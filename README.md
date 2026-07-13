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

Para navegar el catálogo, `index.html` funciona con doble clic. Para
**pagar de verdad** con Mercado Pago necesitás correr también el backend
de `/server` (ver más abajo) — sin eso el botón de pago va a mostrar un
error explicando que falta configurarlo.

## Funcionalidades

### Catálogo, carrito y checkout
Buscador, filtros, carrito con cantidades, cupones con usos limitados,
cálculo de IVA.

### Pagos reales con Mercado Pago Checkout Pro
El botón "Pagar con Mercado Pago" del checkout **redirige a la pasarela
real de Mercado Pago** — tarjetas, transferencia o dinero en cuenta, todo
procesado por Mercado Pago. Ni el frontend ni WizardCo ven o guardan en
ningún momento un número de tarjeta o de cuenta.

Esto necesita un backend chico (`/server`) porque el access token de
Mercado Pago es secreto y no puede vivir en código de frontend. Ver
**`server/README.md`** para la guía completa paso a paso (conseguir
credenciales de prueba, correrlo local, probar con tarjetas de prueba,
desplegarlo). En resumen:

```bash
cd server
cp .env.example .env      # completá MP_ACCESS_TOKEN con el tuyo
npm install
npm start
```

Con eso corriendo, y `index.html` abierto en el navegador, el flujo de
compra completo funciona de punta a punta contra Mercado Pago real (modo
prueba o producción, según qué access token uses).

### Cuentas de usuario y panel de administración
- **Login/registro simulado.** Para probar el panel de administración,
  usá un email que **contenga la palabra "admin"** (ej: `admin@wizardco.com`).
  Cualquier otro email entra como cliente normal.
- **Perfil de usuario** (`Mi perfil` en el menú): verificación de cuenta
  y el historial de tus propias compras.
- **Verificación de cuenta:** como esta demo no tiene backend de emails,
  el "código de verificación" se genera y se muestra directamente en
  pantalla (en producción llegaría por email real — ver la sección de
  abajo). Es un gate: sin cuenta verificada, no se puede pagar.
- **Panel de administración** (`Panel de administración`, solo visible
  para cuentas admin): pestañas para **Productos** (alta, edición inline
  de precio/descuento, baja), **Cupones** (alta con código/porcentaje/usos,
  baja), **Pedidos** (todas las compras confirmadas, con el estado real
  del pago — Pagado/Pendiente — y botón para avisar por WhatsApp/Email) y
  **Configuración** (a qué WhatsApp/Email llegan los avisos de venta).

### Aviso de venta por WhatsApp / Email
Después de un pago confirmado (o desde el panel de administración, tab
Pedidos), aparecen dos botones que arman un mensaje con el detalle del
pedido y abren `https://wa.me/<numero>?text=...` y
`mailto:<email>?subject=...&body=...` con el mensaje ya redactado.

Estos dos son estándares del navegador y **no necesitan backend** — la
salvedad es que requieren un clic de la persona (ver la sección siguiente
sobre por qué el aviso automático 100% solo necesita más infraestructura).

### Persistencia de datos
Productos, cupones, pedidos (los que se resuelven en el navegador) y la
configuración de contacto se guardan en `localStorage` del navegador. Los
pedidos que llegan por el **webhook** de Mercado Pago (la confirmación del
lado del servidor) se guardan en `server/orders.json`. Ninguna de las dos
cosas es una base de datos compartida entre dispositivos/usuarios — ver
abajo.

## Qué haría falta para ir más allá de esta demo (para ser honestos)

1. **Notificación de venta 100% automática (sin clic):** ahora mismo el
   aviso por WhatsApp/Email requiere que alguien haga clic en un botón,
   porque ningún navegador puede mandar un WhatsApp o un email por su
   cuenta sin acción de la persona (es una restricción de seguridad de
   los navegadores, no una limitación de este código). Para que salga
   solo, automáticamente, apenas se confirma un pago, hace falta moverlo
   al backend: el mismo webhook de `/server/index.js` que ya recibe la
   confirmación de Mercado Pago puede, en ese momento, llamar a una API
   de email transaccional (Resend, SendGrid) y a la API de WhatsApp
   Business (Meta Cloud API o Twilio) para mandar los avisos sin que
   nadie tenga que tocar nada. Esto no lo agregamos todavía en este
   backend porque la API de WhatsApp Business requiere una cuenta de
   Meta Business verificada — avisame cuando la tengas y lo conectamos.
2. **Verificación de cuenta por email real:** hoy el código se muestra en
   pantalla. Para que llegue por email de verdad hace falta un servicio
   de email transaccional (Resend, SendGrid, Amazon SES) llamado desde un
   backend — el mismo `/server` es un buen lugar para agregar ese
   endpoint el día que quieras.
3. **Base de datos compartida:** reemplazar `localStorage` (y el
   `orders.json` del backend) por una base de datos real (Postgres,
   MongoDB, etc.), para que el catálogo/cupones/pedidos sean iguales para
   todos los usuarios y no por navegador/servidor.

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
│   ├── localStore.js      → helpers de persistencia en localStorage
│   └── config.js          → URL del backend de pagos (API_BASE_URL)
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
│   ├── AuthContext.jsx      → login/registro, verificación de cuenta
│   └── CartContext.jsx      → carrito de la sesión actual
├── components/
│   ├── Header.jsx, FilterSidebar.jsx, ProductCard.jsx, LoginModal.jsx,
│   │   CartDrawer.jsx, CheckoutView.jsx (acá vive el flujo de pago real)
│   ├── admin/
│   │   ├── ProductsTab.jsx, CouponsTab.jsx, OrdersTab.jsx, SettingsTab.jsx
│   └── profile/
│       ├── VerifyEmailCard.jsx, PaymentInfoCard.jsx, OrderHistoryCard.jsx
├── pages/
│   ├── CatalogPage.jsx, AdminPage.jsx, ProfilePage.jsx
└── App.jsx                  → raíz, monta todo + detecta el regreso de Mercado Pago

css/
├── base.css          → variables de color, reset, animaciones
├── header.css        → header, buscador, menú de usuario, nav de categorías
├── catalog.css       → layout del catálogo, orden, estado vacío
├── filters.css       → sidebar de filtros (desktop + drawer mobile)
├── product-card.css  → grilla de productos y tarjeta
├── buttons.css       → botón primario genérico
├── modal.css         → modal de login/registro
├── cart.css          → carrito lateral
├── checkout.css      → checkout, cupones, totales, bloqueos, resultado del pago
├── admin.css         → panel de administración (tabs, tablas, formularios)
├── profile.css       → tarjetas del perfil de usuario
└── responsive.css    → breakpoints mobile-first

server/                → backend de pagos (Node + Express + Mercado Pago SDK)
├── index.js            → crea preferencias de pago + recibe el webhook
├── .env.example        → variables de entorno (copiar a .env con tus datos)
└── README.md           → guía paso a paso para configurarlo y desplegarlo
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
- **Cambiar la URL del backend de pagos:** `src/data/config.js`
  (`API_BASE_URL`), y después `npm run build`.
- **Agregar una categoría:** un objeto en `src/data/categories.js` + un
  ícono en `src/icons/categoryIcons.jsx`.
- **Cambiar colores:** todo vive en las variables `:root` de `css/base.css`.

Después de cualquier cambio en `/src`, corré `npm run build` de nuevo.
