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
const allJob = require("./routes/job/allJob");
const createJob = require("./routes/job/createJob");
const deleteJob = require("./routes/job/deleteJob");
const updateJob = require("./routes/job/updateJob");
const getJob = require("./routes/job/getJob");


app.use(allJob);
app.use(getJob);
app.use(createJob);
app.use(updateJob);
app.use(deleteJob);

app.use(root);
app.use(signup);
app.use(login);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
