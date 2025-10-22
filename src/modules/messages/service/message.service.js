import { Message, User } from "../../../DB/models/index.js";
// Send Message 
export const sendMessageService=async(req,res)=>{
    const{content}=req.body;
    const {receiverId}=req.params
   const checkUser=await User.findById(receiverId);
    if(!checkUser)return res.status(404).json({message:'user not found'});
     const message= await Message.create({content,receiverId})
    return res.status(200).json({message:'message sent successfully ',message})
};
// Get Messages and User 
 export const getMessagesService=async(req,res)=>{
    const {user}=req.loggedInUser
    const messages=await Message.find({receiverId:user._id}).populate([{
        path:"receiverId",
        select:"firstName lastName fullName email"
    }])
    return res.status(200).json({count:messages.length,data:messages})
}