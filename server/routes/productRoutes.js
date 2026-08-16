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

const router = express.Router();

router.use(controller.requireDb);

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
