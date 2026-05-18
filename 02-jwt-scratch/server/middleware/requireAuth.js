// Middleware to check if a user is logged in/ authenticated
const requireAuth = (req, res, next) => {
    console.log("Auth middleware hit");
    next();
}

// Middleware to check if a user is an admin
const requireAdmin = (req, res, next) => {
    console.log("Admin middleware hit");
    next();
}

module.exports = { requireAuth, requireAdmin };
