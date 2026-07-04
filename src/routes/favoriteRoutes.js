const express = require("express");

const {
  addFavorite,
  getFavorites,
  deleteFavorite,
} = require("../controllers/favoriteController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  addFavorite
);

router.get(
  "/",
  verifyToken,
  getFavorites
);

router.delete(
  "/:id",
  verifyToken,
  deleteFavorite
);

module.exports = router;