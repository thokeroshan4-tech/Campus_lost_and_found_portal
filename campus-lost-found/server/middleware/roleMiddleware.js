// Use AFTER `protect`. Blocks any non-admin from reaching the route,
// regardless of what the frontend does or doesn't show them.
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access only");
  }
  next();
};

export { requireAdmin };
