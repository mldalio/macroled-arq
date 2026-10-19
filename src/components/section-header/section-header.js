// section-header · Figma 1036:2448 · ficha doc/section-header (1452:5492)
//
// Encabezado de un bloque dentro de una página (no de la página: eso es
// page-header). Un <h2> por bloque, escrito en el HTML de la página.
//
//   <arq-section-header type="link" href="/arq/productos">
//     <h2 slot="title">Productos destacados</h2>
//     <span slot="link">Ver todos los productos</span>
//   </arq-section-header>
//
//   <arq-section-header type="description">
//     <h2 slot="title">Diseño que inspira</h2>
//     <span slot="description">Proyectos donde la luminaria forma parte de la arquitectura.</span>
//   </arq-section-header>
//
// El <h2> llega por slot title (AGENTS.md: los encabezados van en el HTML) y
// toma role/heading-2 del contenedor (::slotted de la hoja base). La bajada
// llega por slot y el componente la pone en su <p>. Es un <div> y no un
// <header>: dentro del Shadow DOM podría anunciarse como el encabezado de toda
// la página.
//
// Type: Link (título + link), Description (bajada al costado), Title (solo
// título) y Stacked (bajada debajo y link opcional). El link aparece en Link y
// Stacked cuando hay href. Breakpoint no es prop: en Mobile todo se apila y
// Type=Link no muestra su link (la página pone un button al final del bloque).

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import css from './section-header.css?inline';

const SHOWS_DESCRIPTION = ['description', 'stacked', 'editorial'];
const SHOWS_LINK = ['link', 'stacked'];

class ArqSectionHeader extends ArqElement {
  static tag = 'arq-section-header';
  static styles = css;
  static properties = {
    type: { type: String, values: ['link', 'description', 'title', 'stacked', 'editorial'], default: 'link' }, // Type
    href: { type: String }, // destino del link ("Ver todo")
  };
  static template =
    `<div class="header">` +
    `<div class="text">` +
    `<div class="title-block">` +
    `<p class="kicker role-label" hidden><slot name="kicker"></slot></p>` +
    `<div class="title role-heading-2"><slot name="title"></slot></div>` +
    `</div>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `</div>` +
    `<arq-button class="link" type="underline" show-underline show-icon icon="arrow-right" hidden>` +
    `<slot name="link">Ver todo</slot></arq-button>` +
    `</div>`;

  setup() {
    for (const name of ['description', 'kicker']) {
      this.shadowRoot.querySelector(`slot[name="${name}"]`).addEventListener('slotchange', () => this.update());
    }
  }

  update() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.textContent.trim());
    const editorial = this.type === 'editorial';
    root.querySelector('.description').hidden = !SHOWS_DESCRIPTION.includes(this.type) || !filled('description');
    root.querySelector('.kicker').hidden = !editorial || !filled('kicker');
    root.querySelector('.title').classList.toggle('role-display-sm', editorial);
    root.querySelector('.title').classList.toggle('role-heading-2', !editorial);
    root.querySelector('.description').classList.toggle('role-body', editorial);
    root.querySelector('.description').classList.toggle('role-body-lg', !editorial);

    const link = root.querySelector('.link');
    const hasLink = SHOWS_LINK.includes(this.type) && Boolean(this.href);
    link.hidden = !hasLink;
    if (hasLink) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
  }
}

ArqSectionHeader.define();

export { ArqSectionHeader };
