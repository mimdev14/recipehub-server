const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

// ==============================
// Get All Recipes
// ==============================
const getAllRecipes = async (req, res) => {
  try {
    const db = await connectDB();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit;

    const { categories } = req.query;

    let query = {};

    if (categories) {
      query.category = {
        $in: categories.split(","),
      };
    }

    const total = await db.collection("recipes").countDocuments(query);

    const recipes = await db
      .collection("recipes")
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      recipes,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch recipes",
    });
  }
};

// ==============================
// Get Single Recipe
// ==============================
const getRecipeById = async (req, res) => {
  try {
    const db = await connectDB();

    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!recipe) {
      return res.status(404).send({
        message: "Recipe not found",
      });
    }

    res.send(recipe);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch recipe",
    });
  }
};

// ==============================
// Like Recipe
// ==============================
const likeRecipe = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.collection("recipes").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $inc: {
          likesCount: 1,
        },
      }
    );

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to like recipe",
    });
  }
};

// ==============================
// Update Recipe
// ==============================
const updateRecipe = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const result = await db.collection("recipes").updateOne(
      {
        _id: new ObjectId(req.params.id),
        authorEmail: email,
      },
      {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(403).send({
        message: "Unauthorized",
      });
    }

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to update recipe",
    });
  }
};

// ==============================
// Delete Recipe
// ==============================
const deleteRecipe = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const result = await db.collection("recipes").deleteOne({
      _id: new ObjectId(req.params.id),
      authorEmail: email,
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
      message: "Failed to delete recipe",
    });
  }
};
// ==============================
// Add Recipe
// ==============================
// ==============================
// Add Recipe
// ==============================
const addRecipe = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    // Get logged-in user
    const user = await db.collection("users").findOne({
      email,
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // Free users can add only 2 recipes
    if (!user.isPremium) {
      const totalRecipes = await db
        .collection("recipes")
        .countDocuments({
          authorEmail: email,
        });

      if (totalRecipes >= 2) {
        return res.status(403).send({
          message:
            "Free users can only add 2 recipes. Upgrade to Premium.",
        });
      }
    }

    const recipe = {
      ...req.body,

      // NEVER trust the frontend
      authorEmail: email,
      authorName: user.name,

      likesCount: 0,
      isFeatured: false,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("recipes")
      .insertOne(recipe);

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to add recipe",
    });
  }
};
// ==============================
// Get My Recipes
// ==============================
const getMyRecipes = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const recipes = await db
      .collection("recipes")
      .find({
        authorEmail: email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.send(recipes);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch recipes",
    });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  likeRecipe,
  updateRecipe,
  deleteRecipe,
  addRecipe,
  getMyRecipes,
};
  