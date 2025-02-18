const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");

router.get("/getJob", async (req, res) => {
  const { jobId } = req.query;
  try {
    const job = await Job.findById(jobId);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;