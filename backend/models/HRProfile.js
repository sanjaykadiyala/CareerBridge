const mongoose = require("mongoose");

const hrProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    designation: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    companyName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    industry: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    companyLocation: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    companySize: {
      type: String,
      trim: true,
      default: "",
    },

    aboutCompany: {
      type: String,
      trim: true,
      maxlength: 1500,
      default: "",
    },

    companyWebsite: {
      type: String,
      trim: true,
      default: "",
    },

    companyLinkedin: {
      type: String,
      trim: true,
      default: "",
    },

    companyLogoUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HRProfile", hrProfileSchema);