// filter-row · Figma 1225:3405 · ficha doc/filter-row (1433:3170)
//
// Fila desplegable de filter-panel: un atributo técnico (Potencia,
// Temperatura…) con sus opciones como checkbox Size=Large.
//
//   <arq-filter-row open>
//     <span slot="label">Potencia</span>
//     <arq-checkbox size="large" show-label name="potencia" value="8">8 W</arq-checkbox>
//     <arq-checkbox size="large" show-label name="potencia" value="12">12 W</arq-checkbox>
//   </arq-filter-row>
//
// - Encabezado <button> con aria-expanded (Disclosure). Las opciones quedan
//   agrupadas (role="group") con el nombre del atributo: la ficha pide
//   fieldset + legend, que no se pueden armar con contenido por slot.
// - Open lo decide la página: abierta si tiene filtros aplicados.
// - Cantidad de opciones libre: solo las que existen en el listado (facets).
// - Hover (solo en desktop) y Focus son CSS. Se sigue al set: Hover cambia la
//   línea y el ícono, sin fondo (la ficha dice color/surface/hover).

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import '../checkbox/checkbox.js';
import css from './filter-row.css?inline';

class ArqFilterRow extends ArqElement {
  static tag = 'arq-filter-row';
  static styles = css;
  static properties = {
    open: { type: Boolean }, // Open
  };
  static template =
    `<div class="row">` +
    `<button type="button" class="header">` +
    `<span class="label role-body-xl"><slot name="label"></slot></span>` +
    `<span class="icon-box">${icon('plus')}${icon('minus')}</span>` +
    `</button>` +
    `<div class="options" role="group" part="panel"><slot></slot></div>` +
    `</div>`;

  setup() {
    this.disclosure = new Disclosure(this, {
      trigger: this.shadowRoot.querySelector('.header'),
      panel: this.shadowRoot.querySelector('.options'),
    });
    const options = this.shadowRoot.querySelector('.options');
    const name = () => options.setAttribute('aria-label', this.querySelector('[slot="label"]')?.textContent.trim() ?? '');
    this.shadowRoot.querySelector('slot[name="label"]').addEventListener('slotchange', name);
    name();
  }

  /** Checkbox de la fila. */
  get options() {
    return [...this.querySelectorAll(':scope > arq-checkbox')];
  }
}

ArqFilterRow.define();

export { ArqFilterRow };
