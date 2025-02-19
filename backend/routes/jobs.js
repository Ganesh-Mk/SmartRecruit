const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");

router.get("/jobs/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const jobs = await Job.find({ userId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;