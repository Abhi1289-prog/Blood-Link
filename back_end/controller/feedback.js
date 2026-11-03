const feed_back=require('../models/feedback');
const User = require("../models/user");
exports.feedback=async (req,res)=>{
    try{
    const {name,rating,feedback,user_type}=req.body;
    const user_id = req.user.id;
    const user = await User.findById(user_id);
        if (!user) {
          return res.status(404).json({ message: "User not found or unauthorized." });
        }
    const Feedback=new feed_back({
        user:user_id,
        user_type,
        name,
        rating,
        feedback
    })
    await Feedback.save();
    res.status(201).json({message:'Your feedback has been successfully submitted.'});
}catch(error){
    console.error(error);
    res.status(500).json({message:'Server Error'});
}
};