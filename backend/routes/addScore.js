const express = require('express');
const router = express.Router();
const CandidateScore = require('../models/scoreModel');

router.post('/addScore', async (req, res) => {
  try {
    const { userId, candidateEmail, roundName, score } = req.body;

    if (!userId || !candidateEmail || !roundName || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate roundName
    const validRounds = ['technical', 'aptitude', 'communication'];
    if (!validRounds.includes(roundName.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid round name. Must be technical, aptitude, or communication"
      });
    }

    // Find existing record or create new one
    let candidateScore = await CandidateScore.findOne({
      userId: userId,
      candidateEmail: candidateEmail
    });

    if (!candidateScore) {
      candidateScore = new CandidateScore({
        userId,
        candidateEmail,
        aptitudeScore: roundName.toLowerCase() === 'aptitude' ? score : 0,
        communicationScore: roundName.toLowerCase() === 'communication' ? score : 0,
        technicalScore: roundName.toLowerCase() === 'technical' ? score : 0
      });
    } else {
      // Update existing record
      switch (roundName.toLowerCase()) {
        case 'aptitude':
          candidateScore.aptitudeScore = score;
          break;
        case 'communication':
          candidateScore.communicationScore = score;
          break;
        case 'technical':
          candidateScore.technicalScore = score;
          break;
      }
    }

    await candidateScore.save();

    res.status(200).json({
      success: true,
      message: "Score added successfully",
      data: candidateScore
    });

  } catch (error) {
    console.error("Error in addScore route:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;