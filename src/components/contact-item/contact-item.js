// contact-item · Figma 1303:4340 · ficha doc/contact-item (1452:5702)
//
// Canal de contacto (Contacto): etiqueta + valor como link.
//
//   <arq-contact-item href="mailto:info@macroled.com.ar">
//     <span slot="label">Email</span>info@macroled.com.ar
//   </arq-contact-item>
//   <arq-contact-item href="tel:+541100000000"><span slot="label">Teléfono</span>+54 11 0000-0000</arq-contact-item>
//
// - Label (slot label): role/label en color/text/tertiary; la mayúscula la
//   pone el estilo. Value (slot por defecto): role/body-lg-regular en
//   color/text/primary, dentro de un <a> (mailto:, tel: o https: para
//   WhatsApp y dirección). Sin href, el valor es texto.
// - State no es prop: Hover subraya el valor; Focus pone el anillo alrededor
//   del ítem.
// - Línea color/border/subtle arriba, como el set. La descripción y la ficha
//   dicen "borde inferior": TODO (diseño) confirmar.

import { ArqElement } from '../../base/arq-element.js';
import css from './contact-item.css?inline';

class ArqContactItem extends ArqElement {
  static tag = 'arq-contact-item';
  static styles = css;
  static properties = {
    href: { type: String },
  };
  static template =
    `<div class="item">` +
    `<span class="label role-label"><slot name="label"></slot></span>` +
    `<a class="value role-body-lg-regular"><slot></slot></a>` +
    `</div>`;

  focus(options) {
    this.shadowRoot.querySelector('.value').focus(options);
  }

  update() {
    const value = this.shadowRoot.querySelector('.value');
    if (this.href) value.setAttribute('href', this.href);
    else value.removeAttribute('href');
  }
}

ArqContactItem.define();

export { ArqContactItem };
