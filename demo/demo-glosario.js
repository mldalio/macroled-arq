// select, filter-bar y variants-table (ficha y Descargas) de prueba (solo demo, no entra al build):
// arma los datos como lo va a hacer src/data/ en la ficha. Columnas y valores
// de la Ficha de Final (1218:10708); SKU de demo/fixtures/kanu.json.

import { TABLE_COLUMNS, attributeInfo, tableValues } from '/src/data/attributes.js';
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
// input Type=Select: opciones de solo texto (Figma 1454:5001)
const areas = ['Comercial', 'Técnica', 'Proyectos', 'Otro'].map((v) => ({ value: v }));
const OPTIONS = { heights, finishes, areas };
for (const select of document.querySelectorAll(':is(arq-select, arq-input)[data-demo-options]')) {
  select.options = OPTIONS[select.dataset.demoOptions] ?? finishes;
  // select multiple: valores elegidos de entrada
  if (select.dataset.demoValues) select.values = select.dataset.demoValues.split(',');
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
// Las mismas columnas y el mismo orden en la ficha (type product) y en
// Descargas (type catalog): TABLE_COLUMNS de src/data/attributes.js. El tamaño
// llega en cm y la tabla lo muestra en mm (tableValues).
const group = fixture.groups.find((g) => g.id === 'kanu-jardin');
const POWERS = ['8 W', '12 W', '12 W', '15 W'];
const SIZES = ['Ø 12 x 35 cm', 'Ø 12,5 x 50 cm', 'Ø 12 x 90 cm', 'Ø 12 x 120 cm'];
const columns = TABLE_COLUMNS.map(({ field, label, wide }) => ({ key: field, label, wide }));
const valuesOf = (v, i) =>
  tableValues({
    ...v.attributes,
    tamanio: SIZES[i % SIZES.length],
    potencia: POWERS[i % POWERS.length],
    temperatura_color: '2700 K',
    cri: '90',
    flujo_luminoso: '820 lm',
    angulo_apertura: '60°',
    lumenes_lmw: '68 lm/W',
    proteccion_ip: 'IP65',
    dimeable: 'No Dim',
  });
const filters = group.variantAttributes.map((key) => ({ key, label: attributeInfo(key).label, swatches: attributeInfo(key).control === 'swatches' }));

// Ficha: una fila por SKU del grupo, sin nombre
const data = {
  columns,
  filters,
  rows: group.variants.map((v, i) => ({
    sku: v.sku,
    thumb: `${IMG}card-estudio.svg`,
    attributes: v.attributes,
    values: valuesOf(v, i),
  })),
};
for (const table of document.querySelectorAll('arq-variants-table[data-demo-glosario]')) table.data = data;

// Descargas: las filas de Kanu Jardín con el nombre del producto, el link y la
// meta del modal; un nombre largo para ver cómo se parte y una fila sin imagen.
const downloadsData = {
  columns,
  filters: [...filters, { key: 'potencia', label: 'Potencia' }],
  rows: group.variants.map((v, i) => ({
    sku: v.sku,
    name: i === 1 ? 'Kanu Jardín con un nombre de producto bastante largo' : group.name,
    href: `/arq/producto/${group.id}?sku=${encodeURIComponent(v.sku)}`,
    meta: Object.values(v.attributes).join(', '),
    thumb: i === 2 ? null : `${IMG}card-estudio.svg`,
    search: group.name,
    attributes: { ...v.attributes, potencia: POWERS[i % POWERS.length] },
    values: valuesOf(v, i),
  })),
};
for (const table of document.querySelectorAll('arq-variants-table[data-demo-downloads]')) table.data = downloadsData;
