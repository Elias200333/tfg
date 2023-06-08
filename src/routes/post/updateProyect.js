const { upload } = require('../../functions/uploads/upload')
const { remove } = require('../../functions/uploads/remove')
const proyectBD = require('../../functions/actions/proyectos/proyectBD')
const planesBD = require('../../functions/actions/planes/planesBD')

async function updateProyect(req, res) {
    // Obtén el archivo y la información del archivo de la solicitud
    const file = req.file
    const data = req.body;
    const user = req.session.email;

    // Verifica que el archivo y la información del archivo existan
    if (
        !file || 
        !data.nameWebsite ||
        !data.idProyecto
    ) {
        return res.status(400).send('No se ha proporcionado un archivo o información del archivo válidos.');
    }
    const idProyecto = data.idProyecto;

    // Verifica que el proyecto existe, es dueño del usuario y si se puede actualizar
    if (!await proyectBD.checkCanUpdateProyect(idProyecto, user)) {
        return res.status(500).send("Proyecto inválido.")
    }

    // Guarda el archivo, obtiene su plan y su peso
    const [dataPlan, code, size] = await planesBD.calculatePlan(file);

    // Obtiene el maximo peso según el plan del proyecto
    const maxSizeProyecto = await proyectBD.getMaxSizeByProyect(data.idProyecto);

    // Verifica si encontró un plan y si no supera el máximo del plan
    if (!dataPlan || maxSizeProyecto[0].size < size) {
        console.log("No se cumple");
        await remove(code);
        return res.status(500).send("Lo sentimos, el proyecto que desea subir supera las capacidades.")
    }
    console.log("Termine");

    // Sube el proyecto web
    const results = await upload(code);

    // Si ha habido algún problema, notifica error
    if(!results){
        return res.status(500).send('Parece que ha habido un problema a la hora de crear tu proyecto. Lo volveremos a intentar en unos minutos.');
    }

    // Actualiza el proyecto y verifica si algo ha salido mal.
    const update = await proyectBD.updateProyect(results, data.nameWebsite, data.idProyecto, size, user);
    if (!update) {
        return res.status(500).send("No se pudo actualizar")
    }

    res.redirect('/dashboard/proyects/1');
}

module.exports = { updateProyect }