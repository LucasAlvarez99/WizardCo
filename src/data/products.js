/* src/data/products.js — un producto por línea. Agregar uno nuevo = copiar una línea y editarla. */

const PRODUCTS = [
  { id: 1, name: "Organizador de Escritorio Modular", category: "hogar", price: 8500, discount: 10, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.8, sales: 340, seller: "Vendedor Platino", gradient: "grad-blue" },
  { id: 2, name: "Set de Macetas Geométricas x3", category: "hogar", price: 6200, discount: 0, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.6, sales: 210, seller: "Vendedor Oro", gradient: "grad-emerald" },
  { id: 3, name: "Lámpara Lithophane Personalizada", category: "hogar", price: 12800, discount: 15, material: "Resina", fileType: "fisico", freeShipping: false, rating: 4.9, sales: 98, seller: "Vendedor Platino", gradient: "grad-indigo" },
  { id: 4, name: "Archivo STL Portavelas Nórdico", category: "hogar", price: 1500, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.7, sales: 560, seller: "Vendedor Confiable", gradient: "grad-slate" },
  { id: 5, name: "Baraja de Cartas Flotante — Truco", category: "ilusionismo", price: 15400, discount: 20, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.9, sales: 150, seller: "Vendedor Platino", gradient: "grad-violet" },
  { id: 6, name: "Caja de Aparición Mini", category: "ilusionismo", price: 22300, discount: 0, material: "Resina", fileType: "fisico", freeShipping: false, rating: 4.7, sales: 76, seller: "Vendedor Oro", gradient: "grad-amber" },
  { id: 7, name: "Archivo STL Moneda Mágica Articulada", category: "ilusionismo", price: 2100, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.5, sales: 302, seller: "Vendedor Confiable", gradient: "grad-yellow" },
  { id: 8, name: "Máscara Articulada de Dragón", category: "disfraces", price: 18900, discount: 12, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.8, sales: 189, seller: "Vendedor Platino", gradient: "grad-red" },
  { id: 9, name: "Casco Cyberpunk Modular", category: "disfraces", price: 24500, discount: 0, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.6, sales: 132, seller: "Vendedor Oro", gradient: "grad-cyan" },
  { id: 10, name: "Archivo STL Guanteletes Articulados", category: "disfraces", price: 1800, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.4, sales: 410, seller: "Vendedor Confiable", gradient: "grad-zinc" },
  { id: 11, name: "Busto Realista Personalizable", category: "esculturas", price: 34900, discount: 18, material: "Resina", fileType: "fisico", freeShipping: false, rating: 5.0, sales: 64, seller: "Vendedor Platino", gradient: "grad-stone" },
  { id: 12, name: "Escultura Geométrica Low Poly — Zorro", category: "esculturas", price: 9800, discount: 0, material: "PLA+", fileType: "fisico", freeShipping: true, rating: 4.7, sales: 245, seller: "Vendedor Oro", gradient: "grad-orange" },
  { id: 13, name: "Archivo STL Colección Bustos Mitológicos", category: "esculturas", price: 3200, discount: 25, material: "Resina", fileType: "stl", freeShipping: false, rating: 4.9, sales: 88, seller: "Vendedor Platino", gradient: "grad-purple" },
  { id: 14, name: "Engranaje de Precisión para Impresora", category: "repuestos", price: 4300, discount: 0, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.8, sales: 520, seller: "Vendedor Confiable", gradient: "grad-sky" },
  { id: 15, name: "Extrusor Compatible Bowden", category: "repuestos", price: 11200, discount: 8, material: "PETG", fileType: "fisico", freeShipping: true, rating: 4.6, sales: 178, seller: "Vendedor Oro", gradient: "grad-teal" },
  { id: 16, name: "Archivo STL Soportes de Calibración", category: "repuestos", price: 900, discount: 0, material: "PLA+", fileType: "stl", freeShipping: false, rating: 4.3, sales: 670, seller: "Vendedor Confiable", gradient: "grad-gray" },
];
