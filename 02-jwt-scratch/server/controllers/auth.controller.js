const User = require("../models/User")
const {
    validateName,
    validateEmail,
    validatePassword,
} = require("../utils/validators");

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
        const user = await User.create({ name: cleanName, email: cleanName, password })

        // TODO: AUTO-LOGIN using jwt
        // 1. create jwt token
        // 2. set httpOnly cookie
        // 3. send response

        res.status(201).json({
            message: "Registered successfully and logged in",
            user: user
        })
    } catch (err) {
        next(err)
    }
}

exports.login = (req, res) => {
    res.status(200).json({ message: "User logged in successfully" });
}

exports.logout = (req, res) => {
    res.status(200).json({ message: "User logged out successfully" });
}

exports.checkSession = (req, res) => {
    res.status(200).json({ message: "User is logged in" });
}
