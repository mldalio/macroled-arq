// Demo de páginas: carga la librería (como dist/arq.js en Webflow) e inserta
// el HTML del embed de src/pages/<página>.html sin cambios.
//
//   <body data-demo-page="home"></body>   →   src/pages/home.html
//
// Los links a una página de Arq que tiene demo (/arq → home, /arq/productos →
// productos, /arq/producto/<grupo> → ficha, /arq/coleccion/<id> → coleccion)
// se cambian a su demo, con el mismo
// ?query, para poder navegar. Los del HTML se cambian al insertarlo; los que
// arman los componentes (cards, breadcrumb), al hacer clic.
//
// Ficha: en Webflow cada grupo tiene su ítem del CMS, con nombre y slug. En la
// demo, ?group=<id> hace de ítem: cambia data-group y el nombre, que sale del
// catálogo activo (VITE_DATA_SOURCE). El resto lo trae el componente.
// Colección: lo mismo con ?collection=<id>.

import '/src/main.js';
import '/demo/demo-inspect.js';
import { getProduct, getCollection } from '/src/data/catalog.js';

const pages = import.meta.glob('/src/pages/*.html', { query: '?raw', import: 'default' });
const DEMOS = { '/arq': 'home', '/arq/productos': 'productos', '/arq/contacto': 'contacto', '/arq/comparativa': 'comparativa', '/arq/descargas': 'descargas' };

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
  const collection = path.match(/^\/arq\/coleccion\/(.+)$/);
  if (collection) {
    url.searchParams.set('collection', collection[1]);
    return `/demo/coleccion.html?${url.searchParams}`;
  }
  const demo = DEMOS[path];
  return demo ? `/demo/${demo}.html${url.search}` : null;
}

// Simula el ítem del CMS de otra colección (solo demo)
async function cmsCollection(content) {
  const page = content.querySelector('arq-coleccion');
  if (!page) return;
  const id = new URLSearchParams(location.search).get('collection') ?? page.dataset.collection;
  page.setAttribute('data-collection', id);
  const collection = (await getCollection(id).catch(() => null))?.collection;
  const name = collection?.name ?? id;
  content.querySelector('arq-breadcrumb-item[current]').textContent = name;
  content.querySelector('arq-page-header [slot="title"]').textContent = `Colección ${name}`;
  document.title = `Macroled Arq · Colección ${name}`;
}

// Simula el ítem del CMS de otro grupo (solo demo)
async function cmsItem(content) {
  const ficha = content.querySelector('arq-ficha-producto');
  if (!ficha) return;
  const id = new URLSearchParams(location.search).get('group') ?? ficha.dataset.group;
  ficha.setAttribute('data-group', id);
  const group = (await getProduct(id).catch(() => null))?.group;
  ficha.querySelector('[slot="title"]').textContent = group?.name ?? id;
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
  await cmsItem(template.content);
  await cmsCollection(template.content);
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
