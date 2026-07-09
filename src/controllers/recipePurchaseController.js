const connectDB = require("../config/db");
const stripe = require("../config/stripe");
const { ObjectId } = require("mongodb");

// =======================================
// Create Checkout Session
// =======================================
const createRecipeCheckout = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;
    const { recipeId } = req.body;

    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(recipeId),
    });

    if (!recipe) {
      return res.status(404).send({
        success: false,
        message: "Recipe not found",
      });
    }

    // Prevent purchasing your own recipe
    if (recipe.authorEmail === email) {
      return res.status(400).send({
        success: false,
        message: "You cannot purchase your own recipe.",
      });
    }

    // Prevent duplicate purchase
    const alreadyPurchased = await db.collection("payments").findOne({
      userEmail: email,
      recipeId,
      type: "recipe",
    });

    if (alreadyPurchased) {
      return res.status(400).send({
        success: false,
        message: "You already purchased this recipe.",
      });
    }

    // Default recipe price
    const price = recipe.price || 150;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: "bdt",

            product_data: {
              name: recipe.recipeName,
            },

            unit_amount: price * 100,
          },

          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment/recipe-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/recipes/${recipeId}`,

      metadata: {
        email,
        recipeId,
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

// =======================================
// Payment Success
// =======================================
const recipePaymentSuccess = async (req, res) => {
  try {
    const db = await connectDB();

    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).send({
        success: false,
        message: "Payment failed.",
      });
    }

    const email = session.customer_email;
    const recipeId = session.metadata.recipeId;

    // Prevent duplicate transaction processing
    const exists = await db.collection("payments").findOne({
      transactionId: session.payment_intent,
    });

    if (exists) {
      return res.send({
        success: true,
        message: "Already processed.",
      });
    }

    // Save payment
    await db.collection("payments").insertOne({
      userEmail: email,
      recipeId,
      amount: session.amount_total / 100,
      transactionId: session.payment_intent,
      paymentStatus: "Paid",
      type: "recipe",
      paidAt: new Date(),
    });

    res.send({
      success: true,
      message: "Recipe purchased successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Payment verification failed.",
    });
  }
};

// =======================================
// Get Purchased Recipes
// =======================================
const getPurchasedRecipes = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const purchases = await db
      .collection("payments")
      .find({
        userEmail: email,
        type: "recipe",
      })
      .toArray();

    const recipeIds = purchases.map(
      (item) => new ObjectId(item.recipeId)
    );

    if (recipeIds.length === 0) {
      return res.send([]);
    }

    const recipes = await db
      .collection("recipes")
      .find({
        _id: {
          $in: recipeIds,
        },
      })
      .toArray();

    res.send(recipes);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to load purchased recipes.",
    });
  }
};

module.exports = {
  createRecipeCheckout,
  recipePaymentSuccess,
  getPurchasedRecipes,
};