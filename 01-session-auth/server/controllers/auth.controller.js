const User = require("../models/User");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

// REGISTER user
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // NOTE: role is intentionally NOT destructured from req.body
    // Only admins should be able to assign roles (via a separate admin route)

    // Collect all validation errors so the frontend can show them all at once
    const errors = {};

    const nameError = validateName(name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Return all validation errors at once
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", errors: { email: "Email already registered" } });
    }

    // Role is always "user" for public registration
    const user = await User.create({ name, email, password });

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

  try {
    const { email, password } = req.body;

    const errors = {};
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Find user and include password field (normally excluded)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        errors: { auth: "Invalid email or password" },
      });
    }

    // Compare passwords
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
        errors: { auth: "Invalid email or password" },
      });
    }

    // Store user info in session
    req.session.userId = user._id;
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// LOGOUT user
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Logout failed", error: err.message });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

// CHECK SESSION — returns current user if logged in
exports.checkSession = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Session check failed", error: err.message });
  }
};
