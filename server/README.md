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
3. En "Credenciales de prueba" vas a ver **dos campos distintos** — ojo,
   es el error más común al configurar esto:
   - **Public Key**: formato corto tipo UUID
     (`APP_USR-9628f2cb-3a54-4f95-9894-...`). Esta NO es la que va en
     `MP_ACCESS_TOKEN` — se usa del lado del frontend en integraciones
     con Checkout Bricks, acá no la necesitamos.
   - **Access Token**: más largo, con grupos numéricos
     (`APP_USR-1234567890123456-070512-abcd...-123456789`). **Esta es
     la que va en `server/.env`.**
   - El servidor ahora detecta este error solo: si pegás la Public Key
     por accidente, `npm start` te lo va a avisar apenas arranca, y el
     endpoint de pago también te lo va a decir en vez de un error genérico.
4. Empezá con el **Access Token de prueba** (empieza con `TEST-`). Con
   esto podés simular compras enteras sin plata real, usando
   [tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards).
5. Cuando quieras cobrar de verdad, pasás al **Access Token de
   producción** (empieza con `APP_USR-`) — ahí sí es dinero real.

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

`src/data/config.js` ya detecta solo si estás en local o en el sitio
publicado:
- En `localhost`/`127.0.0.1` usa siempre `http://localhost:4000` (tu
  backend corriendo acá con `npm start`) — no hay que tocar nada.
- En cualquier otro dominio (GitHub Pages, tu dominio propio) usa
  `PRODUCTION_API_URL`, que por defecto dice
  `https://TU-BACKEND.onrender.com`. Una vez que despliegues el backend
  (sección 6), reemplazá esa línea por tu URL real y corré
  `npm run build` en la raíz del proyecto para que quede compilado en `/js`.

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

## 6. Desplegar a producción (Render, paso a paso)

Usamos [Render](https://render.com) porque tiene un plan gratis para
este tipo de backend chico y no pide tarjeta para arrancar. Los pasos:

1. **Subí el proyecto a GitHub** (si no lo hiciste ya) — Render se conecta
   directo a tu repo.
2. Entrá a [render.com](https://render.com) y creá una cuenta (podés
   entrar con tu GitHub).
3. **New +** → **Blueprint** → elegí tu repo `WizardCo`. Render va a leer
   el archivo `render.yaml` de la raíz del proyecto solo, y va a
   proponerte crear el servicio `wizardco-backend` con:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`

   (Si preferís hacerlo a mano en vez de con el Blueprint: **New +** →
   **Web Service** → tu repo → completá esos mismos tres campos vos.)
4. Antes de confirmar, cargá las variables de entorno que pide (son
   secretas, Render te las pide aparte, nunca van en el repo):
   - `MP_ACCESS_TOKEN`: tu Access Token de Mercado Pago (empezá con el de
     `TEST-` para probar el despliegue sin plata real).
   - `PUBLIC_URL`: dejalo vacío por ahora — recién lo vas a saber
     después del primer deploy (paso 6).
   - `FRONTEND_URL` (opcional): la URL de tu sitio publicado (ej.
     `https://lucasalvarez99.github.io`), para que solo tu sitio pueda
     usar este backend. Si no lo cargás, acepta pedidos de cualquier lado
     (más simple para arrancar, menos restrictivo).
5. Deploy. Render te va a dar una URL pública tipo
   `https://wizardco-backend.onrender.com`.
6. Volvé a las variables de entorno del servicio en Render y completá
   `PUBLIC_URL` con esa misma URL que te acaba de dar (esto es lo que
   permite que el webhook de la sección 5 funcione). Guardar reinicia el
   servicio solo.
7. Copiá esa URL a `src/data/config.js` (`PRODUCTION_API_URL`) en tu
   proyecto local, corré `npm run build` en la raíz, y subí los cambios
   (`/js` incluido) a GitHub — GitHub Pages se actualiza solo en un par
   de minutos.
8. Probá una compra de punta a punta en tu sitio publicado (sección 4,
   pero ahora desde la URL real en vez de local). Si algo falla, la
   sección 7 (troubleshooting) te dice cómo leer el error.
9. Cuando todo funcione con el Access Token de `TEST-`, volvé al panel de
   Render, cambiá `MP_ACCESS_TOKEN` por tu Access Token de **producción**
   (`APP_USR-...`) — ese es el único paso que separa "modo prueba" de
   "cobrar plata real".

**Nota sobre el plan gratis de Render:** un servicio gratis se "duerme"
después de un rato sin uso, y tarda unos 30-50 segundos en despertarse
con el primer pedido que le llega — es normal, no es un error. Si eso te
molesta para un sitio con tráfico real, Render tiene planes pagos que no
se duermen (u otras alternativas como [Railway](https://railway.app) o
[Fly.io](https://fly.io)).

## 7. Troubleshooting — "No se pudo crear la preferencia de pago"

**Si el mensaje incluye `(detalle: ...)` o menciona la Public Key:**
Mercado Pago (o este mismo backend) te está diciendo exactamente qué
está mal — leé ese detalle, casi siempre es el `MP_ACCESS_TOKEN`
incorrecto en `server/.env` (ver sección 1 de más arriba).

**Si el mensaje dice que no se pudo *contactar* al backend** (por
ejemplo, en un sitio publicado en **GitHub Pages**): revisá que
`PRODUCTION_API_URL` en `src/data/config.js` sea la URL real de tu
backend ya desplegado (sección 6) y que hayas corrido `npm run build`
después de cambiarla. GitHub Pages solo sirve archivos estáticos
(HTML/CSS/JS) — **no puede ejecutar este servidor de Node bajo ningún
concepto**, por eso `config.js` necesita apuntar a un backend desplegado
aparte (Render u otro), nunca a `localhost`.

Mientras `PRODUCTION_API_URL` siga con el valor de ejemplo
(`TU-BACKEND.onrender.com`), el pago **solo va a funcionar en tu propia
máquina** (porque ahí `config.js` usa `localhost:4000` en su lugar) —
nunca para otra persona que entre a tu sitio publicado.
