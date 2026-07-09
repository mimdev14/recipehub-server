const express = require("express");

const {
  createCheckoutSession,
  paymentSuccess,
} = require("../controllers/premiumController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Create Stripe Checkout
router.post(
  "/create-checkout-session",
  verifyToken,
  createCheckoutSession
);

// Verify payment after success
router.post(
  "/payment-success",
  paymentSuccess
);

module.exports = router;