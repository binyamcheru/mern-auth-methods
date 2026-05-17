const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// CORS middleware to allow requests from the frontend
app.use(
  cors({
    origin: "http://localhost:3000", // allow requests from this origin
    credentials: true, // allow cookies to be sent
  }),
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
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

// middleware to change req.body to a json object
app.use(express.json());

// middleware to change req.body to a urlencoded object
app.use(express.urlencoded({ extended: true }));

// use auth routes
app.use("/api/auth", authRoutes);

// use user routes
app.use("/api/user", userRoutes);

// use admin routes
app.use("/api/admin", adminRoutes);

// route to test if server is working
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Centralized error handler (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});