// collection-tile · Home v2 (Final 2030, collection/Kanu y siguientes)
//
// Tarjeta de colección del mosaico: foto, kicker, nombre y flecha, con tag
// opcional. Toda la tarjeta es el link. El <h3> llega por slot. En hover
// aparece la bajada (description, hidden en el Default de Figma).
//
//   <arq-collection-tile href="/arq/productos?collection=kanu" featured>
//     <img slot="image" src="…" alt="" loading="lazy">
//     <span slot="label">Línea exterior</span>
//     <h3 slot="name">Kanu</h3>
//     <span slot="description">…</span>
//   </arq-collection-tile>

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import cardLinkCss from '../../base/card-link.css?inline';
import { revealCss } from '../../base/reveal.js';
import css from './collection-tile.css?inline';

class ArqCollectionTile extends ArqElement {
  static tag = 'arq-collection-tile';
  static styles = cardLinkCss + revealCss + css;
  static properties = {
    href: { type: String },
    featured: { type: Boolean }, // muestra el tag
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<span class="scrim" aria-hidden="true"></span>` +
    `<span class="tag role-body-sm" hidden><slot name="tag">Destacada</slot></span>` +
    `<div class="info">` +
    `<p class="label role-label"><slot name="label"></slot></p>` +
    `<div class="title-row">` +
    `<a class="card-link name role-heading-2"><slot name="name"></slot></a>` +
    `${icon('arrow-up-right')}` +
    `</div>` +
    `<p class="description role-body" hidden><span class="description-inner"><slot name="description"></slot></span></p>` +
    `</div>` +
    `</div>`;

  setup() {
    this.shadowRoot.querySelector('slot[name="label"]').addEventListener('slotchange', () => this.update(new Set()));
    this.shadowRoot.querySelector('slot[name="description"]').addEventListener('slotchange', () => this.update(new Set()));
    // Cuánto baja el bloque en reposo para que la bajada quede fuera de la
    // tarjeta (la bajada, más el gap). La subida en hover es un transform (CSS).
    const info = this.shadowRoot.querySelector('.info');
    const titleRow = this.shadowRoot.querySelector('.title-row');
    new ResizeObserver(() => {
      const shift = info.offsetHeight - (titleRow.offsetTop + titleRow.offsetHeight);
      info.style.setProperty('--description-shift', `${Math.max(shift, 0)}px`);
    }).observe(info);
  }

  update() {
    const root = this.shadowRoot;
    const link = root.querySelector('.card-link');
    if (this.href) link.href = this.href;
    else link.removeAttribute('href');
    root.querySelector('.tag').hidden = !this.featured;
    const hasLabel = root
      .querySelector('slot[name="label"]')
      .assignedNodes({ flatten: true })
      .some((node) => node.textContent.trim());
    root.querySelector('.label').hidden = !hasLabel;
    const hasDescription = root
      .querySelector('slot[name="description"]')
      .assignedNodes({ flatten: true })
      .some((node) => node.textContent.trim());
    const description = root.querySelector('.description');
    if (description) description.hidden = !hasDescription;
  }
}

ArqCollectionTile.define();

export { ArqCollectionTile };
