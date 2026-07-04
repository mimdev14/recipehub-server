const express = require("express");

const {
  getAllUsers,
  updateUserRole,
  updateBlockStatus,
  getAllRecipes,
  deleteRecipe,
  getAllReports,
deleteReport,
  getPremiumRequests,
  approvePremiumRequest,
  rejectPremiumRequest,
  getAdminStats,
} = require("../controllers/adminController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// =============================
// Get All Users
// =============================
router.get(
  "/users",
  verifyToken,
  getAllUsers
);

// =============================
// Update User Role
// =============================
router.patch(
  "/users/role/:email",
  verifyToken,
  updateUserRole
);

// =============================
// Block / Unblock User
// =============================
router.patch(
  "/users/block/:email",
  verifyToken,
  updateBlockStatus
);
router.get(
  "/recipes",
  verifyToken,
  getAllRecipes
);

router.delete(
  "/recipes/:id",
  verifyToken,
  deleteRecipe
);
router.get(
  "/reports",
  verifyToken,
  getAllReports
);

router.delete(
  "/reports/:id",
  verifyToken,
  deleteReport
);
router.get(
  "/premium",
  verifyToken,
  getPremiumRequests
);

router.patch(
  "/premium/approve/:email",
  verifyToken,
  approvePremiumRequest
);

router.delete(
  "/premium/reject/:email",
  verifyToken,
  rejectPremiumRequest
);
router.get(
  "/stats",
  verifyToken,
  getAdminStats
);

module.exports = router;