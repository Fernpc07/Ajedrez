const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'AfRoot',
    database: process.env.DB_NAME || 'ajedrez_real',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

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
    const { nombre, email, telefono, edad, nivel, modalidad } = req.body;
    const sql = `INSERT INTO jugadores (nombre,email,telefono,edad,nivel)
               VALUES (?,?,?,?,?)`;
    db.query(sql, [nombre, email, telefono, edad, nivel], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: result.insertId, mensaje: 'Jugador registrado' });
    });
});

app.listen(3000, () => console.log('🟢 Servidor en http://localhost:3000'));