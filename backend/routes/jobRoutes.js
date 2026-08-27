const express = require("express");

const {
  createJob,
  getAllJobs,
  getMyJobs,
} = require("../controllers/jobController");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getAllJobs);

router.get(
  "/mine",
  authenticate,
  authorizeRoles("hr"),
  getMyJobs
);

router.post(
  "/",
  authenticate,
  authorizeRoles("hr"),
  createJob
);

module.exports = router;