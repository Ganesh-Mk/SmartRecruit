const fetch = require("node-fetch");
require("dotenv").config();

const deepseekRequest = async (prompt, model = "deepseek-chat") => {
  try {
    console.log("Deep seeking...");

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const text = await response.text(); // Get raw text before parsing
    console.log("Raw DeepSeek Response:", text);

    const jsonResponse = JSON.parse(text);

    if (!jsonResponse || !jsonResponse.choices || jsonResponse.choices.length === 0) {
      throw new Error("Invalid response structure from DeepSeek API");
    }

    return jsonResponse.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return JSON.stringify({
      error: "Failed to fetch response from DeepSeek API",
      details: error.message || error,
    });
  }
};

module.exports = { deepseekRequest };
