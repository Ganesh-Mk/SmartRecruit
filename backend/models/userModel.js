const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  jobRole: { type: String },
  date: { type: String, default: Date },
  startTime: { type: String },
  endTime: { type: String },
  allAptitudes: {
    type: Array,
    default: [], // Array of tech problems directly
  },
  allTechProblems: {
    type: Array,
    default: [], // Array of tech problems directly
  },
  aptitudePassingMarks: {
    type: Number,
    default: 0,
  },
  aptitudePassesCandidates: {
    type: [String], // Array of email strings of users who passed the aptitude test
    default: [],
  },
  aptitudeFailedCandidates: {
    type: [String], // Array of email strings of users who passed the aptitude test
    default: [],
  },
  techPassesCandidates: {
    type: [String], // Array of email strings of users who passed the aptitude test
    default: [],
  },
  techFailedCandidates: {
    type: [String], // Array of email strings of users who passed the aptitude test
    default: [],
  },
});

// Use "User" as the model name
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
