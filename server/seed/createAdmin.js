/**
 * seed/createAdmin.js
 *
 * Crea el primer usuario administrador directamente en la base, ya
 * verificado (sin necesidad de pasar por el flujo de verificación por
 * email). Si el email ya existe, lo promueve a admin y lo marca como
 * verificado en vez de duplicarlo.
 *
 * El nombre es opcional (por defecto "Administrador").
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function run() {
  const [, , email, password, name] = process.argv;

  if (!email || !password) {
    console.error('Uso: node seed/createAdmin.js <email> <password> ["Nombre"]');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("La contraseña debe tener al menos 6 caracteres.");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("[WizardCo] Falta MONGODB_URI en server/.env.");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "wizardco" });
  console.log("[WizardCo] Conectado a MongoDB.");

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email: email.toLowerCase().trim() });

  if (existing) {
    existing.isAdmin = true;
    existing.verified = true;
    existing.passwordHash = passwordHash;
    if (name) existing.name = name;
    await existing.save();
    console.log(`[WizardCo] ✓ Usuario existente "${email}" promovido a administrador.`);
  } else {
    await User.create({
      name: name || "Administrador",
      email,
      passwordHash,
      isAdmin: true,
      verified: true,
    });
    console.log(`[WizardCo] ✓ Administrador "${email}" creado.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[WizardCo] Error creando administrador:", err.message);
  process.exit(1);
});
