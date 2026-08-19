/**
 * routes/orderRoutes.js
 *
 *   POST /api/orders               (usuario logueado) → crear pedido (pending_payment)
 *   GET  /api/orders/mine          (usuario logueado) → mis pedidos
 *   GET  /api/orders/by-reference/:ref (usuario logueado, dueño del pedido, o admin)
 *   GET  /api/orders               (admin) → todos los pedidos
 */

const express = require("express");
const controller = require("../controllers/orderController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(controller.requireDb);

router.post("/", requireAuth, controller.create);
router.get("/mine", requireAuth, controller.getMine);
router.get("/by-reference/:ref", requireAuth, controller.getByReference);
router.get("/", requireAdmin, controller.getAll);

module.exports = router;
