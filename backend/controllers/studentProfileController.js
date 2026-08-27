const StudentProfile = require("../models/StudentProfile");

async function getMyStudentProfile(request, response) {
  try {
    const profile = await StudentProfile.findOne({
      user: request.user.id,
    }).populate("user", "name email");

    return response.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return response.status(500).json({
      message: "Unable to retrieve your profile",
    });
  }
}

async function saveStudentProfile(request, response) {
  try {
    const {
      headline,
      about,
      location,
      college,
      degree,
      graduationYear,
      skills,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
    } = request.body;

    const cleanedSkills = Array.isArray(skills)
      ? [...new Set(
          skills
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0)
        )]
      : [];

    const profile = await StudentProfile.findOneAndUpdate(
      {
        user: request.user.id,
      },
      {
        user: request.user.id,
        headline: headline || "",
        about: about || "",
        location: location || "",
        college: college || "",
        degree: degree || "",
        graduationYear: graduationYear || undefined,
        skills: cleanedSkills,
        githubUrl: githubUrl || "",
        linkedinUrl: linkedinUrl || "",
        portfolioUrl: portfolioUrl || "",
        resumeUrl: resumeUrl || "",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).populate("user", "name email");

    return response.json({
      message: "Student profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Save profile error:", error.message);

    if (error.name === "ValidationError") {
      return response.status(400).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      message: "Unable to save your profile",
    });
  }
}

async function getStudentProfile(request, response) {
  try {
    const profile = await StudentProfile.findOne({
      user: request.params.userId,
    }).populate("user", "name email");

    if (!profile) {
      return response.status(404).json({
        message: "Student profile not found",
      });
    }

    return response.json({ profile });
  } catch (error) {
    return response.status(500).json({
      message: "Unable to retrieve student profile",
    });
  }
}

module.exports = {
  getMyStudentProfile,
  saveStudentProfile,
  getStudentProfile,
};