const bd = require('../../../bd')
const uuid = require('uuid')

function ProyectBD() {
    // Obtener proyecto por ID
    this.getProyectByID = async function (idProyecto, email) {
        const query = `SELECT p.ID, p.Nombre, p.idPlan, DATE_FORMAT(p.date_up, '%d/%m/%Y %H:%i:%s') AS date_up, p.can_update, p.times_updated, p.total_updates
                        FROM proyectos AS p JOIN usuarios AS u ON p.email = u.email 
                        WHERE p.ID = '${idProyecto}' AND u.email = '${email}';`

        const results = await bd.query(query);
        return results;
    }
    // Obtener websites por proyecto
    this.getWebsitesByIdProyect = async function (idProyecto, email) {
        const query = `SELECT w.id, w.nombre, DATE_FORMAT(w.date_time, '%d/%m/%Y %H:%i:%s') AS date_time, (w.size / 1024 / 1024) AS size, w.visits 
                        FROM websites w 
                        JOIN proyectos p ON w.idProyecto = p.ID 
                        JOIN usuarios u ON p.email = u.email 
                        WHERE u.email = '${email}' AND p.ID = '${idProyecto}' ORDER BY w.date_time DESC`;

        const results = await bd.query(query);
        return results;
    }
    // Comprueba si existe un proyecto
    this.checkProyect = async function (idProyecto, email) {
        try {
            const query = `SELECT ID 
                            FROM proyectos AS p JOIN usuarios AS u ON p.email = u.email 
                            WHERE p.ID = '${idProyecto}' AND u.email = '${email}';`

            const results = await bd.query(query);
            if (results.length == 0) {
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    // Crea un website y actualiza el número de veces en el proyecto
    this.updateProyect = async function (arweaveID, nombre, idProyecto, size, email) {
        const query = `INSERT INTO websites(id, nombre, idProyecto, size) 
                        VALUES('${arweaveID}','${nombre}','${idProyecto}', ${size});`;
        const results = await bd.query(query);
        if (results.affectedRows != 1) {
            return false;
        }
        const proyecto = await this.getProyectByID(idProyecto, email);
        const queryUpdate = `UPDATE proyectos SET times_updated = ${proyecto[0].times_updated + 1} WHERE ID = '${idProyecto}'`
        const results2 = await bd.query(queryUpdate);
        if (results2.affectedRows != 1) {
            return false;
        }
        return true;
    }

    // Genera un identificador
    this.generateUUID = function () {
        return uuid.v4();
    }

    // Crea un proyecto
    this.createProyect = async function (uuidCreated, nombre, email, idPlan, updates, arweaveID, size) {
        let canUpdate = 0;
        if (updates > 1) {
            canUpdate = 1
        }
        const query = `INSERT INTO proyectos(ID, Nombre, email, idPlan, can_update, total_updates) 
                        VALUES('${uuidCreated}','${nombre}','${email}', ${idPlan}, ${canUpdate}, ${updates})`;

        const results = await bd.query(query);
        if (results.affectedRows != 1) {
            return false;
        }

        return this.updateProyect(arweaveID, nombre, uuidCreated, size, email)
    }

    // Devuelve la lista de objetos que se pueden actualizar
    this.getProyectsCanUpdate = async function (email) {
        const query = `SELECT p.nombre, p.ID, DATE_FORMAT(p.date_up, '%d/%m/%Y %H:%i:%s') AS date_up FROM proyectos p JOIN usuarios u ON p.email = u.email WHERE u.email = '${email}' AND p.can_update = 1`;
        const results = await bd.query(query);
        return results;
    }

    // Obtiene el tamaño máximo de un proyecto
    this.getMaxSizeByProyect = async function (idProyecto) {
        const query = `SELECT (pl.size * 1024 * 1024) AS size 
                        FROM planes pl 
                        JOIN proyectos p ON pl.ID = p.idPlan 
                        WHERE p.ID = '${idProyecto}'`
        const results = await bd.query(query);
        return results;
    }

    // Comprueba si puede actualizar
    this.checkCanUpdateProyect = async function (idProyecto, email) {
        try {
            const results = await this.getProyectByID(idProyecto, email);
            if (results.length == 0) {
                return false;
            }
            if (results[0].can_update != 1) {
                return false;
            }
            if (results[0].times_updated>= results[0].total_updates) {
                return false;
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

const proyectBD = new ProyectBD();

module.exports = proyectBD;