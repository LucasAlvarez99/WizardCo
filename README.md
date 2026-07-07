# VoxelMarket — E-commerce de impresión 3D

## Por qué daba el error de consola

El navegador estaba usando **Babel en vivo** para transformar cada `.jsx` (vía
`<script type="text/babel" src="...">`). Ese modo usa `XMLHttpRequest` para
traer cada archivo, y falla apenas lo abrís con doble clic (`file://`) o con
algunos servidores — de ahí el `Cannot use import statement outside a module`.

**Solución:** ahora el JSX se precompila **una sola vez** con Babel (fuera del
navegador) a JavaScript plano. El navegador ya no usa Babel para nada: carga
archivos `.js` comunes con `<script src="...">`, así que funciona incluso
abriendo `index.html` con doble clic.

## Cómo abrir el proyecto

Simplemente abrí `index.html` en el navegador (doble clic). Ya no hace falta
servidor ni build para *ver* la app funcionando: `/js` ya viene compilado.

## Cómo modificar el código

El código "fuente" editable (con JSX, más legible) está en `/src`. La carpeta
`/js` es el resultado compilado que realmente carga `index.html` — **no la
edites a mano**, se regenera con el build.

1. Editá lo que necesites dentro de `/src` (ver mapa de carpetas abajo).
2. Instalá las dependencias de build una sola vez:
   ```bash
   npm install
   ```
3. Recompilá:
   ```bash
   npm run build
   ```
4. Recargá `index.html` en el navegador.

## Mapa de carpetas (organizado por objeto, para modificar rápido)

```
src/
├── data/
│   ├── helpers.js         → formatCurrency, priceWithDiscount, TAX_RATE
│   ├── categories.js       → las 5 categorías del menú
│   ├── filterOptions.js    → materiales y tipos de archivo (STL/Físico)
│   ├── products.js         → catálogo completo, un producto por línea
│   └── coupons.js          → cupones iniciales (code, %, usos)
├── icons/
│   ├── IconBase.jsx         → wrapper SVG compartido
│   ├── navIcons.jsx         → buscar, menú, cerrar, flechas
│   ├── actionIcons.jsx      → carrito, usuario, +/-, tacho, tarjeta
│   ├── statusIcons.jsx      → check, alerta, loader, estrella, envío
│   └── categoryIcons.jsx    → un ícono por categoría + mapa CATEGORY_ICONS
├── context/
│   ├── AuthContext.jsx      → login/registro simulado
│   └── CartContext.jsx      → carrito + CouponManager (lógica de cupones)
├── components/
│   ├── Header.jsx
│   ├── FilterSidebar.jsx
│   ├── ProductCard.jsx
│   ├── LoginModal.jsx
│   ├── CartDrawer.jsx
│   └── CheckoutView.jsx
├── pages/
│   └── CatalogPage.jsx
└── App.jsx                  → raíz, monta todo con ReactDOM

css/
├── base.css          → variables de color, reset, animaciones
├── header.css        → header, buscador, menú de usuario, nav de categorías
├── catalog.css       → layout del catálogo, orden, estado vacío
├── filters.css       → sidebar de filtros (desktop + drawer mobile)
├── product-card.css  → grilla de productos y tarjeta
├── buttons.css        → botón primario genérico
├── modal.css          → modal de login/registro
├── cart.css           → carrito lateral
├── checkout.css       → vista de checkout, cupones, totales
└── responsive.css     → breakpoints mobile-first
```

### Ejemplos rápidos de edición

- **Agregar un producto:** copiá una línea en `src/data/products.js` y
  cambiá los valores. No hay que tocar nada más.
- **Agregar un cupón:** agregá un objeto en `src/data/coupons.js`, por
  ejemplo `{ code: "VERANO10", discountPercentage: 10, usableCount: 20 }`.
  La lógica de decremento/expiración en `CartContext.jsx` ya lo soporta sin
  cambios.
- **Agregar una categoría:** agregá un objeto en `src/data/categories.js` y
  un ícono en `src/icons/categoryIcons.jsx` (o reusá uno existente).
- **Cambiar colores:** todo vive en las variables `:root` de `css/base.css`.

Después de cualquier cambio en `/src`, corré `npm run build` de nuevo.
