const proyectBD = require('../../../functions/actions/proyectos/proyectBD')

// Devuelve la primera plantilla de actualización
async function update(req, res) {
    const user = req.session.email
    const results = await proyectBD.getProyectsCanUpdate(user);
    res.render("updatesPanel", {
        email: user,
        proyectos: results,
        nombre: req.session.nombre,
    });
}

module.exports = { update }