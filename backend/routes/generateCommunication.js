const express = require("express");
const router = express.Router();
require("dotenv").config();

const addOnPrompt = `
Generate a set of communication assessment questions divided into three categories:
1. Read and Speak
2. Listen and Type
3. Topic and Speech

For each category, generate 3-4 questions that follow these guidelines:

Read and Speak:
- Questions that require reading a passage and speaking about it
- Mix of comprehension and analysis questions
- Suitable for assessing both reading and speaking skills

Listen and Type:
- Questions that involve listening comprehension
- Scenarios where typing responses are required
- Mix of direct and analytical responses

Topic and Speech:
- Open-ended discussion topics
- Presentation scenarios
- Professional communication situations

Format the response as a JSON object with this structure:
{
  "readAndSpeak": [
    "Question text here",
    "Question text here"
  ],
  "listenAndSpeak": [
    "Question text here",
    "Question text here"
  ],
  "topicAndSpeech": [
    "Question text here",
    "Question text here"
  ]
}

Ensure each question is clear, professional, and appropriate for a communication assessment context.
Base the questions around {{prompt}} if provided, otherwise generate general communication assessment questions.`;

router.get("/generateComm", async (req, res) => {
  const prompt = req.query.prompt || "general communication skills";
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const customPrompt = addOnPrompt.replace("{{prompt}}", prompt);
    const result = await model.generateContent(customPrompt);

    // Extract and parse the raw response
    const rawResponse = await result.response.text();
    // Clean the response if it contains markdown code block markers
    const cleanedResponse = rawResponse.includes("```json") 
      ? rawResponse.split("```json")[1].split("```")[0].trim()
      : rawResponse;
    
    const questions = JSON.parse(cleanedResponse);

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error generating communication questions:", error);
    res.status(500).json({
      error: "Failed to generate communication questions",
      details: error.message
    });
  }
});

module.exports = router;