const { uploadFile } = require('../../functions/uploads/saveFile')
const proyectBD = require('../../functions/actions/proyectos/proyectBD')
const planesBD = require('../../functions/actions/planes/planesBD')

async function createProyect(req, res) {
    // Obtén el archivo y la información del archivo de la solicitud
    const file = req.file
    const data = req.body;
    const user = req.session.email

    // Verifica que el archivo y la información del archivo existan
    if (
        !file ||
        !data.nombreProyecto ||
        !data.dataPayments ||
        !data.level
    ) {
        return res.status(400).send('No se ha proporcionado un archivo o información del archivo válidos.');
    }
    // Calcula el plan y lo mide
    const [dataPlan, code, size] = await planesBD.calculatePlan(file);
    if (!dataPlan) {
        return res.status(500).send("Lo sentimos, el proyecto que desea subir supera las capacidades.")
    }
    
    // Verifica si se ha realizado el pago correctamente.
    if (!planesBD.verifyPayment(dataPlan, user, data.dataPayments)) {
        return res.status(500).send('No se ha podido realizar el pago.');
    }

    // Sube el proyecto web
    const results = await uploadFile(file);

    // Si ha habido algún problema, notifica error
    if (!results) {
        return res.status(500).send('Parece que ha habido un problema a la hora de crear tu proyecto. Lo volveremos a intentar en unos minutos.');
    }

    // Genera el ID del proyecto
    const idProyectoAUsar = proyectBD.generateUUID();

    // Evalua si ha elegido el nivel 1 o el nivel 2
    let nivel = 1;
    if (data.nivel > 1) {
        nivel = dataPlan[0].totalUpdates
    }

    // Crea el proyecto
    if (await proyectBD.createProyect(idProyectoAUsar, data.nombreProyecto, user, dataPlan[0].ID, nivel, results, size)) {
        console.log("Creado correctamente");
    } else {
        console.log("ERROR al crear");
    }

    res.redirect('/dashboard');
}

module.exports = { createProyect }