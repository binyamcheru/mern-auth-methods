const express = require("express");
const authController = require("../controllers/auth.controller")
const { requireAuth, optionalAuth } = require("../middleware/auth.middleware")

const router = express.Router();

router.post("/register", authController.register)

router.post("/login", authController.login)

router.post("/logout", optionalAuth, authController.logout)

router.get("/me", requireAuth, authController.checkSession)

router.get("/csrf-token", (req, res) => {
    const generateCsrfToken = req.app.get("csrfGenerateToken");
    res.status(200).json({ csrfToken: generateCsrfToken(req, res) });
});

module.exports = router;