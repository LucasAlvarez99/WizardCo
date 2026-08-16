/**
 * services/authService.js
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userRepository = require("../repositories/userRepository");
const { sendVerificationEmail } = require("../utils/email");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
  }
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const CODE_TTL_MS = 15 * 60 * 1000; // 15 minutos

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function generateCode() {
  return String(crypto.randomInt(100000, 1000000));
}

async function register({ name, email, password }) {
  if (!name || !email || !password) throw new ValidationError("Completá todos los campos.");
  if (!EMAIL_RE.test(email)) throw new ValidationError("Ingresá un email válido.");
  if (password.length < 6) throw new ValidationError("La contraseña debe tener al menos 6 caracteres.");

  const existing = await userRepository.findByEmail(email);
  if (existing) throw new ValidationError("Ya existe una cuenta con ese email.");

  const passwordHash = await bcrypt.hash(password, 10);
  // isAdmin siempre false acá: el rol de admin nunca se asigna desde el
  // registro público, solo desde seed/createAdmin.js o directo en Mongo.
  const user = await userRepository.create({ name, email, passwordHash, isAdmin: false });

  return { user, token: signToken(user) };
}

async function login({ email, password }) {
  if (!email || !password) throw new ValidationError("Completá todos los campos.");

  const user = await userRepository.findByEmail(email);
  if (!user) throw new AuthError("Email o contraseña incorrectos.");

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) throw new AuthError("Email o contraseña incorrectos.");

  return { user, token: signToken(user) };
}

async function getById(id) {
  const user = await userRepository.findById(id);
  if (!user) throw new AuthError("Usuario no encontrado.");
  return user;
}

async function requestVerificationCode(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new AuthError("Usuario no encontrado.");
  if (user.verified) throw new ValidationError("Tu cuenta ya está verificada.");

  const code = generateCode();
  const verificationCodeHash = await bcrypt.hash(code, 10);
  await userRepository.updateById(userId, {
    verificationCodeHash,
    verificationCodeExpires: new Date(Date.now() + CODE_TTL_MS),
  });

  await sendVerificationEmail({ to: user.email, code });
}

async function verifyEmailCode(userId, inputCode) {
  const user = await userRepository.findById(userId);
  if (!user) throw new AuthError("Usuario no encontrado.");
  if (user.verified) throw new ValidationError("Tu cuenta ya está verificada.");
  if (!user.verificationCodeHash || !user.verificationCodeExpires) {
    throw new ValidationError("Primero pedí un código de verificación.");
  }
  if (user.verificationCodeExpires.getTime() < Date.now()) {
    throw new ValidationError("El código venció. Pedí uno nuevo.");
  }

  const matches = await bcrypt.compare(String(inputCode || "").trim(), user.verificationCodeHash);
  if (!matches) throw new ValidationError("El código no coincide.");

  return userRepository.updateById(userId, {
    verified: true,
    verificationCodeHash: null,
    verificationCodeExpires: null,
  });
}

module.exports = {
  register,
  login,
  getById,
  requestVerificationCode,
  verifyEmailCode,
  signToken,
  ValidationError,
  AuthError,
};
