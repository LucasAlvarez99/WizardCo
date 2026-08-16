/**
 * routes/productRoutes.js
 *
 *   GET    /api/products       → listar (filtros opcionales ?category=&fileType=)
 *   GET    /api/products/:id   → obtener uno
 *   POST   /api/products       → crear
 *   PUT    /api/products/:id   → actualizar (parcial)
 *   DELETE /api/products/:id   → eliminar
 */

const express = require("express");
const controller = require("../controllers/productController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(controller.requireDb);

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", requireAdmin, controller.create);
router.put("/:id", requireAdmin, controller.update);
router.delete("/:id", requireAdmin, controller.remove);

module.exports = router;
