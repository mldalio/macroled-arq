// compare-table · contenedor solo de código (decisión 2026-10-02 · Comparativa)
// con compare-group (Figma 1263:4320) y compare-row (Figma 1263:4317).
//
// Tabla de la comparativa: un grupo por sección (Características lumínicas…)
// y una fila por dato, con un valor por producto (hasta 3).
//
//   <arq-compare-table></arq-compare-table>
//   tabla.data = {
//     products: [{ sku, name, meta, image }],                       // hasta 3
//     groups: [{ label: 'Características lumínicas', rows: [{ label: 'Flujo luminoso', values: ['850 lm', '850 lm', '650 lm'] }] }],
//   };
//
// - Es un <table> real: un lector de pantalla anuncia el producto (columna) y
//   el dato (fila) de cada valor. compare-group y compare-row viven adentro.
// - Un solo scroll horizontal para la cabecera y las filas; la columna de
//   etiquetas (layout/compare-label) queda fija. En Mobile cada producto mide
//   layout/compare-column.
// - "Solo diferencias" (toggle): oculta las filas con todos los valores iguales
//   y el grupo que queda vacío.
// - Cabecera: por ahora un compare-slot por producto (como compare-header
//   Compact); quitar emite arq:remove { sku }. TODO (compare-header): cabecera
//   Default con compare-product cuando esté el rediseño en Figma.

import { ArqElement } from '../../base/arq-element.js';
import '../toggle/toggle.js';
import '../compare-slot/compare-slot.js';
import css from './compare-table.css?inline';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const MAX = 3;
const MOBILE = matchMedia('(max-width: 767px)');

class ArqCompareTable extends ArqElement {
  static tag = 'arq-compare-table';
  static styles = css;
  static properties = {
    onlyDifferences: { type: Boolean }, // toggle "Solo diferencias"
    label: { type: String, default: 'Comparación de productos' }, // nombre de la región con scroll
  };
  static template =
    `<div class="scroll" tabindex="0" role="region">` +
    `<table class="table"><thead></thead></table>` +
    `</div>`;

  #data = { products: [], groups: [] };

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = { products: (value?.products ?? []).slice(0, MAX), groups: value?.groups ?? [] };
    if (this.isConnected) this.#build();
  }

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.table').addEventListener('arq:change', (event) => {
      if (event.target.localName !== 'arq-toggle') return;
      event.stopPropagation();
      this.onlyDifferences = event.detail.checked;
    });
    root.querySelector('.table').addEventListener('arq:remove', (event) => {
      event.stopPropagation();
      this.emit('remove', { sku: event.detail.sku });
    });
    MOBILE.addEventListener('change', () => this.#syncBreakpoint());
    this.#build();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.scroll').setAttribute('aria-label', this.label ?? '');
    if (changed.has('onlyDifferences')) {
      const toggle = root.querySelector('arq-toggle');
      if (toggle) toggle.checked = this.onlyDifferences;
      this.#filter();
    }
  }

  #build() {
    const root = this.shadowRoot;
    const table = root.querySelector('.table');
    const { products, groups } = this.#data;
    const n = products.length;
    // Cabecera: controles (Solo diferencias) + un compare-slot por producto
    root.querySelector('thead').innerHTML =
      `<tr><td class="label-cell controls"><arq-toggle show-label class="diff">Solo diferencias</arq-toggle></td>` +
      products
        .map(
          (p) =>
            `<th scope="col" class="product"><arq-compare-slot sku="${esc(p.sku)}"${p.image ? ` image="${esc(p.image)}"` : ''}>` +
            `<span slot="name">${esc(p.name)}</span><span slot="meta">${esc(p.meta ?? p.sku)}</span></arq-compare-slot>` +
            `<span class="mobile-name role-label" aria-hidden="true">${esc(p.name)}</span></th>`,
        )
        .join('') +
      `</tr>`;
    root.querySelector('arq-toggle').checked = this.onlyDifferences;
    // Grupos y filas
    for (const body of table.querySelectorAll('tbody')) body.remove();
    for (const group of groups) {
      const body = document.createElement('tbody');
      body.innerHTML =
        `<tr class="group"><th scope="colgroup" colspan="${n + 1}"><span class="group-label role-label">${esc(group.label)}</span></th></tr>` +
        (group.rows ?? [])
          .map((row) => {
            const values = products.map((_, i) => row.values?.[i] ?? '—');
            const same = values.every((v) => String(v) === String(values[0]));
            return (
              `<tr class="row"${same ? ' data-same' : ''}><th scope="row" class="label-cell row-label">${esc(row.label)}</th>` +
              values.map((v) => `<td class="value role-body-lg-regular">${esc(v)}</td>`).join('') +
              `</tr>`
            );
          })
          .join('');
      table.append(body);
    }
    this.#syncBreakpoint();
    this.#filter();
  }

  // Mobile (como el set): compare-slot en Compact con el nombre debajo y la
  // etiqueta de la fila en role/body-sm (Desktop role/body).
  #syncBreakpoint() {
    const mobile = MOBILE.matches;
    for (const slot of this.shadowRoot.querySelectorAll('thead arq-compare-slot')) slot.size = mobile ? 'compact' : 'default';
    for (const label of this.shadowRoot.querySelectorAll('.row-label')) {
      label.classList.toggle('role-body', !mobile);
      label.classList.toggle('role-body-sm', mobile);
    }
  }

  // Solo diferencias: oculta filas iguales y grupos vacíos.
  #filter() {
    const only = this.onlyDifferences;
    for (const body of this.shadowRoot.querySelectorAll('tbody')) {
      let visible = 0;
      for (const row of body.querySelectorAll('tr.row')) {
        row.hidden = only && row.hasAttribute('data-same');
        if (!row.hidden) visible++;
      }
      body.hidden = visible === 0;
    }
  }
}

ArqCompareTable.define();

export { ArqCompareTable };
