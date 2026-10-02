// Demo de páginas: carga la librería (como dist/arq.js en Webflow) e inserta
// el HTML del embed de src/pages/<página>.html sin cambios.
//
//   <body data-demo-page="home"></body>   →   src/pages/home.html
//
// Los links a una página de Arq que tiene demo (/arq → home, /arq/productos →
// productos) se cambian a su demo, con el mismo ?query, para poder navegar.

import '/src/main.js';

const pages = import.meta.glob('/src/pages/*.html', { query: '?raw', import: 'default' });
const DEMOS = { '/arq': 'home', '/arq/productos': 'productos' };

const name = document.body.dataset.demoPage;
const load = pages[`/src/pages/${name}.html`];
if (load) {
  // Antes de insertar: así los componentes leen ya el href de la demo.
  const template = document.createElement('template');
  template.innerHTML = await load();
  for (const link of template.content.querySelectorAll('[href^="/arq"]')) {
    const url = new URL(link.getAttribute('href'), location.origin);
    const demo = DEMOS[url.pathname.replace(/\/$/, '')];
    if (demo) link.setAttribute('href', `/demo/${demo}.html${url.search}`);
  }
  document.body.replaceChildren(template.content);
} else document.body.textContent = `No existe src/pages/${name}.html`;
