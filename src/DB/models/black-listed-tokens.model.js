import mongoose from "mongoose";

const blackListedTokensSchema=new mongoose.Schema({
    tokenId:{
        type:String,
        require:true,
        unique:true
    },
    expirationDate:{
        type:Date,
        require:true
    }
    

});
export const BlackListedTokens=mongoose.model('BlackListedTokens',blackListedTokensSchema);



