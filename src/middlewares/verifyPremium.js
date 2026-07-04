const connectDB = require("../config/db");

const verifyPremium = async (req, res, next) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const user = await db.collection("users").findOne({
      email,
    });

    if (!user || !user.isPremium) {
      return res.status(403).send({
        message: "Premium membership required",
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

module.exports = verifyPremium;