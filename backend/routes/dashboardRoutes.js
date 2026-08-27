const express = require("express");

const {
  getHRDashboardStats,
  getStudentDashboardStats,
} = require("../controllers/dashboardController");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/hr",
  authenticate,
  authorizeRoles("hr"),
  getHRDashboardStats
);

router.get(
  "/student",
  authenticate,
  authorizeRoles("student"),
  getStudentDashboardStats
);

module.exports = router;