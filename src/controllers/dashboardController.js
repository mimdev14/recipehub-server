const connectDB = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    // 🔒 Prevent users from accessing someone else's dashboard
    if (req.user.email !== req.params.email) {
      return res.status(403).send({
        message: "Forbidden Access",
      });
    }

    const db = await connectDB();

    const email = req.params.email;

    // Get user's recipes
    const recipes = await db
      .collection("recipes")
      .find({ authorEmail: email })
      .toArray();

    const totalRecipes = recipes.length;

    const totalLikes = recipes.reduce(
      (sum, recipe) => sum + (recipe.likesCount || 0),
      0
    );

    // Get user
    const user = await db.collection("users").findOne({
      email,
    });

    res.send({
      totalRecipes,
      totalLikes,
      favorites: 0,
      isPremium: user?.isPremium || false,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to load dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};