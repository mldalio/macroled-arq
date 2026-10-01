// filter-chip · Figma 1238:3693 · ficha doc/filter-chip (1433:3371)
//
// Filtro aplicado que se puede quitar: todo el chip es el botón. Se usa en la
// fila "applied" de filter-panel.
//
//   <arq-filter-chip>8 W</arq-filter-chip>
//
// Al tocarlo dispara un click (como un <button>); filter-panel quita el filtro
// y mueve el foco al chip siguiente (o a Summary si era el último).
// Nombre accesible: "Quitar filtro 8 W".

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './filter-chip.css?inline';

class ArqFilterChip extends ArqElement {
  static tag = 'arq-filter-chip';
  static styles = css;
  static template = `<button type="button" class="chip role-body-sm"><span class="label"><slot></slot></span>${icon('close')}</button>`;

  #control = null;

  setup() {
    this.#control = this.shadowRoot.querySelector('.chip');
    const sync = () => this.#control.setAttribute('aria-label', `Quitar filtro ${this.textContent.trim()}`);
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', sync);
    sync();
  }

  /** El foco va al <button> interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }
}

ArqFilterChip.define();

export { ArqFilterChip };
