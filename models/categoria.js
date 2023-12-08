// Como se vera la info en la BD
const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
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
});

// Esconder algunos argumento para mostrar en postman en la BD si se ve
CategoriaSchema.methods.toJSON = function (){
    const { __v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema); 