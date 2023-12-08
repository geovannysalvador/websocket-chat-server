// Como se vera la info en la BD
const {Schema, model} = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    },
});

module.exports = model('Role', RoleSchema); 