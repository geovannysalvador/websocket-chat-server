const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

async function googleVerify(token = '') {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
      //aca me manda toda la informacion de usuario de google
    //   const payload = ticket.getPayload();
    //   console.log(payload);

        const {name, email} = ticket.getPayload();


        // Informacion que necesitamos(estraer solo las que usamos)
        // nombre: name || se usa para renombrar como lo tenemos en la bd
        return{
            nombre: name, 
            correo: email
        }
}

module.exports = {
    googleVerify,
}