const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/scanResume", async (req, res) => {
  try {
    const { resumeContent, jobDesc } = req.body;

    if (!resumeContent || !jobDesc) {
      return res.status(400).json({ message: "Resume and Job Description are required" });
    }

    const addOnPrompt = `
      Score the candidate's resume based on the following:
      1. Skills matched then give 5 points each skill
      2. Relevant experience matched then give 10 points each experience
      3. Achivements are good then give 5-15 points (based on achivements)
      4. If overall resume text is great, then give more points (10-20 points)
      Exclude any educational/academic details.
      Provide the score as a simple number (e.g., 75) without explanations or breakdowns.
    `;

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const combinedText = `${jobDesc}\n\nResume:\n${resumeContent}\n\n${addOnPrompt}`;

    const result = await model.generateContent(combinedText);

    const rawResponse = await result.response.text();
    const cleanedResponse = rawResponse.trim();

    const score = parseFloat(cleanedResponse);

    res.status(200).json({ score });

  } catch (error) {
    console.error("Error scanning resume:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
