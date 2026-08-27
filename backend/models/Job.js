const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    salary: {
      type: String,
      default: "Not disclosed",
      trim: true,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);