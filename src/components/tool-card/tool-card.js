// tool-card · Home v2 (Final 2072:20693 Grande · 2072:20702 Chico)
//
// Recurso para proyectar: imagen (o placeholder), título, bajada y flecha.
// Toda la tarjeta es el link.
//
//   <arq-tool-card href="/arq/descargas" size="large">
//     <span slot="title">Catálogo</span>
//     <span slot="subtitle">Un catálogo por familia de producto</span>
//     <span slot="placeholder">Imagen del catálogo</span>
//   </arq-tool-card>
//
// Size: large (Catálogo) y small (Fichas, Descargas). Sin imagen se ve el
// placeholder sobre color/surface/strong.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './tool-card.css?inline';

class ArqToolCard extends ArqElement {
  static tag = 'arq-tool-card';
  static styles = css;
  static properties = {
    href: { type: String },
    size: { type: String, values: ['large', 'small'], default: 'small' }, // Tamaño
  };
  static template =
    `<a class="card">` +
    `<span class="media">` +
    `<slot name="image"></slot>` +
    `<span class="placeholder role-caption"><slot name="placeholder"></slot></span>` +
    `</span>` +
    `<span class="caption">` +
    `<span class="title-row">` +
    `<span class="title role-body-medium"><slot name="title"></slot></span>` +
    `${icon('arrow-up-right')}` +
    `</span>` +
    `<span class="subtitle role-caption"><slot name="subtitle"></slot></span>` +
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
    const hasImage = root.querySelector('slot[name="image"]').assignedElements({ flatten: true }).length > 0;
    root.querySelector('.placeholder').hidden = hasImage;
  }
}

ArqToolCard.define();

export { ArqToolCard };
