const express = require("express");
const Communication = require("../models/communicationModel");
const router = express.Router();

router.get("/allCommunication", async (req, res) => {
  try {
    const communications = await Communication.find()
    res.status(200).json(communications);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;