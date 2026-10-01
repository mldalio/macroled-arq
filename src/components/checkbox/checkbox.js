// checkbox · Figma 975:2322 · ficha doc/checkbox (1430:2811)
//
// Checkbox con label. Filtros (filter-row, Size=Large) y "Comparar" en
// product-card (Size=Default; va fuera del link de la tarjeta).
//
//   <arq-checkbox name="comparar" value="KANU-J-500" show-label>Comparar</arq-checkbox>
//   <arq-checkbox size="large" checked show-label>Exterior</arq-checkbox>
//
// Es un <input type="checkbox"> real (dentro del Shadow DOM) con su <label>:
// toda la fila es clickeable. Va con el formulario por ElementInternals
// (name=value cuando está marcado). Emite arq:change { checked, value }.

import { ArqElement } from '../../base/arq-element.js';
import css from './checkbox.css?inline';

class ArqCheckbox extends ArqElement {
  static tag = 'arq-checkbox';
  static styles = css;
  static formAssociated = true;
  static properties = {
    size: { type: String, values: ['default', 'large'], default: 'default' }, // Size
    checked: { type: Boolean }, // Checked
    disabled: { type: Boolean }, // State=Disabled
    showLabel: { type: Boolean }, // Show label
    name: { type: String },
    value: { type: String, default: 'on' },
  };
  static template =
    `<label class="row">` +
    `<input type="checkbox" class="native visually-hidden">` +
    `<span class="control" aria-hidden="true"><span class="box"></span></span>` +
    `<span class="label"><slot></slot></span>` +
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
    const input = this.#input;
    input.checked = this.checked;
    input.disabled = this.disabled;
    // Show label=false: el texto queda solo para lectores de pantalla.
    this.shadowRoot.querySelector('.label').classList.toggle('visually-hidden', !this.showLabel);
    this.shadowRoot.querySelector('.label').classList.toggle('role-body', this.size !== 'large');
    this.shadowRoot.querySelector('.label').classList.toggle('role-body-lg', this.size === 'large');
    this.#internals.setFormValue(this.checked ? this.value : null);
  }

  formResetCallback() {
    this.checked = this.#initial;
  }

  formDisabledCallback(disabled) {
    this.#input.disabled = disabled || this.disabled;
  }
}

ArqCheckbox.define();

export { ArqCheckbox };
