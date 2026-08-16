/**
 * seed/seedProducts.js
 *
 * Carga los 16 productos de ejemplo (los mismos que hoy están hardcodeados
 * en src/data/products.js) dentro de MongoDB, para tener datos reales con
 * los que probar la API y el Data Explorer de Atlas.
 *
 * Uso:
 *   cd server
 *   node seed/seedProducts.js
 *
 * Por defecto NO borra productos existentes (usa --reset para vaciar la
 * colección antes de insertar).
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const SEED_PRODUCTS = [
  { name: "Organizador de Escritorio Modular", category: "hogar", price: 8500, discount: 10, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.8, sales: 340, seller: "Vendedor Platino", gradient: "grad-blue" },
  { name: "Set de Macetas Geométricas x3", category: "hogar", price: 6200, discount: 0, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.6, sales: 210, seller: "Vendedor Oro", gradient: "grad-emerald" },
  { name: "Lámpara Lithophane Personalizada", category: "hogar", price: 12800, discount: 15, material: "Resina", fileType: "fisico", freeShipping: false, rating: 4.9, sales: 98, seller: "Vendedor Platino", gradient: "grad-indigo" },
  { name: "Archivo STL Portavelas Nórdico", category: "hogar", price: 1500, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.7, sales: 560, seller: "Vendedor Confiable", gradient: "grad-slate" },
  { name: "Baraja de Cartas Flotante — Truco", category: "ilusionismo", price: 15400, discount: 20, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.9, sales: 150, seller: "Vendedor Platino", gradient: "grad-violet" },
  { name: "Caja de Aparición Mini", category: "ilusionismo", price: 22300, discount: 0, material: "Resina", fileType: "fisico", freeShipping: false, rating: 4.7, sales: 76, seller: "Vendedor Oro", gradient: "grad-amber" },
  { name: "Archivo STL Moneda Mágica Articulada", category: "ilusionismo", price: 2100, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.5, sales: 302, seller: "Vendedor Confiable", gradient: "grad-yellow" },
  { name: "Máscara Articulada de Dragón", category: "disfraces", price: 18900, discount: 12, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.8, sales: 189, seller: "Vendedor Platino", gradient: "grad-red" },
  { name: "Casco Cyberpunk Modular", category: "disfraces", price: 24500, discount: 0, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.6, sales: 132, seller: "Vendedor Oro", gradient: "grad-cyan" },
  { name: "Archivo STL Guanteletes Articulados", category: "disfraces", price: 1800, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.4, sales: 410, seller: "Vendedor Confiable", gradient: "grad-zinc" },
  { name: "Busto Realista Personalizable", category: "esculturas", price: 34900, discount: 18, material: "Resina", fileType: "fisico", freeShipping: false, rating: 5.0, sales: 64, seller: "Vendedor Platino", gradient: "grad-stone" },
  { name: "Escultura Geométrica Low Poly — Zorro", category: "esculturas", price: 9800, discount: 0, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.7, sales: 245, seller: "Vendedor Oro", gradient: "grad-orange" },
  { name: "Archivo STL Colección Bustos Mitológicos", category: "esculturas", price: 3200, discount: 25, material: "Resina", fileType: "stl", freeShipping: false, rating: 4.9, sales: 88, seller: "Vendedor Platino", gradient: "grad-purple" },
  { name: "Engranaje de Precisión para Impresora", category: "repuestos", price: 4300, discount: 0, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.8, sales: 520, seller: "Vendedor Confiable", gradient: "grad-sky" },
  { name: "Extrusor Compatible Bowden", category: "repuestos", price: 11200, discount: 8, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.6, sales: 178, seller: "Vendedor Oro", gradient: "grad-teal" },
  { name: "Archivo STL Soportes de Calibración", category: "repuestos", price: 900, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.3, sales: 670, seller: "Vendedor Confiable", gradient: "grad-gray" },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("[WizardCo] Falta MONGODB_URI en server/.env — no se puede seedear.");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "wizardco" });
  console.log("[WizardCo] Conectado a MongoDB para seedear productos.");

  if (process.argv.includes("--reset")) {
    const { deletedCount } = await Product.deleteMany({});
    console.log(`[WizardCo] Colección vaciada (${deletedCount} productos eliminados).`);
  }

  const existing = await Product.countDocuments();
  if (existing > 0 && !process.argv.includes("--reset")) {
    console.log(`[WizardCo] Ya hay ${existing} productos en la base. Usá "node seed/seedProducts.js --reset" si querés reemplazarlos.`);
  } else {
    const inserted = await Product.insertMany(SEED_PRODUCTS);
    console.log(`[WizardCo] ✓ ${inserted.length} productos insertados.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[WizardCo] Error seedeando productos:", err);
  process.exit(1);
});
