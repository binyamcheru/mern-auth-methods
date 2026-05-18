const express = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Not authenticated
 */
router.get('/profile', requireAuth, userController.profile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *       - csrfAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', requireAuth, userController.updateProfile);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *       - csrfAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword, confirmNewPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *               confirmNewPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password changed
 */
router.put('/change-password', requireAuth, userController.changePassword);

/**
 * @swagger
 * /api/user/profile:
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *       - csrfAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Account deleted
 */
router.delete('/profile', requireAuth, userController.deleteAccount);

module.exports = router;