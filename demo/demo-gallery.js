// product-gallery de prueba (solo demo, no entra al build): carga las imágenes
// por JS, como lo va a hacer src/data/ en la ficha, y un toggle "Iluminar" que
// pone data-arq-theme="dark" en su bloque (como el hero de la ficha).
//
//   <arq-product-gallery data-demo-images="5">…</arq-product-gallery>
//   <div data-demo-iluminar> <arq-toggle>Iluminar</arq-toggle> … </div>

import { listCompareCandidates } from '/src/data/catalog.js';

const IMG = '/demo/fixtures/img/';
const BASE = [
  { src: `${IMG}producto-1.svg`, srcOn: `${IMG}producto-1-on.svg`, alt: 'Kanu Jardín, estudio' },
  { src: `${IMG}producto-2.svg`, srcOn: `${IMG}producto-2-on.svg`, alt: 'Kanu Jardín en un jardín' },
  { src: `${IMG}producto-3.svg`, alt: 'Kanu Jardín, perspectiva' },
];

function images(count) {
  return Array.from({ length: count }, (_, i) => {
    const image = BASE[i % BASE.length];
    return { ...image, alt: i < BASE.length ? image.alt : `${image.alt} (${i + 1})` };
  });
}

for (const gallery of document.querySelectorAll('arq-product-gallery[data-demo-images]')) {
  gallery.images = images(Number(gallery.dataset.demoImages));
}

// product-card + compare-bar: lo que va a hacer la página del listado.
// En la demo el nombre hace de SKU.
const compareLog = document.querySelector('[data-demo-compare-log]');
const bar = document.querySelector('arq-compare-bar');
const cardName = (card) => card.querySelector('[slot=name]')?.textContent.trim() ?? '';
const cards = () => [...document.querySelectorAll('arq-product-card[show-compare]')];
document.addEventListener('arq:compare', (event) => {
  const card = event.target;
  const name = cardName(card);
  if (compareLog) compareLog.textContent = `arq:compare → ${event.detail.checked ? 'agregar' : 'quitar'} «${name}»`;
  if (!bar) return;
  if (!event.detail.checked) bar.remove(name);
  else if (!bar.add({ sku: name, name, meta: 'Exterior · Jardín', image: card.image })) card.compared = false; // ya hay 3
});
const barLog = document.querySelector('[data-demo-compare-bar-log]');
const syncCards = () => { for (const card of cards()) card.compared = bar.has(cardName(card)); };
bar?.addEventListener('arq:compare-change', (event) => {
  syncCards();
  if (barLog) barLog.textContent = `arq:compare-change → ${event.detail.items.map((i) => i.name).join(', ') || 'vacía'}`;
});
if (bar) customElements.whenDefined('arq-product-card').then(syncCards);
document.querySelector('[data-demo-compare-add]')?.addEventListener('click', () => {
  bar.add({ sku: 'Hoshi', name: 'Hoshi', meta: 'Interior · Embutir', image: '/demo/fixtures/img/card-estudio.svg' });
  bar.add({ sku: 'Kanu Jardín', name: 'Kanu Jardín', meta: 'Exterior · Jardín', image: '/demo/fixtures/img/card-contexto.svg' });
});

// El lugar vacío (+) y un lugar con producto abren compare-picker, como en
// catalog-listing: agregar, cambiar y quitar desde el modal.
const barPicker = document.querySelector('[data-demo-bar-picker]');
if (bar && barPicker) {
  const loadBarPicker = async () => {
    const selected = bar.items.map((item) => item.sku);
    barPicker.count = selected.length;
    barPicker.items = (await listCompareCandidates({ ...barPicker.search, selected })).items;
  };
  bar.addEventListener('arq:add', (event) => {
    event.stopPropagation();
    barPicker.show();
  });
  bar.addEventListener('arq:replace', (event) => {
    event.stopPropagation();
    barPicker.show(null, { replace: event.detail.sku });
  });
  bar.addEventListener('arq:dismiss', () => barLog && (barLog.textContent = 'arq:dismiss → barra cerrada'));
  bar.addEventListener('arq:compare-change', () => barPicker.open && loadBarPicker());
  barPicker.addEventListener('arq:search', loadBarPicker);
  barPicker.addEventListener('arq:close', (event) => {
    if (event.detail.restored) return;
    if (event.detail.item) bar.focusItem(event.detail.item.sku);
    else bar.focusAdd();
  });
  barPicker.addEventListener('arq:add', (event) => {
    const { sku, name, cardMeta, meta, image } = event.detail.item;
    const item = { sku, name, meta: cardMeta ?? meta, image };
    if (event.detail.replace) bar.replace(event.detail.replace, item);
    else bar.add(item);
  });
  barPicker.addEventListener('arq:remove', (event) => bar.remove(event.detail.sku));
}

for (const block of document.querySelectorAll('[data-demo-iluminar]')) {
  block.querySelector('arq-toggle')?.addEventListener('arq:change', (event) => {
    if (event.detail.checked) block.setAttribute('data-arq-theme', 'dark');
    else block.removeAttribute('data-arq-theme');
  });
}
