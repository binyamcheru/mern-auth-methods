exports.getProfile = (req, res) => {
    res.status(200).json({ message: "Profile fetched successfully" });
}

exports.updateProfile = (req, res) => {
    res.status(200).json({ message: "Profile updated successfully" });
}

exports.changePassword = (req, res) => {
    res.status(200).json({ message: "Password changed successfully" });
}

exports.deleteAccount = (req, res) => {
    res.status(200).json({ message: "Account deleted successfully" });
}