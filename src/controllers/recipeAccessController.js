const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

const checkRecipeAccess = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;
    const { recipeId } = req.params;

    // Find recipe
    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(recipeId),
    });

    if (!recipe) {
      return res.status(404).send({
        success: false,
        message: "Recipe not found",
      });
    }

    // Find current user
    const user = await db.collection("users").findOne({
      email,
    });

    // Admin
    if (user?.role === "admin") {
      return res.send({
        hasAccess: true,
      });
    }

    // Recipe Owner
    if (recipe.authorEmail === email) {
      return res.send({
        hasAccess: true,
      });
    }

    // Premium User
    if (user?.isPremium) {
      return res.send({
        hasAccess: true,
      });
    }

    // Purchased Recipe
    const purchase = await db.collection("payments").findOne({
      userEmail: email,
      recipeId,
      type: "recipe",
    });

    if (purchase) {
      return res.send({
        hasAccess: true,
      });
    }

    // No Access
    return res.send({
      hasAccess: false,
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to check access",
    });
  }
};

module.exports = {
  checkRecipeAccess,
};