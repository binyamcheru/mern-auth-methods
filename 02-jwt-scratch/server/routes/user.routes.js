const express = require("express");
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/auth.middleware")

const router = express.Router();

router.get("/profile", requireAuth, userController.getProfile)

router.put("/profile", requireAuth, userController.updateProfile)

router.put("/change-password", requireAuth, userController.changePassword)

router.delete("/profile", requireAuth, userController.deleteAccount)

module.exports = router;