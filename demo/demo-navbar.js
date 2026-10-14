// navbar, mega-menu y búsqueda en la demo. El navbar pide sus datos a
// src/data/catalog.js (Typesense); el
// mega-menu suelto recibe el mismo árbol.

import { getNavigation } from '/src/data/catalog.js';

const mega = document.querySelector('[data-demo-mega-menu]');
if (mega) {
  getNavigation().then((navigation) => (mega.navigation = navigation));
}

// Navbar con Lámparas y artefactos de ejemplo: el catálogo de Typesense
// todavía no tiene productos de tipo Lámpara ni Artefacto, y sin datos la
// fila no aparece. Al resto del árbol lo trae getNavigation().
const withTypes = document.querySelector('[data-demo-navbar-types]');
if (withTypes) {
  const thumb = '/demo/fixtures/img/card-estudio.svg';
  const section = (label, all, names) => ({
    id: label.toLowerCase(),
    label,
    href: '#demo-navbar',
    all: { label: all, href: '#demo-navbar' },
    links: names.map((name, i) => ({ label: name, href: '#demo-navbar', count: 1, image: null, thumb: i === 1 ? null : thumb })),
  });
  getNavigation().then((navigation) => {
    navigation.sections.lamparas = section('Lámparas', 'Ver todas las lámparas', ['PAR11']);
    navigation.sections.artefactos = section('Artefactos', 'Ver todos los artefactos', ['Mini Kai Round', 'Dao (sin miniatura)', 'Un artefacto con un nombre muy largo que ocupa varias líneas']);
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
