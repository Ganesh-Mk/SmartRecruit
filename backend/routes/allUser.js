const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/allUser", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal server err", err: err.message });
  }
});

module.exports = router;