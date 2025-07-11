require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Añadir para seguridad
const rateLimit = require('express-rate-limit'); // Añadir para limitar peticiones
const connectDB = require('./config/db');

// Inicializar la aplicación
const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de rate limiting (protección contra ataques DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones por IP
});

// Middleware
app.use(helmet()); // Seguridad HTTP headers
app.use(limiter); // Aplicar rate limiting
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Reemplaza con tu URL de frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Si usas cookies/tokens
}));
app.use(express.json({ limit: '10kb' })); // Limitar tamaño de JSON

// Rutas
app.use('/api/posts', require('./routes/posts'));

// Middleware para manejo de errores (añadir al final)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);