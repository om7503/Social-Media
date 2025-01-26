const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

let gridfsBucket;

// Set up GridFSBucket
mongoose.connection.on("connected", () => {
  gridfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  console.log("GridFSBucket initialized.");
});

// Setup Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file upload
app.post("/api/upload", upload.array("images", 5), (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const fileIds = [];

  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      uploadStream.end(file.buffer);

      uploadStream.on("finish", () => {
        console.log(`File ${file.originalname} uploaded successfully!`);

        // Push the uploaded file's _id to fileIds
        fileIds.push(uploadStream.id); // use uploadStream.id to access the _id of the uploaded file

        resolve();
      });

      uploadStream.on("error", (err) => {
        console.error(`Error uploading file ${file.originalname}:`, err);
        reject(err);
      });
    });
  });

  // Once all files are uploaded
  Promise.all(uploadPromises)
    .then(() => {
      // You can use fileIds for further processing, such as saving to the database
      console.log("All files uploaded successfully.", fileIds);
      res.status(200).send("Files uploaded successfully.");
    })
    .catch((err) => {
      res.status(500).send("Error uploading files: " + err.message);
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
