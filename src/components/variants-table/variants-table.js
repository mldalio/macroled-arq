// variants-table · Figma 1068:5582 (+ variants-table-row 923:2708) · ficha doc/variants-table
//
// Tabla de variantes de la ficha (Glosario): una fila por SKU del grupo, con
// sus datos técnicos. El título va aparte, como título de sección.
//
//   <arq-variants-table downloads="descargas">
//     <arq-button slot="downloads" type="outline" show-icon icon="download" href="…">CAD 2D/3D</arq-button>
//   </arq-variants-table>
//
//   tabla.data = {
//     columns: [{ key: 'potencia', label: 'Potencia' }, …],
//     filters: [{ key: 'color_carcasa', label: 'Color', swatches: true }, { key: 'altura', label: 'Altura' }],
//     rows: [{ sku: 'KANU-…', thumb: '…', attributes: { color_carcasa: 'Negro', … }, values: { potencia: '12 W', … } }],
//   };
//
// - Es un <table> real: un lector de pantalla anuncia la columna de cada valor.
//   Miniatura y sku van en celdas separadas: hasta 1023 px solo la miniatura
//   queda fija y el sku se desplaza con los datos (ficha doc/variants-table:
//   «mobile: solo miniatura»).
//   variants-table-row vive adentro (la fila de la tabla), como toggle-switch
//   dentro de toggle (decisión 2026-10-02 · glosario).
// - Un solo contenedor con scroll horizontal para el encabezado y las filas; la
//   columna de inicio (miniatura + sku) y la de descarga quedan fijas
//   (position: sticky). El scroll queda dentro de los márgenes de la página.
// - Filters (Off · On): el botón Filtros (Filled con icon/filter; activo,
//   Outline con icon/filter-off; con show-search, siempre Outline) muestra filter-bar con un select por cada
//   filtro. Las opciones que no dan ninguna fila van deshabilitadas
//   (src/data/variants.js) y la tabla muestra solo las filas que cumplen.
// - Descarga de cada fila: icon-button Size=Large Background=Outline (columna
//   «Descargas»); emite arq:downloads { sku } y, con downloads="<id>", abre ese
//   download-modal.
// - Columnas: miden lo que su contenido (sin anchos fijos).
// - Solo de código (página Descargas, Figma 1808:20165 · 1808:20882): show-search
//   suma search-field («Buscar por SKU o nombre…», busca en el SKU y en
//   row.search) y show-sort, el select «Ordenar por» (SORT_ORDERS). Los dos
//   filtran y ordenan junto con los filtros (src/data/variants.js).

import { ArqElement } from '../../base/arq-element.js';
import { filterOptions, filterVariants, searchVariants, sortVariants, SORT_ORDERS } from '../../data/variants.js';
import '../button/button.js';
import '../icon-button/icon-button.js';
import '../sku/sku.js';
import '../filter-bar/filter-bar.js';
import '../search-field/search-field.js';
import '../select/select.js';
import css from './variants-table.css?inline';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const TEXT = {
  search: 'Buscar por SKU o nombre…',
  searchLabel: 'Buscar por SKU o nombre',
  sort: 'Ordenar por',
  downloads: 'Descargas',
  image: 'Imagen',
  // TODO (contenido): texto sin diseño
  empty: 'Ningún SKU coincide con la búsqueda o los filtros.',
  count: (n) => (n === 1 ? '1 variante' : `${n} variantes`),
};

