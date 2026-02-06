const mongoose = require("mongoose");

const aiOutputSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    prompt: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    },
    tool: {
      type: String, // summarize, generate, rewrite etc
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiOutput", aiOutputSchema);
