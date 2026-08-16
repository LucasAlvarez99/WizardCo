/**
 * controllers/productController.js
 *
 * Traduce HTTP <-> service. No tiene lógica de negocio ni de acceso a
 * datos, solo maneja request/response y códigos de estado.
 */

const productService = require("../services/productService");
const { isDbConnected } = require("../config/db");

function requireDb(req, res, next) {
  if (!isDbConnected()) {
    return res.status(503).json({
      error: "La base de datos no está conectada. Revisá MONGODB_URI en server/.env.",
    });
  }
  next();
}

function handleError(err, res) {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error("[WizardCo] Error inesperado en productos:", err);
  return res.status(500).json({ error: "Error interno del servidor." });
}

async function getAll(req, res) {
  try {
    const products = await productService.listProducts(req.query);
    res.json(products);
  } catch (err) {
    handleError(err, res);
  }
}

async function getOne(req, res) {
  try {
    const product = await productService.getProduct(req.params.id);
    res.json(product);
  } catch (err) {
    handleError(err, res);
  }
}

async function create(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    handleError(err, res);
  }
}

async function update(req, res) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    handleError(err, res);
  }
}

async function remove(req, res) {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}

module.exports = { requireDb, getAll, getOne, create, update, remove };
