// catalog-card · página Catálogos (sin set en Figma)
//
// Portada vertical y título. La tapa abre el PDF en otra pestaña.
// Referencia de layout: una grilla de tapas (el ejemplo que pidió la página).
// No confundir con download-card (Descargas: la tarjeta entera descarga,
// ratio/landscape y una bajada).
//
//   <arq-catalog-card href="/archivos/catalogo-general-2026.pdf">
//     <img slot="image" src="/img/tapa.jpg" alt="" loading="lazy">
//     <span slot="title">Catálogo general 2026</span>
//   </arq-catalog-card>
//
// - El título llega por slot. Sin imagen, la tapa queda en color/surface/subtle.
// - href: la tapa abre el PDF en otra pestaña. Sin href, la tapa no navega.

import { ArqElement } from '../../base/arq-element.js';
import css from './catalog-card.css?inline';

class ArqCatalogCard extends ArqElement {
  static tag = 'arq-catalog-card';
  static styles = css;
  static properties = {
    href: { type: String }, // PDF que abre la tapa
  };
  static template =
    `<div class="card">` +
    `<a class="cover"><span class="visually-hidden"></span><div class="card-media"><slot name="image"></slot></div></a>` +
    `<p class="title role-body"><slot name="title"></slot></p>` +
    `</div>`;

  setup() {
    this.shadowRoot.querySelector('slot[name="title"]').addEventListener('slotchange', () => this.#links());
  }

  update() {
    this.#links();
  }

  #title() {
    const slot = this.shadowRoot.querySelector('slot[name="title"]');
    const text = slot.assignedNodes({ flatten: true }).map((node) => node.textContent).join('').trim();
    return text || 'catálogo';
  }

  #links() {
    const anchor = this.shadowRoot.querySelector('.cover');
    anchor.querySelector('.visually-hidden').textContent = `Ver ${this.#title()}`;
    if (!this.href) {
      anchor.removeAttribute('href');
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
      anchor.setAttribute('aria-disabled', 'true');
      return;
    }
    anchor.removeAttribute('aria-disabled');
    anchor.href = this.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
  }
}

ArqCatalogCard.define();

export { ArqCatalogCard };
