const express = require("express");

const {
  createRecipeCheckout,
  recipePaymentSuccess,
  getPurchasedRecipes,
} = require("../controllers/recipePurchaseController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// =======================================
// Create Stripe Checkout Session
// =======================================
router.post(
  "/create-checkout-session",
  verifyToken,
  createRecipeCheckout
);

// =======================================
// Verify Payment Success
// =======================================
router.post(
  "/payment-success",
  recipePaymentSuccess
);

// =======================================
// Get My Purchased Recipes
// =======================================
router.get(
  "/my-purchases",
  verifyToken,
  getPurchasedRecipes
);

module.exports = router;