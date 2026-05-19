const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes")
const authRoutes = require("./routes/auth.routes")
const adminRoutes = require("./routes/admin.routes")
const errorHandler = require("./middleware/errorHandler")

const PORT = process.env.PORT || 5000;

// connect to database
connectDB()

const app = express();

// add security middlewares
app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
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