import mongoose from "mongoose";
import { GenderEnum, providerEnum, RolesEnum } from "../../common/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "Name must be at least 3 characters long"],
      maxLangth: [20, "Name must be at most 20 characters long"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Name must be at least 3 characters long"],
      maxLangth: [20, "Name must be at most 20 characters log"],
      lowercase: true,
      trim: true,
    },
    age:{
        type:Number,
        required:true,
        min:[18,"Age must be at least 18 years old"],
        max :[70, "Age must be at most 70 years old"],
        index:{
            name:"idx_age"
        }
    },
    gender:{
        type:String,
        enum:Object.values(GenderEnum),
        default:GenderEnum.MALE
    },
    email:{
        type:String,
        required:true,
       index:{
         unique:true,
        name:"idx_email_unique"
       }
    },
    password:{
        type:String,
        required:true,  
    },
    phoneNumber:{
        type:String,
        required:true
    },
    role:{
      type:String,
      enum:Object.values(RolesEnum),
      default:RolesEnum.USER
    },
    provider:{
      type:String,
      enum:Object.values(providerEnum),
      default:providerEnum.LOCAL

    },
    otps:{
      confirmation:String,
      expiresAt:Number,
      resetpassword:String
    },
    isconfirmed:{
      type:Boolean,
      default:false
    },
    profilePicture:{
      secure_url:String,
      public_id:String
    },
  },
  {
    timestamps:true,
    virtuals:{
        fullName:{
            get(){
                return `${this.firstName} ${this.lastName}`
            }
        }
    },
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    }

  }
);
userSchema.index({firstName:1,lastName:1},{name:'idx_fristName_lastName_unique',unique:true});
export const User=mongoose.model("User",userSchema);
// ===== Google User =====
export const GoogleUser = User.discriminator(
  "GoogleUser",
  new mongoose.Schema({
    googleId: { type: String, required: true },
    email_verified: { type: String,
      enum:[true,false]
     },
  })
);


