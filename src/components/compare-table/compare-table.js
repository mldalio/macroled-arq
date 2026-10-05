// compare-table · contenedor solo de código (decisión 2026-10-02 · Comparativa)
// con compare-group (Figma 1263:4320), compare-section-group (1769:26234) y
// compare-row (Figma 1263:4317).
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
//   La identidad de cada producto la muestra arq-compare-header (arriba de la
//   tabla, en la página); acá el <thead> queda solo para la semántica de la
//   tabla (<th scope="col"> con texto visually-hidden).
// - Desktop: fila horizontal, etiqueta (layout/compare-label) + 3 valores.
//   Mobile (compare-row Breakpoint=Mobile): la etiqueta pasa a ocupar toda la
//   fila arriba y los 3 valores quedan en una fila propia debajo (sin columna
//   fija ni sticky: ya no hace falta, todo el bloque — compare-header incluido
//   — se desplaza junto, con embedded). Se logra con flex-wrap en <tr>, no con
//   un segundo <tr>; se agregan roles ARIA explícitos porque algunos lectores
//   de pantalla pierden la semántica de tabla al cambiarle el display.
// - compare-section-group: separación entre el título del grupo y su primera
//   fila (space/padding/md) y entre filas (space/gap/sm), en Mobile.
// - Con embedded, ese scroll lo maneja el contenedor de afuera (arq-comparativa,
//   junto con compare-header) y acá queda desactivado.
// - Siempre se arman 3 columnas de valor (como compare-header, que siempre
//   muestra 3 compare-product): con menos productos, las columnas de más
//   quedan en blanco en vez de desaparecer, para que las líneas de la tabla no
//   se estiren a lo ancho que haya.
// - "Solo diferencias" (prop onlyDifferences, la página la sincroniza con el
//   toggle de compare-header): oculta las filas con todos los valores iguales
//   y el grupo que queda vacío.

import { ArqElement } from '../../base/arq-element.js';
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
    embedded: { type: Boolean }, // el scroll horizontal lo maneja el contenedor de afuera
  };
  static template =
    `<div class="scroll" tabindex="0" role="region">` +
    `<table class="table" role="table"><thead role="rowgroup"></thead></table>` +
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
    MOBILE.addEventListener('change', () => this.#syncBreakpoint());
    this.#build();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.scroll').setAttribute('aria-label', this.label ?? '');
    if (changed.has('onlyDifferences')) this.#filter();
    if (changed.has('embedded')) {
      const scroll = root.querySelector('.scroll');
      // embedded: el scroll (y su foco de teclado) lo maneja el contenedor de afuera
      if (this.embedded) {
        scroll.removeAttribute('tabindex');
        scroll.removeAttribute('role');
      } else {
        scroll.setAttribute('tabindex', '0');
        scroll.setAttribute('role', 'region');
      }
    }
  }

  #build() {
    const root = this.shadowRoot;
    const table = root.querySelector('.table');
    const { products, groups } = this.#data;
    // Cabecera: solo semántica de tabla (la identidad de cada producto la
    // muestra arq-compare-header, arriba, en la página). Siempre MAX columnas.
    root.querySelector('thead').innerHTML =
      `<tr role="row"><th scope="col" class="label-cell" role="columnheader"></th>` +
      Array.from({ length: MAX }, (_, i) => products[i])
        .map((p) => `<th scope="col" class="product" role="columnheader">${p ? `<span class="visually-hidden">${esc(p.name)} (${esc(p.meta ?? p.sku)})</span>` : ''}</th>`)
        .join('') +
      `</tr>`;
    // Grupos y filas
    for (const body of table.querySelectorAll('tbody')) body.remove();
    for (const group of groups) {
      const body = document.createElement('tbody');
      body.setAttribute('role', 'rowgroup');
      body.innerHTML =
        `<tr class="group" role="row"><th scope="colgroup" colspan="${MAX + 1}" role="columnheader"><span class="group-label role-label">${esc(group.label)}</span></th></tr>` +
        (group.rows ?? [])
          .map((row) => {
            const real = products.map((_, i) => row.values?.[i] ?? '—');
            const same = real.length > 0 && real.every((v) => String(v) === String(real[0]));
            const values = Array.from({ length: MAX }, (_, i) => real[i] ?? '');
            return (
              `<tr class="row" role="row"${same ? ' data-same' : ''}><th scope="row" class="label-cell row-label" role="rowheader">${esc(row.label)}</th>` +
              values.map((v) => `<td class="value role-body-lg-regular" role="cell">${esc(v)}</td>`).join('') +
              `</tr>`
            );
          })
          .join('');
      table.append(body);
    }
    this.#syncBreakpoint();
    this.#filter();
  }

  // Mobile (como el set): etiqueta de la fila en role/body-sm (Desktop role/body).
  #syncBreakpoint() {
    const mobile = MOBILE.matches;
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
