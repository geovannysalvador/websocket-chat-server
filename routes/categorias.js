const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { crearCategoria, 
        optemerCategorias, 
        optemerCategoria, 
        actualizarCategoria, 
        eliminarCategoria, } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');



const router = Router();


// rutas 

// Obtener todas las categorias - PUBLICO
router.get('/', [
    // No hay validaciones por ser publico
],optemerCategorias)


// Obtener una categoria por id - PUBLICO
router.get('/:id', [
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
],optemerCategoria)


// Crear una nueva categoria - PRIVADO - Que tenga token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    ], crearCategoria)


// Actualizar un registro por id - TOKEN VALIDO - PRIVADO
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    validarCampos,
],actualizarCategoria)


// Borrar una categoria - PRIVADO - solo ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
],eliminarCategoria)


module.exports = router;