/**
 * services/productService.js
 *
 * Reglas de negocio y validación. El controller no valida nada por su
 * cuenta, delega acá.
 */

const productRepository = require("../repositories/productRepository");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

const VALID_FILE_TYPES = ["fisico", "stl"];

// Solo aceptamos URLs de Cloudinary acá — evita que alguien mande cualquier
// URL arbitraria (por ejemplo, apuntando a contenido malicioso) directo a
// la API, saltándose el widget de subida del panel.
function isCloudinaryUrl(url) {
  return typeof url === "string" && /^https:\/\/res\.cloudinary\.com\//.test(url);
}

function validateProductInput(data, { partial = false } = {}) {
  const errors = [];

  if (!partial || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      errors.push("El nombre es obligatorio.");
    }
  }
  if (!partial || data.category !== undefined) {
    if (!data.category || typeof data.category !== "string") {
      errors.push("La categoría es obligatoria.");
    }
  }
  if (!partial || data.price !== undefined) {
    if (typeof data.price !== "number" || data.price < 0) {
      errors.push("El precio debe ser un número mayor o igual a 0.");
    }
  }
  if (!partial || data.fileType !== undefined) {
    if (!VALID_FILE_TYPES.includes(data.fileType)) {
      errors.push(`fileType debe ser uno de: ${VALID_FILE_TYPES.join(", ")}.`);
    }
  }
  if (data.discount !== undefined) {
    if (typeof data.discount !== "number" || data.discount < 0 || data.discount > 100) {
      errors.push("El descuento debe ser un número entre 0 y 100.");
    }
  }
  if (data.images !== undefined) {
    if (!Array.isArray(data.images) || data.images.length > 3 || !data.images.every(isCloudinaryUrl)) {
      errors.push("Las fotos deben ser hasta 3 URLs de Cloudinary.");
    }
  }
  if (data.video !== undefined && data.video !== null && data.video !== "") {
    if (!isCloudinaryUrl(data.video)) {
      errors.push("El video debe ser una URL de Cloudinary.");
    }
  }

  if (errors.length) {
    throw new ValidationError(errors.join(" "));
  }
}

async function listProducts(query = {}) {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.fileType) filter.fileType = query.fileType;
  return productRepository.findAll(filter);
}

async function getProduct(id) {
  const product = await productRepository.findById(id);
  if (!product) throw new NotFoundError("Producto no encontrado.");
  return product;
}

async function createProduct(data) {
  validateProductInput(data);
  return productRepository.create(data);
}

async function updateProduct(id, patch) {
  validateProductInput(patch, { partial: true });
  const updated = await productRepository.updateById(id, patch);
  if (!updated) throw new NotFoundError("Producto no encontrado.");
  return updated;
}

async function deleteProduct(id) {
  const deleted = await productRepository.deleteById(id);
  if (!deleted) throw new NotFoundError("Producto no encontrado.");
  return deleted;
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  NotFoundError,
  ValidationError,
};
