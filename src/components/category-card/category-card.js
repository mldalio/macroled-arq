// category-card · Figma 1036:2461 · ficha doc/category-card (1452:5984)
//
// Tarjeta de categoría del Home (Interior, Exterior…): imagen + nombre +
// flecha. Toda la tarjeta lleva al listado filtrado. No confundir con
// line-card (editorial) ni family-card (ficha).
//
//   <arq-category-card href="/arq/productos…">
//     <img slot="image" src="…" alt="" loading="lazy">
//     <span slot="name">Interior</span>
//   </arq-category-card>
//
// Link estirado (src/base/card-link.css): el <a> envuelve solo el nombre y su
// ::after cubre la tarjeta. Imagen en ratio/portrait-soft (4:5) en Desktop y
// Mobile. State no es prop: Hover y Focus por CSS sobre toda la tarjeta.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import cardLinkCss from '../../base/card-link.css?inline';
import css from './category-card.css?inline';

class ArqCategoryCard extends ArqElement {
  static tag = 'arq-category-card';
  static styles = cardLinkCss + css;
  static properties = {
    href: { type: String }, // destino: el listado filtrado
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<div class="caption">` +
    `<a class="card-link name role-heading-3"><slot name="name"></slot></a>` +
    `${icon('arrow-right')}` +
    `</div>` +
    `</div>`;

  update(changed) {
    if (!changed.has('href')) return;
    const link = this.shadowRoot.querySelector('.card-link');
    if (this.href) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
  }
}

ArqCategoryCard.define();

export { ArqCategoryCard };
