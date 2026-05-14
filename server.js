const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

require('dotenv').config(); 
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));


const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'contact_list_db'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos MySQL!');
});


app.get('/api/contacts', (req, res) => {
    const query = 'SELECT * FROM contactos';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


app.post('/api/contacts', (req, res) => {
    const { name, lastname, sex, phone, city, address } = req.body;
    
    
    if (!name || !lastname || !sex || !phone || !city || !address) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = 'INSERT INTO contactos (name, lastname, sex, phone, city, address) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, lastname, sex, phone, city, address], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});


app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const { name, lastname, sex, phone, city, address } = req.body;

    if (!name || !lastname || !sex || !phone || !city || !address) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = 'UPDATE contactos SET name=?, lastname=?, sex=?, phone=?, city=?, address=? WHERE id=?';
    db.query(query, [name, lastname, sex, phone, city, address, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.json({ id, ...req.body });
    });
});


app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM contactos WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.status(204).send();
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
