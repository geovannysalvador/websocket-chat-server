const { response, request } = require('express');
const jwt = require('jsonwebtoken');
// Importar modelo 
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    // Para leer lo header es usar la req
    const token = req.header('x-token');
    // Si no viene no ejecuta nada mas de la opcion de delete
    if(!token){
        return res.status(401).json({
            msg: 'No hay autorizacion - no hay token de acceso'
        });
    }

    try {
        // Ver el token y la firma
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // leer el user que corresponda al uuid
        // Basicamente crear para que me devuelva que usuario es el que esta activo y borrara 
        const usuario = await Usuario.findById(uid);
        // validacion por si me muestra undefine/es decir no existe por que se elimino completamente
        if (!usuario) {
        return res.status(401).json({
        msg: 'El usuario no existe en la BD'
        })
        }
        // Verificar si el Uid tiene estado en tru o false para que no haga acciones
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'El usuario esta en estado false'
            })
        }

        // Lo almacenamos en la rq.usuario para extraerla en el apartado de delete
        req.usuario = usuario;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'No hay autorizacion-token no valido'
        })
    }


    
}

module.exports = {
    validarJWT
}