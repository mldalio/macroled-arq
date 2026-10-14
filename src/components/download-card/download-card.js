// download-card · Figma 2496:8095 (Componentes › 7 · Cards y bloques)
//
// Tarjeta de descarga de un archivo general: en Descargas, «Catálogo
// Macroled ARQ 2026». Toda la tarjeta es un link que descarga el archivo.
// No confundir con download-item (fila del modal de descargas) ni con
// family-card (link a otra ficha).
//
//   <arq-download-card href="…/catalogo-2026.pdf" show-description>
//     <img slot="image" src="…/portada.jpg" alt="" loading="lazy">
//     <span slot="title">Catálogo Macroled ARQ 2026</span>
//     <span slot="description">Un catálogo por familia de producto</span>
//   </arq-download-card>
//
// - Link estirado (src/base/card-link.css): el <a> envuelve solo el título.
//   Hover (borde color/border/hover en la imagen) y Focus son CSS.
// - El título llega por slot; el ícono icon/download lo pone el componente.
// - download: el <a> lleva el atributo download (el archivo se baja en vez
//   de abrirse) cuando href es del mismo sitio; si no, se abre en otra pestaña.
// - Show description (en Figma, activada por defecto) es un atributo de
//   presencia: sin show-description la bajada no se ve.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import cardLinkCss from '../../base/card-link.css?inline';
import css from './download-card.css?inline';

class ArqDownloadCard extends ArqElement {
  static tag = 'arq-download-card';
  static styles = cardLinkCss + css;
  static properties = {
    href: { type: String }, // archivo a descargar
    showDescription: { type: Boolean }, // Show description
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<div class="caption">` +
    `<div class="title-row">` +
    `<a class="card-link title role-heading-3"><slot name="title"></slot></a>` +
    `<span class="icon-wrap" aria-hidden="true">${icon('download')}</span>` +
    `</div>` +
    `<p class="description role-body" hidden><slot name="description"></slot></p>` +
    `</div>` +
    `</div>`;

  update(changed) {
    const root = this.shadowRoot;
    const link = root.querySelector('.card-link');
    if (changed.has('href')) {
      if (this.href) {
        link.setAttribute('href', this.href);
        // Mismo sitio: se descarga; otro dominio: download no aplica, se abre aparte
        const external = new URL(this.href, location.href).origin !== location.origin;
        link.toggleAttribute('download', !external);
        if (external) {
          link.target = '_blank';
          link.rel = 'noopener';
        } else {
          link.removeAttribute('target');
          link.removeAttribute('rel');
        }
      } else {
        link.removeAttribute('href');
      }
    }
    root.querySelector('.description').hidden = !this.showDescription;
  }
}

ArqDownloadCard.define();

export { ArqDownloadCard };
