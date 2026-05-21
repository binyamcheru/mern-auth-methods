const User = require("../models/User");
const { validateName, validatePassword } = require("../utils/validators");

exports.getProfile = (req, res) => {
    res.status(200).json({
        message: "Profile fetched successfully",
        user: req.user
    });
}

exports.updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (name) {
            const nameError = validateName(name);
            if (nameError) return res.status(400).json({ message: nameError });
            req.user.name = name.trim();
        }

        await req.user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: req.user
        });
    } catch (err) {
        next(err);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All password fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) return res.status(400).json({ message: passwordError });

        // Need to explicitly select password because it's set to select: false
        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        next(err);
    }
}

exports.deleteAccount = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.clearCookie("access_token");
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        next(err);
    }
}