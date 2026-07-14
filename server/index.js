/**
 * server/index.js
 *
 * Backend mínimo para procesar pagos REALES con Mercado Pago Checkout Pro.
 * Existe porque el access token de Mercado Pago es secreto y JAMÁS puede
 * vivir en código de frontend (cualquiera que abra las devtools lo vería).
 *
 * Flujo:
 *  1. El frontend llama a POST /api/create-preference con el carrito.
 *  2. Este servidor crea la preferencia en Mercado Pago (usando el access
 *     token secreto) y devuelve la URL de pago (init_point).
 *  3. El frontend redirige al usuario a esa URL — ahí paga de verdad,
 *     con tarjeta, transferencia o dinero en cuenta. Ni este servidor ni
 *     el frontend ven el número de tarjeta/cuenta en ningún momento.
 *  4. Mercado Pago confirma el pago llamando a POST /api/webhook (esto
 *     pasa del lado del servidor, sin depender de que el usuario vuelva
 *     al navegador — así se puede confirmar una venta aunque cierre la
 *     pestaña antes de volver).
 *
 * Persistencia: para esta demo los pedidos confirmados por webhook se
 * guardan en un archivo JSON (orders.json). En producción esto debería
 * ser una base de datos real (Postgres, MongoDB, etc.).
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

const ORDERS_FILE = path.join(__dirname, "orders.json");
const PORT = process.env.PORT || 4000;
const TOKEN = process.env.MP_ACCESS_TOKEN || "";

// Tanto la Public Key como el Access Token empiezan con "TEST-" o "APP_USR-",
// así que el prefijo NO alcanza para distinguirlos — es el error más común al
// configurar esto. La Public Key tiene forma de UUID corto
// (APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx); el Access Token es más
// largo, con grupos numéricos (APP_USR-NNNNNNNN...-NNNNNN-hash-NNNNNNNNN).
const LOOKS_LIKE_PUBLIC_KEY = /^(TEST-|APP_USR-)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

if (!TOKEN) {
  console.warn(
    "\n[WizardCo] ⚠ Falta MP_ACCESS_TOKEN en server/.env — copiá server/.env.example a server/.env y completá tu access token real (podés arrancar con uno de PRUEBA).\n"
  );
} else if (LOOKS_LIKE_PUBLIC_KEY.test(TOKEN)) {
  console.warn(
    "\n[WizardCo] ⚠ El MP_ACCESS_TOKEN configurado tiene forma de PUBLIC KEY (formato UUID corto), no de Access Token.\n" +
      "           En el panel de Mercado Pago son dos campos separados: 'Public Key' y 'Access Token'.\n" +
      "           Necesitás el segundo (es más largo, con números). Fijate en Credenciales de producción/prueba.\n"
  );
}

const mpClient = new MercadoPagoConfig({ accessToken: TOKEN });

const app = express();
app.use(cors());
app.use(express.json());

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

/* ---------------------------------------------------------------------- */
/* Crear preferencia de pago (esto es lo que dispara Checkout Pro)         */
/* ---------------------------------------------------------------------- */
app.post("/api/create-preference", async (req, res) => {
  try {
    const { items, payer, external_reference, back_urls } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }
    if (!back_urls || !back_urls.success || !back_urls.failure || !back_urls.pending) {
      return res.status(400).json({ error: "Faltan back_urls (success/failure/pending)." });
    }

    const preference = new Preference(mpClient);

    const body = {
      items: items.map((i) => ({
        title: String(i.title).slice(0, 256),
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        currency_id: "ARS",
      })),
      payer: payer ? { email: payer.email, name: payer.name } : undefined,
      external_reference,
      back_urls,
      // auto_return solo funciona con URLs https públicas (no localhost).
      auto_return: back_urls.success.startsWith("https://") ? "approved" : undefined,
      notification_url: process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/api/webhook` : undefined,
    };

    const result = await preference.create({ body });

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (err) {
    // Mercado Pago devuelve el motivo real en err.cause (array de
    // {code, description}) — lo mostramos en la consola del servidor
    // (nunca contiene datos secretos, son errores de validación) para
    // poder diagnosticar rápido qué está fallando.
    const causeDetail = Array.isArray(err.cause) ? err.cause.map((c) => c.description || c.code).join(" | ") : null;
    console.error("[WizardCo] Error creando preferencia:", err.message, causeDetail || "");

    if (LOOKS_LIKE_PUBLIC_KEY.test(TOKEN)) {
      return res.status(500).json({
        error: "El MP_ACCESS_TOKEN configurado parece ser tu Public Key, no tu Access Token. Son dos campos distintos en el panel de Mercado Pago — revisá server/.env.",
      });
    }

    res.status(500).json({
      error: "No se pudo crear la preferencia de pago. Revisá el MP_ACCESS_TOKEN en server/.env.",
      details: causeDetail || err.message || undefined,
    });
  }
});

/* ---------------------------------------------------------------------- */
/* Webhook: Mercado Pago llama acá solo cuando cambia el estado de un pago */
/* ---------------------------------------------------------------------- */
app.post("/api/webhook", async (req, res) => {
  try {
    const topic = req.query.topic || req.body.type;
    const paymentId = req.query["data.id"] || (req.body.data && req.body.data.id);

    if (topic === "payment" && paymentId) {
      const payment = new Payment(mpClient);
      const info = await payment.get({ id: paymentId });

      const orders = readOrders();
      orders.unshift({
        id: `WZ-${paymentId}`,
        date: new Date().toISOString(),
        status: info.status, // approved | pending | rejected | etc.
        externalReference: info.external_reference,
        amount: info.transaction_amount,
        payerEmail: info.payer && info.payer.email,
      });
      writeOrders(orders);

      console.log(`[WizardCo] Pago ${paymentId} → estado: ${info.status}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("[WizardCo] Error en webhook:", err.message);
    // Devolvemos 200 igual: si no, Mercado Pago reintenta indefinidamente.
    res.sendStatus(200);
  }
});

/* Lectura simple de los pedidos confirmados por webhook (para debug/uso interno). */
app.get("/api/orders", (req, res) => {
  res.json(readOrders());
});

app.get("/", (req, res) => {
  res.send("WizardCo backend de pagos — OK. Ver /server/README.md para configurarlo.");
});

app.listen(PORT, () => {
  console.log(`WizardCo backend de pagos escuchando en http://localhost:${PORT}`);
});
