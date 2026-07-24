const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

// rutas
const customerRoutes = require('./routes/enrutador');

// settings
app.set('port', process.env.PORT || 3000);

// 🔥 MIDDLEWARES CLAVE (ANTES DE RUTAS)
app.use(cors({
  origin: [
    "http://localhost:5173", // local
    "https://proyectohotelero.onrender.com" // producción
  ],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json()); // 🔥 IMPORTANTE (para React)
app.use(express.urlencoded({ extended: true }));

// rutas API
app.use('/api', customerRoutes);

// servidor
app.listen(app.get('port'), () => {
    console.log('Servidor corriendo en puerto', app.get('port'));
});
