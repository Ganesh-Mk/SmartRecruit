const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Adjust the path as necessary
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Convert buffer to readable stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => { };
  readable.push(buffer);
  readable.push(null); // End of stream
  return readable;
};

router.post(
  "/uploadScreenshot",
  upload.single("screenshot"),
  async (req, res) => {
    const { userId, email } = req.body;
    const screenshotFile = req.file;


    try {
      const user = await User.findOne({ email, _id: userId });
      if (!user) return res.status(404).send({ message: "User Not Found!" });

      const candidate = user.candidateData.find(
        (candidate) => candidate.email === email
      );
      if (!candidate)
        return res.status(404).send({ message: "Candidate Not Found!" });

      // Upload screenshot to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "screenshots",
            public_id: `${user._id}_${candidate.email}_screenshot`,
          },
          (error, result) => {
            if (error) {
              reject(new Error("Cloudinary upload failed"));
            } else {
              resolve(result);
            }
          }
        );

        bufferToStream(screenshotFile.buffer).pipe(uploadStream);
      });

      candidate.cheatImage = result.secure_url; // Store the Cloudinary URL in MongoDB
      await user.save();

      res
        .status(200)
        .send({ message: "Screenshot uploaded successfully", user });
    } catch (err) {
      console.error("Error:", err.message);
      res
        .status(500)
        .send({ message: "An error occurred", error: err.message });
    }
  }
);

module.exports = router;
