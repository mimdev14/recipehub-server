const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../config/firebaseAdmin");

console.log("✅ authRoutes loaded");

const router = express.Router();

// =====================
// Generate JWT
// =====================
router.post("/jwt", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No Firebase Token",
      });
    }

    const decoded = await auth.verifyIdToken(token);

    const jwtToken = jwt.sign(
      {
        uid: decoded.uid,
        email: decoded.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send({
      success: true,
      message: "Login Success",
    });
  } catch (error) {
    console.log(error);

    res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
});

// =====================
// Logout
// =====================
router.post("/logout", (req, res) => {
  console.log("🔥 Logout route hit");

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  res.status(200).send({
    success: true,
    message: "Logout Success",
  });
});

module.exports = router;