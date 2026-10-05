// compare-table, compare-product y compare-header en la demo: datos de
// ejemplo (fixtures/comparativa.json). La página real (demo/comparativa.html)
// pide estos datos a src/data/catalog.js con los SKU de ?sku=.

import data from './fixtures/comparativa.json';

for (const table of document.querySelectorAll('[data-demo-compare-table]')) {
  const count = Number(table.dataset.demoCompareTable);
  table.data = { products: data.products.slice(0, count), groups: data.groups };
}

// ── compare-product ─────────────────────────────────────────────────────
// Un select por atributo de variante, como el configurador de la ficha
// (la muestra solo en el de color).
const ATTRIBUTES = [
  {
    field: 'color_carcasa',
    label: 'Color',
    value: 'Negro',
    options: [
      { value: 'Negro', label: 'Negro', showSwatch: true },
      { value: 'Verde', label: 'Verde', showSwatch: true },
      { value: 'Terracota', label: 'Terracota', showSwatch: true, disabled: true },
    ],
  },
  {
    field: 'altura',
    label: 'Altura',
    value: '50 cm',
    options: [
      { value: '50 cm', label: '50 cm' },
      { value: '90 cm', label: '90 cm' },
    ],
  },
];

const productLog = document.querySelector('[data-demo-compare-product-log]');

for (const product of document.querySelectorAll('[data-demo-compare-product]')) {
  const state = product.dataset.demoCompareProduct;
  product.data =
    state === 'filled'
      ? {
          sku: 'KANU-J-500-12W-N-WW',
          name: 'Kanu Jardín',
          href: '#',
          image: '/demo/fixtures/img/card-estudio.svg',
          attributes: ATTRIBUTES,
        }
      : null;
  product.addEventListener('arq:change', (event) => {
    if (productLog) productLog.textContent = `arq:change → ${event.detail.field} = «${event.detail.value}»`;
  });
  product.addEventListener('arq:remove', (event) => {
    if (productLog) productLog.textContent = `arq:remove → «${event.detail.sku}»`;
  });
  product.addEventListener('arq:add', () => {
    if (productLog) productLog.textContent = 'arq:add → (abriría el modal para elegir producto)';
  });
}

// ── compare-header ───────────────────────────────────────────────────────
const headerLog = document.querySelector('[data-demo-compare-header-log]');

function headerProducts(count) {
  return data.products.slice(0, count).map((p) => ({ ...p, attributes: ATTRIBUTES }));
}

for (const header of document.querySelectorAll('[data-demo-compare-header]')) {
  const count = Number(header.dataset.demoCompareHeader);
  header.products = headerProducts(count);
  header.addEventListener('arq:differences', (event) => {
    if (headerLog) headerLog.textContent = `arq:differences → ${event.detail.value}`;
  });
  header.addEventListener('arq:remove', (event) => {
    if (headerLog) headerLog.textContent = `arq:remove → «${event.detail.sku}»`;
  });
  header.addEventListener('arq:change', (event) => {
    if (headerLog) headerLog.textContent = `arq:change → columna ${event.detail.index}, ${event.detail.field} = «${event.detail.value}»`;
  });
  header.addEventListener('arq:add', (event) => {
    if (headerLog) headerLog.textContent = `arq:add → columna ${event.detail.index} (abriría el modal para elegir producto)`;
  });
}
