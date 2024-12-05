const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();


// Middleware para manejar JSON
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Definición del modelo de tarea
const tareaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

// Rutas básicas
app.get('/', (req, res) => {
    res.send('¡Hola desde el backend en Vercel!');
});

app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Hola, este es un endpoint de la API!' });
});

// Ruta para obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
    try {
        const tareas = await Tarea.find();  // Aquí "Tarea" es el modelo de tu colección
        res.json(tareas);  // Devuelve las tareas como respuesta en formato JSON
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener las tareas' });
    }
});

// Ruta para obtener una tarea por ID
app.get('/api/tareas/:id', async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
});

// Ruta para crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
    try {
        const nuevaTarea = new Tarea(req.body);
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la tarea' });
    }
});

// Ruta para actualizar una tarea por ID
app.put('/api/tareas/:id', async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tareaActualizada) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json(tareaActualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la tarea' });
    }
});

// Ruta para eliminar una tarea por ID
app.delete('/api/tareas/:id', async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
        if (!tareaEliminada) return res.status(404).json({ error: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
