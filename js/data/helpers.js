/* src/data/helpers.js — utilidades puras */

const TAX_RATE = 0.21; // IVA

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

function priceWithDiscount(product) {
  return product.price * (1 - product.discount / 100);
}

