import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

// Verifies the JWT and attaches the real user document to req.user.
// Every protected route relies on req.user — never trust a userId
// sent from the client in the body or query string.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid or expired token");
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // If password was changed since this token was issued, tokenVersion
  // will have been bumped — this invalidates old sessions automatically.
  if (decoded.tokenVersion !== user.tokenVersion) {
    res.status(401);
    throw new Error("Session expired, please log in again");
  }

  req.user = user;
  next();
});

export default protect;
