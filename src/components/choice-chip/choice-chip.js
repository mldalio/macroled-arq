// choice-chip · Figma 1113:2485 · ficha doc/choice-chip (1451:5647)
//
// Opción en forma de chip para elegir entre pocas opciones visibles en un
// formulario (motivo de consulta en Contacto). Se comporta como radio: una
// selección por grupo. No confundir con option-tile (ficha).
//
//   <arq-choice-chip name="motivo" value="presupuesto">Presupuesto</arq-choice-chip>
//
// Va con el formulario como un radio nativo: el chip elegido manda name=value
// (ElementInternals). Las flechas y la selección única las maneja el grupo
// (SingleSelect; el contenedor del grupo todavía no está construido).

import { ArqElement } from '../../base/arq-element.js';
import { Selectable } from '../../base/selectable.js';
import css from './choice-chip.css?inline';

class ArqChoiceChip extends ArqElement {
  static tag = 'arq-choice-chip';
  static styles = css;
  static formAssociated = true;
  static properties = {
    selected: { type: Boolean }, // State=Selected
    disabled: { type: Boolean }, // State=Disabled
    name: { type: String },
    value: { type: String },
  };
  static template = `<span class="chip role-body-regular"><slot></slot></span>`;

  #internals = this.attachInternals();
  #initial = false;

  setup() {
    this.#initial = this.selected;
    this.selectable = new Selectable(this, { role: 'radio', state: 'aria-checked' });
  }

  update() {
    // Como un radio: solo el elegido manda su valor.
    this.#internals.setFormValue(this.selected ? (this.value ?? 'on') : null);
  }

  formResetCallback() {
    this.selected = this.#initial;
  }
}

ArqChoiceChip.define();

export { ArqChoiceChip };
