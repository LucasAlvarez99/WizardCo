/**
 * controllers/couponController.js
 */

const couponService = require("../services/couponService");
const { isDbConnected } = require("../config/db");

function requireDb(req, res, next) {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "La base de datos no está conectada. Revisá MONGODB_URI en server/.env." });
  }
  next();
}

function handleError(err, res) {
  if (err.statusCode) return res.status(err.statusCode).json({ error: err.message });
  console.error("[WizardCo] Error inesperado en cupones:", err);
  return res.status(500).json({ error: "Error interno del servidor." });
}

async function getAll(req, res) {
  try {
    res.json(await couponService.listCoupons());
  } catch (err) {
    handleError(err, res);
  }
}

async function create(req, res) {
  try {
    res.status(201).json(await couponService.createCoupon(req.body));
  } catch (err) {
    handleError(err, res);
  }
}

async function remove(req, res) {
  try {
    await couponService.deleteCoupon(req.params.code);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}

async function apply(req, res) {
  try {
    res.json(await couponService.applyCoupon(req.body.code));
  } catch (err) {
    handleError(err, res);
  }
}

module.exports = { requireDb, getAll, create, remove, apply };
