const mongoose = require("mongoose");

const RequestTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },

  request_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "request", 
    required: true 
  },

  status: {
    type: String,
    enum: ["pending", "fulfilled", "expired"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 6 // expires after 6 hours (optional)
  }

});

module.exports = mongoose.model("RequestToken", RequestTokenSchema);
