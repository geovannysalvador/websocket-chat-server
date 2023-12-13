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
      // displayUsuarios(payload);
    });
  
    socket.on('usuarios-activos', (payload) => {
      displayUsuarios(payload);
      // console.log(payload);
    });
  
    socket.on('private-messages', (payload) => {
      console.log(payload);
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


const main = async() =>{

    // validar jwt
    await validateJWT();
}

main ();

