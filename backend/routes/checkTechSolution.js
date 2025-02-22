const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post("/checkTechSolution", async (req, res) => {
  const { title, desc, code } = req.body;

  if (!title || !desc || !code) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  const addOnPrompt = `
  ${title}
    ${desc}
    ${code}
    Evaluate the following code solution against given problem requirements:
    1. Check the solution against multiple test cases.
    2. Return if the solution passes or fails each test case.
    3. Provide hint for error messages for failed cases, including input and expected vs actual output.
    4. Return the evaluation result in JSON format with the following structure exactly:
    5. Respoonse should be small like around 10 lines. MAKE SURE YOU SHOULD NOT GIVE ANY SOLUTIONS IN THE RESPONSE.
    6. Check the solution properly, even a small error in the code may lead to a failed evaluation.
    {
      "success": true/false,
      "summary": "Summary of the evaluation"
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(addOnPrompt);

    // Get the raw response text
    let rawResponse = await result.response.text();

    try {
      const cleanedResponse = JSON.parse(rawResponse.slice(7, -4));
      res.status(200).json({ success: true, cleanedResponse: cleanedResponse });
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      res.status(500).json({ success: false, error: "Invalid JSON response" });
    }
  } catch (error) {
    console.error("Error evaluating solution:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to evaluate the solution" });
  }
});

module.exports = router;
