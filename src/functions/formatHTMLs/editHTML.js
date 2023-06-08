const fs = require('fs');
const path = require('path');

// Injecta el baseScript en la ruta HTML indicada
function editHTML(filePath) {
    let data = fs.readFileSync(filePath, 'utf8');
    let scriptPath = path.resolve(__dirname, './baseScript.js');
    let script = fs.readFileSync(scriptPath, 'utf8')
    if (!data.includes('<base')) {
        data.replace(`<head>`, `<head><base href="/">`)
    }
    const nuevo = data.replace(`<body>`,
    `<body><script class="permahosting-ajuste-arweave" defer>
        ${script}
    </script>`);
    fs.writeFileSync(filePath, nuevo, 'utf8');
}

module.exports = { editHTML }