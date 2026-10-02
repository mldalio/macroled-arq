// select, filter-bar y variants-table de prueba (solo demo, no entra al build):
// arma los datos como lo va a hacer src/data/ en la ficha. Columnas y valores
// de la Ficha de Final (1218:10708); SKU de demo/fixtures/kanu.json.

import { attributeInfo } from '/src/data/attributes.js';
import fixture from '/demo/fixtures/kanu.json';

const IMG = '/demo/fixtures/img/';
const FINISH = fixture.finishImages;

// ── select ──────────────────────────────────────────────────────────
const finishes = [
  { value: 'Negro', label: 'Negro', swatch: FINISH.Negro },
  { value: 'Verde', label: 'Verde', showSwatch: true },
  { value: 'Terracota', label: 'Terracota', showSwatch: true, disabled: true },
  { value: 'Blanco', label: 'Blanco', swatch: `${IMG}acabado-blanco.svg` },
];
const heights = ['35 cm', '50 cm', '90 cm', '120 cm', '150 cm', '180 cm', '200 cm', '240 cm', '300 cm'].map((v) => ({ value: v, label: v }));
for (const select of document.querySelectorAll('arq-select[data-demo-options]')) {
  select.options = select.dataset.demoOptions === 'heights' ? heights : finishes;
}
const selectLog = document.querySelector('[data-demo-select-log]');
document.addEventListener('arq:change', (event) => {
  if (selectLog && event.target.localName === 'arq-select') selectLog.textContent = `arq:change → «${event.target.label}»: ${event.detail.value || 'Todos'}`;
});
const barLog = document.querySelector('[data-demo-filter-bar-log]');
document.addEventListener('arq:filters', (event) => {
  if (barLog && event.target.localName === 'arq-filter-bar') barLog.textContent = `arq:filters → ${JSON.stringify(event.detail.filters)}`;
});

// ── variants-table (Kanu Jardín) ────────────────────────────────────
const COLUMNS = ['Tamaño', 'Potencia', 'Temp.', 'Flujo lum.', 'Ángulo', 'Eficiencia', 'Regulación', 'IP', 'Fuente', 'CRI'];
const group = fixture.groups.find((g) => g.id === 'kanu-jardin');
const data = {
  columns: COLUMNS.map((label, i) => ({ key: `c${i}`, label })),
  filters: group.variantAttributes.map((key) => ({ key, label: attributeInfo(key).label })),
  rows: group.variants.map((v) => ({
    sku: v.sku,
    thumb: `${IMG}card-estudio.svg`,
    attributes: v.attributes,
    values: Object.fromEntries(
      [v.attributes.altura, '12 W', '2700 K', '820 lm', '60°', '68 lm/W', 'No Dim', 'IP65', 'LED', '90'].map((value, i) => [`c${i}`, value]),
    ),
  })),
};
for (const table of document.querySelectorAll('arq-variants-table[data-demo-glosario]')) table.data = data;
