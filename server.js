const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a TiDB Cloud
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CA)
  }
});

// ------------------- RUTAS DE PÁGINAS -------------------
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/torneos', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'torneos.html'));
});

app.get('/jugadores', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'jugadores.html'));
});

// ------------------- RUTAS API -------------------
app.get('/api/torneos', (req, res) => {
  db.query('SELECT * FROM torneos ORDER BY fecha_inicio ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/jugadores/ranking', (req, res) => {
  db.query(
    'SELECT nombre,nivel,elo,pais FROM jugadores WHERE activo=1 ORDER BY elo DESC LIMIT 20',
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

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
