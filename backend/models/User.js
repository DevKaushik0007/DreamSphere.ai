const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // For local auth (your Node login)
    name: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: null, // Supabase users won’t have password
    },

    // For Supabase auth
    supabaseId: {
      type: String,
      unique: true,
      sparse: true, // allows null values
    },

    authProvider: {
      type: String,
      enum: ["local", "supabase"],
      default: "supabase",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
