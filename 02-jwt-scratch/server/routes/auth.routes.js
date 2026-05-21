const express = require("express");
const authController = require("../controllers/auth.controller")
const { requireAuth, optionalAuth } = require("../middleware/auth.middleware")

const router = express.Router();

router.post("/register", authController.register)

router.post("/login", authController.login)

router.post("/logout", optionalAuth, authController.logout)

router.get("/me", requireAuth, authController.checkSession)

module.exports = router;