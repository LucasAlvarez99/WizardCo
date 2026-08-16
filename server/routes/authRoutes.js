/**
 * routes/authRoutes.js
 *
 *   POST /api/auth/register           → crear cuenta
 *   POST /api/auth/login              → iniciar sesión
 *   GET  /api/auth/me                 → datos del usuario logueado (requiere token)
 *   POST /api/auth/send-verification  → pedir código de verificación por email (requiere token)
 *   POST /api/auth/verify-email       → confirmar código (requiere token)
 */

const express = require("express");
const controller = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(controller.requireDb);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", requireAuth, controller.me);
router.post("/send-verification", requireAuth, controller.sendVerification);
router.post("/verify-email", requireAuth, controller.verifyEmail);

module.exports = router;
