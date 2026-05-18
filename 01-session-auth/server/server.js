const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser"); // NEW: For CSRF and cookie handling
const { doubleCsrf } = require("csrf-csrf"); // NEW: For CSRF protection
const rateLimit = require("express-rate-limit"); // NEW: For brute-force protection
const { MongoStore } = require("connect-mongo");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express"); // NEW
const swaggerSpec = require("./config/swagger"); // NEW
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();
app.use(helmet());


// 1. Trust proxy (needed for rate limiting if behind a proxy like Heroku/Nginx)
app.set("trust proxy", 1);

// 2. Cookie Parser
app.use(cookieParser(process.env.SESSION_SECRET || "your-secret-key"));

// 3. CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// 4. Rate Limiter for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

// 5. Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // set to true if using HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

// 6. CSRF Configuration
const {
  doubleCsrfProtection,
  generateCsrfToken,
} = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET || "your-secret-key",
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: false, // CRITICAL: Must be false so frontend JS can read it for double-submit
    sameSite: "lax",
    secure: false,
  },
  // CSRF needs a way to identify the user session to bind the token
  getSessionIdentifier: (req) => {
    return req.session?.id || "uninitialized";
  },
  getCsrfTokenFromRequest: (req) => {
    const token = req.headers["x-csrf-token"];
    return token;
  },
});

// Export CSRF tools for the auth routes
app.set("csrfGenerateToken", generateCsrfToken);

// 7. Standard Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 8. CSRF Protection Middleware
app.use((req, res, next) => {
  // Skip CSRF check for GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  doubleCsrfProtection(req, res, next);
});

// Apply rate limiter specifically to auth routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "Welcome to the Secure MERN Session-Auth API",
    version: "1.0.0",
    docs: "/api-docs",
  });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});