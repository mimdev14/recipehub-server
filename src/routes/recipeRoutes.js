const express = require("express");

const {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  likeRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  getFeaturedRecipes,
} = require("../controllers/recipeController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// ==============================
// Public Routes
// ==============================

// Featured Recipes
router.get("/featured", getFeaturedRecipes);

// Browse Recipes
router.get("/", getAllRecipes);

// My Recipes
router.get(
  "/my-recipes",
  verifyToken,
  getMyRecipes
);

// Recipe Details
router.get("/:id", getRecipeById);

// ==============================
// Protected Routes
// ==============================

// Add Recipe
router.post(
  "/",
  verifyToken,
  addRecipe
);

// Like Recipe
router.patch(
  "/:id/like",
  verifyToken,
  likeRecipe
);

// Update Recipe
router.put(
  "/:id",
  verifyToken,
  updateRecipe
);

// Delete Recipe
router.delete(
  "/:id",
  verifyToken,
  deleteRecipe
);



module.exports = router;