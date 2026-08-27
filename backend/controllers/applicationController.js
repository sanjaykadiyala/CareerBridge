const Application = require("../models/Application");
const Job = require("../models/Job");

async function applyToJob(request, response) {
  try {
    const { jobId } = request.params;
    const { coverLetter } = request.body;

    const job = await Job.findById(jobId);

    if (!job || job.status !== "active") {
      return response.status(404).json({
        message: "This job is not available",
      });
    }

    if (
      job.applicationDeadline &&
      new Date(job.applicationDeadline) < new Date()
    ) {
      return response.status(400).json({
        message: "The application deadline has passed",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      student: request.user.id,
    });

    if (existingApplication) {
      return response.status(409).json({
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      student: request.user.id,
      coverLetter: coverLetter || "",
    });

    return response.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Application error:", error.message);

    if (error.code === 11000) {
      return response.status(409).json({
        message: "You have already applied for this job",
      });
    }

    return response.status(500).json({
      message: "Unable to submit application",
    });
  }
}

async function getMyApplications(request, response) {
  try {
    const applications = await Application.find({
      student: request.user.id,
    })
      .populate(
        "job",
        "title company location jobType salary applicationDeadline status"
      )
      .sort({ createdAt: -1 });

    return response.json({
      applications,
    });
  } catch {
    return response.status(500).json({
      message: "Unable to retrieve applications",
    });
  }
}

async function getJobApplicants(request, response) {
  try {
    const { jobId } = request.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return response.status(404).json({
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== request.user.id) {
      return response.status(403).json({
        message: "You cannot view applicants for this job",
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return response.json({
      job,
      applications,
    });
  } catch {
    return response.status(500).json({
      message: "Unable to retrieve applicants",
    });
  }
}

async function updateApplicationStatus(request, response) {
  try {
    const { applicationId } = request.params;
    const { status } = request.body;

    if (!["Shortlisted", "Rejected"].includes(status)) {
      return response.status(400).json({
        message: "Invalid application status",
      });
    }

    const application = await Application.findById(applicationId).populate(
      "job"
    );

    if (!application) {
      return response.status(404).json({
        message: "Application not found",
      });
    }

    if (application.job.postedBy.toString() !== request.user.id) {
      return response.status(403).json({
        message: "You cannot update this application",
      });
    }

    application.status = status;
    await application.save();

    return response.json({
      message: `Application ${status.toLowerCase()} successfully`,
      application,
    });
  } catch {
    return response.status(500).json({
      message: "Unable to update application",
    });
  }
}

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};