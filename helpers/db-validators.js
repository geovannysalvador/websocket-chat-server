const Role = require('../models/role');
// Importar modelo 
// const Usuario = require('../models/usuario');
// Nueva forma de importarlo
const { Categoria, Usuario, Producto } = require('../models');

const esRolValido = async (rol = "") => {

    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta permitido`);
    }
}

const emaiExiste = async (correo = "") => {
    // Ver si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} esta registrado`);
    }
}

const idUsuarioExiste = async (id) => {
    // Ver si el correo existe
    const existeUsuarioId = await Usuario.findById(id);
    if (!existeUsuarioId) {
        throw new Error(`El Id: ${id} no existe`);
    }
}
// Validadores de categorias
const existeCategoria = async (id) => {
    // Ver si la categoria existe
    const existeCategoriaId = await Categoria.findById(id);
    if (!existeCategoriaId) {
        throw new Error(`El Id: ${id} no existe`);
    }
}

// Validadores de Productos
const existeProducto = async (id) => {
    // Ver si la categoria existe
    const existeProductoId = await Producto.findById(id);
    if (!existeProductoId) {
        throw new Error(`El Id: ${id} no existe`);
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{

    const incluida = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion: ${coleccion} no es permitida`)
    }

    return true;

}



module.exports = {
    esRolValido,
    emaiExiste,
    idUsuarioExiste,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas,
}