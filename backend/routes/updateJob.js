  const express = require("express");
  const router = express.Router();
  const Job = require("../models/jobModel");

  router.put("/updateJob", async (req, res) => {
    try {
      const { jobId, jobRole, companyName, description, deadline } = req.body;
      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { jobRole, companyName, description, deadline },
        { new: true }
      );

      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

  module.exports = router;