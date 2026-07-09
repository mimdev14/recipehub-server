const connectDB = require("../config/db");
const stripe = require("../config/stripe");

// ===========================================
// Create Checkout Session
// ===========================================
const createCheckoutSession = async (req, res) => {
  try {
    const email = req.user.email;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: "bdt",

            product_data: {
              name: "RecipeHub Premium Membership",
            },

            unit_amount: 49900,
          },

          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/dashboard/membership`,

      metadata: {
        email,
      },
    });

    res.send({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

// ===========================================
// Verify Payment
// ===========================================
const paymentSuccess = async (req, res) => {
  try {
    const db = await connectDB();

    const { sessionId } = req.body;

    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).send({
        success: false,
        message: "Payment not completed.",
      });
    }

    const email = session.customer_email;

    // Prevent duplicate payment
    const exists = await db.collection("payments").findOne({
      transactionId: session.payment_intent,
    });

    if (exists) {
      return res.send({
        success: true,
        message: "Already processed",
      });
    }

    // Save payment
    await db.collection("payments").insertOne({
      userEmail: email,
      amount: session.amount_total / 100,
      transactionId: session.payment_intent,
      paymentStatus: "Paid",
      paidAt: new Date(),
    });

    // Upgrade user
    await db.collection("users").updateOne(
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
      message: "Premium Activated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Payment verification failed.",
    });
  }
};

module.exports = {
  createCheckoutSession,
  paymentSuccess,
};