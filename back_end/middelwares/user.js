const { isValidObjectId } = require("mongoose");
const passwordResetToken=require("../models/passwordresettoken");

exports.isValidPasswordResetToken=async (req,res,next)=>{
    const {token,userId}=req.body;
    if(!token || !token.trim() || !isValidObjectId(userId)){
        return res.status(401).json({error:"Unauthorized access, Invalid request!"});
    }  
    
    const resetToken=await passwordResetToken.findOne({owner: userId});
    if(!resetToken){
        return res.status(401).json({error:"Unauthorized access, Invalid request!"});
    }
 
   const matched=await resetToken.compareToken(token)
   if(!matched){
    return res.status(401).json({error:"Unauthorized access, Invalid request!"});
   }
req.resetToken=resetToken

next();

}