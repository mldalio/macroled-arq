// family-card · Figma 1094:5766 · ficha doc/family-card (1463:10124)
//
// Tarjeta de otra familia (grupo) de la misma colección, en la ficha: lleva a
// la ficha de esa familia. Default en "Otras familias de la colección"; Large
// en "Explora la colección" (sección en Dark local). No confundir con
// category-card ni line-card (Home).
//
//   <arq-family-card href="/arq/producto/kanu-pared">
//     <img slot="image" src="…" alt="" loading="lazy">
//     <h3 slot="name">Kanu Pared</h3>
//   </arq-family-card>
//
// - Link estirado (src/base/card-link.css): el <a> envuelve solo el nombre.
//   Hover (borde color/border/hover en la imagen) y Focus son CSS.
// - Imagen: la misma de la product-card del grupo (estudio, luz apagada;
//   decisión 2026-10-02 · Cards), alt="" porque el nombre lo da el link.
//   Proporción del sistema (DESIGN.md §5): ratio/square en Default,
//   ratio/portrait en Large.
// - Toma el ancho de su columna; en un carrusel, el ancho lo pone la página.

import { ArqElement } from '../../base/arq-element.js';
import cardLinkCss from '../../base/card-link.css?inline';
import css from './family-card.css?inline';

class ArqFamilyCard extends ArqElement {
  static tag = 'arq-family-card';
  static styles = cardLinkCss + css;
  static properties = {
    size: { type: String, values: ['default', 'large'], default: 'default' }, // Size
    href: { type: String }, // ficha de la familia
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<a class="card-link name"><slot name="name"></slot></a>` +
    `</div>`;

  update(changed) {
    const link = this.shadowRoot.querySelector('.card-link');
    if (changed.has('href')) {
      if (this.href) link.setAttribute('href', this.href);
      else link.removeAttribute('href');
    }
    if (changed.has('size')) link.className = `card-link name ${this.size === 'large' ? 'role-heading-3' : 'role-body-lg-medium'}`;
  }
}

ArqFamilyCard.define();

export { ArqFamilyCard };
