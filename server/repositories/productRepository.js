/**
 * repositories/productRepository.js
 *
 * Única capa que habla directamente con Mongoose/MongoDB. El service no
 * conoce queries de Mongo, solo llama a estas funciones.
 */

const Product = require("../models/Product");

async function findAll(filter = {}) {
  return Product.find(filter).sort({ createdAt: -1 });
}

async function findById(id) {
  return Product.findById(id);
}

async function create(data) {
  return Product.create(data);
}

async function updateById(id, patch) {
  return Product.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
}

async function deleteById(id) {
  return Product.findByIdAndDelete(id);
}

async function insertMany(products) {
  return Product.insertMany(products);
}

async function countAll() {
  return Product.countDocuments();
}

module.exports = { findAll, findById, create, updateById, deleteById, insertMany, countAll };
