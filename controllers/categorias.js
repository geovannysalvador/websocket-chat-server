// Se importa porque no sabe que es res por ello se coloca res = response. Aunque sea redundante
const { response, request } = require('express');
const { Categoria } = require('../models');


const optemerCategorias = async (req = request, res = response) => {

    const {limite = 5, desde = 0 } = req.query;

    // Ambos await deben de ir juntos ya que no depende uno del otro para continuar 
    // No continua hastq que ambas funciones y se ejecutan ambas
    // const resp = await Promise.all([
        const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado: true }),
        Categoria.find({estado: true })
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    // res.json({resp});
    res.json({
        total,
        categorias,
    })

}

const optemerCategoria = async (req = request, res = response) => {

    const {id} = req.params;
    const categoria =  await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
}

const crearCategoria = async (req = request, res = response) => {

    // Extraer el nombre que viene de la req.body y grabarlo en mayuscula 
    const nombre = req.body.nombre.toUpperCase();
    // ver si existe la misma
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria: ${categoriaDB.nombre}, Ya existe`
        });
    }

    // Generar la Data para guardar
    const data ={
        nombre,
        // Recopilamos la info del usuario activo no de lo que me manden.
        usuario: req.usuario._id
    }

    // Grabar fisicamente en la BD
    const categoria =  await new Categoria(data);
    await categoria.save(); 

    res.status(201).json(categoria);
}

const actualizarCategoria = async (req = request, res = response) => {

        // En la ruta de indico que es ID y se obtoene de la siguiente forma
        const {id} = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        // Id del usuario y due;o del toquen para saber quien lo modifico
        data.usuario = req.usuario._id;

        const categoria =  await Categoria.findByIdAndUpdate(id, data, {new: true}).populate('usuario', 'nombre'); 
        
        res.json({
            msg: 'Categoria actualizada',
            categoria
        });

}

const eliminarCategoria = async (req = request, res = response) => {

    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false }, {new: true}).populate('usuario', 'nombre');
    // Solo asignamos usuarioAtuthenticado que conteta la info de la req.usuario para luego mostrarla
    // const usuarioAtuthenticado = req.usuario;

    res.json({
        msg: 'Categoria eliminada',
        categoria,
    });

}


module.exports = {
    optemerCategorias,
    optemerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}