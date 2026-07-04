const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");


const router = express.Router();

// Protected Route
router.get(
  "/stats/:email",
  verifyToken,
  getDashboardStats
);

module.exports = router;