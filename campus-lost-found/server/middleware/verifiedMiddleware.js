// Use AFTER `protect`. Locks browsing, reporting, and claiming behind
// admin-approved identity verification. Admins bypass this since they're
// the ones running the verification queue, not standing in it.
const requireVerified = (req, res, next) => {
  if (req.user.role === "admin") return next();

  if (req.user.verificationStatus !== "verified") {
    res.status(403);
    throw new Error(
      req.user.verificationStatus === "rejected"
        ? "Your identity verification was rejected. Please resubmit your ID proof."
        : "Your account is pending identity verification"
    );
  }
  next();
};

export default requireVerified;
