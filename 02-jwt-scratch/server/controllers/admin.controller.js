const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            message: "All users fetched successfully",
            count: users.length,
            users
        });
    } catch (err) {
        next(err);
    }
}

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (err) {
        next(err);
    }
}

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role || !["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Please provide a valid role (user or admin)" });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            message: "User role updated successfully",
            user
        });
    } catch (err) {
        next(err);
    }
}

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent admin from deleting themselves (optional but good practice)
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Admin cannot delete their own account from here" });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
}