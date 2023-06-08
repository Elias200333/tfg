const bd = require('../../../bd')
const admZip = require('adm-zip');
const { saveFile } = require('../../uploads/saveFile')

function PlanesBD() {
    // Obtiene la lista de planes
    this.getPlan = async function (idPlan) {
        try {
            const query = `SELECT * FROM Planes WHERE ID = ${idPlan};`

            const results = await bd.query(query);
            if (results.length == 0) {
                return null;
            }
            return results[0];
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    // Verifica el método de pago
    this.verifyPayment = async function (dataPlan, email, dataPayments) {
        return true;
    }

    // Calcula la cuota en base al tamaño
    this.calculatePlan = async function (file) {
        var zip = new admZip(file.buffer);
        var zipEntries = zip.getEntries();
        var size = 0;
        console.log("Calculando tamaño...");
        zipEntries.forEach(function (zipEntry) {
            size += zipEntry.header.size;
        });

        console.log("Calculado. Total: "+size);
        
        const code = await saveFile(file);
        if (!code) {
            return [0,0,0];
        }

        const query = `SELECT * FROM planes WHERE (size * 1024 * 1024) > ${size} LIMIT 1;`
        const results = await bd.query(query);
        return [results, code, size];
    }
}

const planesBD = new PlanesBD();

module.exports = planesBD;