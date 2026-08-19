/**
 * seed/seedCoupons.js
 *
 * Carga los cupones de ejemplo (los mismos que hoy están hardcodeados en
 * src/data/coupons.js) en MongoDB.
 *
 * Uso:
 *   cd server
 *   node seed/seedCoupons.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");

const SEED_COUPONS = [
  { code: "DESCUENTO3D", discountPercentage: 15, usableCount: 5 },
  { code: "MAGIC20", discountPercentage: 20, usableCount: 3 },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("[WizardCo] Falta MONGODB_URI en server/.env.");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "wizardco" });
  console.log("[WizardCo] Conectado a MongoDB para seedear cupones.");

  for (const coupon of SEED_COUPONS) {
    const existing = await Coupon.findOne({ code: coupon.code });
    if (existing) {
      console.log(`[WizardCo] El cupón ${coupon.code} ya existe, se salteó.`);
      continue;
    }
    await Coupon.create(coupon);
    console.log(`[WizardCo] ✓ Cupón ${coupon.code} creado.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[WizardCo] Error seedeando cupones:", err.message);
  process.exit(1);
});
