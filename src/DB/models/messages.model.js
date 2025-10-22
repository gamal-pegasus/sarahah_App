import  mongoose from "mongoose";

const messagesSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
     },
     receiverId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
     }
},{timestamps:true}) ;

 export const Message=mongoose.model("Message",messagesSchema);
 messagesSchema.virtual("Messages",{
   ref:"Messages",
   localField:"_id",
   foreignField:"receiverId"
 })

