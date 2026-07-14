/* src/data/config.js
   URL del backend (ver /server) que crea la preferencia de pago real en
   Mercado Pago.

   Detecta solo si estás en local o en el sitio publicado, así no hay que
   acordarse de cambiar nada antes de cada build:
   - En localhost/127.0.0.1 → usa tu backend local (npm start en /server).
   - En cualquier otro dominio (GitHub Pages, tu dominio propio, etc.) →
     usa la URL de producción de acá abajo.

   Editá PRODUCTION_API_URL con la URL real una sola vez, cuando despliegues
   /server (ver server/README.md, sección "Desplegar a producción"), y
   corré "npm run build" para que quede compilado en /js. */

const PRODUCTION_API_URL = "https://TU-BACKEND.onrender.com"; // 👈 reemplazar después de desplegar /server

const IS_LOCAL = ["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_BASE_URL = IS_LOCAL ? "http://localhost:4000" : PRODUCTION_API_URL;
