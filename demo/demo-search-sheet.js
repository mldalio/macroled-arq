// demo/search-sheet.html: el search-sheet abierto y en el flujo (atributo
// inline), con el estado que pide la URL. Lo muestra demo/index.html en iframes.
//
//   ?state=recommended  campo vacío: productos recomendados de ejemplo (el navbar real los pide a Typesense)
//   ?state=results      productos y colecciones de ejemplo (la base todavía no devuelve colecciones)
//   ?state=none         sin resultados

import '/src/main.js';

const params = new URLSearchParams(location.search);
const state = params.get('state') ?? 'recommended';

const sheet = document.querySelector('arq-search-sheet');
const href = (query) => `#${encodeURIComponent(query)}`;

if (state === 'recommended') {
  const img = '/demo/fixtures/img/';
  sheet.recommended = ['Sento', 'Yoru', 'Douli', 'Köen', 'Tori', 'Nobu', 'Kanu', 'Mito'].map((name, i) => ({
    name,
    meta: ['Colgante', 'Pared', 'Techo', 'Jardín'][i % 4],
    href: '#',
    image: img + 'card-estudio.svg',
    imageHover: img + 'card-contexto.svg',
    imageLit: img + 'card-estudio-on.svg',
    imageHoverLit: img + 'card-contexto-on.svg',
  }));
} else if (state === 'results') {
  const query = 'kanu';
  sheet.field.value = query;
  sheet.results = {
    query,
    total: 6,
    href: href(query),
    items: [
      { kind: 'product', name: 'Kanu Pared', href: '#', image: '/demo/fixtures/img/producto-1.svg' },
      { kind: 'product', name: 'Kanu Jardín', href: '#', image: '/demo/fixtures/img/producto-2.svg' },
      { kind: 'product', name: 'Kanu Colgante', href: '#', image: '/demo/fixtures/img/producto-3.svg' },
      // Coincide por SKU o colección, no por el nombre: todo el nombre en gris
      { kind: 'product', name: 'Tori Colgante', href: '#', image: '/demo/fixtures/img/producto-1.svg' },
      { kind: 'collection', name: 'Kanu', href: '#', image: '/demo/fixtures/img/hero-1.svg' },
      { kind: 'collection', name: 'Kanu Outdoor', href: '#' },
    ],
  };
} else if (state === 'none') {
  const query = 'lámpara roja';
  sheet.field.value = query;
  sheet.results = { query, total: 0, href: href(query), items: [] };
}

// El iframe de index.html se ajusta al alto del panel
const notify = () => parent.postMessage({ arqSheetHeight: Math.ceil(sheet.getBoundingClientRect().height), state }, location.origin);
new ResizeObserver(notify).observe(document.body);
