
require('dotenv').config();

const Server = require('./models/server');


// Llamar al server
const server = new Server();


// lanzar el metodo listen
server.listen();