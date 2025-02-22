const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizModel");
const User = require("../models/userModel");

router.get("/getQuiz", async (req, res) => {
  const { userId } = req.query;

  try {
    let quizzes;

    if (userId) {
      // If userId is provided, get the user's allAptitudes
      const user = await User.findById(userId); // Correct method to fetch a single document
      if (!user) {
        return res.status(404).send("User not found");
      }
      quizzes = user.allAptitudes; // Access the user's allAptitudes array
    } else {
      // If userId is not provided,
      quizzes = await Quiz.find();
    }

    // Map through quizzes if they exist
    const modifiedQuizzes = quizzes?.map((quiz) => {
      quiz.id = quiz._id;

      return quiz;
    });

    res.status(200).json(modifiedQuizzes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong from backend");
  }
});

module.exports = router;
