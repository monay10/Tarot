// Copies the web app (site root) into www/ for Capacitor native builds.
// The repo root stays the source of truth (also served by GitHub Pages).
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WWW = path.join(ROOT, "www");

const ITEMS = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "css",
  "fonts",
  "icons",
  "js"
];

fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });

for (const item of ITEMS) {
  const src = path.join(ROOT, item);
  if (!fs.existsSync(src)) {
    console.warn("atlandi (yok):", item);
    continue;
  }
  fs.cpSync(src, path.join(WWW, item), { recursive: true });
}

console.log("www/ hazir (" + ITEMS.join(", ") + ")");
