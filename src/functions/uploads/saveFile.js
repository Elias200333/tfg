const fs = require('fs');
const AdmZip = require('adm-zip'); // Descomprimir
const crypto = require('crypto')

const { walkSync } = require('../formatHTMLs/formatHTMLs');
const { editHTML } = require('../formatHTMLs/editHTML');
const { remove } = require('./remove');

async function saveFile(file) {
    const nombreZip = crypto.randomBytes(10).toString('hex')
    try {
        const zip = new AdmZip(file.buffer);
        let base = 'volcadoTemporal/' + nombreZip;
        let ruta = base;
        fs.mkdirSync(ruta);
        zip.extractAllTo(ruta);
        const carpeta = fs.readdirSync(ruta);
        if (carpeta.length == 1 && fs.statSync(ruta + '/' + carpeta[0]).isDirectory()) {
            ruta += "/" + carpeta[0];
        }
        if (!fs.readdirSync(ruta).includes('index.html')) {
            throw 'No existe un index.html alojado en la carpeta principal.'
        }
        await walkSync(ruta, editHTML, (error) => {
            if (error) {
                throw error
            } else {
                console.log("All HTML files have been edited successfully!");
            }
        });

        const result = ruta.replace('volcadoTemporal/', '')
        return result;
    } catch (error) {
        console.log(error);
        remove(nombreZip)
        return null;
    }
}

module.exports = { saveFile }