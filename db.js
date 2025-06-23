import('cors');
var mysql = require('mysql');

var conexion = mysql.createConnection({
    host: 'mysql.db.mdbgo.com',
    user: 'julieta_denise_r_julirojas',
    password: 'Juli1234*',
    database: 'julieta_denise_rojas_dbjuli',
    port: 3306
});


function conectar(){

    conexion.connect(function(err){
        if(err) console.log(err);
        else
        console.log('conexion exitosa');
    })

}

exports.buscarPersonas= function(usuario,respuesta){
    conectar();

    const sql ='SELECT * FROM usuarios WHERE user = ? AND password = ?;'
    const values = [usuario.user, usuario.password];
    conexion.query(sql, values, function(err, resultado, filas){
        if(err) throw err;
        console.log(resultado);
        respuesta(resultado);
    });
}


exports.verificarUsuarioExistente = function (usuario, callback) {
        conectar();

        const sql = "SELECT * FROM usuarios WHERE user = ? AND password = ? OR mail = ?";
        const values = [usuario.user, usuario.password, usuario.mail];

        conexion.query(sql, values, function (err, results) {

            if (err) {
                return callback(err);
            }

            if (results.length > 0) {
                return callback(null, true); // Usuario y password ya existen
            } else {
                return callback(null, false); // Usuario y password no existen
            }
        });  
};

exports.registrarPersona = function(usuario, respuesta) {
    conectar();

    const sql = `
        INSERT INTO usuarios (nombre, apellido, mail, fechaNacimiento, user, password, tipoUsuario)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        usuario.nombre,
        usuario.apellido,
        usuario.mail,
        usuario.fechaNacimiento,
        usuario.user,
        usuario.password,
        usuario.tipoUsuario
    ];

    conexion.query(sql, values, function(err, result) {
        if (err) {
            console.error('Error al registrar usuario:', err);

            return respuesta({ success: false, mensaje: 'Error al registrar usuario', error: err });
        }

        respuesta({ success: true, mensaje: 'Usuario registrado correctamente', id: result.insertId });
    });
};

exports.obtenerProductos = function(producto, respuesta){
    conectar();

    const sql = "SELECT * FROM productos";


    conexion.query(sql, function (err, resultado) {
        if(err) throw err;
        console.log(resultado);
        respuesta(resultado);
    });
}

exports.actualizarProducto = function(producto, respuesta){
    conectar();

    const sql = "UPDATE productos SET nombre = ?, descripcion = ?, precioA = ?, categoria = ?, imagen = ? WHERE id = ? ";
    const values = [producto.nombre, producto.descripcion, producto.precioArs, producto.categoria, producto.imagen, producto.id];


    conexion.query(sql, values, function (err, resultado) {
        if(err) throw err;
        console.log(resultado);
        respuesta(resultado);
    });
}

exports.crearProducto = function(producto, respuesta){
    conectar();

    const sql = "INSERT INTO productos (nombre, descripcion, precioArs, categoria, imagen) VALUES (?, ?, ?, ?, ?)";
    const values = [producto.nombre, producto.descripcion, producto.precioArs, producto.categoria, producto.imagen];
    conexion.query(sql, values, function (err, resultado) {
        if(err) throw err;
        console.log(resultado);
        respuesta(resultado);
    });
}

exports.eliminarProducto= function(producto, respuesta){
    conectar();

    const sql = "DELETE FROM productos WHERE id = ?";
    const values = [producto.id];


    conexion.query(sql, values, function (err, resultado) {
        if(err) throw err;
        console.log(resultado);
        respuesta(resultado);
    });
}

exports.crearFactura= function(factura, respuesta){
    conectar();

    const sql = "INSERT INTO producto_factura(cantidad,precio_unitario,total_ars,total_usd,cotizacion_usd,fecha_cotizacion) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [factura.cantidad,factura.precio_unitario,factura.total_ars,factura.total_usd,factura.cotizacion_usd,factura.fecha_cotizacion];


    conexion.query(sql, values, function (err, resultado) {
        if(err) throw err;
        console.log(resultado);
        respuesta(resultado);
    });
}