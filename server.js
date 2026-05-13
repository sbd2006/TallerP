const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'contact_list_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('¡Conectado a la base de datos MySQL!');
});


app.get('/api/contacts', (req, res) => {
    db.query('SELECT * FROM contactos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});


app.post('/api/contacts', (req, res) => {
    const { name, lastname, sex, phone, city, address } = req.body;
    const query = 'INSERT INTO contactos (name, lastname, sex, phone, city, address) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [name, lastname, sex, phone, city, address], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, name, lastname, sex, phone, city, address });
    });
});


app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM contactos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Contacto eliminado con éxito' });
    });
});


app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const { name, lastname, sex, phone, city, address } = req.body;
    const query = 'UPDATE contactos SET name=?, lastname=?, sex=?, phone=?, city=?, address=? WHERE id=?';
    
    db.query(query, [name, lastname, sex, phone, city, address, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ id, name, lastname, sex, phone, city, address });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de la API corriendo en http://localhost:${PORT}`);
});
