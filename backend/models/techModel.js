const mongoose = require("mongoose");

// Define each tech schema
const eachTechSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

// Define the tech schema that embeds eachTechSchema as an array
const techSchema = new mongoose.Schema({
  techEntries: [eachTechSchema], // Embed multiple tech entries
});

module.exports = mongoose.models.Tech || mongoose.model("Tech", techSchema);
