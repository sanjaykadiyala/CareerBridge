const express = require("express");

const {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/mine",
  authenticate,
  authorizeRoles("student"),
  getMyApplications
);

router.post(
  "/:jobId",
  authenticate,
  authorizeRoles("student"),
  applyToJob
);

router.get(
  "/job/:jobId",
  authenticate,
  authorizeRoles("hr"),
  getJobApplicants
);

router.patch(
  "/:applicationId/status",
  authenticate,
  authorizeRoles("hr"),
  updateApplicationStatus
);

module.exports = router;