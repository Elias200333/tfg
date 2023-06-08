// async function load() {
//     try {
//         const base = document.querySelector('base');
//         if (!base) {
//             const newHREF = "/" + window.location.pathname.split("/")[1] + "/";
//             console.log(newHREF);
//             await fetch(window.location.href).then(response => response.text())
//                 .then(html => {
//                     newHTML = html.replace('<head>', '<head><base href="' + newHREF + '">')
//                     document.open();
//                     document.write(newHTML);
//                     document.close();
//                 });
//         } else if (base.getAttribute('href') == '/') {
//             const hrefBase = base.getAttribute('href');
//             console.log(hrefBase);
//             if (hrefBase == "/") {
//                 console.log("Cambio HREF");
//                 const newHREF = "/" + window.location.pathname.split("/")[1] + "/";
//                 console.log(newHREF);
//                 await fetch(window.location.href).then(response => response.text())
//                     .then(html => {
//                         newHTML = html.replace('<base href="/">', '<base href="' + newHREF + '">')
//                         document.open();
//                         document.write(newHTML);
//                         document.close();
//                     });
//             }
//         }
//     } catch (error) { 
//         console.log(error);
//     } finally {
//         try{
//             document.currentScript.parentNode.removeChild(document.currentScript);
//         }catch{}
//     }
//     // NFT CERTIFICATION:
//     // NFT WEBSITE CREATED BY PermaHosting

// }
// load()