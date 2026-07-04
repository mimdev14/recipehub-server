const connectDB = require("../config/db");

const verifyAdmin = async (req, res, next) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const user = await db.collection("users").findOne({
      email,
    });

    if (!user || user.role !== "admin") {
      return res.status(403).send({
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Authorization failed",
    });
  }
};

module.exports = verifyAdmin;