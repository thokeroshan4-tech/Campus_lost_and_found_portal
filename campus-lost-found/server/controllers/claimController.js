import asyncHandler from "../utils/asyncHandler.js";
import Claim from "../models/Claim.js";
import Item from "../models/Item.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// @desc   Submit a claim on an item
// @route  POST /api/claims
// @access Private (verified users only)
const createClaim = asyncHandler(async (req, res) => {
  const { itemId, proofText } = req.body;

  if (!itemId || !proofText) {
    res.status(400);
    throw new Error("itemId and proofText are required");
  }

  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.reportedBy.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You can't claim an item you reported yourself");
  }

  const existing = await Claim.findOne({
    item: itemId,
    claimant: req.user._id,
  });
  if (existing) {
    res.status(400);
    throw new Error("You've already submitted a claim on this item");
  }

  let proofImageUrl = null;
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "claims");
    proofImageUrl = result.secure_url;
  }

  const claim = await Claim.create({
    item: itemId,
    claimant: req.user._id,
    proofText,
    proofImageUrl,
  });

  item.status = "pending";
  await item.save();

  res.status(201).json(claim);
});

// @desc   Get every claim in the system (for the admin dashboard)
// @route  GET /api/claims
// @access Private (admin only)
const getAllClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find()
    .populate("item", "title type status")
    .populate("claimant", "name email designation")
    .sort({ createdAt: -1 });
  res.json(claims);
});

// @desc   Get claims the logged-in user has submitted
// @route  GET /api/claims/mine
// @access Private (verified users only)
const getMyClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ claimant: req.user._id })
    .populate("item", "title type status imageUrl")
    .sort({ createdAt: -1 });
  res.json(claims);
});

// @desc   Get all claims submitted against a specific item (item owner or admin)
// @route  GET /api/claims/item/:itemId
// @access Private
const getClaimsForItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const isOwner = item.reportedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view claims on this item");
  }

  const claims = await Claim.find({ item: item._id }).populate(
    "claimant",
    "name email designation"
  );
  res.json(claims);
});

// Shared logic for approve/reject — only the decision differs
const reviewClaim = (decision) =>
  asyncHandler(async (req, res) => {
    const claim = await Claim.findById(req.params.id).populate("item");
    if (!claim) {
      res.status(404);
      throw new Error("Claim not found");
    }

    const item = claim.item;
    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to review this claim");
    }

    if (claim.status !== "pending") {
      res.status(400);
      throw new Error("This claim has already been reviewed");
    }

    claim.status = decision;
    claim.reviewedBy = req.user._id;
    await claim.save();

    if (decision === "approved") {
      // Item flips to "approved" — NOT "resolved" yet. A separate manual
      // resolve action is still required, by design, as a final safety check.
      item.status = "approved";
      await item.save();
    } else {
      // If rejected and no other pending/approved claims remain, reopen the item
      const otherActiveClaim = await Claim.exists({
        item: item._id,
        status: { $in: ["pending", "approved"] },
        _id: { $ne: claim._id },
      });
      if (!otherActiveClaim) {
        item.status = "open";
        await item.save();
      }
    }

    res.json(claim);
  });

const approveClaim = reviewClaim("approved");
const rejectClaim = reviewClaim("rejected");

export {
  createClaim,
  getAllClaims,
  getMyClaims,
  getClaimsForItem,
  approveClaim,
  rejectClaim,
};
