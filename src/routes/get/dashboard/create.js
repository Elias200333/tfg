// Devuelve el formulario de creación de proyecto
async function create(req, res) {
    // Si existe una sesión, la elimina
    if (req.session.code) {
        req.session.code = null
    }
    res.render("create", {
        email: req.session.email,
        nombre: req.session.nombre,
    });
}

module.exports = { create }