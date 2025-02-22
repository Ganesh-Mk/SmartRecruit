const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Failed: ", err));

const signup = require("./routes/signup");
const login = require("./routes/login");
const root = require("./routes/root");

// Jobs Routes
const allJob = require("./routes/allJob");
const createJob = require("./routes/createJob");
const deleteJob = require("./routes/deleteJob");
const updateJob = require("./routes/updateJob");
const getJob = require("./routes/getJob")
const jobs = require("./routes/jobs")
const getUserInfo = require("./routes/getUserInfo")


app.use(allJob);
app.use(jobs);
app.use(getJob);
app.use(createJob);
app.use(updateJob);
app.use(deleteJob);

app.use(getUserInfo);
app.use(root);
app.use(signup);
app.use(login);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
