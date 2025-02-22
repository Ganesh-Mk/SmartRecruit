const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
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
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial data
  res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);

  const intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify({ text: currentText })}\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.post("/api/update", (req, res) => {
  currentText = req.body.text;
  res.status(200).send("Text updated successfully");
});

// Other route imports
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

const allJob = require("./routes/allJob");
const createJob = require("./routes/createJob");
const updateJob = require("./routes/updateJob");
const deleteJob = require("./routes/deleteJob");
const allUser = require("./routes/allUser");
const getJob = require("./routes/getJob");
const scanResume = require("./routes/scanResume");
const getExcelFile = require("./routes/getExcelFile");
const jobs = require("./routes/jobs");

const addCommunication = require("./routes/addCommunication");
const allCommunication = require("./routes/allCommunication");
const getCommunication = require("./routes/getCommunication");

const generateListenAndSpeak = require("./routes/generateListenAndSpeak");
const generateReadAndSpeak = require("./routes/generateReadAndSpeak");
const generateTopicAndSpeech = require("./routes/generateTopicAndSpeech");

// Use routes
app.use(addCommunication);
app.use(allCommunication);
app.use(getCommunication);

app.use(generateListenAndSpeak);
app.use(generateReadAndSpeak);
app.use(generateTopicAndSpeech);


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

app.use(allJob);
app.use(createJob);
app.use(updateJob);
app.use(deleteJob);
app.use(allUser);
app.use(getJob);
app.use(scanResume);
app.use(getExcelFile);
app.use(jobs);

// Test route for users
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.send("Error, check console");
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
