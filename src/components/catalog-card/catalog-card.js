// catalog-card · página Catálogos (sin set en Figma)
//
// Portada vertical, título y dos acciones: ver el PDF y descargarlo.
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
// - href: el mismo archivo para ver (pestaña nueva) y descargar. Del mismo
//   sitio, descargar lleva el atributo download; de otro dominio los dos se
//   abren en otra pestaña (download no aplica entre dominios).
// - Sin href las acciones se ven y no navegan. TODO (datos): las URL de los PDF.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './catalog-card.css?inline';

class ArqCatalogCard extends ArqElement {
  static tag = 'arq-catalog-card';
  static styles = css;
  static properties = {
    href: { type: String }, // PDF: ver y descargar
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<div class="caption">` +
    `<p class="title role-body"><slot name="title"></slot></p>` +
    `<div class="actions">` +
    `<a class="action view">${icon('eye')}<span class="visually-hidden"></span></a>` +
    `<a class="action download">${icon('download')}<span class="visually-hidden"></span></a>` +
    `</div>` +
    `</div>` +
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
    const title = this.#title();
    const external = this.href ? new URL(this.href, location.href).origin !== location.origin : false;
    this.#link(this.shadowRoot.querySelector('.view'), `Ver ${title}`, { external, download: false });
    this.#link(this.shadowRoot.querySelector('.download'), `Descargar ${title}`, { external, download: true });
  }

  #link(anchor, label, { external, download }) {
    anchor.querySelector('.visually-hidden').textContent = label;
    if (!this.href) {
      anchor.removeAttribute('href');
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
      anchor.removeAttribute('download');
      anchor.setAttribute('aria-disabled', 'true');
      return;
    }
    anchor.removeAttribute('aria-disabled');
    anchor.href = this.href;
    if (download && !external) {
      anchor.setAttribute('download', '');
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
    } else {
      anchor.removeAttribute('download');
      anchor.target = '_blank';
      anchor.rel = 'noopener';
    }
  }
}

ArqCatalogCard.define();

export { ArqCatalogCard };
