/**
 * utils/email.js
 *
 * Envío del código de verificación de cuenta por email real, vía Resend.
 * Si RESEND_API_KEY no está configurada, no rompe el resto del backend:
 * devuelve un error claro que el service de arriba puede mostrarle al
 * usuario, en vez de tirar una excepción no controlada.
 */

const { Resend } = require("resend");

let resendClient = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

async function sendVerificationEmail({ to, code }) {
  const client = getClient();
  if (!client) {
    throw new Error(
      "Falta RESEND_API_KEY en server/.env — no se puede enviar el email de verificación (ver server/.env.example)."
    );
  }

  const from = process.env.RESEND_FROM_EMAIL || "WizardCo <onboarding@resend.dev>";

  const { error } = await client.emails.send({
    from,
    to,
    subject: `${code} es tu código de verificación de WizardCo`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verificá tu cuenta de WizardCo</h2>
        <p>Usá este código para confirmar tu email:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p style="color: #666; font-size: 13px;">Este código vence en 15 minutos. Si no pediste esto, ignorá este email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("[WizardCo] Error enviando email con Resend:", error);
    throw new Error("No se pudo enviar el email de verificación. Intentá de nuevo en unos minutos.");
  }
}

module.exports = { sendVerificationEmail };
