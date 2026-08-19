/**
 * services/couponService.js
 */

const couponRepository = require("../repositories/couponRepository");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

function validateCouponInput({ code, discountPercentage, usableCount }) {
  const errors = [];
  if (!code || !String(code).trim()) errors.push("El código es obligatorio.");
  const pct = Number(discountPercentage);
  if (!Number.isFinite(pct) || pct < 1 || pct > 90) errors.push("El descuento debe ser un número entre 1 y 90.");
  const count = Number(usableCount);
  if (!Number.isFinite(count) || count < 1) errors.push("Los usos disponibles deben ser al menos 1.");
  if (errors.length) throw new ValidationError(errors.join(" "));
}

async function listCoupons() {
  return couponRepository.findAll();
}

async function createCoupon(data) {
  validateCouponInput(data);
  const existing = await couponRepository.findByCode(data.code);
  if (existing) throw new ValidationError("Ya existe un cupón con ese código.");
  return couponRepository.create({
    code: data.code,
    discountPercentage: Number(data.discountPercentage),
    usableCount: Number(data.usableCount),
  });
}

async function deleteCoupon(code) {
  const deleted = await couponRepository.deleteByCode(code);
  if (!deleted) throw new NotFoundError("Cupón no encontrado.");
  return deleted;
}

// Decremento atómico + limpieza si se agota. Devuelve el resultado listo
// para mostrarle a la persona en el checkout.
async function applyCoupon(rawCode) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) throw new ValidationError("Ingresá un código de cupón.");

  const updated = await couponRepository.decrementUsable(code);

  if (!updated) {
    // Puede ser que no exista, o que ya esté en 0 (y en ese caso lo limpiamos).
    const existing = await couponRepository.findByCode(code);
    if (existing) await couponRepository.deleteByCode(code);
    throw new ValidationError(
      existing ? "Este cupón ya alcanzó su límite de usos." : "El cupón no existe o ya no está disponible."
    );
  }

  if (updated.usableCount <= 0) {
    await couponRepository.deleteByCode(code);
  }

  return {
    discountPercentage: updated.discountPercentage,
    code: updated.code,
    message:
      updated.usableCount > 0
        ? `Cupón ${updated.code} aplicado (-${updated.discountPercentage}%). Quedan ${updated.usableCount} usos.`
        : `Cupón ${updated.code} aplicado (-${updated.discountPercentage}%). Era el último uso disponible: se agotó.`,
  };
}

module.exports = { listCoupons, createCoupon, deleteCoupon, applyCoupon, ValidationError, NotFoundError };
