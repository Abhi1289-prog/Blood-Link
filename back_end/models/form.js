const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  current_illnesses: {
    type: String,
    required: true
  },
  checkmedication: { type: Boolean, required: true, default: false },
  checkweight: { type: Boolean, required: true, default: false },
  checkfeel_well_today: { type: Boolean, required: true, default: false },
  checkeat_in_last_4_hours: { type: Boolean, required: true, default: false },
  checksleep: { type: Boolean, required: true, default: false },
  checknot_to_donate: { type: Boolean, required: true, default: false },
  checkalcohol_within_the_last24hours: { type: Boolean, required: true, default: false },
  checksmoked_within_lasthour: { type: Boolean, required: true, default: false },
  checkconsent: { type: Boolean, required: true, default: false },

  insurance_provider: { type: String },
  
  policy_number: { 
    type: String, 
    unique: true 
  },

  iseligible: {
    type: Boolean,
    required: true,
    default: false
  },

  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    index: { expires: 0 } 
  },
  pdfFileId: {
  type: mongoose.Schema.Types.ObjectId,
  required: false
}

},
{
  timestamps: true
});

module.exports = mongoose.model('form', FormSchema);
