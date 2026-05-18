const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAdmin } = require('../middleware/requireAuth');

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List all users (Paginated)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved
 */
router.get('/users', requireAdmin, adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/users/:id', requireAdmin, adminController.getUserById);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - csrfAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put('/users/:id/role', requireAdmin, adminController.updateUserRole);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *       - csrfAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/users/:id', requireAdmin, adminController.deleteUser);

module.exports = router;
