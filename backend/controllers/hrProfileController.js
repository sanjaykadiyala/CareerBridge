const HRProfile = require("../models/HRProfile");

async function getMyHRProfile(request, response) {
  try {
    const profile = await HRProfile.findOne({
      user: request.user.id,
    }).populate("user", "name email");

    return response.json({ profile });
  } catch (error) {
    console.error("Get HR profile error:", error.message);

    return response.status(500).json({
      message: "Unable to retrieve your HR profile",
    });
  }
}

async function saveHRProfile(request, response) {
  try {
    const {
      designation,
      companyName,
      industry,
      companyLocation,
      companySize,
      aboutCompany,
      companyWebsite,
      companyLinkedin,
      companyLogoUrl,
    } = request.body;

    const profile = await HRProfile.findOneAndUpdate(
      {
        user: request.user.id,
      },
      {
        user: request.user.id,
        designation: designation || "",
        companyName: companyName || "",
        industry: industry || "",
        companyLocation: companyLocation || "",
        companySize: companySize || "",
        aboutCompany: aboutCompany || "",
        companyWebsite: companyWebsite || "",
        companyLinkedin: companyLinkedin || "",
        companyLogoUrl: companyLogoUrl || "",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).populate("user", "name email");

    return response.json({
      message: "HR profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Save HR profile error:", error.message);

    if (error.name === "ValidationError") {
      return response.status(400).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      message: "Unable to save your HR profile",
    });
  }
}

async function getHRProfile(request, response) {
  try {
    const profile = await HRProfile.findOne({
      user: request.params.userId,
    }).populate("user", "name email");

    if (!profile) {
      return response.status(404).json({
        message: "HR profile not found",
      });
    }

    return response.json({ profile });
  } catch (error) {
    return response.status(500).json({
      message: "Unable to retrieve HR profile",
    });
  }
}

module.exports = {
  getMyHRProfile,
  saveHRProfile,
  getHRProfile,
};