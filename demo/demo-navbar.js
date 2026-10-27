// navbar, mega-menu y búsqueda en la demo. El navbar pide sus datos a
// src/data/catalog.js (Typesense); el
// mega-menu suelto recibe el mismo árbol.

import { getNavigation } from '/src/data/catalog.js';

const mega = document.querySelector('[data-demo-mega-menu]');
if (mega) {
  getNavigation().then((navigation) => (mega.navigation = navigation));
}

// mega-menu con fotos que no cargan: el preview pasa a la foto de respaldo
// (fallbacks, en orden); el último link no tiene ninguna que cargue y queda en
// color/surface/subtle.
const fallback = document.querySelector('[data-demo-mega-menu-fallback]');
if (fallback) {
  const link = (label, image, ...fallbacks) => ({ label, href: '#demo-mega-menu', count: 1, image, fallbacks: fallbacks.filter(Boolean), thumb: null });
  const missing = '/demo/fixtures/img/no-existe.webp';
  fallback.navigation = {
    sections: {
      interior: {
        id: 'interior',
        label: 'Interior',
        href: '#demo-mega-menu',
        all: { label: 'Ver todo interior', href: '#demo-mega-menu' },
        links: [
          link('Foto propia', '/demo/fixtures/img/card-contexto-on.svg', '/demo/fixtures/img/card-estudio.svg'),
          link('Sin cargar, con respaldo', missing, '/demo/fixtures/img/no-existe-2.webp', '/demo/fixtures/img/card-estudio.svg'),
          link('Sin cargar, sin respaldo', missing, '/demo/fixtures/img/no-existe-2.webp'),
        ],
      },
    },
    collections: [],
  };
}

// Este navbar muestra la navegación de Typesense, incluida Lámparas y artefactos.
const withTypes = document.querySelector('[data-demo-navbar-types]');
if (withTypes) {
  getNavigation().then((navigation) => {
    withTypes.navigation = navigation;
  });
}

const log = document.querySelector('[data-demo-search-log]');
for (const field of document.querySelectorAll('section[aria-labelledby="demo-search-field"] arq-search-field')) {
  for (const type of ['input', 'submit', 'navigate', 'close']) {
    field.addEventListener(`arq:${type}`, (event) => {
      if (log) log.textContent = `arq:${type} → ${JSON.stringify(event.detail ?? {})}`;
    });
  }
}

const screen = document.querySelector('[data-demo-screen]');
document.querySelector('[data-demo-search-screen]')?.addEventListener('click', (event) => {
  screen.field.value = 'kanu';
  screen.show(event.currentTarget);
});

// search-sheet: cada iframe se ajusta al alto de su panel (lo avisa
// demo/demo-search-sheet.js con postMessage).
window.addEventListener('message', (event) => {
  if (event.origin !== location.origin || typeof event.data?.arqSheetHeight !== 'number') return;
  for (const frame of document.querySelectorAll('[data-demo-sheet] iframe')) {
    if (frame.contentWindow === event.source) frame.height = String(event.data.arqSheetHeight + 2);
  }
});
