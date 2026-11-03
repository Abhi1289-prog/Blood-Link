const mongoose = require('mongoose');

const Request_Form = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },

  patient_name: {
    type: String,
    required: true
  },

  blood_type: {
    type: String,
    required: true,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood type'
    }
  },

  unit_needed: {
    type: Number,
    required: true
  },

  hospital_name: {
    type: String,
    required: true
  },

  hospital_address: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true,
  },

  contact_name: {
    type: String,
    required: true
  },

  contact_number: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Invalid contact number']
  }
});

module.exports = mongoose.model('requestform', Request_Form);
