const dashboardAPI = require('../../../api/dashboard')

// Devuelve la plantilla de dashboard
async function dashboard(req, res) {
    const user = req.session.email
    const proyectos = await dashboardAPI.getListProyects(user)
    const top = await dashboardAPI.getTop(user)
    const estadisticas = await dashboardAPI.getStadistics(user)
    res.render("dashboard", {
        email: user,
        proyectos,
        nombre: req.session.nombre,
        top,
        estadisticas: estadisticas[0]
    });
}

module.exports = { dashboard }