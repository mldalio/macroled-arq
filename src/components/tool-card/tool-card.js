// tool-card · Home v2 (Final 2072:20693 Grande · 2072:20702 Chico)
//
// Recurso para proyectar. Toda la tarjeta es el link.
//
//   <arq-tool-card href="/arq/descargas" size="large">
//     <span slot="title">Catálogo</span>
//     <span slot="subtitle">Un catálogo por familia de producto</span>
//     <span slot="placeholder">Imagen del catálogo</span>
//   </arq-tool-card>
//
//   <arq-tool-card type="index" href="/arq/descargas">
//     <span slot="index">01</span>
//     <span slot="title">Catálogo</span>
//     <span slot="subtitle">Un catálogo por familia de producto</span>
//   </arq-tool-card>
//
// Type=media (def.): imagen o placeholder, título, bajada y flecha.
// Size: large y small. Sin imagen se ve el placeholder sobre color/surface/strong.
// Type=index: fila sin imagen. Número, título, bajada y flecha, con la línea
// del encabezado editorial. TODO (diseño): no está en el set de Figma.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './tool-card.css?inline';

class ArqToolCard extends ArqElement {
  static tag = 'arq-tool-card';
  static styles = css;
  static properties = {
    href: { type: String },
    size: { type: String, values: ['large', 'small'], default: 'small' }, // Tamaño
    type: { type: String, values: ['media', 'index'], default: 'media' }, // Type
  };
  static template =
    `<a class="card">` +
    `<span class="index role-label" hidden><slot name="index"></slot></span>` +
    `<span class="media">` +
    `<slot name="image"></slot>` +
    `<span class="placeholder role-caption"><slot name="placeholder"></slot></span>` +
    `</span>` +
    `<span class="caption">` +
    `<span class="title-row">` +
    `<span class="title"><slot name="title"></slot></span>` +
    `${icon('arrow-up-right')}` +
    `</span>` +
    `<span class="subtitle"><slot name="subtitle"></slot></span>` +
    `</span>` +
    `</a>`;

  setup() {
    this.shadowRoot.querySelector('slot[name="image"]').addEventListener('slotchange', () => this.update());
  }

  update() {
    const root = this.shadowRoot;
    const card = root.querySelector('.card');
    if (this.href) card.href = this.href;
    else card.removeAttribute('href');
    const index = this.type === 'index';
    root.querySelector('.media').hidden = index;
    root.querySelector('.index').hidden = !index;
    root.querySelector('.title').className = `title ${index ? 'role-heading-3-light' : 'role-body-medium'}`;
    root.querySelector('.subtitle').className = `subtitle ${index ? 'role-body' : 'role-caption'}`;
    const hasImage = root.querySelector('slot[name="image"]').assignedElements({ flatten: true }).length > 0;
    root.querySelector('.placeholder').hidden = hasImage;
  }
}

ArqToolCard.define();

export { ArqToolCard };
