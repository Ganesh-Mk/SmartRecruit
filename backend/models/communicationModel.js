const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  readAndSpeak: {
    type: [String],
    default: [],
  },
  listenAndSpeak: {
    type: [String],
    default: [],
  },
  topicAndSpeech: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.models.communicationSchema || mongoose.model("Communication", communicationSchema);
