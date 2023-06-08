const bd = require('../../bd')

async function login(req, res) {
    const user = req.body;

    // Verifica que la información del usuario sea válida
    if (!user.email || !user.password) {
        return res.status(400).send('Se necesita un correo electrónico y una contraseña para registrar un usuario.');
    }

    // Comprueba la existencia del usuario
    const results = await bd.query(`SELECT * FROM usuarios WHERE email = '${user.email}' AND password = SHA('${user.password}')`);
    if (results.length === 0) {
        return res.status(401).send('Correo electrónico o contraseña incorrectos.');
    }
    req.session.email = user.email;
    req.session.nombre = results[0].nombre + ' ' + results[0].apellidos
    res.redirect("/dashboard");
}

module.exports = { login }