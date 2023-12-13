const miFormulario = document.querySelector('form');
const url = `${window.location.origin}/api/auth/`;

miFormulario.addEventListener('submit', ev => {
    // No refresca el navegador web
    ev.preventDefault();
    const formData = {};

    for(let elemento of miFormulario.elements){
        if(elemento.name.length > 0)
        formData[elemento.name] = elemento.value;
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then( resp => resp.json())
      .then( ({msg, token}) => {
        if(msg){
            return console.log(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
        
      })
      .catch( err => {
        console.log(err);
      })
});

function handleCredentialResponse(response) {

    // google token : Id token
    //console.log('id token', response.credential);

    const body = { id_token: response.credential };

    fetch( url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then( ({token}) => {
            console.log(token);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        // .then(resp => {
        //     console.log(resp);
        //     // Almacenar el correo en el localStorage para luego mandarlo a llamar y cerrar 
        //     localStorage.setItem('email', resp.usuario.correo);
        // })
        .catch(console.warn);

}


const button = document.getElementById('google_sign_out');
button.onclick = () => {
    // console.log(google.accounts.id);
    // Propio de google
    google.accounts.id.disableAutoSelect();
    // Mandamos a cerrar y luego hacer uso de un callback
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        // Limpiar el localStorage
        localStorage.clear();
        location.reload();
        console.log('Cerrar sesion');
    });
}
