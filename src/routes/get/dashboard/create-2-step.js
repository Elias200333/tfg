const planesBD = require('../../../functions/actions/planes/planesBD')

async function create2step(req, res) {
    if (req.session.code) {
        return res.render('create-2-step', {
            plan: req.session.plan,
            email: req.session.email,
            nombre: req.session.nombre,
            proyecto: req.session.proyecto
        })
    }
    // Obtén el archivo y la información del archivo de la solicitud
    const file = req.file
    let plan;
    [plan, code, size] = await planesBD.calculatePlan(file);
    if (!code || plan.length == 0) {
        return res.status(500).send("Lo sentimos, ha habido un error.")
    }
    console.log(req.body.nameProyect);
    req.session.code = code
    req.session.proyecto = req.body.nameProyect;
    req.session.size = size;
    res.render('create-2-step', {
        plan: plan[0],
        email: req.session.email,
        nombre: req.session.nombre,
    })

    // Test card. 4242424242424242
}

module.exports = { create2step }