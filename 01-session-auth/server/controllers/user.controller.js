const User = require("../models/User");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

// GET user profile — returns the logged-in user's data
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: err.message });
  }
};

// UPDATE user profile — update name and/or email
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const errors = {};
    if (name) {
      const nameError = validateName(name);
      if (nameError) errors.name = nameError;
    }
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) errors.email = emailError;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "Provide at least name or email to update" });
    }

    // If email is being updated, check for duplicates
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.session.userId) {
        return res
          .status(409)
          .json({ message: "Email already in use", errors: { email: "Email already in use" } });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.session.userId, updateData, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update session data to reflect changes
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
};

// CHANGE PASSWORD — verify current password, then set new one
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) errors.newPassword = passwordError;

    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (newPassword && newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "New passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const user = await User.findById(req.session.userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect", errors: { currentPassword: "Current password is incorrect" } });
    }

    user.password = newPassword;
    await user.save(); // triggers the pre('save') hook to hash the password

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to change password", error: err.message });
  }
};

// DELETE ACCOUNT — verify password, then delete user and session
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required to delete account", errors: { password: "Password is required" } });
    }

    const user = await User.findById(req.session.userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Password is incorrect", errors: { password: "Password is incorrect" } });
    }

    await User.findByIdAndDelete(req.session.userId);

    // Destroy session after deleting account
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Account deleted but session cleanup failed" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Account deleted successfully" });
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete account", error: err.message });
  }
};