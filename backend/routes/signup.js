const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("From backend: ", name, email, password);

  try {
    const existingUser = await User.findOne({ email });
    console.log("existingUser: ", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    console.log("newUser: ", newUser);

    await newUser.save(); // This line might throw an error

    console.log("Database saved");

    res
      .status(200)
      .json({ id: newUser._id, message: "User registered successfully" });
  } catch (error) {
    console.log("Database register not saved");

    console.error("Error in saving user:", error); // Add more logging here
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
