/**
 * repositories/orderRepository.js
 */

const Order = require("../models/Order");

async function create(data) {
  return Order.create(data);
}

async function findAll() {
  return Order.find().sort({ createdAt: -1 });
}

async function findByUserId(userId) {
  return Order.find({ userId }).sort({ createdAt: -1 });
}

async function findByExternalReference(externalReference) {
  return Order.findOne({ externalReference });
}

async function updateByExternalReference(externalReference, patch) {
  return Order.findOneAndUpdate({ externalReference }, patch, { new: true });
}

module.exports = { create, findAll, findByUserId, findByExternalReference, updateByExternalReference };
