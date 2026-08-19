/**
 * controllers/orderController.js
 */

const orderService = require("../services/orderService");
const userRepository = require("../repositories/userRepository");
const { isDbConnected } = require("../config/db");

function requireDb(req, res, next) {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "La base de datos no está conectada. Revisá MONGODB_URI en server/.env." });
  }
  next();
}

function handleError(err, res) {
  if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
  console.error("[WizardCo] Error inesperado en pedidos:", err);
  return res.status(500).json({ error: "Error interno del servidor." });
}

async function create(req, res) {
  try {
    const user = await userRepository.findById(req.auth.sub);
    if (!user) return res.status(401).json({ error: "Sesión inválida." });
    const order = await orderService.createOrder(user, req.body);
    res.status(201).json(order);
  } catch (err) {
    handleError(err, res);
  }
}

async function getMine(req, res) {
  try {
    res.json(await orderService.getMine(req.auth.sub));
  } catch (err) {
    handleError(err, res);
  }
}

async function getAll(req, res) {
  try {
    res.json(await orderService.getAll());
  } catch (err) {
    handleError(err, res);
  }
}

async function getByReference(req, res) {
  try {
    const order = await orderService.getByReference(req.params.ref, req.auth.sub, req.auth.isAdmin);
    res.json(order);
  } catch (err) {
    handleError(err, res);
  }
}

module.exports = { requireDb, create, getMine, getAll, getByReference };
