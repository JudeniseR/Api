
var aplicacion = require('./aplicacion')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3000;


// Configuración del límite de tamaño
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(cors());

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // <- necesario para algunos navegadores/proxies
};

app.use(cors(corsOptions));




// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});


//POST para login de usuarios
app.post('/login/', (req,res)  => {
    var usuario = req.body;
    aplicacion.loginUsuario(usuario, res);
    console.log(res);
});

//POST para el registro
app.post('/registro', (req, res) => {

    var usuario = req.body;

    console.log(req.headers.authorization);

    aplicacion.insertar(usuario, res);
    
})

app.post('/obtener_productos', (req, res) => {

    var producto = req.body;

    aplicacion.obtener_productos(producto, res);
    
})

app.post('/actualizar_producto', (req, res) => {

    var producto = req.body;

    aplicacion.actualizar_producto(producto, res);
    
})

app.post('/crear_producto', (req, res) => {

    var producto = req.body;

    aplicacion.crear_producto(producto, res);
    
})
app.post('/eliminar_producto', (req, res) => {

    var producto = req.body;

    aplicacion.eliminar_producto(producto, res);
    
})


app.post('/crear_factura', (req, res) => {

    var factura = req.body;

    aplicacion.crear_factura(factura, res);
    
})

