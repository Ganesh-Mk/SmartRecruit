// Debug version of the getExcelFile endpoint
const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get("/getExcelFile/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const dataDir = path.join(__dirname, "../data");

    const files = fs.readdirSync(dataDir);

    const filePath = path.join(dataDir, `${userId}.xlsx`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found. Available files: " + files.join(", ")
      });
    }

    // Add file stats for debugging
    const stats = fs.statSync(filePath);

    // Set proper headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="shortlistedCandidates.xlsx"`);

    // Send file as a stream
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming file: " + error.message });
      }
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error("Unexpected error in getExcelFile:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;