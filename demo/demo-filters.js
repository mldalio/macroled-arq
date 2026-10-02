// filter-panel de prueba (solo demo, no entra al build). Hace lo que va a
// hacer la página del listado: abrir el panel desde Filtrar, calcular el
// resultado con los filtros marcados (acá, un número de ejemplo) y mostrar lo
// que se aplica.
//
//   <arq-button data-demo-filter-open="id-del-panel">Filtrar</arq-button>

const TOTAL = 11;

// download-modal: abrir desde su botón; registro de arq:download (ficha técnica)
for (const button of document.querySelectorAll('[data-demo-download-open]')) {
  const modal = document.getElementById(button.dataset.demoDownloadOpen);
  button.addEventListener('click', () => modal?.show(button));
}
const downloadLog = document.querySelector('[data-demo-download-log]');
document.addEventListener('arq:download', (event) => {
  if (downloadLog) downloadLog.textContent = `arq:download → «${event.target.textContent.trim()}» (acá se generaría el PDF)`;
});

for (const button of document.querySelectorAll('[data-demo-filter-open]')) {
  const panel = document.getElementById(button.dataset.demoFilterOpen);
  if (!panel) continue;
  const log = document.querySelector(`[data-demo-filter-log="${panel.id}"]`);
  const count = (filters) => Math.max(1, TOTAL - 2 * Object.values(filters).flat().length);
  panel.count = count(panel.filters);
  button.addEventListener('click', () => panel.show(button));
  panel.addEventListener('arq:filters', (event) => (panel.count = count(event.detail.filters)));
  panel.addEventListener('arq:apply', (event) => {
    // Como la página: el toolbar conectado muestra el nuevo total.
    for (const toolbar of document.querySelectorAll(`arq-catalog-toolbar[for="${panel.id}"]`)) toolbar.count = panel.count;
    const list = Object.entries(event.detail.filters).map(([name, values]) => `${name}: ${values.join(', ')}`);
    if (log) log.textContent = `arq:apply → ${list.join(' · ') || 'sin filtros'}`;
  });
}
