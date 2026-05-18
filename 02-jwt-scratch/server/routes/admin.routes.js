const express = require("express")
const adminController = require("../controllers/admin.controller")
const { requireAdmin } = require("../middleware/requireAuth")

const router = express.Router()

router.get("/users", requireAdmin, adminController.getAllUsers)

router.get("/users/:id", requireAdmin, adminController.getUserById)

router.put("/users/:id/role", requireAdmin, adminController.updateUserRole)

router.delete("/users/:id", requireAdmin, adminController.deleteUser)

module.exports = router;