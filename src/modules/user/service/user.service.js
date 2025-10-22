import { compareSync, hashSync } from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { customAlphabet   } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { User, GoogleUser } from "../../../DB/models/index.js";
import {emitter,generateToken,encryptAsymmetric} from '../../../utils/index.js'
import { providerEnum } from "../../../common/enums/user.enum.js";
const newOtp = customAlphabet("123456789", 5);
//signup
export const signupService = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, email, password, phoneNumber } =
      req.body;

    const encryptedPhoneNumber = encryptAsymmetric(phoneNumber);

    const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);

    const existingUser = await User.findOne({
      $or: [{ email }, { firstName, lastName }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = newOtp();
    const user = await User.create({
      firstName,
      lastName,
      age,
      gender,
      email,
      password: hashedPassword,
      phoneNumber: encryptedPhoneNumber,
      otps: {
        confirmation: hashSync(otp, +process.env.SALT_ROUNDS),
        expiresAt: Date.now() + 3 * 60 * 1000,
      },
      isConfirmed: false,
    });

    // Send email 
    emitter.emit("sendEmail", {
      to: email,
      subject: "Confirmation Email",
      content: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f9f9f9;">
          <h2 style="color: #333;">🔐 Email Confirmation</h2>
          <p style="font-size: 16px; color: #555;">
            Please use the following One-Time Password (OTP) to confirm your email:
          </p>
          <div style="margin: 20px auto; padding: 10px 20px; background: #4CAF50; color: #fff; font-size: 24px; font-weight: bold; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #999; margin-top: 20px;">
            This OTP is valid for a single use only. If you didn’t request this, please ignore this email.
          </p>
        </div>`,
    });
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//signin
export const signinService = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Invalid Email Or Password" });
  }
  const isPasswordMatch = compareSync(password, user.password);
  if (!isPasswordMatch) {
    return res.status(404).json({ message: "Invalid Email Or Password" });
  }
  const accessToken = generateToken(
    { _id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
      jwtid: uuidv4(),
    }
    
  );
  
  return res
    .status(200)
    .json({ message: "User signed successfully", accessToken  });
};
//email confirmation
export const confirmationByEmailService = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email, isconfirmed: false });

  if (!user) {
    return res
      .status(400)
      .json({ message: "user not found or already confirmed" });
  }

  if (Date.now() > user.otps?.expiresAt) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  const isOtpMatch = compareSync(otp, user.otps?.confirmation);
  if (!isOtpMatch) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isconfirmed = true;
  user.otps.confirmation = undefined;
  user.otps.expiresAt = undefined;
  await user.save();

  return res.status(200).json({ message: " Otp Confirmed Successfully" });
};
//social login
export const socialLoginService = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
   const payload = ticket.getPayload();
    const { email, given_name, family_name, email_verified,sub} = payload;
    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified by Google" });
    }
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await GoogleUser.create({
        firstName:given_name|| "unknown",
        lastName: family_name || "user",
        email,
        password:hashSync(`StrongP@ss`, +process.env.SALT_ROUNDS), 
        phoneNumber:  encryptAsymmetric('01111111111'),
        age: 18,
        provider: providerEnum.GOOGLE,
        isconfirmed: email_verified || false,
        googleId:sub,
        email_verified
      });
       return  res.status(200).json({
      message: "Social signup successful",
      user,
    });
    }
    return res.status(200).json({
      message: "Social login successful",
      user,
    });
  } catch (err) {
    console.error("Social login error:", err);
    res.status(500).json({ message: "Error during social login", error: err.message });
  }
};
//Forgot Password
export const forgotPasswordService=async(req,res)=>{
  const {email}=req.body
   const otp = newOtp();
  const user =await User.findOneAndUpdate({email},{otps:{
        confirmation: hashSync(otp, +process.env.SALT_ROUNDS),
        expiresAt: Date.now() + 3 * 60 * 1000,
      },
    isconfirmed:false
    })
      if (!user)return res.status(404).json({message:'User Not Found'})
     // Send email
emitter.emit("sendEmail", {
  to: email,
  subject: "Password Reset Code",
  content: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f9f9f9;">
      <h2 style="color: #333;">🔑 Password Reset Request</h2>
      <p style="font-size: 16px; color: #555;">
        You requested to reset your password.<br />
        Please use the code below to continue:
      </p>
      <div style="margin: 20px auto; padding: 10px 20px; background: #4CAF50; color: #fff; font-size: 24px; font-weight: bold; border-radius: 8px; display: inline-block;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #999; margin-top: 20px;">
        If you didn’t request a password reset, please ignore this email.<br />
        This code is valid for one-time use only.
      </p>
    </div>
  `,
});

 
return res.status(200).json({message:'We have sent you an OTP'})

  
}
//reset Password
export const resetPasswordService=async(req,res)=>{
  const {email,password}=req.body;
 const user=await User.findOne ({email,isconfirmed:true})
 if (!user)return res.status(404).json({message:'User Not Found'})
  const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
user.password=hashedPassword;
await user.save()
  const accessToken = generateToken(
    { _id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
      jwtid: uuidv4(),
    }
    
  );
return res.status(200).json({message:'New Password',token:accessToken})
}
// search 
export const search= async (req, res) => {
    const { fullName } = req.body;  
    const users = await User.find({
       $expr: {
    $regexMatch: {
      input: { $concat: ["$firstName", " ", "$lastName"] },
      regex: fullName,
      options: "i"
    }
  }
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    const decryptedUsers = users.map(user => ({
      ...user.toObject(),
      phoneNumber: decryptAsymmetric(user.phoneNumber)
    }));
    return res.status(200).json({
      message: "Users found successfully",
      count: decryptedUsers.length,
      data: decryptedUsers
    });
};



