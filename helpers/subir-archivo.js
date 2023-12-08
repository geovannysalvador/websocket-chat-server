const path = require('path')
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionValida = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {
    // Trabajar en promesas cuando necesito saber que algo salga bien o mal 

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        // formato para separar despues de un punto
        const nombrecortado = archivo.name.split('.');

        // Extraer la extension 
        const extension = nombrecortado[nombrecortado.length - 1];

        // validar extension
        if (!extensionValida.includes(extension)) {
            return reject(`La extension: ${extension} no es permitida`);
        }


        const nombreTemporal = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }

            // resolve(uploadPath);
            resolve(nombreTemporal);

        });

    });


}



module.exports = {
    subirArchivo
}