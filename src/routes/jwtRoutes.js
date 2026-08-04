const express = require("express");
const admin = require("../config/firebaseAdmin");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No Firebase token provided",
      });
    }

    // Verify Firebase ID Token
    const decoded = await admin.auth().verifyIdToken(token);

    // Create JWT
    const jwtToken = jwt.sign(
      {
        email: decoded.email,
        uid: decoded.uid,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send JWT as HttpOnly Cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.send({
      success: true,
      message: "JWT Created Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }
});

module.exports = router;
