const express = require("express");
const router = express.Router();
require("dotenv").config();

const readAndSpeakPrompt = `
Generate Read and Speak assessment questions based on the following difficulty level: {{prompt}}

Create questions that:
- Include passages for reading aloud
- Test pronunciation accuracy
- Focus on stress and intonation
- Include comprehension questions
- Match the requested difficulty level

Format the response as an array of strings, with each string being a question or task.

Example response format:
[
  "Read this paragraph about climate change and explain the main arguments",
  "Practice these tongue twisters and explain their meaning",
  "Read this business proposal and present its key points"
]`;

router.get("/generateReadAndSpeak", async (req, res) => {
  const prompt = req.query.prompt || "intermediate level";
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const customPrompt = readAndSpeakPrompt.replace("{{prompt}}", prompt);
    const result = await model.generateContent(customPrompt);
    const rawResponse = await result.response.text();
    const cleanedResponse = rawResponse.includes("[")
      ? rawResponse.substring(rawResponse.indexOf("["), rawResponse.lastIndexOf("]") + 1)
      : rawResponse;

    const questions = JSON.parse(cleanedResponse);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error generating Read and Speak questions:", error);
    res.status(500).json({
      error: "Failed to generate Read and Speak questions",
      details: error.message
    });
  }
});

module.exports = router;