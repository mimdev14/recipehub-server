const express = require("express");

const {
  checkRecipeAccess,
} = require("../controllers/recipeAccessController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Check if current user can view full recipe
router.get(
  "/:recipeId",
  verifyToken,
  checkRecipeAccess
);

module.exports = router;