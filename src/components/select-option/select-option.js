// select-option · Figma 921:2500 · ficha doc/select-option (1461:8627)
//
// Opción de select-menu: muestra de acabado opcional + nombre. Sirve para
// acabados y para "Todos" o valores sin muestra.
//
//   <arq-select-option value="black" show-swatch swatch-src="…/black.jpg">Negro</arq-select-option>
//   <arq-select-option value="all" selected>Todos</arq-select-option>
//
// El elemento es la opción (role="option", aria-selected, aria-disabled). El
// foco y el teclado los maneja select: el foco queda en el campo y la opción
// resaltada se marca con aria-activedescendant + active (State=Focus).

import { ArqElement } from '../../base/arq-element.js';
import css from './select-option.css?inline';

class ArqSelectOption extends ArqElement {
  static tag = 'arq-select-option';
  static styles = css;
  static properties = {
    showSwatch: { type: Boolean }, // Show swatch
    swatchSrc: { type: String }, // imagen del acabado (de los datos)
    selected: { type: Boolean }, // State=Selected
    disabled: { type: Boolean }, // State=Disabled
    active: { type: Boolean }, // State=Focus: la opción resaltada con las flechas (aria-activedescendant)
    value: { type: String },
  };
  static template = `<span class="option"><span class="swatch" aria-hidden="true" hidden><img alt="" hidden></span><span class="name role-body"><slot></slot></span></span>`;

  setup() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'option');
    const img = this.shadowRoot.querySelector('img');
    // Sin imagen (o si no carga): queda el fondo color/surface/subtle.
    img.addEventListener('error', () => (img.hidden = true));
    img.addEventListener('load', () => (img.hidden = false));
    this.addEventListener('click', () => {
      if (this.disabled) return;
      this.emit('change', { value: this.value, selected: true });
    });
  }

  update(changed) {
    this.setAttribute('aria-selected', String(this.selected));
    if (this.disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
    this.shadowRoot.querySelector('.swatch').hidden = !this.showSwatch;
    const name = this.shadowRoot.querySelector('.name');
    name.classList.toggle('role-body', !this.selected);
    name.classList.toggle('role-body-medium', this.selected);
    if (changed.has('swatchSrc')) {
      const img = this.shadowRoot.querySelector('img');
      if (this.swatchSrc) img.src = this.swatchSrc;
      else {
        img.removeAttribute('src');
        img.hidden = true;
      }
    }
  }
}

ArqSelectOption.define();

export { ArqSelectOption };
