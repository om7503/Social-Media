const express = require("express");
const multer = require("multer");
const Submission = require("../models/submission");
const router = express.Router();
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route: Submit form data
router.post("/submit", upload.array("images", 10), async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    const images = req.files.map((file) => file.filename);

    const newSubmission = new Submission({ name, socialMediaHandle, images });
    await newSubmission.save();

    res.status(201).json({ message: "Submission successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Get all submissions
router.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
