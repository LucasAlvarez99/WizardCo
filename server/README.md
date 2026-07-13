# WizardCo — Backend de pagos (Mercado Pago Checkout Pro)

Este backend existe por una razón de seguridad, no de estilo: el
**access token** de Mercado Pago es secreto. Si lo pusiéramos en el
frontend (`/js`, `/src`), cualquier persona podría abrir las devtools del
navegador, copiarlo, y crear pagos o leer información de tu cuenta. Por
eso este único paso (crear la preferencia de pago) tiene que pasar por un
servidor.

**Importante:** este backend nunca ve ni guarda números de tarjeta ni de
cuenta bancaria. Ese dato lo tipea la persona directamente en la página de
Mercado Pago (Checkout Pro), que es quien realmente procesa el pago.

## 1. Conseguí tus credenciales reales

1. Entrá a [mercadopago.com.ar/developers/panel](https://www.mercadopago.com.ar/developers/panel/app).
2. Creá una aplicación (o usá una existente).
3. En "Credenciales de prueba" copiá el **Access Token de prueba**
   (empieza con `TEST-`). Con esto podés simular compras enteras sin
   plata real, usando [tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards).
4. Cuando quieras cobrar de verdad, pasás a las credenciales de
   **producción** (empiezan con `APP_USR-`) — ahí sí es dinero real.

## 2. Configurar y correr

```bash
cd server
cp .env.example .env
# Editá .env y pegá tu MP_ACCESS_TOKEN real (arrancá con el de prueba)
npm install
npm start
```

Vas a ver: `WizardCo backend de pagos escuchando en http://localhost:4000`

## 3. Conectar el frontend

En `src/data/config.js`, `API_BASE_URL` ya apunta a
`http://localhost:4000` por defecto — si corrés todo en tu máquina no hay
que tocar nada. Si desplegás este backend en otro lado (Render, Railway,
tu propio VPS), cambiá esa URL por la real y corré `npm run build` en la
raíz del proyecto para que el cambio quede compilado en `/js`.

## 4. Probar una compra de punta a punta

1. Corré este backend (`npm start` acá adentro).
2. Abrí `index.html` del frontend (o serví la carpeta con un servidor
   local).
3. Agregá algo al carrito, iniciá sesión (verificá tu cuenta desde
   "Mi perfil") y andá a pagar.
4. Vas a ser redirigido a la pantalla real de Mercado Pago. Usá una
   [tarjeta de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards)
   si estás con el access token de `TEST-`.
5. Al confirmar, Mercado Pago te redirige de vuelta al sitio, que muestra
   "¡Compra confirmada!" y registra el pedido.

## 5. El webhook (confirmación real del lado del servidor)

`POST /api/webhook` es la forma *correcta* de confirmar una venta: no
depende de que la persona vuelva al navegador (podría cerrar la pestaña
antes). Mercado Pago necesita poder alcanzar esa URL desde internet, así
que en `localhost` no va a poder llamarla sola — para probarlo en tu
máquina, usá algo como [ngrok](https://ngrok.com/) para exponer tu
`localhost:4000` con una URL pública, y poné esa URL en `PUBLIC_URL`
dentro de `.env`. En un despliegue real (Render/Railway/tu servidor),
`PUBLIC_URL` es directamente la URL pública de ese backend.

Los pedidos que llegan por webhook se guardan en `server/orders.json`
(se crea solo). **Esto es solo para la demo** — en producción reemplazá
ese archivo por una base de datos real (Postgres, MongoDB, lo que uses),
porque un archivo JSON no soporta escrituras concurrentes de forma segura.

## 6. Desplegar el backend

Cualquier servicio que corra Node sirve: [Render](https://render.com),
[Railway](https://railway.app), un VPS propio, etc. Los pasos son
siempre los mismos:
1. Subís esta carpeta `/server` (o el repo completo).
2. Configurás las variables de entorno (`MP_ACCESS_TOKEN`, `PORT` si hace
   falta, `PUBLIC_URL` con la URL pública que te den).
3. Comando de arranque: `npm install && npm start`.
4. Copiás esa URL pública a `src/data/config.js` (`API_BASE_URL`) y
   recompilás el frontend (`npm run build` en la raíz).
