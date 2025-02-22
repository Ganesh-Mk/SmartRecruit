const express = require("express");
const router = express.Router();
const Job = require("../../models/jobModel");

router.post("/createJob", async (req, res) => {
  try {

    const { userId, jobRole, companyName, description, deadline } = req.body;

    if (!userId || !jobRole || !companyName || !description || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = new Job({ userId, jobRole, companyName, description, deadline });
    await newJob.save();

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
