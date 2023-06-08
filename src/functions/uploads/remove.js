const rimraf = require('rimraf'); // Permite eliminar directorios con su contenido
const fs = require('fs');

// Remueve el directorio de la ruta temporal
async function remove(route) {
    const base = route+''.split('/')[0]
    console.log(base);
    try {
        rimraf.sync('volcadoTemporal/'+base);
    } catch (error) {console.log(error);}
    try {
        fs.unlinkSync('volcadoTemporal/'+base + '-manifest.csv');
    } catch (error) {console.log(error);}
    try {
        fs.unlinkSync('volcadoTemporal/'+base + '-manifest.json');
    } catch (error) {console.log(error);}   
    try {
        fs.unlinkSync('volcadoTemporal/'+base + '-id.txt'); 
    } catch (error) {console.log(error);}
}

module.exports = { remove }