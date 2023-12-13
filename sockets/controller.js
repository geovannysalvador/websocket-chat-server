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
    // Cuando se conecta un nuevo usuario le envia todos los mensajes
    socket.emit('receibe-messages', chatmensajes.ultimos10);

    // Cuando se conecta conectarlo a una sala especial
    socket.join( usuario.id ); // salas: global. socket.id, usuario,id
    
    // Limpiar cuando se desconectan
    socket.on('disconnect', () => {
        io.emit('usuarios-activos', chatmensajes.usuariosArr);
        chatmensajes.desconectarUsuario(usuario.id);
    })

    socket.on('send-msg', ({ uid, msg}) => {

        // PReguntar para ver si es msg privado o no 
        if( uid ){
            // Mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', {de: usuario.nombre, msg})

        }else {
            // Enviar los ultimso 10 mensajes de la sala de chat 
            chatmensajes.enviarMensaje(usuario.id, usuario.nombre, msg)
            io.emit('receibe-messages', chatmensajes.ultimos10);
        }
    
    })
}




module.exports = {
    socketController,
}