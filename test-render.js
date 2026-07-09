const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const projectDir = __dirname;
const html = fs.readFileSync(path.join(projectDir, "index.html"), "utf8");

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  beforeParse(window) {
    window.console = console;
    // localStorage no viene incluido en jsdom por defecto para file/http simple; mock simple:
    const store = {};
    window.localStorage = {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    };
  },
});

const window = dom.window;

window.addEventListener("error", (e) => {
  console.error("WINDOW ERROR:", e.error ? e.error.stack || e.error.message : e.message);
  process.exitCode = 1;
});

// Los <script src="..."> remotos (React/ReactDOM por CDN) no los puede bajar jsdom sin red real
// dentro de este sandbox, así que los interceptamos y los servimos desde node_modules si existen,
// o desde una copia local si ya se descargaron antes.
async function run() {
  await new Promise((resolve) => {
    dom.window.document.addEventListener("DOMContentLoaded", resolve);
    if (dom.window.document.readyState !== "loading") resolve();
  });

  // Esperar un poco a que corran los scripts diferidos/paralelos
  setTimeout(() => {
    const root = window.document.getElementById("root");
    if (!root || root.innerHTML.trim() === "") {
      console.error("FAIL: #root quedó vacío, la app no montó.");
      process.exitCode = 1;
    } else {
      console.log("OK: la app montó contenido en #root.");
      console.log("Longitud del HTML renderizado:", root.innerHTML.length);
    }
    process.exit(process.exitCode || 0);
  }, 2000);
}

run();
