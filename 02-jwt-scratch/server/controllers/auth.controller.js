const User = require("../models/User")
const {
    validateName,
    validateEmail,
    validatePassword,
} = require("../utils/validators");
const jwt = require("../lib/jwt");

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Changed from strict to lax for better dev experience with cors
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const cleanName = name ? name.trim() : name;
        const cleanEmail = email ? email.toLowerCase().trim() : email;

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

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Validation failed", errors });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "Email already registered", errors: { email: "Email already registered" } });
        }

        // create new user
        const user = await User.create({ name: cleanName, email: cleanEmail, password })

        // AUTO-LOGIN using jwt
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("access_token", token, COOKIE_OPTIONS);

        res.status(201).json({
            message: "Registered successfully and logged in",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("access_token", token, COOKIE_OPTIONS);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.logout = (req, res) => {
    res.clearCookie("access_token");
    if (req.user) {
        return res.status(200).json({ message: "User logged out successfully" });
    }
    res.status(200).json({ message: "You were already logged out" });
}

exports.checkSession = (req, res) => {
    res.status(200).json({
        message: "User is logged in",
        user: req.user
    });
}
