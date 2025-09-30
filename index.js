// index.js
const aplicacion = require('./aplicacion');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const reportesRoutes = require('./routes/reportes'); // 👈 router de reportes

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Body parsers ----------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

// ---------- CORS ----------
const allowList = new Set([
  'https://j-angular.web.app', // tu frontend en producción
]);

const corsOptions = {
  origin: [
    'https://j-angular.web.app',
    'http://localhost:4200',
    'http://localhost:4300',
    'http://localhost:62763' // <— tu puerto actual
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); 
// ---------- Rutas montadas ----------
app.use('/api/users', userRoutes);
app.use('/api/reportes', reportesRoutes); // 👈 /api/reportes/*

// ---------- Endpoints legacy (usan módulo "aplicacion") ----------
app.post('/login/', (req, res) => {
  const usuario = req.body;
  aplicacion.loginUsuario(usuario, res);
});

app.post('/registro', (req, res) => {
  const usuario = req.body;
  aplicacion.insertar(usuario, res);
});

app.post('/obtener_productos', (req, res) => {
  const producto = req.body;
  aplicacion.obtener_productos(producto, res);
});

app.post('/actualizar_producto', (req, res) => {
  const producto = req.body;
  aplicacion.actualizar_producto(producto, res);
});

app.post('/crear_producto', (req, res) => {
  const producto = req.body;
  aplicacion.crear_producto(producto, res);
});

app.post('/eliminar_producto', (req, res) => {
  const producto = req.body;
  aplicacion.eliminar_producto(producto, res);
});

app.post('/crear_factura', (req, res) => {
  const factura = req.body;
  aplicacion.crear_factura(factura, res);
});

// (opcional) healthcheck
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// ---------- Start ----------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend corriendo en http://0.0.0.0:${PORT}`);
});
