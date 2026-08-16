/**
 * controllers/authController.js
 */

const authService = require("../services/authService");
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
  console.error("[WizardCo] Error inesperado en auth:", err);
  return res.status(500).json({ error: "Error interno del servidor." });
}

async function register(req, res) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  } catch (err) {
    handleError(err, res);
  }
}

async function login(req, res) {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ user, token });
  } catch (err) {
    handleError(err, res);
  }
}

async function me(req, res) {
  try {
    const user = await authService.getById(req.auth.sub);
    res.json({ user });
  } catch (err) {
    handleError(err, res);
  }
}

async function sendVerification(req, res) {
  try {
    await authService.requestVerificationCode(req.auth.sub);
    res.json({ message: "Te enviamos un código de verificación por email." });
  } catch (err) {
    handleError(err, res);
  }
}

async function verifyEmail(req, res) {
  try {
    const user = await authService.verifyEmailCode(req.auth.sub, req.body.code);
    res.json({ user, message: "Cuenta verificada correctamente." });
  } catch (err) {
    handleError(err, res);
  }
}

module.exports = { requireDb, register, login, me, sendVerification, verifyEmail };
