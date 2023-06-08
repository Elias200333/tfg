const fs = require('fs')
const Bundlr = require('@bundlr-network/client');
const key = JSON.parse(fs.readFileSync('wallet.json').toString());
const bundlr = new Bundlr.default("https://node1.bundlr.network", "arweave", key);
const { remove } = require('./remove');

async function upload(route) {
    let succesfull;
    try {
        const result = await bundlr.uploadFolder('volcadoTemporal/'+route, {
            indexFile: "index.html", // optional index file (file the user will load when accessing the manifest)
            keepDeleted: false, // whether to keep now deleted items from previous uploads
            fallback: "index.html"
        });
        succesfull = result.id;
        console.log(result.id);  
    } catch (error) {
        console.log(error);
    } finally {
        await remove(route);
        return succesfull;
    }
}

module.exports = { upload }