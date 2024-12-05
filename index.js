const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
    res.send('¡Hola desde el backend en Vercel!');
});

app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Hola, este es un endpoint de la API!' });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
