const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");
const {createServer} = require('http');
const { socketController } = require("../sockets/controller");

class Server {
    constructor() {
        // Consgtructor
        this.app = express();
        this.port = process.env.PORT;
        // Socketio
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        // Paths
        this.authPath = '/api/auth';
        this.buscarPath = '/api/buscar';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        this.usuariosPath = '/api/usuarios';
        this.uploadsPath = '/api/uploads';

        // Conectar a la BD
        this.conectarBD();

        // Middlewares(Funion que siempre se ejecuta)
        this.middlewares();

        // LLamar las rutas
        this.routes();

        // Escuchar eventos propios de los sockets
        this.sockets();
    }

    async conectarBD(){
        await dbConnection();
    }

    middlewares() {
        // Cors. Proteger el server
        this.app.use(cors());
        // Lectura y parseo del body usando POST.Serialisar a un json 
        this.app.use(express.json());
        // Directorio publico
        this.app.use(express.static('public'));
        // Manejar la carga de archivos || Cualquier archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.buscarPath, require('../routes/busqueda'));
        this.app.use(this.categoriasPath, require('../routes/categorias'));
        this.app.use(this.productosPath, require('../routes/productos'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.uploadsPath, require('../routes/uploads'));
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`App listening on port`, this.port);
        });
    }
}

module.exports = Server;
