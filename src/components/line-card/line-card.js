// line-card · Figma 1036:2490 · ficha doc/line-card (1452:6102)
//
// Tarjeta editorial de línea o colección del Home: imagen, eyebrow, nombre,
// bajada y "Ver colección". El único link es el botón: la imagen y el nombre
// no son clickeables. No confundir con category-card (toda la tarjeta lleva
// al listado) ni family-card (ficha).
//
//   <arq-line-card href="/arq/coleccion/douli">
//     <img slot="image" src="…" alt="" loading="lazy">
//     <span slot="label">Línea interior</span>
//     <h3 slot="name">Douli</h3>
//     <span slot="description">Descripción breve de la línea, su uso y su carácter.</span>
//   </arq-line-card>
//
// "Ver colección" es un arq-button Underline con Show underline y flecha, con
// el href de la tarjeta (docs/decisiones.md, 2026-10-05 · line-card: el link
// es el botón). Imagen en ratio/landscape (5:4) en Desktop y ratio/square
// (1:1) en Mobile.

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import cardLinkCss from '../../base/card-link.css?inline';
import css from './line-card.css?inline';

const OPTIONAL = ['label', 'description'];

class ArqLineCard extends ArqElement {
  static tag = 'arq-line-card';
  // card-link.css: solo por la imagen por slot (.card-media); la tarjeta no
  // usa el link estirado.
  static styles = cardLinkCss + css;
  static properties = {
    href: { type: String }, // destino del botón: la colección o el listado filtrado
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<div class="content">` +
    `<p class="label role-label" hidden><slot name="label"></slot></p>` +
    `<div class="name role-heading-1"><slot name="name"></slot></div>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `<arq-button class="cta" type="underline" show-underline show-icon icon="arrow-right">` +
    `<slot name="action">Ver colección</slot>` +
    `</arq-button>` +
    `</div>` +
    `</div>`;

  setup() {
    for (const name of OPTIONAL) {
      this.shadowRoot.querySelector(`slot[name="${name}"]`).addEventListener('slotchange', () => this.update(new Set()));
    }
  }

  update(changed) {
    const root = this.shadowRoot;
    for (const name of OPTIONAL) {
      root.querySelector(`.${name}`).hidden = !root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    }
    if (changed.has('href')) {
      const button = root.querySelector('.cta');
      if (this.href) button.setAttribute('href', this.href);
      else button.removeAttribute('href');
    }
  }
}

ArqLineCard.define();

export { ArqLineCard };
