import{verfiyToken}from '../utils/index.js'
import { User,BlackListedTokens } from '../DB/models/index.js';
export const authenticationMiddleware=async(req,res,next)=>{
  const  {accesstoken}=req.headers  
  if(!accesstoken)return res.status(400).json({message:'Please provide access token'});
//   verify the token
const decodedData=verfiyToken(accesstoken,process.env.JWT_ACCESS_SECRET)
if(!decodedData?.jti)return res.status(400).json({message:'Invalid Token'});
//check if token in black listed
const blackListedToken=await BlackListedTokens.findOne({tokenId:decodedData?.jti})
if(blackListedToken)return res.status(400).json({message:'Invalid Token'})
//get user by _id
const user= await User.findById(decodedData?._id) 
if(!user)return res.status(400).json({message:'user not found'})
//the authenticated user to the request objec
req.loggedInUser={user,token:{tokenId:decodedData.jti,expirationDate:decodedData.exp}}

next()
}