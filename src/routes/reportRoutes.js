const express = require("express");

const {
  addReport,
  getReports,
  dismissReport,
} = require("../controllers/reportController");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = express.Router();

// User
router.post("/", verifyToken, addReport);

// Admin
router.get("/", verifyToken, verifyAdmin, getReports);

router.patch(
  "/:id/dismiss",
  verifyToken,
  verifyAdmin,
  dismissReport
);

module.exports = router;