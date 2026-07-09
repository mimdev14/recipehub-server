const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reportRoutes = require("./routes/reportRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const recipePurchaseRoutes = require("./routes/recipePurchaseRoutes");
const recipeAccessRoutes = require("./routes/recipeAccessRoutes");


const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

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
app.use(
  "/api/recipe-purchase",
  recipePurchaseRoutes
);

app.get("/", (req, res) => {
  res.send("RecipeHub Server Running...");
});

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}
startServer().catch((error) => {
  console.error("Failed to start server:", error);
});

