const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, elRolEs,} = require('../middlewares');


const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');

const router = Router();


// rutas 

// Obtener todas las categorias - PUBLICO
router.get('/', [
    // No hay validaciones por ser publico
],obtenerProductos);


// Obtener una categoria por id - PUBLICO
router.get('/:id', [
    check('id', 'No es un Id Mongo valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
],obtenerProducto);


// Crear una nueva categoria - PRIVADO - Que tenga token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un Id de mongo').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos,
    ], crearProducto);


// Actualizar un registro por id - TOKEN VALIDO - PRIVADO
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un Id de mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
],actualizarProducto);


// Borrar una categoria - PRIVADO - solo ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
],eliminarProducto);


module.exports = router;