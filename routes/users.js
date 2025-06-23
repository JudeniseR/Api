// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Registrar usuario
router.post('/register', async (req, res) => {
  const { nombre, apellido, mail, fechaNacimiento, user, password, tipoUsuario } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE user = ?', [user]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    await db.query(
      'INSERT INTO usuarios (nombre, apellido, mail, fechaNacimiento, user, password, tipoUsuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, mail, fechaNacimiento, user, password, tipoUsuario]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login usuario
router.post('/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE user = ? AND password = ?',
      [user, password]
    );

    if (rows.length === 0) {
      return res.status(401).json(null);
    }

    const usuario = rows[0];
    res.json(usuario); // devolvemos los datos del usuario
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;
