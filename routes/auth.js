const { Router } = require('express');

const { login, googleSingIn, } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// rutas 

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
],
 login);

 router.post('/google', [
    check('id_token', 'Es necessario el id_Token').not().isEmpty(),
    validarCampos,
],
googleSingIn);

module.exports = router;