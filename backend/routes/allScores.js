const express = require('express');
const router = express.Router();
const CandidateScore = require('../models/scoreModel');

router.get('/allScores/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required"
      });
    }

    const candidateScores = await CandidateScore.find({ userId: userId });

    if (!candidateScores.length) {
      return res.status(404).json({
        success: false,
        message: "No scores found for this user"
      });
    }

    res.status(200).json(candidateScores);

  } catch (error) {
    console.error("Error in getAllScores route:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;