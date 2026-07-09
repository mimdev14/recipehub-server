const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// =============================
// Add Report
// =============================
const addReport = async (req, res) => {
  try {
    const db = await connectDB();

    const report = req.body;

    // Prevent duplicate reports
    const exists = await db.collection("reports").findOne({
      recipeId: report.recipeId,
      reporterEmail: req.user.email,
    });

    if (exists) {
      return res.status(400).send({
        message: "You already reported this recipe.",
      });
    }

    report.reporterEmail = req.user.email;
    report.status = "Pending";
    report.createdAt = new Date();

    const result = await db
      .collection("reports")
      .insertOne(report);

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to submit report",
    });
  }
};

// =============================
// Admin
// =============================
const getReports = async (req, res) => {
  try {
    const db = await connectDB();

    const reports = await db
      .collection("reports")
      .find()
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
// Dismiss Report
// =============================
const dismissReport = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.collection("reports").updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          status: "Dismissed",
        },
      }
    );

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to dismiss report",
    });
  }
};
// =============================
// Delete Reported Recipe
// =============================
const deleteReportedRecipe = async (req, res) => {
  try {
    const db = await connectDB();

    const report = await db.collection("reports").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!report) {
      return res.status(404).send({
        message: "Report not found",
      });
    }

    // Delete recipe
    await db.collection("recipes").deleteOne({
      _id: new ObjectId(report.recipeId),
    });

    // Delete all reports for that recipe
    await db.collection("reports").deleteMany({
      recipeId: report.recipeId,
    });

    res.send({
      success: true,
      message: "Recipe removed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to remove recipe",
    });
  }
};

module.exports = {
  addReport,
  getReports,
  dismissReport,
  deleteReportedRecipe
};
