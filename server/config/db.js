/**
 * config/db.js
 *
 * Conexión a MongoDB (Atlas, plan gratuito M0 — no se pausa por
 * inactividad). Usa MONGODB_URI desde server/.env.
 *
 * Si MONGODB_URI no está definida, el server sigue levantando igual
 * (para no romper el backend de pagos, que no depende de la DB), pero
 * cualquier endpoint de /api/products va a devolver error 503 hasta que
 * se configure.
 */

const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "\n[WizardCo] ⚠ Falta MONGODB_URI en server/.env — los endpoints de /api/products no van a funcionar hasta que la configures (ver server/.env.example).\n"
    );
    return;
  }

  try {
    mongoose.connection.on("connected", () => {
      isConnected = true;
      console.log("[WizardCo] ✓ Conectado a MongoDB Atlas.");
    });

    mongoose.connection.on("error", (err) => {
      isConnected = false;
      console.error("[WizardCo] Error de conexión a MongoDB:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("[WizardCo] ⚠ Se perdió la conexión a MongoDB.");
    });

    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || "wizardco",
    });
  } catch (err) {
    console.error("[WizardCo] No se pudo conectar a MongoDB Atlas:", err.message);
  }
}

function isDbConnected() {
  return isConnected;
}

module.exports = { connectDB, isDbConnected };
