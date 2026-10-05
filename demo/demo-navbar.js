// navbar, mega-menu y búsqueda en la demo. El navbar pide sus datos a
// src/data/catalog.js (VITE_DATA_SOURCE=mixto o mock); el
// mega-menu suelto recibe el mismo árbol.

import { getNavigation } from '/src/data/catalog.js';

const mega = document.querySelector('[data-demo-mega-menu]');
if (mega) {
  getNavigation().then((navigation) => (mega.navigation = navigation));
  mega.images = { aplicacion: '/demo/fixtures/img/producto-2.svg', colecciones: '/demo/fixtures/img/producto-1.svg' };
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
