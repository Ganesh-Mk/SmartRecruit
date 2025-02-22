const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // User model to fetch tech problems

// Route to fetch tech problems
router.get("/getTech", async (req, res) => {
  const { userId } = req.query; // Get the userId from query parameters

  try {
    if (userId) {
      // If userId is provided, find the user and return their specific tech problems
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Return the tech problems related to this user

      return res
        .status(200)
        .json({ success: true, techEntries: user.allTechProblems });
    } else {
      // If no userId is provided, return all tech problems from all users
      const allTechProblems = await User.find().select("allTechProblems"); // This will return all tech problems from all users

      // Flatten the array of tech problems
      const techEntries = allTechProblems
        .map((user) => user.allTechProblems)
        .flat();

      return res.status(200).json({ success: true, techEntries });
    }
  } catch (err) {
    console.error("Error fetching tech problems:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching tech problems.",
    });
  }
});

module.exports = router;
