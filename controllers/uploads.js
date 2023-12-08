const path = require('path')
const fs = require('fs');

// configurar para subirlo a cloudinary y no local
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');


const cargarArchivos = async (req = request, res = response,) => {

    // Ya se uso el mismo codigo en el apartado de middlewares en el validar-archivo
    // Tambien se mando a llamar en la ruta para que verifique primero
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({
    //         msg: 'No hay archivos seleccionados'
    //     });
    //     return;
    // }


    try {
        // subir txt, md. USANDO que extesiones quiero y si quier una carpeta
        // const pathCompleto = await subirArchivo(req.files, ['txt', 'md'], 'textos' );
        // Imagenes por defecto
        const pathCompleto = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre: pathCompleto
        })

    } catch (msg) {
        res.status(400).json({ msg });
    }


}


const actualizarImagen = async (req = request, res = response) => {

    // Ya se uso el mismo codigo en el apartado de middlewares en el validar-archivo
    // Tambien se mando a llamar en la ruta para que verifique primero
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({
    //         msg: 'No hay archivos seleccionados'
    //     });
    //     return;
    // }

    const { id, coleccion, } = req.params;

    // Establecer el valor de forma condicional por ello se usa let
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            // Verificar si la coleccion tiene un ID
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }

            break;

        case 'productos':
            // Verificar si la coleccion tiene un ID
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Olvide validar esto' });
    }

    // Borrar la ultima imagen si es que existe luego subir la nueva
    // Antes de subir limpiar o borrar la img previao anterior
    // Si la propiedad existe entra dentro del:     if( modelo.img 
    if (modelo.img) {
        // verificar la img del servidor y borrarla
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // Ver si existe la imagen en si en la bd
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }

    }

    // Actualziar la imagen 
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    // Guardar en BD
    await modelo.save();

    res.json({
        modelo
    });
}

// ---------------actualizarImagenCoudinary---------------------------------------

const actualizarImagenCoudinary = async (req = request, res = response) => {

    // Es lo mismo de arriba pero con el entorno de Cloudinary

    const { id, coleccion, } = req.params;

    // Establecer el valor de forma condicional por ello se usa let
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            // Verificar si la coleccion tiene un ID
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }

            break;

        case 'productos':
            // Verificar si la coleccion tiene un ID
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Olvide validar esto' });
    }

    // Eliminar imagen de cloudinary || Eliminar la ultima y colocar la nueva para actualziarla
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        // Con el nombre ya tengo lo ultimo que me interesa (lo que me arroja postam)
        // Osea el nombre del archivo que le da cloudinary y la extension 
        const nombre = nombreArr[nombreArr.length - 1];
        // Ahora separar el nombre y la extension el public_id es de cloudinary pero puedo colocarle lo que quiera
        const [public_id] = nombre.split('.');
        // console.log(public_id);
        // Aca literalmente le mandamos el id de cloudinary y lo eliminamos
        cloudinary.uploader.destroy(public_id);
    }

    // Cuando mandamos el archivo este cuenta con un url temporal el cual usaremos
    // Parapoder crear y almacenarlo en cloudinary. Lo contiene el req.files.archivo
    const { tempFilePath } = req.files.archivo;
    // Aca para ver todo lo que me manda y en eso me manda el secure_url
    // Eso lo usaremos en lugar de la linea de abajo
    // const resp = await cloudinary.uploader.upload(tempFilePath);
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    // Guardar en BD
    await modelo.save();

    res.json({
        modelo
    });
}

const mostrarImagen = async (req = request, res = response) => {

    const { id, coleccion, } = req.params;

    // Establecer el valor de forma condicional por ello se usa let
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            // Verificar si la coleccion tiene un ID
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }

            break;

        case 'productos':
            // Verificar si la coleccion tiene un ID
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Olvide validar esto' });
    }

    if (modelo.img) {
        // verificar la img del servidor y borrarla
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // Ver si existe la imagen en si en la bd
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }

    }

    const pathNoImagen = path.join(__dirname, '../assets/noimage-220518-150756.jpg');
    res.sendFile(pathNoImagen);

}

const mostrarImagenCloudinary = async (req = request, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            break;

        default:
            return res.status(500).json({ msg: 'Olvidé validar esto' });
    }

    if (modelo.img) {
        // Construir la URL de Cloudinary
        // const imgUrl = cloudinary.url(modelo.img, { secure: true, width: 400, height: 400, crop: 'fill' });
        const imgUrl = cloudinary.url(modelo.img);
        return res.redirect(imgUrl);
    }

    const pathNoImagen = path.join(__dirname, '../assets/noimage-220518-150756.jpg');
    res.sendFile(pathNoImagen);
}

// cargamos la imagen a cloudinary y lo almacenamos en 
const subirConImagenCloudinary = async (imagen) => {

    // La imagen viene del req || from-data
    const { secure_url } = await cloudinary.uploader.upload(imagen);

    // console.log(secure_url);

    // Aca esta la URL de la imagen. 
    return secure_url;
}


module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCoudinary,
    mostrarImagenCloudinary,
    subirConImagenCloudinary,
}