const express = require("express");
const router = express.Router();
require("dotenv").config();

const topicAndSpeechPrompt = `
Generate Topic and Speech assessment questions based on the following difficulty level: {{prompt}}

Create questions that:
- Present discussion topics
- Include presentation scenarios
- Focus on impromptu speaking
- Cover various subject areas
- Match the requested difficulty level

Format the response as an array of strings, with each string being a question or task.

Example response format:
[
  "Give a 2-minute presentation on the impact of social media on society",
  "Discuss the pros and cons of remote work in modern businesses",
  "Present your views on environmental conservation efforts"
]`;

router.get("/generateTopicAndSpeech", async (req, res) => {
  const prompt = req.query.prompt || "intermediate level";
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const customPrompt = topicAndSpeechPrompt.replace("{{prompt}}", prompt);
    const result = await model.generateContent(customPrompt);
    const rawResponse = await result.response.text();
    const cleanedResponse = rawResponse.includes("[")
      ? rawResponse.substring(rawResponse.indexOf("["), rawResponse.lastIndexOf("]") + 1)
      : rawResponse;

    const questions = JSON.parse(cleanedResponse);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error generating Topic and Speech questions:", error);
    res.status(500).json({
      error: "Failed to generate Topic and Speech questions",
      details: error.message
    });
  }
});

module.exports = router;