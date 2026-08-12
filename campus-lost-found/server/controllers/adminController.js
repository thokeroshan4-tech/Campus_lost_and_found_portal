import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Item from "../models/Item.js";
import Claim from "../models/Claim.js";

// @desc   Dashboard summary numbers
// @route  GET /api/admin/stats
// @access Private (admin only)
const getStats = asyncHandler(async (req, res) => {
  const [openItems, pendingClaims, resolvedItems, pendingVerifications] =
    await Promise.all([
      Item.countDocuments({ status: { $in: ["open", "pending", "approved"] } }),
      Claim.countDocuments({ status: "pending" }),
      Item.countDocuments({ status: "resolved" }),
      User.countDocuments({ verificationStatus: "pending", isEmailVerified: true }),
    ]);

  res.json({ openItems, pendingClaims, resolvedItems, pendingVerifications });
});

// @desc   List users awaiting identity verification
// @route  GET /api/admin/verifications
// @access Private (admin only)
const getPendingVerifications = asyncHandler(async (req, res) => {
  const users = await User.find({
    verificationStatus: "pending",
    isEmailVerified: true,
    idProofUrl: { $ne: null }, // only show users who've actually submitted proof
  }).select("name email designation campusId idProofUrl createdAt");

  res.json(users);
});

// @desc   Approve a user's identity verification
// @route  PATCH /api/admin/verifications/:userId/approve
// @access Private (admin only)
const approveVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.verificationStatus = "verified";
  user.rejectionReason = null;
  await user.save();

  res.json({ message: "User verified", userId: user._id });
});

// @desc   Reject a user's identity verification
// @route  PATCH /api/admin/verifications/:userId/reject
// @access Private (admin only)
const rejectVerification = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const user = await User.findById(req.params.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.verificationStatus = "rejected";
  user.rejectionReason = reason || "ID proof could not be verified";
  await user.save();

  res.json({ message: "User verification rejected", userId: user._id });
});

export {
  getStats,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
};
