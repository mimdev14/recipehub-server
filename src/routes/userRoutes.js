const express = require("express");

const {
  saveUser,
  getCurrentUser,
  upgradeToPremium,
} = require("../controllers/userController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.put("/", saveUser);

router.get(
  "/me",
  verifyToken,
  getCurrentUser
);

router.patch(
  "/premium",
  verifyToken,
  upgradeToPremium
);

module.exports = router;