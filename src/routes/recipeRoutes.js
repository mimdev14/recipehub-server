const express = require("express");
const conectDB = require("../config/db");
const {
  addRecipe,
  getAllRecipes,
  getRecipeById,
  likeRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes
} = require("../controllers/recipeController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", getAllRecipes);

router.get("/:id", getRecipeById);

router.post(
  "/",
  verifyToken,
  addRecipe
);

router.patch(
  "/:id/like",
  verifyToken,
  likeRecipe
);

router.put(
  "/:id",
  verifyToken,
  updateRecipe
);

router.delete(
  "/:id",
  verifyToken,
  deleteRecipe
);

router.get(
  "/my-recipes",
  verifyToken,
  getMyRecipes
);

module.exports = router;