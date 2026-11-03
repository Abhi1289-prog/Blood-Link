const mongoose = require("mongoose");

const LiveLocationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },

  coordinates: {
    type: [Number],  // [lng, lat]
    required: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geospatial queries
LiveLocationSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("LiveLocation", LiveLocationSchema);
