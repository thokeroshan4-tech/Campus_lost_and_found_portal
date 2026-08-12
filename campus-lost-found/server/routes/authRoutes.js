import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  uploadIdProof,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/upload-id-proof", protect, upload.single("idProof"), uploadIdProof);

export default router;
