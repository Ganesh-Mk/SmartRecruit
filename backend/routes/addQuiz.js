const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizModel");
const User = require("../models/userModel");

router.post("/addQuiz", async (req, res) => {
  const { userId, questions } = req.body; // Accept userId and an array of questions

  try {
    // Map questions to the required quiz format
    const quizzesToSave = questions.map((quiz) => ({
      que: quiz.que,
      a: quiz.a,
      b: quiz.b,
      c: quiz.c,
      d: quiz.d,
      ans: quiz.ans,
    }));

    // Insert quizzes into Quiz collection
    const savedQuizzes = await Quiz.insertMany(quizzesToSave);

    // Prepare quiz data to store directly in user's allAptitudes
    const quizDataForUser = savedQuizzes.map((quiz) => ({
      que: quiz.que,
      a: quiz.a,
      b: quiz.b,
      c: quiz.c,
      d: quiz.d,
      ans: quiz.ans,
    }));

    // Update the user model to store quizzes in allAptitudes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { allAptitudes: { $each: quizDataForUser } } },
      { new: true } // Return the updated user document
    );

    res.status(201).json({
      success: true,
      quizzes: savedQuizzes,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error saving quizzes:", err);
    res.status(500).send("Something went wrong while adding quizzes.");
  }
});

module.exports = router;
