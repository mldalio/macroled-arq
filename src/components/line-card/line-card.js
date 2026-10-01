// line-card · Figma 1036:2490 · ficha doc/line-card (1452:6102)
//
// Tarjeta editorial de línea o colección del Home: imagen, eyebrow, nombre,
// bajada y "Ver colección". Toda la tarjeta es un solo link. No confundir con
// category-card (lleva al listado) ni family-card (ficha).
//
//   <arq-line-card href="/arq/coleccion/douli">
//     <img slot="image" src="…" alt="" loading="lazy">
//     <span slot="label">Línea interior</span>
//     <h3 slot="name">Douli</h3>
//     <span slot="description">Descripción breve de la línea, su uso y su carácter.</span>
//   </arq-line-card>
//
// Link estirado (src/base/card-link.css): el <a> envuelve solo el <h3> (el
// nombre accesible es corto) y su ::after cubre la tarjeta. "Ver colección"
// se ve como button Underline pero es decorativo (aria-hidden): no es otro
// link al mismo destino. Imagen en ratio/landscape (5:4) en Desktop y
// ratio/square (1:1) en Mobile.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import cardLinkCss from '../../base/card-link.css?inline';
import css from './line-card.css?inline';

const OPTIONAL = ['label', 'description'];

class ArqLineCard extends ArqElement {
  static tag = 'arq-line-card';
  static styles = cardLinkCss + css;
  static properties = {
    href: { type: String }, // destino: la colección o el listado filtrado
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<div class="content">` +
    `<p class="label role-label" hidden><slot name="label"></slot></p>` +
    `<a class="card-link name role-heading-1"><slot name="name"></slot></a>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `<span class="cta role-body-regular" aria-hidden="true">` +
    `<span class="cta-text"><slot name="action">Ver colección</slot></span>${icon('arrow-right')}` +
    `</span>` +
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
      const link = root.querySelector('.card-link');
      if (this.href) link.setAttribute('href', this.href);
      else link.removeAttribute('href');
    }
  }
}

ArqLineCard.define();

export { ArqLineCard };
