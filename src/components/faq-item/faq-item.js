// faq-item · Figma 1036:2430 · ficha doc/faq-item (1452:5345)
//
// Pregunta frecuente desplegable (Home). No confundir con accordion-item, que
// agrupa especificaciones en la ficha.
//
//   <arq-faq-item>
//     <span slot="question">¿Desarrollan luminarias a medida para proyectos?</span>
//     Sí. Nuestro equipo técnico adapta medidas, acabados y temperatura de color.
//   </arq-faq-item>
//
// La pregunta (slot question) es el encabezado: un <button> con aria-expanded
// (Disclosure). La respuesta (slot por defecto) queda en el HTML aunque esté
// cerrada (indexable). Pueden quedar varios abiertos a la vez.
//
// Open es la prop open. State no es prop: Hover (:hover, solo cerrado, como
// en el set) y Focus (:focus-visible, anillo alrededor de todo el ítem).

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './faq-item.css?inline';

class ArqFaqItem extends ArqElement {
  static tag = 'arq-faq-item';
  static styles = css;
  static properties = {
    open: { type: Boolean }, // Open
  };
  static template =
    `<div class="item">` +
    `<button type="button" class="trigger">` +
    `<span class="question role-body-lg-regular"><slot name="question"></slot></span>` +
    `${icon('plus')}${icon('minus')}` +
    `</button>` +
    `<div class="answer role-body" part="panel"><slot></slot></div>` +
    `</div>`;

  setup() {
    this.disclosure = new Disclosure(this, {
      trigger: this.shadowRoot.querySelector('.trigger'),
      panel: this.shadowRoot.querySelector('.answer'),
    });
  }
}

ArqFaqItem.define();

export { ArqFaqItem };
