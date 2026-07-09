const connectDB = require("../config/db");

// =======================================
// Get All Transactions (Admin)
// =======================================
const getAllTransactions = async (req, res) => {
  try {
    const db = await connectDB();

    const payments = await db
      .collection("payments")
      .find()
      .sort({ paidAt: -1 })
      .toArray();

    res.send(payments);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

module.exports = {
  getAllTransactions,
};