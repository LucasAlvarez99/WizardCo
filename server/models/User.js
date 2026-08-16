/**
 * models/User.js
 *
 * El campo isAdmin ya no depende de que el email contenga "admin" (como en
 * la versión simulada): es un campo real en la base, que solo se puede
 * setear desde el script server/seed/createAdmin.js o directamente en
 * Mongo — nunca desde el registro público.
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verificationCodeHash: { type: String, default: null },
    verificationCodeExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.verificationCodeHash;
        delete ret.verificationCodeExpires;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
