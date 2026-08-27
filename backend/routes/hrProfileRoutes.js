const express = require("express");

const {
  getMyHRProfile,
  saveHRProfile,
  getHRProfile,
} = require("../controllers/hrProfileController");

const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/me",
  authenticate,
  authorizeRoles("hr"),
  getMyHRProfile
);

router.put(
  "/me",
  authenticate,
  authorizeRoles("hr"),
  saveHRProfile
);

router.get(
  "/:userId",
  authenticate,
  getHRProfile
);

module.exports = router;