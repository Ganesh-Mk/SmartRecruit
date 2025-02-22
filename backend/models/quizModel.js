const mongoose = require("mongoose");

const eachQuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  que: { type: String },
  a: { type: String },
  b: { type: String },
  c: { type: String },
  d: { type: String },
  ans: { type: String },
});

const quizSchema = new mongoose.Schema([eachQuizSchema]);

module.exports = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
