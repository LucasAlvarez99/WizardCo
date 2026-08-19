/**
 * models/Order.js
 *
 * Se crea (con status "pending_payment") cuando la persona logueada arma
 * el checkout — customerName/customerEmail/userId salen del token, nunca
 * del body, así nadie puede crear un pedido a nombre de otra persona.
 *
 * paymentStatus solo lo actualiza el webhook de Mercado Pago (fuente de
 * verdad real de si se pagó o no), buscando por externalReference.
 */

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    externalReference: { type: String, required: true, unique: true },
    paymentId: { type: String, default: null },
    paymentStatus: {
      type: String,
      enum: ["pending_payment", "approved", "pending", "rejected"],
      default: "pending_payment",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.date = ret.createdAt;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Order", orderSchema);
