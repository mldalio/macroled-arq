// Demo de páginas: carga la librería (como dist/arq.js en Webflow) e inserta
// el HTML del embed de src/pages/<página>.html sin cambios.
//
//   <body data-demo-page="home"></body>   →   src/pages/home.html

import '/src/main.js';

const pages = import.meta.glob('/src/pages/*.html', { query: '?raw', import: 'default' });

const name = document.body.dataset.demoPage;
const load = pages[`/src/pages/${name}.html`];
if (load) document.body.innerHTML = await load();
else document.body.textContent = `No existe src/pages/${name}.html`;
