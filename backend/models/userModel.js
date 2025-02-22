const mongoose = require("mongoose");
require("./communicationModel");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  jobRole: { type: String },
  date: { type: String, default: Date },
  startTime: { type: String },
  endTime: { type: String },
  aptitudeTime: { type: String },
  techTime: { type: String },
  hrTime: { type: String },
  allAptitudes: {
    type: Array,
    default: [],
  },
  allTechProblems: {
    type: Array,
    default: [],
  },
  aptitudePassingMarks: {
    type: Number,
    default: 0,
  },
  technicalPassingMarks: {
    type: Number,
    default: 0,
  },
  aptitudePassesCandidates: {
    type: [String],
    default: [],
  },
  aptitudeFailedCandidates: {
    type: [String],
    default: [],
  },
  techPassesCandidates: {
    type: [String],
    default: [],
  },
  techFailedCandidates: {
    type: [String],
    default: [],
  },
  candidateData: {
    type: [
      {
        cheatImage: { type: String },
        cheatComment: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],
    default: [],
  },
  communication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Communication",
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
