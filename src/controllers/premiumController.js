const connectDB = require("../config/db");

const upgradeToPremium = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          isPremium: true,
          updatedAt: new Date(),
        },
      }
    );

    res.send({
      success: true,
      message: "Premium activated",
      result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to upgrade",
    });
  }
};

module.exports = {
  upgradeToPremium,
};