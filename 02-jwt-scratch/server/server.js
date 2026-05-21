const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { doubleCsrf } = require("csrf-csrf");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes")
const authRoutes = require("./routes/auth.routes")
const adminRoutes = require("./routes/admin.routes")
const errorHandler = require("./middleware/errorHandler")
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// connect to database
connectDB()

const app = express();

// add security middlewares
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Rate Limiting for Auth Routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later" },
});

// CSRF Configuration
const {
    doubleCsrfProtection,
    generateCsrfToken,
} = doubleCsrf({
    getSecret: () => process.env.JWT_SECRET || "csrf-secret-key",
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: false, // Must be false so frontend can read it
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    },
    getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
    getSessionIdentifier: (req) => req.cookies.access_token || "uninitialized",
});


// Expose CSRF token generation
app.set("csrfGenerateToken", generateCsrfToken);

// body parser & cookie middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

// CSRF Protection Middleware
app.use((req, res, next) => {
    // Skip CSRF check for GET, HEAD, OPTIONS
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next();
    }
    doubleCsrfProtection(req, res, next);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// routes
app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)

// 404 Handler => if no route matches above
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// error handler
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});