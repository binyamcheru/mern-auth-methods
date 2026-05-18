const express = require('express');
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirmPassword]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "Password123" }
 *               confirmPassword: { type: string, example: "Password123" }
 *     responses:
 *       211:
 *         description: Registered and logged in successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already exists
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "Password123" }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/csrf-token:
 *   get:
 *     summary: Get a new CSRF token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns a CSRF token
 */
router.get('/csrf-token', (req, res) => {
  const generateToken = req.app.get('csrfGenerateToken');
  res.json({ csrfToken: generateToken(req, res) });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Check current session
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User is logged in
 *       401:
 *         description: Not authenticated
 */
router.get('/me', requireAuth, authController.checkSession);

// LOGOUT user
router.post('/logout', requireAuth, authController.logout);

module.exports = router;