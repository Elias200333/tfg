const fs = require('fs')
const Bundlr = require('@bundlr-network/client');
const key = JSON.parse(fs.readFileSync('wallet.json').toString());
const bundlr = new Bundlr.default("https://node1.bundlr.network", "arweave", key);

async function app() {
    const balance = await bundlr.getBalance(bundlr.address);
    const actualMB = (balance / await bundlr.getPrice(1048576))
    console.log("Actualmente tu balance es de "+balance);
    console.log("El equvalente en megas es: "+ actualMB);
    console.log("Indica la cantidad en megabytes para el fondeo.");
    process.stdin.on('data', async function(data){
        console.log(data.toString());
        let value = parseFloat(data.toString())*1048576;
        let price = await bundlr.getPrice(value);
        console.log("El precio de tokens será de "+bundlr.utils.unitConverter(price));
        let response = await bundlr.fund(price);
        console.log("Cantidad solicitada a la blockchain.");
        const intervalo = setInterval(async () => {
            try {
                const res = await fetch(`https://arweave.net/tx/${response.id}/status`);
                const status = await res.text();
                console.log(`Estado de transacción: ${status}`);
            
                if (status.length > 20) {
                  console.log(`Transacción validada!`);
                  clearInterval(intervalo);
                }
              } catch (error) {
                console.error(error);
              }
        }, 30000)
    })   
}

app();