const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// Add Favorite
const addFavorite = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const favorite = {
      ...req.body,
      userEmail: email,
      createdAt: new Date(),
    };

    const existing = await db.collection("favorites").findOne({
      recipeId: favorite.recipeId,
      userEmail: email,
    });

    if (existing) {
      return res.status(400).send({
        message: "Recipe already added to favorites",
      });
    }

    const result = await db
      .collection("favorites")
      .insertOne(favorite);

    res.status(201).send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to add favorite",
    });
  }
};

// Get User Favorites
const getFavorites = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const favorites = await db
      .collection("favorites")
      .find({
        userEmail: email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.send(favorites);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch favorites",
    });
  }
};

// Remove Favorite
const deleteFavorite = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const result = await db.collection("favorites").deleteOne({
      _id: new ObjectId(req.params.id),
      userEmail: email,
    });

    if (result.deletedCount === 0) {
      return res.status(403).send({
        message: "Unauthorized",
      });
    }

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to delete favorite",
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  deleteFavorite,
};