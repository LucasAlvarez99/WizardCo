# WizardCo — E-commerce de impresión 3D

## Por qué daba el error de consola (ya resuelto)

El navegador estaba usando **Babel en vivo** para transformar cada `.jsx` (vía
`<script type="text/babel" src="...">`). Ese modo usa `XMLHttpRequest` para
traer cada archivo, y falla apenas lo abrís con doble clic (`file://`) o con
algunos servidores.

**Solución:** el JSX se precompila **una sola vez** con Babel (fuera del
navegador) a JavaScript plano. El navegador ya no usa Babel para nada: carga
archivos `.js` comunes con `<script src="...">`, así que funciona incluso
abriendo `index.html` con doble clic.

## Cómo abrir el proyecto

Simplemente abrí `index.html` en el navegador (doble clic). No hace falta
servidor ni build para *ver* la app: `/js` ya viene compilado.

## Funcionalidades

### Catálogo, carrito y checkout
Los de siempre: buscador, filtros, carrito con cantidades, cupones con
usos limitados, cálculo de IVA.

### Cuentas de usuario y panel de administración
- **Login/registro simulado.** Para probar el panel de administración,
  usá un email que **contenga la palabra "admin"** (ej: `admin@wizardco.com`).
  Cualquier otro email entra como cliente normal.
- **Perfil de usuario** (`Mi perfil` en el menú): verificación de cuenta,
  vinculación de cuenta bancaria y el historial de tus propias compras.
- **Verificación de cuenta:** como esta demo no tiene backend de emails,
  el "código de verificación" se genera y se muestra directamente en
  pantalla (en producción llegaría por email real). Es un gate: sin
  cuenta verificada, no se puede confirmar una compra.
- **Cuenta bancaria (simulada):** el formulario de "vincular cuenta"
  guarda solo un alias y los **últimos 4 dígitos**, nunca el número
  completo — es una simulación pensada para la demo, no un medio de pago
  real. También es un gate obligatorio antes de poder comprar.
- **Panel de administración** (`Panel de administración`, solo visible
  para cuentas admin): pestañas para **Productos** (alta, edición inline
  de precio/descuento, baja), **Cupones** (alta con código/porcentaje/usos,
  baja), **Pedidos** (todas las compras confirmadas, con botón para avisar
  por WhatsApp/Email) y **Configuración** (a qué WhatsApp/Email llegan los
  avisos de venta).

### Aviso de venta por WhatsApp / Email (esto sí es real)
Después de confirmar una compra (o desde el panel de administración, tab
Pedidos), aparecen dos botones que arman un mensaje con el detalle del
pedido y abren:
- `https://wa.me/<numero>?text=...` → abre WhatsApp Web/App con el mensaje
  ya redactado, listo para enviar.
- `mailto:<email>?subject=...&body=...` → abre el cliente de correo del
  usuario con el mensaje ya redactado.

Ambos son estándares del navegador, **no necesitan backend ni API paga** —
la única salvedad es que requieren un clic del usuario (ningún sitio puede
mandar un WhatsApp o email 100% solo, por diseño de los navegadores).

### Persistencia de datos
Productos, cupones, pedidos y la configuración de contacto se guardan en
`localStorage`, o sea que sobreviven a un F5 **en ese mismo navegador**.
No se sincronizan entre dispositivos ni usuarios distintos — para eso hace
falta una base de datos real con un backend atrás.

## Qué haría falta para producción (para ser honestos)

Este proyecto es 100% frontend estático, así que hay tres puntos que hoy
están *simulados* a propósito y que en un producto real necesitan
infraestructura del lado del servidor:

1. **Verificación de cuenta real:** un backend + servicio de email
   transaccional (Resend, SendGrid, Amazon SES) que mande el código en
   vez de mostrarlo en pantalla.
2. **Cuenta bancaria / cobros reales:** un backend conectado a un
   procesador de pagos habilitado (Mercado Pago, Stripe Connect, etc.).
   Nunca hay que manejar números de cuenta completos del lado del cliente
   como hace este demo.
