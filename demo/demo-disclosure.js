// Ejemplo mínimo de la base (solo demo, no entra al build).
// No es un componente del sistema: sin prefijo arq- para no confundirlo con
// accordion-item o faq-item. Prueba ArqElement + Disclosure + icon().

import { ArqElement } from '/src/base/arq-element.js';
import { Disclosure } from '/src/base/disclosure.js';
import { icon } from '/src/base/icons.js';
import css from './demo-disclosure.css?inline';

class DemoDisclosure extends ArqElement {
  static tag = 'demo-disclosure';
  static styles = css;
  static properties = {
    open: { type: Boolean },
  };
  static template = `
    <button class="trigger role-body-lg-regular">
      <slot name="label"></slot>
      ${icon('plus')}${icon('minus')}
    </button>
    <div class="panel role-body" part="panel"><slot></slot></div>
  `;

  setup() {
    this.disclosure = new Disclosure(this, {
      trigger: this.shadowRoot.querySelector('.trigger'),
      panel: this.shadowRoot.querySelector('.panel'),
    });
  }
}

DemoDisclosure.define();
