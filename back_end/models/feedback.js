const mongoose=require("mongoose")
const Feed_back_Schema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
          required: true,     
    },
    name:{
        type:String
    },
    user_type:{
        type:String,
        required:true,
        enum:{
            values:['Donor','Recipient'],
            message:'{VALUE} is invalid UserType'
        }
    },
    rating:{
        type:String,
        required:true,
    },
    feedback:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("feedback",Feed_back_Schema);