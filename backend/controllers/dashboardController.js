const Job = require("../models/Job");
const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");

async function getHRDashboardStats(request, response) {
  try {
    const jobs = await Job.find({
      postedBy: request.user.id,
    }).select("_id status");

    const jobIds = jobs.map((job) => job._id);

    const activeJobs = jobs.filter(
      (job) => job.status === "active"
    ).length;

    const [totalApplications, shortlisted] = await Promise.all([
      Application.countDocuments({
        job: { $in: jobIds },
      }),

      Application.countDocuments({
        job: { $in: jobIds },
        status: "Shortlisted",
      }),
    ]);

    return response.json({
      stats: {
        activeJobs,
        applications: totalApplications,
        shortlisted,
      },
    });
  } catch (error) {
    console.error("HR dashboard statistics error:", error.message);

    return response.status(500).json({
      message: "Unable to retrieve dashboard statistics",
    });
  }
}

async function getStudentDashboardStats(request, response) {
  try {
    const [profile, jobsApplied, shortlisted] = await Promise.all([
      StudentProfile.findOne({
        user: request.user.id,
      }),

      Application.countDocuments({
        student: request.user.id,
      }),

      Application.countDocuments({
        student: request.user.id,
        status: "Shortlisted",
      }),
    ]);

    let profileCompletion = 0;

    if (profile) {
      const profileFields = [
        profile.headline,
        profile.about,
        profile.location,
        profile.college,
        profile.degree,
        profile.graduationYear,
        profile.skills?.length > 0,
        profile.githubUrl,
        profile.linkedinUrl,
        profile.portfolioUrl || profile.resumeUrl,
      ];

      const completedFields = profileFields.filter(Boolean).length;

      profileCompletion = Math.round(
        (completedFields / profileFields.length) * 100
      );
    }

    return response.json({
      stats: {
        profileCompletion,
        jobsApplied,
        shortlisted,
      },
    });
  } catch (error) {
    console.error(
      "Student dashboard statistics error:",
      error.message
    );

    return response.status(500).json({
      message: "Unable to retrieve dashboard statistics",
    });
  }
}

module.exports = {
  getHRDashboardStats,
  getStudentDashboardStats,
};