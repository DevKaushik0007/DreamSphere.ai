const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // ✅ Supabase UUID
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      default: "global",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Search", searchSchema);
