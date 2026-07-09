const express = require("express");

const {
  addReport,
  getReports,
  dismissReport,
  deleteReportedRecipe,
} = require("../controllers/reportController");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = express.Router();

// ==============================
// User Routes
// ==============================

// Submit a report
router.post(
  "/",
  verifyToken,
  addReport
);

// ==============================
// Admin Routes
// ==============================

// Get all reports
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getReports
);

// Dismiss a report
router.patch(
  "/:id/dismiss",
  verifyToken,
  verifyAdmin,
  dismissReport
);

// Delete reported recipe
router.delete(
  "/:id/remove-recipe",
  verifyToken,
  verifyAdmin,
  deleteReportedRecipe
);

module.exports = router;