class ArqVariantsTable extends ArqElement {
  static tag = 'arq-variants-table';
  static styles = css;
  static properties = {
    filters: { type: Boolean }, // Filters: Off · On
    downloads: { type: String }, // id del arq-download-modal que abre el ícono de cada fila
    label: { type: String, default: 'Variantes' }, // nombre de la región con scroll (único en la página)
    showSearch: { type: Boolean }, // solo de código: buscador por SKU o nombre
    showSort: { type: Boolean }, // solo de código: select «Ordenar por»
  };
  static template =
    `<div class="controls">` +
    `<div class="toolbar">` +
    `<arq-search-field class="search" placeholder="${TEXT.search}" label="${TEXT.searchLabel}" hidden></arq-search-field>` +
    `<arq-button class="toggle-filters" show-icon icon="filter">Filtros</arq-button>` +
    `<div class="downloads"><slot name="downloads"></slot></div>` +
    `<arq-select class="sort" type="filter" label="${TEXT.sort}" hidden></arq-select>` +
    `</div>` +
    `<arq-filter-bar class="filter-bar" hidden></arq-filter-bar>` +
    `</div>` +
    `<div class="scroll" tabindex="0" role="region" aria-label="Variantes">` +
    `<table class="table"><thead></thead><tbody></tbody></table>` +
    `</div>` +
    `<p class="empty role-body" hidden>${TEXT.empty}</p>` +
    `<span class="visually-hidden count" role="status"></span>`;

