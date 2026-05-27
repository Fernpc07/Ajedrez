const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos (TiDB Cloud o local)
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'AfRoot',
  database: process.env.DB_NAME || 'ajedrez_real',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.DB_SSL_CA ? { ca: fs.readFileSync(process.env.DB_SSL_CA) } : undefined
});

// ------------------- RUTAS DE PÁGINAS -------------------

// Servir carpetas estáticas
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Servir carpeta pages directamente (para acceder con /pages/archivo.html)
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Ruta raíz → index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Ruta limpia para torneos
app.get('/torneos', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'torneos.html'));
});

// Ruta limpia para jugadores
app.get('/jugadores', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'jugadores.html'));
});

// ------------------- RUTAS API -------------------

// Obtener torneos
app.get('/api/torneos', (req, res) => {
  db.query('SELECT * FROM torneos ORDER BY fecha_inicio ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ranking de jugadores
app.get('/api/jugadores/ranking', (req, res) => {
  db.query(
    'SELECT nombre,nivel,elo,pais FROM jugadores WHERE activo=1 ORDER BY elo DESC LIMIT 20',
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Registrar jugador
app.post('/api/jugadores', (req, res) => {
  const { nombre, email, telefono, edad, nivel } = req.body;
  const sql = `INSERT INTO jugadores (nombre,email,telefono,edad,nivel)
               VALUES (?,?,?,?,?)`;
  db.query(sql, [nombre, email, telefono, edad, nivel], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: result.insertId, mensaje: 'Jugador registrado' });
  });
});

// ------------------- INICIO DEL SERVIDOR -------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
