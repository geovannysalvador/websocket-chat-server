const { response, request, } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require('../models')


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productos-por-categoria',
    'roles',
];

const buscarUsuarios = async ( termino ='', res = response ) => {

    // VEr si el termino es un mongo ID
    const esMongoID = ObjectId.isValid( termino ); //manda un true o false

    if( esMongoID ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    // Busquedas sensibles usar una expresion regular
    const regex = new RegExp( termino, 'i' );
    // const usuarios = await Usuario.find({ nombre: termino });
    const usuarios = await Usuario.find({ 
        // aca colocar todos los terminos de busqueda que quiera
        $or: [
            {nombre: regex},
            {correo: regex},
        ],
        // Condicion de busqueda para que solo busque los que estan activos
        $and: [
            {estado: true}
        ]
     });

        res.json({
            results: usuarios
        });

}

const buscarCategorias = async ( termino ='', res = response ) => {

    // VEr si el termino es un mongo ID
    const esMongoID = ObjectId.isValid( termino ); //manda un true o false

    if( esMongoID ){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    // Busquedas sensibles usar una expresion regular
    const regex = new RegExp( termino, 'i' );
    // const usuarios = await Usuario.find({ nombre: termino });
    const categorias = await Categoria.find({nombre: regex, estado: true});

        res.json({
            results: categorias
        });

}

const buscarProductos = async ( termino ='', res = response ) => {

        // VEr si el termino es un mongo ID
        const esMongoID = ObjectId.isValid( termino ); //manda un true o false

        if( esMongoID ){
            // Colocar el populate para ver mejor la respuesta
            const producto = await Producto.findById(termino)
                .populate('categoria', 'nombre');

            return res.json({
                results: (producto) ? [producto] : []
            });
        }
    
        // Busquedas sensibles usar una expresion regular
        const regex = new RegExp( termino, 'i' );
        // const usuarios = await Usuario.find({ nombre: termino });
        const productos = await Producto.find({nombre: regex, estado: true})
            .populate('categoria', 'nombre');
    
            res.json({
                results: productos
            });

}

const buscarProductosPorCategoria = async (termino = '', res = response) => {

    // VEr si el termino es un mongo ID
    const esMongoID = ObjectId.isValid( termino ); //manda un true o false

    if( esMongoID ){
        const producto = await Producto.find({ categoria: termino, estado: true })
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

     // Busquedas sensibles usar una expresion regular
     const regex = new RegExp( termino, 'i' );
     const categoria = await Categoria.findOne({ nombre: regex });
        if (categoria) {
        const objectId = categoria._id;
        console.log('ObjectId del primer resultado:', objectId);
        } else {
        console.log('No se encontró ninguna categoría con ese nombre');
        }
     // const usuarios = await Usuario.find({ nombre: termino });
     const productos = await Producto.find({categoria: categoria._id})
         .populate('categoria', 'nombre');
 
         res.json({
             results: productos
         });
   
};



const buscar = (req = request, res = response) => {

    const {coleccion, termino} = req.params;
    // verificar si esta en la ccoleccion permitida
    if (!coleccionesPermitidas.includes(coleccion) ) {
        return res.status(400).json({
            msg: `Las permitidas son: ${coleccionesPermitidas} `
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
            
        break;
        case 'productos-por-categoria':
            buscarProductosPorCategoria(termino, res);
            
        break;
    
        default:
            res.status(500).json({
                msg: 'La busqueda no esta en la BD'
            })
    }
    

}


module.exports = {
    buscar
}