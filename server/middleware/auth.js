/**
 * middleware/auth.js
 *
 *   requireAuth  → exige un JWT válido en el header Authorization: Bearer <token>
 *   requireAdmin → además, exige que el usuario tenga isAdmin: true
 *
 * En ambos casos deja el payload del token en req.auth = { sub, isAdmin }.
 */

const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Falta iniciar sesión." });
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesión inválida o vencida. Volvé a iniciar sesión." });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (!req.auth || !req.auth.isAdmin) {
      return res.status(403).json({ error: "No tenés permisos de administrador." });
    }
    next();
  });
}

module.exports = { requireAuth, requireAdmin };
