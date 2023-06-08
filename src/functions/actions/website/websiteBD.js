const bd = require('../../../bd')

function WebsiteBD() {
    // Obtiene el último website de un proyecto
    this.getLastWebsiteFromProyect = async function (idProyecto) {
        const query = `SELECT * FROM websites WHERE idProyecto = '${idProyecto}';`

        const results = await bd.query(query);
        if (results.length == 0) {
            return null;
        }
        return results;
    }
}

const websiteBD = new WebsiteBD();

module.exports = websiteBD;