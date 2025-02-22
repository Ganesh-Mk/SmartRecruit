const express = require("express");
const router = express.Router();
require("dotenv").config();

const addOnPrompt = `
Generate an aptitude quiz with 10 questions. Each question should have:
- A question text.
- 4 options labeled A, B, C, and D.
- The correct answer.
- Questions on {{quizType}}
Return the quiz as an array of objects in JSON format, where each object contains:
{
  "id": "a very unique id (not serializable)",
  "que": "Question text",
  "a": "option A",
  "b": "option B",
  "c": "option C",
  "d": "option D",
  "ans": "correct answer option (like a,b,c,d)"
}
`;

router.get("/generateQuiz", async (req, res) => {
  let quizType = req.query.quizType;
  if (!quizType || quizType === null || quizType === "") {
    quizType =
      "aptitude including logical reasoning, problem solving, and critical thinking.";
  }

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const typeAddOnPrompt = addOnPrompt.replace("{{quizType}}", quizType);
    const result = await model.generateContent(typeAddOnPrompt);
    const rawResponse = await result.response.text(); // Get the raw response text

    const cleanedResponse = rawResponse.slice(7, -4).trim();
    const responseText = JSON.parse(cleanedResponse);

    res.status(200).json(responseText); // Send the parsed JSON to the frontend
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).send("Failed to generate quiz");
  }
});

module.exports = router;
