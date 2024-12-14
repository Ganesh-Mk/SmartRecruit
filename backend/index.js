const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// Create a Set to store active clients for Server-Sent Events (SSE)
const clients = new Set();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://smartrecruit.vercel.app", // for quick testing purpose included this hardcoded urls
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "multipart/form-data"],
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected ");
  })
  .catch((err) => console.error("Database Connection Failed: ", err));

const User = require("./models/userModel");

// Real-time text update logic
let currentText = "";

app.get("/api/events", (req, res) => {
  // Set headers for Server-Sent Events
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial state
  res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);

  // Add this client to the set
  clients.add(res);

  // Remove client when connection closes
  req.on("close", () => {
    clients.delete(res);
  });
});

app.post("/api/update", (req, res) => {
  const { text, clientId } = req.body;

  // Only update if text has actually changed
  if (text !== currentText) {
    currentText = text;

    // Broadcast to all clients except the sender
    clients.forEach((client) => {
      if (client !== res) {
        client.write(
          `data: ${JSON.stringify({ text, excludeClientId: clientId })}\n\n`
        );
      }
    });
  }

  res.status(200).send("Text updated successfully");
});

// Route imports
const signup = require("./routes/signup");
const login = require("./routes/login");
const addQuiz = require("./routes/addQuiz");
const getQuiz = require("./routes/getQuiz");
const generateQuiz = require("./routes/generateQuiz");
const updateUser = require("./routes/updateUser");
const generateTech = require("./routes/generateTech");
const addTech = require("./routes/addTech");
const getTech = require("./routes/getTech");
const getUserInfo = require("./routes/getUserInfo");
const checkTechSolution = require("./routes/checkTechSolution");
const cheatingDetected = require("./routes/cheatingDetected");

// Use routes
app.use(signup);
app.use(login);
app.use(addQuiz);
app.use(getQuiz);
app.use(generateQuiz);
app.use(updateUser);
app.use(generateTech);
app.use(addTech);
app.use(getTech);
app.use(getUserInfo);
app.use(checkTechSolution);
app.use(cheatingDetected);

// Test route for users
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
