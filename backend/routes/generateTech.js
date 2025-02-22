const express = require("express");
const router = express.Router();
require("dotenv").config();

const addOnPrompt = `
Generate a set of 4 technical interview questions on {{techType}} DSA problems. Each problem should include:
- A unique ID for the problem (not serializable).
- A title describing the problem.
- A detailed description of the problem, including:
  - Problem statement.
  - Input format.
  - Output format.
  - Example with input and output.
  - Constraints for the problem.
- Two test cases with:
  - A sample input for the problem.
  - The expected output for the provided input.

Format the description as a single string with line breaks and spaces for readability.
Return the set of problems as an array of objects in JSON format, where each object follows this structure:
{
  "id": "unique problem ID",
  "title": "Problem title",
  "desc": "Detailed problem description with proper formatting",
  "testCases": [
    {
      "input": "Sample input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Sample input",
      "expectedOutput": "Expected output"
    }
  ]
}`;

router.get("/generateTech", async (req, res) => {
  const techType = req.query.techType;
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const typeAddOnPrompt = addOnPrompt.replace("{{techType}}", techType);
    const result = await model.generateContent(typeAddOnPrompt);

    // Extract and parse the raw response
    const rawResponse = await result.response.text();
    const cleanedResponse = rawResponse.slice(7, -4).trim();
    const responseText = JSON.parse(cleanedResponse);

    res.status(200).json(responseText); // Send the parsed JSON to the frontend
  } catch (error) {
    console.error("Error generating tech quiz:", error);
    res.status(500).send("Failed to generate tech quiz");
  }
});

module.exports = router;
