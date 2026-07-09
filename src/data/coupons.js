/* src/data/coupons.js — agregar un cupón nuevo = agregar un objeto acá.
   La lógica que los consume (CartContext.jsx) no necesita cambios. */

const INITIAL_COUPONS = [
  { code: "DESCUENTO3D", discountPercentage: 15, usableCount: 5 },
  { code: "MAGIC20", discountPercentage: 20, usableCount: 3 },
];
