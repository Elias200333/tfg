const puppeteer = require('puppeteer');

// Realiza y devuelve un screenshot de la página web recibida como parámetro
async function screenshort(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshotBuffer = await page.screenshot();
    await browser.close();

    const base64Image = screenshotBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return dataUrl;
}

module.exports = { screenshort }