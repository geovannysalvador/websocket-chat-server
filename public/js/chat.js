// validar si el jwt es correcto 
let usuario =  null;
let socket = null;
const url = `${window.location.origin}/api/auth/`;

// Referencias html que usaremos 
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnLogout = document.querySelector('#btnLogout');


// Validar el token del localStorage

const validateJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    // Mandar a llamar el endpoint
    const resp = await fetch(url, {
        headers: {'x-token': token}
    });

    const {usuario: userDB, token: tokenDb} = await resp.json();
    // console.log(userDB, tokenDb);
    localStorage.setItem('token', tokenDb)
    usuario= userDB;
    document.title = usuario.nombre;

    await connectarSocket();


}

const connectarSocket = async () => {
    // send token to socket connection (located in handshake)
    socket = io({
      extraHeaders: {
        'x-token': localStorage.getItem('token'),
      },
    });
  
    // as code above is sync, i can create events when it triggers
    socket.on('connect', () => {
      console.log('sockets online');
    });
  
    socket.on('disconnect', () => {
      console.log('sockets offline');
    });
  
    socket.on('receibe-messages', (payload) => {
      displayMesajes(payload);
      // console.log(payload);
    });
  
    socket.on('usuarios-activos', (payload) => {
      displayUsuarios(payload);
      // console.log(payload);
    });
  
    socket.on('mensaje-privado', (payload) => {
      console.log('Privado: ', payload);
    });
  };

const displayUsuarios = (usuarios = []) => {
  let usersHTML = '';
  usuarios.forEach(({ nombre, uid }) => {
    usersHTML += `
      <li>
        <p>
          <h5 class="text-success">${nombre}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });

  ulUsuarios.innerHTML = usersHTML;
}

const displayMesajes = ( mensajes = []) => {
  let mensajesHTML = '';
  mensajes.forEach(({nombre, mensaje}) => {
    mensajesHTML += `
      <li>
        <p>
          <span class="text-primary">${nombre}: </span>
          <span>${mensaje}</span>
        </p>
      </li>
    `;
  });

  ulMensajes.innerHTML = mensajesHTML;
};

txtMsg.addEventListener('keyup', ({ keyCode }) => {
  const msg = txtMsg.value;
  const uid = txtUid.value;
  const token = localStorage.getItem('token');

  if (keyCode !== 13) return;
  if (msg.length === 0) return;
  // Emitir a todos el mensaje despues de las validaciones
  socket.emit('send-msg', { baseUrl: window.location.origin, msg, uid, token });

  txtMsg.value = '';
});

const main = async() =>{

    // validar jwt
    await validateJWT();
}

main ();

