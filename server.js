// server.js
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const next = require("next");
const cors = require("cors");

// Configuración de Next.js
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Configuración de Express
const server = express();
server.use(cors()); // Habilitar CORS

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Ruta para obtener cervezas
server.get("/api/cervezas", (req, res) => {
  db.query(
    "SELECT nombre, tipo, precio FROM cervezas WHERE cerveceria_id=2",
    (err, results) => {
      if (err) {
        console.error("Error al hacer la consulta:", err);
        return res.status(500).send("Error al obtener los datos");
      }
      res.json(results); // Enviar los resultados como JSON
    }
  );
});

// Ruta para obtener elementos del menú
server.get("/api/menu-items", (req, res) => {
  db.query(
    "SELECT nombre, descripcion, precio FROM menu_items",
    (err, results) => {
      if (err) {
        console.error("Error al hacer la consulta:", err);
        return res.status(500).send("Error al obtener los datos");
      }
      res.json(results); // Enviar los resultados como JSON
    }
  );
});

// Servir las páginas de Next.js
server.all("*", (req, res) => {
  return handle(req, res);
});

// Iniciar el servidor
app.prepare().then(() => {
  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log("> Servidor listo en http://localhost:3000");
  });
});
