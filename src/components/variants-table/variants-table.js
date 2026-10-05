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
//   variants-table-row vive adentro (la fila de la tabla), como toggle-switch
//   dentro de toggle (decisión 2026-10-02 · glosario).
// - Un solo contenedor con scroll horizontal para el encabezado y las filas; la
//   columna de inicio (miniatura + sku) y la de descarga quedan fijas
//   (position: sticky). El scroll queda dentro de los márgenes de la página.
// - Filters (Off · On): el botón Filtros (Filled con icon/filter; activo,
//   Outline con icon/filter-off) muestra filter-bar con un select por cada
//   filtro. Las opciones que no dan ninguna fila van deshabilitadas
//   (src/data/variants.js) y la tabla muestra solo las filas que cumplen.
// - Descarga de cada fila: icon-button Background=Subtle; emite
//   arq:downloads { sku } y, con downloads="<id>", abre ese download-modal.
// - Columnas: miden lo que su contenido (sin anchos fijos).

import { ArqElement } from '../../base/arq-element.js';
import { filterOptions, filterVariants } from '../../data/variants.js';
import '../button/button.js';
import '../icon-button/icon-button.js';
import '../sku/sku.js';
import '../filter-bar/filter-bar.js';
import '../select/select.js';
import css from './variants-table.css?inline';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

class ArqVariantsTable extends ArqElement {
  static tag = 'arq-variants-table';
  static styles = css;
  static properties = {
    filters: { type: Boolean }, // Filters: Off · On
    downloads: { type: String }, // id del arq-download-modal que abre el ícono de cada fila
    label: { type: String, default: 'Variantes' }, // nombre de la región con scroll (único en la página)
  };
  static template =
    `<div class="controls">` +
    `<div class="toolbar">` +
    `<arq-button class="toggle-filters" show-icon icon="filter">Filtros</arq-button>` +
    `<div class="downloads"><slot name="downloads"></slot></div>` +
    `</div>` +
    `<arq-filter-bar class="filter-bar" hidden></arq-filter-bar>` +
    `</div>` +
    `<div class="scroll" tabindex="0" role="region" aria-label="Variantes">` +
    `<table class="table"><thead></thead><tbody></tbody></table>` +
    `</div>`;

  #data = { columns: [], filters: [], rows: [] };
  #values = {};

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
      this.#refresh();
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
    if (!changed.has('filters')) return;
    const button = root.querySelector('.toggle-filters');
    button.type = this.filters ? 'outline' : 'filled';
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
      this.#refresh();
    }
  }

  #build() {
    const root = this.shadowRoot;
    const { columns, filters } = this.#data;
    // Encabezado: SKU (columna fija de inicio) · columnas · descarga (fija de fin)
    root.querySelector('thead').innerHTML =
      `<tr><th scope="col" class="start role-label"><span class="th-sku">SKU</span></th>` +
      columns.map((c) => `<th scope="col" class="role-label">${esc(c.label)}</th>`).join('') +
      `<th scope="col" class="end"><span class="visually-hidden">Descargas</span></th></tr>`;
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

  #refresh() {
    const root = this.shadowRoot;
    const { columns, filters, rows } = this.#data;
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
          `<th scope="row" class="start"><span class="cell-start">` +
          `<span class="thumb">${row.thumb ? `<img src="${esc(row.thumb)}" alt="" loading="lazy">` : ''}</span>` +
          `<arq-sku size="compact">${esc(row.sku)}</arq-sku>` +
          `</span></th>` +
          columns.map((c) => `<td class="role-body">${esc(row.values?.[c.key] ?? '—')}</td>`).join('') +
          `<td class="end"><arq-icon-button icon="download" background="subtle" data-sku="${esc(row.sku)}">Descargas de ${esc(row.sku)}</arq-icon-button></td>` +
          `</tr>`,
      )
      .join('');
  }
}

ArqVariantsTable.define();

export { ArqVariantsTable };
