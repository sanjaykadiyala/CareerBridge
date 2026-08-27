const express = require("express");

const {
  getMyStudentProfile,
  saveStudentProfile,
  getStudentProfile,
} = require("../controllers/studentProfileController");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/me",
  authenticate,
  authorizeRoles("student"),
  getMyStudentProfile
);

router.put(
  "/me",
  authenticate,
  authorizeRoles("student"),
  saveStudentProfile
);

router.get(
  "/:userId",
  authenticate,
  getStudentProfile
);

module.exports = router;