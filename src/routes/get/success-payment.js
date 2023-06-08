// Importación de módulos y funciones necesarias
const { upload } = require('../../functions/uploads/upload'); // Importa la función 'upload' del módulo '../../functions/uploads/upload'
const proyectBD = require('../../functions/actions/proyectos/proyectBD'); // Importa el módulo '../../functions/actions/proyectos/proyectBD'
const planesBD = require('../../functions/actions/planes/planesBD'); // Importa el módulo '../../functions/actions/planes/planesBD'

// Definición de la función asincrónica 'successPayment'
async function successPayment(req, res) {
    const user = req.session.email; // Obtiene el correo electrónico del usuario de la sesión
    const data = req.params.id.split('-'); // Divide el parámetro 'id' por el carácter '-' y lo guarda en 'data'
    const idPlan = data[0]; // Obtiene el primer elemento de 'data' y lo asigna a 'idPlan'
    const level = data[1]; // Obtiene el segundo elemento de 'data' y lo asigna a 'level'

    // Obtiene la información del plan a través de 'planesBD.getPlan' utilizando 'idPlan'
    const dataPlan = await planesBD.getPlan(idPlan);
    if (!dataPlan) {
        return res.status(500).send("Plan no válido"); // Si no se encuentra información del plan, envía una respuesta de error con el mensaje "Plan no válido"
    }

    // Sube el proyecto utilizando la función 'upload' y el código de sesión almacenado en 'req.session.code'
    const results = await upload(req.session.code);
    if (!results) {
        return res.status(500).send("Error al subir el proyecto."); // Si ocurre un error al subir el proyecto, envía una respuesta de error con el mensaje "Error al subir el proyecto."
    }

    const idProyecto = proyectBD.generateUUID(); // Genera un identificador único para el proyecto utilizando la función 'generateUUID' del módulo 'proyectBD'
    let updates = 0; // Inicializa 'updates' con el valor 0
    if (level == "2") {
        updates = dataPlan.totalUpdates; // Si 'level' es igual a "2", asigna el valor de 'dataPlan.totalUpdates' a 'updates'
    }
    console.log(updates); // Imprime el valor de 'updates' en la consola

    // Crea el proyecto utilizando la función 'createProyect' del módulo 'proyectBD'
    if (await proyectBD.createProyect(
        idProyecto, // Identificador único del proyecto
        req.session.proyecto, // Nombre del proyecto almacenado en 'req.session.proyecto'
        user, // Correo electrónico del usuario
        dataPlan.ID, // ID del plan obtenido de 'dataPlan'
        updates, // Número de actualizaciones obtenido de 'updates'
        results, // Resultados de la subida del proyecto obtenidos de 'results'
        req.session.size // Tamaño del proyecto almacenado en 'req.session.size'
    )) {
        console.log("Creado correctamente"); // Si la creación del proyecto es exitosa, imprime "Creado correctamente" en la consola
    } else {
        console.log("ERROR al crear"); // Si ocurre un error al crear el proyecto, imprime "ERROR al crear" en la consola
    }

    res.redirect('/dashboard/proyects/1'); // Redirecciona la respuesta a la ruta '/dashboard/proyects/1'
}

// Exporta la función 'successPayment' para que esté disponible para otros módulos
module.exports = { successPayment };
