// section-header · Figma 1036:2448 · ficha doc/section-header (1452:5492)
//
// Encabezado de un bloque dentro de una página (no de la página: eso es
// page-header). Un <h2> por bloque.
//
//   <arq-section-header type="link" href="/arq/productos">
//     Productos destacados
//     <span slot="link">Ver todos los productos</span>
//   </arq-section-header>
//
//   <arq-section-header type="description">
//     Diseño que inspira
//     <span slot="description">Proyectos donde la luminaria forma parte de la arquitectura.</span>
//   </arq-section-header>
//
// El título y la bajada llegan por slot (indexables) y el componente los pone
// en su propio <h2> y <p>, así no toman los estilos de Webflow. Es un <div> y
// no un <header>: dentro del Shadow DOM podría anunciarse como el encabezado
// de toda la página.
//
// Type: Link (título + link), Description (bajada al costado), Title (solo
// título) y Stacked (bajada debajo y link opcional). El link aparece en Link y
// Stacked cuando hay href. Breakpoint no es prop: en Mobile todo se apila y
// Type=Link no muestra su link (la página pone un button al final del bloque).

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import css from './section-header.css?inline';

const SHOWS_DESCRIPTION = ['description', 'stacked'];
const SHOWS_LINK = ['link', 'stacked'];

class ArqSectionHeader extends ArqElement {
  static tag = 'arq-section-header';
  static styles = css;
  static properties = {
    type: { type: String, values: ['link', 'description', 'title', 'stacked'], default: 'link' }, // Type
    href: { type: String }, // destino del link ("Ver todo")
  };
  static template =
    `<div class="header">` +
    `<div class="text">` +
    `<h2 class="title role-heading-2"><slot></slot></h2>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `</div>` +
    `<arq-button class="link" type="underline" show-underline show-icon icon="arrow-right" hidden>` +
    `<slot name="link">Ver todo</slot></arq-button>` +
    `</div>`;

  setup() {
    this.shadowRoot.querySelector('slot[name="description"]').addEventListener('slotchange', () => this.update());
  }

  update() {
    const root = this.shadowRoot;
    const hasDescription = root
      .querySelector('slot[name="description"]')
      .assignedNodes({ flatten: true })
      .some((node) => node.textContent.trim());
    root.querySelector('.description').hidden = !SHOWS_DESCRIPTION.includes(this.type) || !hasDescription;

    const link = root.querySelector('.link');
    const hasLink = SHOWS_LINK.includes(this.type) && Boolean(this.href);
    link.hidden = !hasLink;
    if (hasLink) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
  }
}

ArqSectionHeader.define();

export { ArqSectionHeader };
