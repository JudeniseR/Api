var db = require('./db');

exports.loginUsuario = function(usuario,res){
    db.buscarPersonas(usuario,datos => {
        res.json(validarusuario(datos,usuario))
     } );
 }


function validarusuario(datos, usuario) {
    for (let i = 0; i < datos.length; i++) {
        let element = datos[i];
        if (element.usuario == usuario.usuario && element.password == usuario.password) {
            // Devuelve los datos del usuario autenticado directamente
            return datos[i];
        }
    }
    // Si no se encuentra el usuario o la contraseña no coincide
    return null;
}


exports.insertar = function (usuario, res) {

    db.verificarUsuarioExistente(usuario, function (err, existe) {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (existe) {
            return res.status(400).json({ error: 'Usuario con el mismo usuario y password ya existe' });
        }

        db.registrarPersona(usuario, datos => {
            res.json(datos);
        });
    });
}

exports.obtener_productos = function(producto,res){

    db.obtenerProductos(producto, datos => {
        res.json(datos);
    });

}

exports.actualizar_producto = function(producto,res){

    db.actualizarProducto(producto, datos => {
        res.json(datos);
    });

}

exports.crear_producto = function(producto,res){

    db.crearProducto(producto, datos => {
        res.json(datos);
    });

}

exports.eliminar_producto= function(producto,res){

    db.eliminarProducto(producto, datos => {
        res.json(datos);
    });

}

exports.crear_factura= function(factura,res){

    db.crearFactura(factura, datos => {
        res.json(datos);
    });

}