const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverLetter: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

// A student can apply to the same job only once
applicationSchema.index(
  {
    job: 1,
    student: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);