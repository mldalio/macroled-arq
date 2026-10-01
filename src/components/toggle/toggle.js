// toggle · Figma 926:3102 (+ toggle-switch 1131:6383) · fichas doc/toggle (1427:2707) y doc/toggle-switch (1427:2912)
//
// Interruptor con texto para opciones que se aplican al instante: "Iluminar"
// (modo Dark) o "Solo diferencias" (Comparativa). Si el cambio se confirma con
// un botón, se usa checkbox.
//
//   <arq-toggle show-label>Iluminar</arq-toggle>
//   <arq-toggle checked show-label>Solo diferencias</arq-toggle>
//
// El switch (pista + círculo) es toggle-switch: va siempre adentro, no es un
// elemento propio. Es un <input type="checkbox" role="switch"> real: todo el
// componente es clickeable, incluido el texto. Emite arq:change { checked }.
// Pasar la página a Dark con Iluminar lo hace la página (no el toggle).

import { ArqElement } from '../../base/arq-element.js';
import css from './toggle.css?inline';

class ArqToggle extends ArqElement {
  static tag = 'arq-toggle';
  static styles = css;
  static formAssociated = true;
  static properties = {
    checked: { type: Boolean }, // Checked
    disabled: { type: Boolean }, // State=Disabled
    showLabel: { type: Boolean }, // Show label
    name: { type: String },
    value: { type: String, default: 'on' },
  };
  static template =
    `<label class="toggle">` +
    `<input type="checkbox" role="switch" class="native visually-hidden">` +
    `<span class="track" aria-hidden="true"><span class="thumb"></span></span>` +
    `<span class="label role-body-regular"><slot></slot></span>` +
    `</label>`;

  #internals = this.attachInternals();
  #input = null;
  #initial = false;

  setup() {
    this.#initial = this.checked;
    this.#input = this.shadowRoot.querySelector('input');
    this.#input.addEventListener('change', () => {
      this.checked = this.#input.checked;
      this.emit('change', { checked: this.#input.checked, value: this.value });
    });
  }

  /** El foco va al <input> interno. */
  focus(options) {
    if (this.#input) this.#input.focus(options);
    else super.focus(options);
  }

  update() {
    this.#input.checked = this.checked;
    this.#input.disabled = this.disabled;
    // Show label=false: el texto queda solo para lectores de pantalla.
    this.shadowRoot.querySelector('.label').classList.toggle('visually-hidden', !this.showLabel);
    this.#internals.setFormValue(this.checked ? this.value : null);
  }

  formResetCallback() {
    this.checked = this.#initial;
  }

  formDisabledCallback(disabled) {
    this.#input.disabled = disabled || this.disabled;
  }
}

ArqToggle.define();

export { ArqToggle };
