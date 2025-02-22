const express = require("express");
const router = express.Router();
const Communication = require("../models/communicationModel");

router.post("/addCommunication", async (req, res) => {
  try {
    const { userId, readAndSpeak, listenAndSpeak, topicAndSpeech } = req.body;

    const newCommunication = new Communication({
      userId,
      readAndSpeak,
      listenAndSpeak,
      topicAndSpeech,
    });

    await newCommunication.save();
    res.status(201).json({ success: true, message: "Communication round created", data: newCommunication });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
