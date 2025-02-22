const mongoose = require("mongoose");
require("./userModel");

const scoreModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  candidateEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  aptitudeScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  communicationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  technicalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Score || mongoose.model("Score", scoreModel);