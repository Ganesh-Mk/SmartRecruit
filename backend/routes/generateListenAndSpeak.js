const express = require("express");
const router = express.Router();
require("dotenv").config();
const listenAndSpeakPrompt = `
Generate exactly 4 sentences based on the following difficulty level: {{prompt}}

The sentences should:
- Be directly usable for listening and speaking practice
- Match the requested difficulty level
- Focus on pronunciation and fluency
- Not include any instructions, only the sentences themselves

Response format: an array of exactly 4 strings.

Example:
[
  "The cat stealthily climbed onto the rooftop.",
  "She swiftly solved the tricky puzzle.",
  "Thunder rumbled as the storm approached.",
  "His dedication to practice paid off in the finals."
]`;

router.get("/generateListenAndSpeak", async (req, res) => {
  const prompt = req.query.prompt || "intermediate level";
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const customPrompt = listenAndSpeakPrompt.replace("{{prompt}}", prompt);
    const result = await model.generateContent(customPrompt);
    const rawResponse = await result.response.text();
    const cleanedResponse = rawResponse.includes("[")
      ? rawResponse.substring(rawResponse.indexOf("["), rawResponse.lastIndexOf("]") + 1)
      : rawResponse;

    const questions = JSON.parse(cleanedResponse);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error generating Listen and Speak questions:", error);
    res.status(500).json({
      error: "Failed to generate Listen and Speak questions",
      details: error.message
    });
  }
});

module.exports = router;