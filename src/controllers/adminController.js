const connectDB = require("../config/db");

// =========================
// Get All Users
// =========================
const getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();

    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(users);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch users",
    });
  }
};

// =========================
// Update User Role
// =========================
const updateUserRole = async (req, res) => {
  try {
    const db = await connectDB();

    const { email } = req.params;
    const { role } = req.body;

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          role,
          updatedAt: new Date(),
        },
      }
    );

    res.send({
      success: true,
      message: "Role Updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed",
    });
  }
};
// =========================
// Delete Recipe
// =========================
const deleteRecipe = async (req, res) => {
  try {
    const db = await connectDB();

    const { id } = req.params;

    await db.collection("recipes").deleteOne({
      _id: new (require("mongodb").ObjectId)(id),
    });

    res.send({
      success: true,
      message: "Recipe Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Delete Failed",
    });
  }
};
// =========================
// Get All Recipes
// =========================
const getAllRecipes = async (req, res) => {
  try {
    const db = await connectDB();

    const recipes = await db
      .collection("recipes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(recipes);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch recipes",
    });
  }
};

// =============================
// Get All Reports
// =============================
const getAllReports = async (req, res) => {
  try {
    const db = await connectDB();

    const reports = await db
      .collection("reports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(reports);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch reports",
    });
  }
};
// =============================
// Delete Report
// =============================
const deleteReport = async (req, res) => {
  try {
    const db = await connectDB();

    const { id } = req.params;

    await db.collection("reports").deleteOne({
      _id: new (require("mongodb").ObjectId)(id),
    });

    res.send({
      success: true,
      message: "Report Deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Delete Failed",
    });
  }
};
// ==========================
// Get Premium Requests
// ==========================
const getPremiumRequests = async (req, res) => {
  try {
    const db = await connectDB();

    const requests = await db
      .collection("premiumRequests")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(requests);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch requests",
    });
  }
};
// ==========================
// Approve Premium Request
// ==========================
const approvePremiumRequest = async (req, res) => {
  try {
    const db = await connectDB();

    const { email } = req.params;

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          isPremium: true,
          Subscription: "Premium User",
        },
      }
    );

    await db.collection("premiumRequests").deleteOne({
      email,
    });

    res.send({
      success: true,
      message: "Premium Approved",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Approval Failed",
    });
  }
};
// ==========================
// Reject Premium Request
// ==========================
const rejectPremiumRequest = async (req, res) => {
  try {
    const db = await connectDB();

    const { email } = req.params;

    await db.collection("premiumRequests").deleteOne({
      email,
    });

    res.send({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Reject Failed",
    });
  }
};

// =============================
// Admin Statistics
// =============================
const getAdminStats = async (req, res) => {
  try {
    const db = await connectDB();

    const usersCollection = db.collection("users");
    const recipesCollection = db.collection("recipes");
    const reportsCollection = db.collection("reports");
    const favoritesCollection = db.collection("favorites");

    const totalUsers =
      await usersCollection.countDocuments();

    const totalRecipes =
      await recipesCollection.countDocuments();

    const totalReports =
      await reportsCollection.countDocuments();

    const totalFavorites =
      await favoritesCollection.countDocuments();

    const premiumUsers =
      await usersCollection.countDocuments({
        isPremium: true,
      });

    const recipes =
      await recipesCollection.find().toArray();

    const totalLikes = recipes.reduce(
      (sum, recipe) => sum + (recipe.likes || 0),
      0
    );

    res.send({
      totalUsers,
      totalRecipes,
      totalReports,
      totalFavorites,
      premiumUsers,
      totalLikes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed",
    });
  }
};
// =============================
// Feature Recipe
// =============================
const { ObjectId } = require("mongodb");

const featureRecipe = async (req, res) => {
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

    const result = await db.collection("recipes").updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          isFeatured: !recipe.isFeatured,
        },
      }
    );

    res.send({
      success: true,
      featured: !recipe.isFeatured,
      result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed",
    });
  }
};

// =========================
// Block / Unblock User
// =========================
const updateBlockStatus = async (req, res) => {
  try {
    const db = await connectDB();

    const { email } = req.params;
    const { isBlocked } = req.body;

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          isBlocked,
          updatedAt: new Date(),
        },
      }
    );

    res.send({
      success: true,
      message: "User Updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  updateBlockStatus,
  getAllRecipes,
  deleteRecipe,
  getAllReports,
  deleteReport,
  getPremiumRequests,
  approvePremiumRequest,
  rejectPremiumRequest,
  getAdminStats,
  featureRecipe,
};