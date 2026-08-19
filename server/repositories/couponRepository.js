/**
 * repositories/couponRepository.js
 */

const Coupon = require("../models/Coupon");

async function findAll() {
  return Coupon.find().sort({ createdAt: -1 });
}

async function findByCode(code) {
  return Coupon.findOne({ code: code.toUpperCase().trim() });
}

async function create(data) {
  return Coupon.create({ ...data, code: data.code.toUpperCase().trim() });
}

async function deleteByCode(code) {
  return Coupon.findOneAndDelete({ code: code.toUpperCase().trim() });
}

// Atómico: solo decrementa si usableCount > 0 en ese mismo instante, evita
// condiciones de carrera si dos personas usan el cupón al mismo tiempo.
async function decrementUsable(code) {
  return Coupon.findOneAndUpdate(
    { code: code.toUpperCase().trim(), usableCount: { $gt: 0 } },
    { $inc: { usableCount: -1 } },
    { new: true }
  );
}

module.exports = { findAll, findByCode, create, deleteByCode, decrementUsable };
