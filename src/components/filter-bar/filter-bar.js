// filter-bar · Figma 1068:5165 · ficha doc/filter-bar
//
// Barra de filtros de la tabla de variantes (visible con Filtros activos):
// una celda select Type=Filter por atributo y "Limpiar filtros".
//
//   <arq-filter-bar>
//     <arq-select type="filter" label="Acabado" name="color_carcasa"></arq-select>
//     <arq-select type="filter" label="Altura" name="altura"></arq-select>
//   </arq-filter-bar>
//
// - Componente de borde a borde: el fondo llega al borde de la página y el
//   contenido lleva layout/gutter a los lados.
// - State=Applied se pone solo (applied) cuando algún select tiene valor:
//   aparece "Limpiar filtros" (button Underline), que vuelve todo a "Todos".
// - Emite arq:filters { filters } ({ name: value }) cuando cambia un select o
//   se limpian. Desktop: celdas en fila con divisores; Mobile: en columna.

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import '../select/select.js';
import css from './filter-bar.css?inline';

class ArqFilterBar extends ArqElement {
  static tag = 'arq-filter-bar';
  static styles = css;
  static properties = {
    applied: { type: Boolean }, // State=Applied (lo pone el componente)
  };
  static template =
    `<div class="bar">` +
    `<div class="filters" role="group" aria-label="Filtros"><slot></slot></div>` +
    `<arq-button type="underline" show-underline class="clear" hidden>Limpiar filtros</arq-button>` +
    `</div>`;

  setup() {
    this.addEventListener('arq:change', (event) => {
      if (event.target.localName !== 'arq-select') return;
      event.stopPropagation();
      this.#changed();
    });
    this.shadowRoot.querySelector('.clear').addEventListener('click', () => this.clear());
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => this.#sync());
    this.#sync();
  }

  /** Selects de la barra. */
  get selects() {
    return [...this.querySelectorAll(':scope > arq-select')];
  }

  /** Valores elegidos: { name: value } (sin los que están en "Todos"). */
  get filters() {
    const filters = {};
    for (const select of this.selects) if (select.value) filters[select.name ?? ''] = select.value;
    return filters;
  }

  /** "Limpiar filtros": todo vuelve a "Todos". */
  clear() {
    for (const select of this.selects) select.value = '';
    this.#changed();
    this.selects[0]?.focus();
  }

  #changed() {
    this.#sync();
    this.emit('filters', { filters: this.filters });
  }

  #sync() {
    const applied = this.selects.some((select) => Boolean(select.value));
    if (this.applied !== applied) this.applied = applied;
    this.shadowRoot.querySelector('.clear').hidden = !applied;
  }
}

ArqFilterBar.define();

export { ArqFilterBar };
