const express = require("express");
const router = express.Router();
const Communication = require("../models/communicationModel");

router.get("/getCommunication/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const communication = await Communication.findOne({ userId })

    if (!communication) {
      return res.status(404).json({ success: false, message: "Communication round not found" });
    }

    res.status(200).json({ success: true, data: communication });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;

