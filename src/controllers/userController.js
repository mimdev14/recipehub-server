const connectDB = require("../config/db");

// ==========================
// Save User
// ==========================
const saveUser = async (req, res) => {
  try {
    const db = await connectDB();

    const { name, email, image } = req.body;

    const existingUser = await db.collection("users").findOne({
      email,
    });

    if (existingUser) {
      await db.collection("users").updateOne(
        { email },
        {
          $set: {
            name,
            image,
            updatedAt: new Date(),
          },
        }
      );

      return res.send({
        message: "User updated successfully",
      });
    }

    await db.collection("users").insertOne({
      name,
      email,
      image,
      role: "user",
      isBlocked: false,
      isPremium: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.send({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to save user",
    });
  }
};

// ==========================
// Get Current User
// ==========================
const getCurrentUser = async (req, res) => {
  try {
    const db = await connectDB();

    const email = req.user.email;

    const user = await db.collection("users").findOne({
      email,
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    res.send(user);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to fetch user",
    });
  }
};
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

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Upgrade failed",
    });
  }
};

module.exports = {
  saveUser,
  getCurrentUser,
  upgradeToPremium,
};