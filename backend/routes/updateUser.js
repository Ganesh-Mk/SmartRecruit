const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/updateUser", async (req, res) => {
  const {
    userId,
    date,
    startTime,
    endTime,
    name,
    companyName,
    email,
    jobrole,
    passingMarks,
    userEmail,
    aptitudePassingMarks,
    aptitudePassesCandidates,
    aptitudeFailedCandidates,
    techPassesCandidates,
    techFailedCandidates,
    aptitudeSolved,
    techSolved,
    score,
    candidateData,
    aptitudeTime,
    techTime,
    hrTime,
    passingMarksofTech,
    technicalScore,
  } = req.body;

  console.log("Data of technical round came to backend : ", userId, userEmail, technicalScore);

  let techPass = false;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user details
    if (date) user.date = date;
    if (name) user.name = name;
    if (passingMarksofTech) user.technicalPassingMarks = passingMarksofTech;
    if (companyName) user.companyName = companyName;
    if (jobrole) user.jobRole = jobrole;
    if (passingMarks) user.aptitudePassingMarks = passingMarks;
    if (startTime) user.startTime = startTime;
    if (endTime) user.endTime = endTime;
    if (candidateData) user.candidateData = candidateData;
    if (aptitudeTime) user.aptitudeTime = aptitudeTime;
    if (techTime) user.techTime = techTime;
    if (hrTime) user.hrTime = hrTime;

    // Check aptitude results
    if (score !== undefined) {
      if (score >= user.aptitudePassingMarks) {
        if (!user.aptitudePassesCandidates.includes(userEmail)) {
          user.aptitudePassesCandidates.push(userEmail);
        }
      } else {
        if (!user.aptitudeFailedCandidates.includes(userEmail)) {
          user.aptitudeFailedCandidates.push(userEmail);
        }
      }
    }

    // Check technical results if technicalScore is provided
    if (technicalScore !== undefined) {
      if (technicalScore >= user.technicalPassingMarks) {
        if (!user.techPassesCandidates.includes(userEmail)) {
          user.techPassesCandidates.push(userEmail);
          techPass = true;
        }
      } else {
        if (!user.techFailedCandidates.includes(userEmail)) {
          user.techFailedCandidates.push(userEmail);
        }
      }
    }

    // Update email if provided
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).send("Email already exists");
      }
      user.email = email;
    }

    // Save the updated user
    await user.save();

    res.status(200).send({ message: "User updated successfully", techPass });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
