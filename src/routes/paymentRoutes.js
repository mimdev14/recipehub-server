const express = require("express");

const {
  getAllTransactions,
} = require("../controllers/paymentController");

const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = express.Router();

// Admin: Get all payment transactions
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getAllTransactions
);

module.exports = router;