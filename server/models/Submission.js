const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  socialMediaHandle: { type: String, required: true },
  images: { type: [mongoose.Schema.Types.ObjectId], ref: "uploads", required: true },
});

module.exports = mongoose.model("User", submissionSchema);
