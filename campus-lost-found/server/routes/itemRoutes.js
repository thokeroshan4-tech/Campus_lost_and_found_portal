import express from "express";
import {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
  resolveItem,
} from "../controllers/itemController.js";
import protect from "../middleware/authMiddleware.js";
import requireVerified from "../middleware/verifiedMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Every item route requires a logged-in AND identity-verified user
router.use(protect, requireVerified);

// IMPORTANT: /mine must be declared before /:id, otherwise Express
// treats "mine" as an :id value and this route never gets hit
router.get("/mine", getMyItems);

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", upload.single("image"), createItem);
router.patch("/:id", updateItem);
router.delete("/:id", deleteItem);
router.patch("/:id/resolve", resolveItem);

export default router;
