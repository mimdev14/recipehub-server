const stripe = require("../config/stripe");

// ===================================
// Create Payment Intent
// ===================================
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // dollars → cents
        currency: "usd",
        payment_method_types: ["card"],
      });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to create payment intent",
    });
  }
};

module.exports = {
  createPaymentIntent,
};