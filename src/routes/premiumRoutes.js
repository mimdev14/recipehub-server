const express = require("express");
const { upgradeToPremium } = require("../controllers/premiumController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.patch("/upgrade", verifyToken, upgradeToPremium);

module.exports = router;