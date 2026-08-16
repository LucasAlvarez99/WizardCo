/* src/data/api.js
   Helper compartido para llamar a la API del backend (fetch + manejo de
   errores consistente). Usado por AuthContext y AdminDataContext. */

function apiNetworkErrorMessage(err) {
  if (err instanceof TypeError) {
    return `No se pudo contactar al backend en ${API_BASE_URL}. Si estás en local, revisá que corriste "npm start" dentro de /server. Si este sitio está desplegado, revisá API_BASE_URL en src/data/config.js.`;
  }
  return err.message || "Ocurrió un error inesperado.";
}

/**
 * apiRequest(path, { method, body, token })
 * - Arma la URL con API_BASE_URL, manda/recibe JSON.
 * - Si hay token, agrega el header Authorization: Bearer.
 * - Tira un Error con el mensaje del servidor (o uno de red) si falla.
 */
async function apiRequest(path, { method = "GET", body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error(apiNetworkErrorMessage(err));
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}.`);
  }

  return data;
}
