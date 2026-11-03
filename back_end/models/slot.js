const mongoose = require('mongoose');

const Slot_Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },

  date: {
    type: Date,
    required: true,
  set: (value) => {
    const d = new Date(value);
    d.setHours(0, 0, 0, 0); // remove time
    return d;
  }
  },

  time: {
    type: Date,    // "10:30 AM" or "14:00" etc.
    required: true
  },

  address: {
    type: String,
    required: true
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],   // [longitude, latitude]
      required: false
    }
  },

  slot_confirm: {
    type: Boolean,
    default: false
  },
  completion_time: {
    type: Date,
    set: (value) => {
    const d = new Date(value);
    d.setHours(0, 0, 0, 0); 
    return d;
  }
  }
});

module.exports = mongoose.model('slot', Slot_Schema);
