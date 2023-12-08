const mongoose = require('mongoose')

const dbConnection = async() =>{

    try {

        await mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });
        console.log("Bases de datos en linea");

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD')
    }
}

module.exports = {
    dbConnection
}