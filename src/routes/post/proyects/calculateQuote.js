const planesBD = require('../../../functions/actions/planes/planesBD')

async function calculateQuote(req, res) {
    // Obtén el archivo y la información del archivo de la solicitud
    const file = req.file
    const data = req.body;
    const user = req.session.email
    let update = false;
    // Calcula el plan
    const plan = await planesBD.calculatePlan(file);

    // Si no devuelve nada, devuelve un error
    if (!plan) {
        return res.status(500).send("Lo sentimos, el proyecto que desea subir supera nuestras capacidades.")
    }

    return res.json(plan);
}

module.exports = { calculateQuote }