const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');
const { disconnect } = require("mongoose");

const chatmensajes = new ChatMensajes();


const socketController = async (socket = new Socket(), io) => {

    // const token = socket.handshake.headers['x-token']; 
    // verificar/comprobar 
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    if (!usuario){
        return socket.disconnect();
    }

    // console.log("se conecto ", usuario.nombre);

    // Agregar el usuario conectado al arreglo
    chatmensajes.conectarUsuario(usuario);
    // Mostrar todos lo susuarios conectados
    io.emit('usuarios-activos', chatmensajes.usuariosArr);

    // Limpiar cuando se desconectan
    socket.on('disconnect', () => {
        io.emit('usuarios-activos', chatmensajes.usuariosArr);
        chatmensajes.desconectarUsuario(usuario.id);
    })

}




module.exports = {
    socketController,
}