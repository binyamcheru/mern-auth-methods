const User = require("../models/User");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

// REGISTER user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Sanitization: Trim whitespace from name and email
    const cleanName = name ? name.trim() : name;
    const cleanEmail = email ? email.toLowerCase().trim() : email;

    // Collect all validation errors so the frontend can show them all at once
    const errors = {};

    const nameError = validateName(cleanName);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(cleanEmail);
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
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", errors: { email: "Email already registered" } });
    }

    // Role is always "user" for public registration
    const user = await User.create({ name: cleanName, email: cleanEmail, password });

    // AUTO-LOGIN: Store user info in session immediately after registration
    req.session.userId = user._id;
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      message: "Registered successfully and logged in",
      user: req.session.user,
    });
  } catch (err) {
    next(err); // Delegate to centralized error handler
  }
};

// LOGIN user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Sanitization: Trim email
    const cleanEmail = email ? email.toLowerCase().trim() : email;

    const errors = {};
    const emailError = validateEmail(cleanEmail);
    if (emailError) errors.email = emailError;

    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Find user and include password field (normally excluded)
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        errors: { auth: "Invalid email or password" },
      });
    }

    // check account is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is disabled' })
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
    next(err); // Delegate to centralized error handler
  }
};

// LOGOUT user
exports.logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(err); // Delegate to centralized error handler
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    next(err); // Delegate to centralized error handler
  }
};

// CHECK SESSION — returns current user if logged in
exports.checkSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err); // Delegate to centralized error handler
  }
};
