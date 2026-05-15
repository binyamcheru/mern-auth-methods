const User = require("../models/User");

// REGISTER user
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "Registered successfully",
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// LOGIN user
exports.login = async (req, res) => {
  res.status(200).json({ message: "Login successful" });
};

// LOGOUT user
exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
