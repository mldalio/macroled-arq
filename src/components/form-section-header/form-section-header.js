// form-section-header · Figma 1303:4382 · ficha doc/form-section-header (1451:5929)
//
// Título de sección de un formulario largo: número opcional + label, con línea
// inferior. Es solo visual: el bloque es un <fieldset> y este componente va
// dentro de su <legend> (o de un <h2> si no agrupa campos).
//
//   <fieldset>
//     <legend><arq-form-section-header number="01" show-number>Tus datos</arq-form-section-header></legend>
//     …
//   </fieldset>

import { ArqElement } from '../../base/arq-element.js';
import css from './form-section-header.css?inline';

class ArqFormSectionHeader extends ArqElement {
  static tag = 'arq-form-section-header';
  static styles = css;
  static properties = {
    number: { type: String }, // Number ("01")
    showNumber: { type: Boolean }, // Show number
  };
  static template = `<span class="header role-label"><span class="number" hidden></span><span class="label"><slot></slot></span></span>`;

  update() {
    const number = this.shadowRoot.querySelector('.number');
    number.textContent = this.number ?? '';
    number.hidden = !this.showNumber || !this.number;
  }
}

ArqFormSectionHeader.define();

export { ArqFormSectionHeader };
