const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
 user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
  required: true,
  unique: true
},
address:{
  type:String,
  required:true
},
officeaddress: {
  type: String
},
age: {
  type: Number,
  required: true,
   min: [18, 'Minimum age to donate blood in India is 18'],
  max: [65, 'Maximum age to donate blood in India is 65']
},
gender: {
  type: String,
  required: true,
  enum: {
    values: ['Male', 'Female', 'Other','male', 'female', 'other'],
    message: '{VALUE} is not a valid gender'
  }
},
bloodgroup: {
  type: String,
  required: [true, 'Blood group is required'],
  enum: {
    values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    message: '{VALUE} is not a valid blood group'
  },
  uppercase: true,
  trim: true
},
iseligible:{
   type:Boolean,
   default:false
},
location: {
  type: {
    type: String,
    enum: ['Point'],
    required: false
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: false
  }
},
      
});
personalDetailsSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('personalDetails', personalDetailsSchema);
