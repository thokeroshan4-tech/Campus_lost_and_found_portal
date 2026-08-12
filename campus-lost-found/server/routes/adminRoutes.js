import express from "express";
import {
  getStats,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Every single route in this file requires admin — enforced here once,
// so there's no risk of forgetting it on an individual route later
router.use(protect, requireAdmin);

router.get("/stats", getStats);
router.get("/verifications", getPendingVerifications);
router.patch("/verifications/:userId/approve", approveVerification);
router.patch("/verifications/:userId/reject", rejectVerification);

export default router;
