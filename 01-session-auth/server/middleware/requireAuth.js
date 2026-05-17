// Middleware to check if user is authenticated
exports.requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  next();
};

// Middleware to check if user is admin
exports.requireAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "You must be logged in" });
  }
  if (req.session.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You do not have permission to access this resource" });
  }
  next();
};