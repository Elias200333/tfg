const dashboardAPI = require('../../../api/dashboard')

// Devuelve la plantilla de proyectos
async function proyects(req, res) {
    const user = req.session.email
    const page = req.params.page
    const base = 'info'
    let proyectos;
    // Si no hay paginación o es la página 1, devuelve la lista completa
    if (!page || page == 1) {
        proyectos = await dashboardAPI.getListProyects(user);
    } else { // En caso de haber, solicita a partir de la página solicitada
        proyectos = await dashboardAPI.getListProyects(user, page);
    }
    res.render("proyects", {
        email: user,
        proyectos,
        nombre: req.session.nombre,
        base: base,
    });
}

module.exports = { proyects }