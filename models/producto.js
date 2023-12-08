// Como se vera la info en la BD
const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    descrpcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true,
    },
    img: {
        type: String,
    },
});

// Esconder algunos argumento para mostrar en postman en la BD si se ve
ProductoSchema.methods.toJSON = function (){
    const { __v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Producto', ProductoSchema); 