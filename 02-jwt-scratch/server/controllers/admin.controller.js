exports.getAllUsers = (req, res) => {
    res.status(200).json({ message: "All users fetched successfully" });
}

exports.getUserById = (req, res) => {
    res.status(200).json({ message: "User fetched successfully" });
}

exports.updateUserRole = (req, res) => {
    res.status(200).json({ message: "User role updated successfully" });
}

exports.deleteUser = (req, res) => {
    res.status(200).json({ message: "User deleted successfully" });
}