3. **Base de datos compartida:** reemplazar `localStorage` por una API +
   base de datos real, para que el catálogo/cupones/pedidos sean iguales
   para todos los usuarios y no por navegador.

## Cómo modificar el código

El código "fuente" editable (con JSX, más legible) está en `/src`. La
carpeta `/js` es el resultado compilado que realmente carga `index.html`
— **no la edites a mano**, se regenera con el build.

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
│   ├── categories.js      → las 5 categorías del menú
│   ├── filterOptions.js   → materiales y tipos de archivo (STL/Físico)
│   ├── products.js        → catálogo inicial, un producto por línea
│   ├── coupons.js         → cupones iniciales (code, %, usos)
│   ├── adminContact.js    → a dónde llegan los avisos de venta por defecto
│   └── localStore.js      → helpers de persistencia en localStorage
├── icons/
│   ├── IconBase.jsx        → wrapper SVG compartido
│   ├── navIcons.jsx        → buscar, menú, cerrar, flechas, sombrero de mago
│   ├── actionIcons.jsx     → carrito, usuario, +/-, tacho, tarjeta
│   ├── statusIcons.jsx     → check, alerta, loader, estrella, envío
│   ├── categoryIcons.jsx   → un ícono por categoría + mapa CATEGORY_ICONS
│   └── adminIcons.jsx      → mail, WhatsApp, banco, tienda, editar, pedidos
├── context/
│   ├── AdminDataContext.jsx → productos, cupones (CouponManager), pedidos,
│   │                          contacto — todo persistido en localStorage
│   ├── AuthContext.jsx      → login/registro, verificación, cuenta bancaria
│   └── CartContext.jsx      → carrito de la sesión actual
├── components/
│   ├── Header.jsx, FilterSidebar.jsx, ProductCard.jsx, LoginModal.jsx,
│   │   CartDrawer.jsx, CheckoutView.jsx
│   ├── admin/
│   │   ├── ProductsTab.jsx, CouponsTab.jsx, OrdersTab.jsx, SettingsTab.jsx
│   └── profile/
│       ├── VerifyEmailCard.jsx, BankAccountCard.jsx, OrderHistoryCard.jsx
├── pages/
│   ├── CatalogPage.jsx, AdminPage.jsx, ProfilePage.jsx
└── App.jsx                  → raíz, monta todo con ReactDOM

css/
├── base.css          → variables de color, reset, animaciones
├── header.css        → header, buscador, menú de usuario, nav de categorías
├── catalog.css       → layout del catálogo, orden, estado vacío
├── filters.css       → sidebar de filtros (desktop + drawer mobile)
├── product-card.css  → grilla de productos y tarjeta
├── buttons.css       → botón primario genérico
├── modal.css         → modal de login/registro
├── cart.css          → carrito lateral
├── checkout.css      → checkout, cupones, totales, bloqueos, aviso de venta
├── admin.css         → panel de administración (tabs, tablas, formularios)
├── profile.css        → tarjetas del perfil de usuario
└── responsive.css     → breakpoints mobile-first
```

### Ejemplos rápidos de edición

- **Agregar un producto:** hacerlo desde el panel de administración (tab
  Productos), o copiar una línea en `src/data/products.js` para que sea
  parte del catálogo por defecto.
- **Agregar un cupón:** desde el panel de administración (tab Cupones), o
  agregando un objeto en `src/data/coupons.js` para que sea un cupón por
  defecto. La lógica de decremento/expiración vive en `AdminDataContext.jsx`.
- **Cambiar a dónde llegan los avisos de venta:** panel de administración
  → Configuración, o editando `src/data/adminContact.js` (valor por defecto).
- **Agregar una categoría:** un objeto en `src/data/categories.js` + un
  ícono en `src/icons/categoryIcons.jsx`.
- **Cambiar colores:** todo vive en las variables `:root` de `css/base.css`.

Después de cualquier cambio en `/src`, corré `npm run build` de nuevo.