  #data = { columns: [], filters: [], rows: [] };
  #values = {};
  #query = '';
  #order = SORT_ORDERS[0].value;

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = { columns: value?.columns ?? [], filters: value?.filters ?? [], rows: value?.rows ?? [] };
    this.#values = {};
    if (this.isConnected) this.#build();
  }

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.toggle-filters').addEventListener('click', () => (this.filters = !this.filters));
    root.querySelector('.filter-bar').addEventListener('arq:filters', (event) => {
      event.stopPropagation();
      this.#values = event.detail.filters;
      this.#refresh(true);
    });
    root.querySelector('.search').addEventListener('arq:input', (event) => {
      event.stopPropagation();
      this.#query = event.detail.value;
      this.#refresh(true);
    });
    // Enter no envía a otra página: la tabla ya se filtró al escribir.
    root.querySelector('.search').addEventListener('arq:submit', (event) => event.stopPropagation());
    // Sin botones de descarga en la barra (página Descargas), no ocupa lugar
    const downloads = root.querySelector('slot[name="downloads"]');
    const toggleDownloads = () => (downloads.parentElement.hidden = !downloads.assignedElements().length);
    downloads.addEventListener('slotchange', toggleDownloads);
    toggleDownloads();
    const sort = root.querySelector('.sort');
    // La primera opción («Todos» en un Filter) es el orden por defecto.
    sort.allLabel = SORT_ORDERS[0].label;
    sort.options = SORT_ORDERS.slice(1);
    sort.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.#order = event.detail.value || SORT_ORDERS[0].value;
      this.#refresh(true);
    });
    root.querySelector('tbody').addEventListener('click', (event) => {
      const button = event.target.closest('arq-icon-button[data-sku]');
      if (!button) return;
      const sku = button.dataset.sku;
      this.emit('downloads', { sku });
      const modal = this.downloads ? this.getRootNode().getElementById?.(this.downloads) : null;
      modal?.show?.(button);
    });
    this.#build();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.scroll').setAttribute('aria-label', this.label ?? 'Variantes');
    if (changed.has('showSearch')) root.querySelector('.search').hidden = !this.showSearch;
    if (changed.has('showSort')) root.querySelector('.sort').hidden = !this.showSort;
    if (changed.has('showSearch') || changed.has('showSort')) this.#refresh();
    const button = root.querySelector('.toggle-filters');
    // Con buscador (página Descargas), Filtros va siempre en Outline: Filled
    // competiría con la acción del page-header (Descargar catálogo general).
    if (changed.has('filters') || changed.has('showSearch')) button.type = this.filters || this.showSearch ? 'outline' : 'filled';
    if (!changed.has('filters')) return;
    button.icon = this.filters ? 'filter-off' : 'filter';
    // aria-expanded y aria-controls en el <button> interno (el que tiene el foco)
    customElements.whenDefined('arq-button').then(() => {
      const control = button.shadowRoot?.querySelector('.control');
      if (!control) return;
      control.setAttribute('aria-expanded', String(this.filters));
      if ('ariaControlsElements' in control) control.ariaControlsElements = [root.querySelector('.filter-bar')];
    });
    root.querySelector('.filter-bar').hidden = !this.filters;
    // Al ocultar los filtros, la tabla vuelve a mostrar todas las filas.
    if (!this.filters && Object.keys(this.#values).length) {
      this.#values = {};
      for (const select of root.querySelectorAll('.filter-bar arq-select')) select.value = '';
      root.querySelector('.filter-bar').applied = false;
      this.#refresh(true);
    }
  }

  #build() {
    const root = this.shadowRoot;
    const { columns, filters } = this.#data;
    // Encabezado: SKU (columna fija de inicio) · columnas · descarga (fija de fin)
    root.querySelector('thead').innerHTML =
      `<tr><th scope="col" class="start"><span class="visually-hidden">${TEXT.image}</span></th>` +
      `<th scope="col" class="sku-col role-label">SKU</th>` +
      columns.map((c) => `<th scope="col" class="role-label">${esc(c.label)}</th>`).join('') +
      `<th scope="col" class="end role-label"><span class="th-downloads">${TEXT.downloads}</span></th></tr>`;
    // Filtros: un select por atributo
    const bar = root.querySelector('.filter-bar');
    bar.replaceChildren(
      ...filters.map((f) => {
        const select = document.createElement('arq-select');
        select.type = 'filter';
        select.label = f.label;
        select.name = f.key;
        return select;
      }),
    );
    this.#refresh();
  }

  // announce: después de buscar, filtrar u ordenar se anuncia la cantidad de filas.
  #refresh(announce = false) {
    const root = this.shadowRoot;
    const { columns, filters } = this.#data;
    // Buscador y orden (solo con show-search / show-sort)
    let rows = this.showSearch ? searchVariants(this.#data.rows, this.#query) : this.#data.rows;
    if (this.showSort) rows = sortVariants(rows, this.#order);
    const keys = filters.map((f) => f.key);
    // Opciones de cada filtro (las que no dan filas, deshabilitadas)
    const groups = filterOptions(rows, keys, this.#values);
    root.querySelectorAll('.filter-bar arq-select').forEach((select, i) => {
      // Acabados (swatches): opción con muestra, como select-menu Filter del set.
      // TODO (acabados): sin imagen, la muestra es el neutro (DESIGN.md §8).
      const showSwatch = Boolean(filters[i].swatches);
      select.options = groups[i].options.map((o) => ({ value: o.value, label: o.value, disabled: o.disabled, showSwatch }));
      select.value = this.#values[select.name] ?? '';
    });
    // Filas que cumplen los filtros
    const visible = filterVariants(rows, this.#values);
    root.querySelector('tbody').innerHTML = visible
      .map(
        (row) =>
          `<tr>` +
          `<td class="start"><span class="thumb">${row.thumb ? `<img src="${esc(row.thumb)}" alt="" loading="lazy">` : ''}</span></td>` +
          `<th scope="row" class="sku-col"><arq-sku size="compact">${esc(row.sku)}</arq-sku></th>` +
          columns.map((c) => `<td class="role-body">${esc(row.values?.[c.key] ?? '—')}</td>`).join('') +
          `<td class="end"><arq-icon-button icon="download" size="large" background="outline" data-sku="${esc(row.sku)}">Descargas de ${esc(row.sku)}</arq-icon-button></td>` +
          `</tr>`,
      )
      .join('');
    // Sin filas: la tabla se oculta y queda el aviso
    const empty = !visible.length && this.#data.rows.length > 0;
    root.querySelector('.scroll').hidden = empty;
    root.querySelector('.empty').hidden = !empty;
    if (announce) root.querySelector('.count').textContent = TEXT.count(visible.length);
  }
}

ArqVariantsTable.define();

export { ArqVariantsTable };
