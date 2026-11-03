const { default: mongoose, models } = require("mongoose");
const bcrypt=require('bcrypt');

const userSchema=mongoose.Schema({
name:{
    type:String,
    trim:true,
    required:true
},
email:{
    type:String,
    trim:true,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
phone_number: {
    type: String,
    required: true,
},
username:{
    type:String,
    trim:true,
    unique:true,
    required:true
},
hasPersonalDetails: {
  type: Boolean,
  default: false
},
token: {
  type: String,
  default: null
}
});
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
      this.password=await bcrypt.hash(this.password,10);
    }
    next();
});
userSchema.methods.comparePassword=async function(password) {
  const result=  await bcrypt.compare(password,this.password);
    return result;
}
module.exports=mongoose.model("user",userSchema);