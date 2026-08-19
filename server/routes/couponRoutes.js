/**
 * routes/couponRoutes.js
 *
 *   GET    /api/coupons        (admin) → listar
 *   POST   /api/coupons        (admin) → crear
 *   DELETE /api/coupons/:code  (admin) → eliminar
 *   POST   /api/coupons/apply  (cualquier usuario logueado) → aplicar en el checkout
 */

const express = require("express");
const controller = require("../controllers/couponController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(controller.requireDb);

router.get("/", requireAdmin, controller.getAll);
router.post("/", requireAdmin, controller.create);
router.delete("/:code", requireAdmin, controller.remove);
router.post("/apply", requireAuth, controller.apply);

module.exports = router;
