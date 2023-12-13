const { Router } = require('express');

const { login, googleSingIn, renovarToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos, validarJWT } = require('../middlewares');

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

router.get('/', validarJWT, renovarToken);

module.exports = router;