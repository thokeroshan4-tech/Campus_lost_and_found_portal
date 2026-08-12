import express from "express";
import {
  createClaim,
  getAllClaims,
  getMyClaims,
  getClaimsForItem,
  approveClaim,
  rejectClaim,
} from "../controllers/claimController.js";
import protect from "../middleware/authMiddleware.js";
import requireVerified from "../middleware/verifiedMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect, requireVerified);

router.post("/", upload.single("proofImage"), createClaim);
router.get("/mine", getMyClaims);
router.get("/item/:itemId", getClaimsForItem);
router.get("/", requireAdmin, getAllClaims);
router.patch("/:id/approve", approveClaim);
router.patch("/:id/reject", rejectClaim);

export default router;
