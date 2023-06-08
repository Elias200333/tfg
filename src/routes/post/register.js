const bd = require('../../bd')

async function register(req, res) {
    const user = req.body;
    let nombre = '';
    let apellidos = '';
    let fecha_nacimiento = '';
    // Verifica que la información del usuario sea válida
    if (!user.email || !user.password) {
        return res.status(400).send('Se necesita un correo electrónico y una contraseña para iniciar sesión.');
    }
    if (user.nombre) {
        nombre = user.nombre
    }
    if (user.apellidos) {
        apellidos = user.apellidos
    }
    if(user.fecha_nacimiento){
        fecha_nacimiento = user.fecha_nacimiento
    }
    
    await bd.query(`INSERT INTO usuarios (
        email, 
        password,
        nombre,
        apellidos,
        fecha_nacimiento
    ) VALUES (
        '${user.email}', 
        SHA('${user.password}'),
        '${nombre}',
        '${apellidos}',
        '${fecha_nacimiento}'
    );`);

    res.redirect("/login");
}

module.exports = { register }