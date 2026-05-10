const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON

// 1. Conexión a tu base de datos XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Usuario por defecto de XAMPP
    password: '',      // Contraseña vacía por defecto en XAMPP
    database: 'contact_list_db'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos MySQL!');
});

// --- RUTAS DE LA API ---

// Obtener todos los contactos (GET)
app.get('/contactos', (req, res) => {
    db.query('SELECT * FROM contactos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Crear un nuevo contacto (POST)
app.post('/contactos', (req, res) => {
    const { nombre, apellido, telefono } = req.body;
    const query = 'INSERT INTO contactos (nombre, apellido, telefono) VALUES (?, ?, ?)';
    
    db.query(query, [nombre, apellido, telefono], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, nombre, apellido, telefono });
    });
});

// Eliminar un contacto (DELETE)
app.delete('/contactos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM contactos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: 'Contacto eliminado' });
    });
});

// 3. Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de contactos corriendo en http://localhost:${PORT}`);
});