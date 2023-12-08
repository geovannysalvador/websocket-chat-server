const { Router } = require('express');

const { check } = require('express-validator');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCoudinary, mostrarImagenCloudinary,  } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

// rutas 

router.post('/', [
    validarArchivoSubir,
] , cargarArchivos);
// ] , cargarArchivosCloudinary);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El Id debe de ser un Id de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])) ,
    validarCampos,
// ], actualizarImagen);
], actualizarImagenCoudinary);


router.get('/:coleccion/:id', [
    check('id', 'El Id debe de ser un Id de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])) ,
    validarCampos,
// ], mostrarImagen);
], mostrarImagenCloudinary);


module.exports = router;