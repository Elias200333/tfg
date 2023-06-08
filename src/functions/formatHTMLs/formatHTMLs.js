const fs = require('fs');
const path = require('path');

// Función para recorrer el directorio y sus subdirectorios
async function walkSync(dir, fileCallback, done) {
    let files = fs.readdirSync(dir)
    let pending = files.length;
    if (!pending) {
        return done(null);
    }
    files.forEach(async (file) => {
        const filePath = path.join(dir, file);
        let stats = fs.statSync(filePath);
        if (stats && stats.isDirectory()) {
            walkSync(filePath, fileCallback, (error) => {
                if (error) {
                    return done(error);
                }
                if (!--pending) {
                    done(null);
                }
            });
        } else {
            if (path.extname(filePath) === ".html") {
                await fileCallback(filePath);
            }
            if (!--pending) {
                done(null);
            }
        }
    });
}

module.exports = { walkSync }