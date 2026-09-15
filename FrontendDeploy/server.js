// ==========================================================
// Servidor estático mínimo para publicar el build de Vite
// (carpeta dist/) en Azure App Service con stack Node.
//
// ¿Por qué hace falta? App Service con Node NO sirve archivos
// estáticos por sí solo, y pm2 (que antes se usaba con
// "pm2 serve") ya no viene incluido en Node 20/22.
//
// Este servidor hace dos cosas:
//   1. Sirve los archivos de dist/
//   2. Cualquier ruta desconocida devuelve index.html
//      (necesario para que una SPA de React funcione al
//       recargar la página en una ruta interna)
// ==========================================================

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "dist");

const app = express();

// Archivos estáticos del build
app.use(express.static(distPath));

// Fallback SPA: todo lo demás devuelve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Azure inyecta PORT automáticamente
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🌐 Frontend servido en el puerto ${PORT}`);
});
