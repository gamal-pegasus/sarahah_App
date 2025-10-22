export const authorization=(allowedRole)=>{
    return(req,res,next)=>{
        const{user:{role}}=req.loggedInUser;
       
        if(allowedRole.includes(role))return next();
        return res.status(401).json({message:'unauthorized'})


    }
}