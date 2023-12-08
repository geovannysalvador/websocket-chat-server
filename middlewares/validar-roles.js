const { request, response } = require("express")


const esAdminRole = (req = request, res= response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere validar el rol sin validar el token primero'
        });
    }

    const {rol, nombre} = req.usuario ;

    if( rol !== 'ADMIN'){
        return res.status(401).json({
            msg: `El usuario: ${nombre} no esta autorizado`
        });
    }

    next();

}

const elRolEs = ( ...roles ) => {

    return (req = request, res= response, next) => {

        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere validar el rol sin validar el token primero'
            });
        }

        // Verifico que el rol del usuario logueado tenga el rol que determine en el middleware
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El usuario no tiene estos roles: ${roles}`
            })
        }

        next();

    }

}


module.exports = {
    esAdminRole,
    elRolEs,
}