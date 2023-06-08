const proyectBD = require('../../../functions/actions/proyectos/proyectBD')

// Devuelve la segunda plantilla de actualización
async function update2(req, res) {
    const user = req.session.email
    const idProyecto = req.params.id
    // Comprueba si puede actualizar
    if (!await proyectBD.checkCanUpdateProyect(idProyecto, user)) {
        return res.status(500).send("Proyecto inválido.")
    }
    res.render("update-2-step", {
        email: user,
        nombre: req.session.nombre,
        idProyecto: idProyecto
    });
}

module.exports = { update2 }