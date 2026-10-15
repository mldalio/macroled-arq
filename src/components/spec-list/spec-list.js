// spec-list · Figma 922:2500 · ficha doc/spec-list (1462:8935)
//
// Lista de spec-row: una sola columna en Fill (ficha doc/spec-list, set de
// accordion-item y Ficha de Final). La cantidad de filas es libre: salen de
// los datos del SKU elegido.
//
//   <arq-spec-list>
//     <arq-spec-row><span slot="label">Flujo luminoso</span>850 lm</arq-spec-row>
//     <arq-spec-row><span slot="label">CRI</span>90</arq-spec-row>
//   </arq-spec-list>
//
// columns (solo de código): reparte las filas en dos columnas desde 1024 px,
// como la Ficha v2 (dos spec-list en Figma).
//
// La última fila de cada columna no lleva línea inferior (cierra la del
// acordeón): la lista la marca con data-arq-last, porque con dos columnas la
// última de la izquierda depende de cuántas filas haya.
//
// Sin prop Title (decisión 2026-10-02 · accordion-item): el set no tiene capa de
// título; el nombre del bloque lo da el accordion-item que la contiene.
// Cada spec-row arma su propio <dl> (los <dt>/<dd> no cruzan el Shadow DOM).

import { ArqElement } from '../../base/arq-element.js';
import css from './spec-list.css?inline';

class ArqSpecList extends ArqElement {
  static tag = 'arq-spec-list';
  static styles = css;
  static properties = {
    columns: { type: Boolean }, // solo de código: dos columnas desde 1024 px
  };
  static template = `<div class="list"><slot></slot></div>`;

  setup() {
    this.slotEl = this.shadowRoot.querySelector('slot');
    this.wide = window.matchMedia('(min-width: 1024px)');
    this.slotEl.addEventListener('slotchange', () => this.#mark());
    this.wide.addEventListener('change', () => this.#mark());
  }

  update() {
    this.#mark();
  }

  // Dos columnas: la izquierda se llena primero (ceil(n / 2) filas por columna)
  #mark() {
    const rows = this.slotEl.assignedElements();
    const per = this.columns && this.wide.matches ? Math.ceil(rows.length / 2) : rows.length;
    this.style.setProperty('--rows', per);
    rows.forEach((row, i) => row.toggleAttribute('data-arq-last', (i + 1) % per === 0));
  }
}

ArqSpecList.define();

export { ArqSpecList };
