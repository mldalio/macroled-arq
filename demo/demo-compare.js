// compare-table en la demo: datos de ejemplo (fixtures/comparativa.json).
// La página de la comparativa va a pedir estos datos a src/data/ con los SKU
// de ?sku=. Quitar (arq:remove) acá solo saca la columna.

import data from './fixtures/comparativa.json';

const log = document.querySelector('[data-demo-compare-table-log]');

for (const table of document.querySelectorAll('[data-demo-compare-table]')) {
  const count = Number(table.dataset.demoCompareTable);
  table.data = { products: data.products.slice(0, count), groups: data.groups };
  table.addEventListener('arq:remove', (event) => {
    const { products, groups } = table.data;
    const i = products.findIndex((p) => p.sku === event.detail.sku);
    if (i < 0) return;
    table.data = {
      products: products.filter((_, j) => j !== i),
      groups: groups.map((g) => ({ ...g, rows: g.rows.map((r) => ({ ...r, values: (r.values ?? []).filter((_, j) => j !== i) })) })),
    };
    if (log) log.textContent = `arq:remove → «${event.detail.sku}»`;
  });
}
