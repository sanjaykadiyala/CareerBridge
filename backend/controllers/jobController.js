const Job = require("../models/Job");

async function createJob(request, response) {
  try {
    const {
      title,
      company,
      location,
      jobType,
      description,
      skills,
      salary,
      applicationDeadline,
    } = request.body;

    if (!title || !company || !location || !jobType || !description) {
      return response.status(400).json({
        message: "Required job information is missing",
      });
    }

    const skillList = Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : String(skills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      jobType,
      description: description.trim(),
      skills: skillList,
      salary: String(salary || "").trim() || "Not disclosed",
      applicationDeadline: applicationDeadline || null,
      postedBy: request.user.id,
    });

    return response.status(201).json({
      message: "Job posted successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error.message);

    return response.status(500).json({
      message: "Unable to create job",
    });
  }
}

async function getAllJobs(request, response) {
  try {
    const jobs = await Job.find({ status: "active" })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    return response.json({
      jobs,
    });
  } catch {
    return response.status(500).json({
      message: "Unable to retrieve jobs",
    });
  }
}

async function getMyJobs(request, response) {
  try {
    const jobs = await Job.find({
      postedBy: request.user.id,
    }).sort({ createdAt: -1 });

    return response.json({
      jobs,
    });
  } catch {
    return response.status(500).json({
      message: "Unable to retrieve your jobs",
    });
  }
}

module.exports = {
  createJob,
  getAllJobs,
  getMyJobs,
};