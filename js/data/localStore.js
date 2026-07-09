/* src/data/localStore.js — helper de persistencia en el navegador (localStorage).
   No requiere backend. Los datos quedan guardados en ESE navegador únicamente. */

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Almacenamiento no disponible (modo privado, cuota llena, etc.) — se ignora.
  }
}

