const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");
const User = require("../models/userModel");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/cheatingDetected", upload.single("cheatImage"), async (req, res) => {
  const { userId, email, comment } = req.body;
  const cheatImageFile = req.file;

  if (!email || !comment) {
    return res.status(400).json({ message: "Email and comment are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const candidate = user.candidateData.find(
      (candidate) => candidate.email === email
    );

    if (!candidate) {
      return res.status(404).json({ message: "Candidate data not found." });
    }

    // Update candidate data
    candidate.cheatComment = comment;

    if (cheatImageFile) {
      try {
        const imageUrl = await uploadImage(cheatImageFile.buffer, "cheating");
        candidate.cheatImage = imageUrl;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ message: "Failed to upload image." });
      }
    }

    await user.save();
    return res.status(200).json({
      message: "Cheating details updated successfully.",
      imageUrl: candidate.cheatImage
    });
  } catch (error) {
    console.error("Error updating cheating details:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
