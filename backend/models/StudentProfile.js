const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    about: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    college: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    degree: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    graduationYear: {
      type: Number,
      min: 2000,
      max: 2100,
    },

    skills: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);