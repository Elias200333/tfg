// Importación de módulos y funciones necesarias
const proyectBD = require('../../../functions/actions/proyectos/proyectBD'); // Importa el módulo '../../../functions/actions/proyectos/proyectBD'
const { screenshort } = require('../../../functions/screenshortWebsite/screenshort'); // Importa la función 'screenshort' del módulo '../../../functions/screenshortWebsite/screenshort'

// Definición de la función asincrónica 'info'
async function info(req, res) {
    const id = req.params.id; // Obtiene el parámetro 'id' de la solicitud
    const email = req.session.email; // Obtiene el correo electrónico del usuario de la sesión
    const nombre = req.session.nombre; // Obtiene el nombre del usuario de la sesión

    // Obtiene la información del proyecto utilizando la función 'getProyectByID' del módulo 'proyectBD'
    const resultProyect = await proyectBD.getProyectByID(id, email);

    let resultWebsites; // Variable para almacenar la información de los sitios web asociados al proyecto
    let actualWebsite; // Variable para almacenar el sitio web actual
    let result; // Variable para almacenar la información del proyecto
    let imgWebsite; // Variable para almacenar la imagen del sitio web

    if (resultProyect.length > 0) {
        result = resultProyect[0]; // Asigna el primer elemento de 'resultProyect' a 'result'

        // Obtiene la información de los sitios web asociados al proyecto utilizando la función 'getWebsitesByIdProyect' del módulo 'proyectBD'
        resultWebsites = await proyectBD.getWebsitesByIdProyect(id, email);

        actualWebsite = resultWebsites[0]; // Asigna el primer elemento de 'resultWebsites' a 'actualWebsite'

        // Captura una captura de pantalla del sitio web utilizando la función 'screenshort' y el ID del sitio web actual
        imgWebsite = await screenshort('https://arweave.net/' + actualWebsite.id);
    }

    // Renderiza la plantilla 'info' y envía los datos al template engine para su procesamiento
    res.render('info', {
        proyectInfo: result, // Información del proyecto
        websitesInfo: resultWebsites, // Información de los sitios web asociados al proyecto
        actualWebsite: actualWebsite, // Sitio web actual
        imgWebsite: imgWebsite, // Imagen del sitio web
        email: email, // Correo electrónico del usuario
        nombre: nombre, // Nombre del usuario
    });
}

// Exporta la función 'info' para que esté disponible para otros módulos
module.exports = { info };
