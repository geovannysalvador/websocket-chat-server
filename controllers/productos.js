// Se importa porque no sabe que es res por ello se coloca res = response. Aunque sea redundante
const { response, request } = require('express');
const { Producto } = require('../models');
const { body } = require('express-validator');

const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    // Ambos await deben de ir juntos ya que no depende uno del otro para continuar 
    // No continua hastq que ambas funciones y se ejecutan ambas
    // const resp = await Promise.all([
    const [total, productos] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    // res.json({resp});
    res.json({
        total,
        productos,
    })

}

const obtenerProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async (req = request, res = response) => {

    // Extraer el nombre que viene de la req.body y grabarlo en mayuscula 
    const { estado, usuario, ...body } = req.body;
    // ver si existe la misma
    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto: ${productoDB.nombre}, Ya existe`
        });
    }

    // Generar la Data para guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        // Recopilamos la info del usuario activo no de lo que me manden.
        usuario: req.usuario._id
    }

    // Grabar fisicamente en la BD
    const producto = await new Producto(data);
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async (req = request, res = response) => {

    // En la ruta de indico que es ID y se obtoene de la siguiente forma
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    // Id del usuario y due;o del toquen para saber quien lo modifico
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true }).populate('usuario', 'nombre');

    res.json({
        msg: 'Producto actualizado',
        producto
    });

}

const eliminarProducto = async (req = request, res = response) => {

    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false }, {new: true}).populate('usuario', 'nombre');

    res.json({
        msg: 'Producto eliminada',
        producto,
    });

}



module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
}