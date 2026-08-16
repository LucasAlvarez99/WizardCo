/**
 * build.js
 * Precompila todo lo que está en /src (incluye JSX) a JavaScript plano en /js,
 * preservando la misma estructura de carpetas. No arma un bundle único:
 * cada archivo sigue siendo un archivo aparte, así se mantiene fácil de tocar.
 *
 * Uso:
 *   npm install
 *   npm run build
 */
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

const SRC_DIR = path.join(__dirname, "src");
const OUT_DIR = path.join(__dirname, "js");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (/\.(jsx?|JSX?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function build() {
  const files = walk(SRC_DIR);
  let count = 0;

  for (const file of files) {
    const relative = path.relative(SRC_DIR, file);
    const outPath = path.join(OUT_DIR, relative).replace(/\.jsx$/, ".js");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    const isJsx = file.endsWith(".jsx");
    const source = fs.readFileSync(file, "utf8");

    let output;
    if (isJsx) {
      const result = babel.transform(source, {
        presets: [["@babel/preset-react", { pragma: "React.createElement" }]],
        sourceType: "script",
        babelrc: false,
        configFile: false,
        filename: file,
      });
      output = result.code;
    } else {
      output = source; // .js plano: se copia tal cual
    }

    fs.writeFileSync(outPath, output + "\n");
    count++;
  }

  console.log(`Build OK: ${count} archivos compilados de /src a /js`);
}

build();
