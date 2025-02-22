const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// User model (assuming you have a User schema)
const User = require("../models/userModel"); // Adjust the path as needed

// Delete Account Route
router.delete("/deleteAccount/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      // 1. Find the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.findByIdAndDelete(userId);
      // Optional: Log the account deletion

      res.status(200).json({
        message: "Account successfully deleted",
        deletedUserId: userId,
      });
    } catch (deleteError) {
      console.error("Error during account deletion:", deleteError);
      res.status(500).json({
        message: "Failed to delete account",
        error: deleteError.message,
      });
    }
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({
      message: "Server error during account deletion",
      error: error.message,
    });
  }
});

module.exports = router;
