const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reportRoutes = require("./routes/reportRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recipePurchaseRoutes = require("./routes/recipePurchaseRoutes");
const recipeAccessRoutes = require("./routes/recipeAccessRoutes");

const app = express();

// =======================
// Connect MongoDB
// =======================
connectDB()
  .then(() => {
    console.log("✅ Database Connected");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error);
  });

// =======================
// Middleware
// =======================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL, // Railway/Vercel frontend URL
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// =======================
// Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/recipe-access", recipeAccessRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/recipe-purchase", recipePurchaseRoutes);

// =======================
// Root Route
// =======================
app.get("/", (req, res) => {
  res.status(200).send("🚀 RecipeHub Server Running...");
});

// =======================
// Health Check
// =======================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// =======================
// 404 Handler
// =======================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});