/**
 * services/orderService.js
 */

const crypto = require("crypto");
const orderRepository = require("../repositories/orderRepository");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

function generateExternalReference() {
  return `WZ-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
}

// user: documento de Mongoose del usuario logueado (ya autenticado por el
// middleware). customerName/customerEmail salen de ACÁ, nunca del body,
// para que nadie pueda crear un pedido a nombre de otra persona.
async function createOrder(user, { items, subtotal, discountAmount, tax, total, couponCode }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError("El pedido no tiene productos.");
  }
  for (const item of items) {
    if (!item.name || typeof item.qty !== "number" || item.qty < 1 || typeof item.price !== "number" || item.price < 0) {
      throw new ValidationError("Uno de los productos del pedido tiene datos inválidos.");
    }
  }
  if (typeof total !== "number" || total < 0) {
    throw new ValidationError("El total del pedido es inválido.");
  }

  return orderRepository.create({
    userId: user._id,
    customerName: user.name,
    customerEmail: user.email,
    items,
    subtotal: Number(subtotal) || 0,
    discountAmount: Number(discountAmount) || 0,
    tax: Number(tax) || 0,
    total: Number(total),
    couponCode: couponCode || null,
    externalReference: generateExternalReference(),
    paymentStatus: "pending_payment",
  });
}

async function getMine(userId) {
  return orderRepository.findByUserId(userId);
}

async function getAll() {
  return orderRepository.findAll();
}

async function getByReference(externalReference, requestingUserId, isAdmin) {
  const order = await orderRepository.findByExternalReference(externalReference);
  if (!order) throw new NotFoundError("Pedido no encontrado.");
  if (!isAdmin && (!order.userId || order.userId.toString() !== requestingUserId)) {
    throw new ForbiddenError("No tenés permiso para ver este pedido.");
  }
  return order;
}

// Llamado únicamente desde el webhook de Mercado Pago (fuente de verdad
// de si el pago se acreditó o no).
async function confirmPaymentFromWebhook({ externalReference, paymentId, paymentStatus, amount, payerEmail }) {
  if (!externalReference) return null;

  const existing = await orderRepository.updateByExternalReference(externalReference, {
    paymentId: String(paymentId),
    paymentStatus,
    ...(typeof amount === "number" ? { total: amount } : {}),
  });

  if (existing) return existing;

  // No había un pedido creado desde el checkout (por ejemplo, si falló esa
  // llamada) — igual guardamos la confirmación de pago para no perder la
  // venta, aunque sin el detalle de items.
  return orderRepository.create({
    userId: null,
    customerName: payerEmail || "Desconocido",
    customerEmail: payerEmail || "desconocido@wizardco.com",
    items: [],
    total: typeof amount === "number" ? amount : 0,
    externalReference,
    paymentId: String(paymentId),
    paymentStatus,
  });
}

module.exports = {
  createOrder,
  getMine,
  getAll,
  getByReference,
  confirmPaymentFromWebhook,
  ValidationError,
  ForbiddenError,
  NotFoundError,
};
