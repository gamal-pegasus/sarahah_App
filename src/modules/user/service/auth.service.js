import { decryptAsymmetric} from "../../../utils/index.js";
import mongoose from "mongoose";
import {BlackListedTokens,Message,User} from '../../../DB/models/index.js'
import { cleanupFolderFromCloudinary, deleteFileCloudinary, uploadFileOneCloudinary } from "../../../common/service/cloudinary.service.js";
//update
export const updateService = async (req, res) => {
  try {
    const {user} = req.loggedInUser;
    const { firstName, lastName, age, gender, email } = req.body;
    const check = await User.findOne({
      $or: [{ email }, { firstName, lastName }],
    });
    if (check) {
      return res.status(404).json({ message: "user already exsist" });
    }
    const updatedResult = await User.findByIdAndUpdate(
     user._id,
      { firstName, lastName, age, gender, email },
      { new: true }
    ).select("-password");

    if (!updatedResult) {
      return res.status(409).json({ message: "User  Not Found" });
    }
    return res
      .status(200)
      .json({ message: " User Updated successfully ", updatedResult });
  } catch (err) {
    return res.status(500).json({ message: "internal server error", err });
  }
};
//delete
export const deleteService = async (req, res) => {
 const session=await  mongoose.startSession()
   req.session=session
    session.startTransaction()
     const { user:{_id} } = req.loggedInUser;
  
    const deleteResult = await User.findByIdAndDelete(_id,{session});
    if (!deleteResult) {
      return res.status(404).json({ message: "user not found" });
    }
    await Message.deleteMany({receiverId:_id},{session})
     await session.commitTransaction();
      await session.endSession()
     req.session = null;
    return res
      .status(200)
      .json({ message: "user deleted successfully", deleteResult });
     
 
};

//logout
export const logoutService=async(req,res)=>{
 const{token}=req.loggedInUser
  const expirationDate=new Date(token.expirationDate*1000)
  await BlackListedTokens.create({
    tokenId:token.tokenId,
    expirationDate
  })
  return res.status(200).json({message:'user logged out successfully'})
}
//upload profile
export const UploadProfileService = async(req, res) => {
const{user:{_id}}=req.loggedInUser
const {path}=req.file
const {public_id,secure_url}=await uploadFileOneCloudinary(path,{
  folder:'sarahah_App/users/profiles',
  resource_type:"image",
    public_id:_id.toString(),
})
const user=await User.findByIdAndUpdate(_id,{profilePicture:{secure_url,public_id}},{new:true})
  return res.status(200).json({ message: "Profile uploaded successfully" ,user});
};
//delete profile
export const deleteProfileService = async(req, res) => {
const{user}=req.loggedInUser
console.log(user);

if(!user.profilePicture.public_id)return res.status(404).json({message:'No profile picture found'})


const result=await deleteFileCloudinary(user.profilePicture.public_id)
  await User.findByIdAndUpdate(user._id,{ $unset: { profilePicture:' '} });
  console.log(user);

console.log(result);



  return res.status(200).json({ message: "Profile  successfully" ,result});
};

