/**
 * repositories/userRepository.js
 */

const User = require("../models/User");

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() });
}

async function findById(id) {
  return User.findById(id);
}

async function create(data) {
  return User.create(data);
}

async function updateById(id, patch) {
  return User.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
}

module.exports = { findByEmail, findById, create, updateById };
