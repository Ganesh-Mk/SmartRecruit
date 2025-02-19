const express = require("express");
const router = express.Router();
const Tech = require("../models/techModel");
const User = require("../models/userModel");

// Route to add tech problems
router.post("/addTech", async (req, res) => {
  try {
    const { problems, userId } = req.body;

    // Parse the JSON string back to an array of objects
    const parsedProblems = JSON.parse(problems).problems;

    // Find the user and add the problems
    const user = await User.findById(userId);
    if (user) {
      user.allTechProblems.push(...parsedProblems); // Add the problems to the user's allTechProblems array
      await user.save();
    } else {
      return res.status(404).send("User not found");
    }

    // Now, also add the new problems to the Tech model
    const techEntries = parsedProblems.map((problem) => ({
      title: problem.title,
      desc: problem.desc,
      user: userId,
    }));

    // Insert the tech entries into the Tech model
    await Tech.insertMany(techEntries);

    res.status(200).send("Tech problems added successfully");
  } catch (error) {
    console.error("Error adding tech problems:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
