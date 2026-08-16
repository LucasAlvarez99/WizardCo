/**
 * models/Product.js
 *
 * Mismos campos que ya usa el frontend (ver src/data/products.js), para
 * que la migración de localStorage a la DB sea directa en la Fase 2.
 */

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    material: { type: String, trim: true },
    fileType: { type: String, enum: ["fisico", "stl"], required: true },
    freeShipping: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    sales: { type: Number, default: 0, min: 0 },
    seller: { type: String, trim: true },
    gradient: { type: String, trim: true },
    stock: { type: Number, default: null }, // null = sin control de stock
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Product", productSchema);
