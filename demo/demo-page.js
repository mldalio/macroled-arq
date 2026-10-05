// Demo de páginas: carga la librería (como dist/arq.js en Webflow) e inserta
// el HTML del embed de src/pages/<página>.html sin cambios.
//
//   <body data-demo-page="home"></body>   →   src/pages/home.html
//
// Los links a una página de Arq que tiene demo (/arq → home, /arq/productos →
// productos, /arq/producto/<grupo> → ficha) se cambian a su demo, con el mismo
// ?query, para poder navegar. Los del HTML se cambian al insertarlo; los que
// arman los componentes (cards, breadcrumb), al hacer clic.
//
// Ficha: en Webflow cada grupo tiene su ítem del CMS. En la demo, ?group=<id>
// hace de ítem: cambia data-group y los textos del embed por los del catálogo
// de ejemplo (demo/fixtures/catalogo.json).

import '/src/main.js';
import '/demo/demo-inspect.js';
import catalog from '/demo/fixtures/catalogo.json';

const pages = import.meta.glob('/src/pages/*.html', { query: '?raw', import: 'default' });
const DEMOS = { '/arq': 'home', '/arq/productos': 'productos' };

/** URL de la demo para un link de Arq, o null si esa página no tiene demo. */
function demoHref(href) {
  const url = new URL(href, location.origin);
  if (url.origin !== location.origin) return null;
  const path = decodeURIComponent(url.pathname).replace(/\/$/, '');
  const product = path.match(/^\/arq\/producto\/(.+)$/);
  if (product) {
    url.searchParams.set('group', product[1]);
    return `/demo/ficha.html?${url.searchParams}`;
  }
  const demo = DEMOS[path];
  return demo ? `/demo/${demo}.html${url.search}` : null;
}

// Simula el ítem del CMS de otro grupo (solo demo)
function cmsItem(content) {
  const id = new URLSearchParams(location.search).get('group');
  const ficha = content.querySelector('arq-ficha-producto');
  if (!id || !ficha) return;
  ficha.setAttribute('data-group', id);
  const group = catalog.groups.find((g) => g.id === id);
  const set = (selector, text) => {
    const element = ficha.querySelector(selector);
    if (!element) return;
    if (text) element.textContent = text;
    else element.remove();
  };
  set('[slot="title"]', group?.name ?? id);
  set('[slot="description"]', group?.variants.find((v) => v.isDefault)?.description);
  set('[slot="story"]', group?.story);
  set('[slot="inspiration"]', group?.inspiration);
  const img = ficha.querySelector('img[slot="image"]');
  const main = group?.variants.find((v) => v.isDefault)?.images?.gallery?.[0];
  if (img && main) img.src = main;
  else img?.remove();
  document.title = `Macroled Arq · ${group?.name ?? id}`;
}

const name = document.body.dataset.demoPage;
const load = pages[`/src/pages/${name}.html`];
if (load) {
  // Antes de insertar: así los componentes leen ya el href de la demo.
  const template = document.createElement('template');
  template.innerHTML = await load();
  for (const link of template.content.querySelectorAll('[href^="/arq"]')) {
    const demo = demoHref(link.getAttribute('href'));
    if (demo) link.setAttribute('href', demo);
  }
  cmsItem(template.content);
  document.body.replaceChildren(template.content);
} else document.body.textContent = `No existe src/pages/${name}.html`;

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const link = event.composedPath().find((node) => node.localName === 'a' && node.hasAttribute('href'));
  const demo = link && link.getAttribute('href').startsWith('/arq') ? demoHref(link.getAttribute('href')) : null;
  if (!demo) return;
  event.preventDefault();
  location.href = demo;
});
