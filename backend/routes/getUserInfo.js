const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Route to get user information by userId
router.get("/getUserInfo/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Send back the user information
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
