// page-header · Figma 1244:4016 · ficha doc/page-header (1424:1703)
//
// Encabezado de la página: breadcrumb, título (el único <h1>) y bajada. Va
// después del navbar y antes del contenido; uno solo por página.
//
//   <arq-page-header show-breadcrumb show-description>
//     <arq-breadcrumb slot="breadcrumb">…</arq-breadcrumb>
//     <h1 slot="title">Productos</h1>
//     <span slot="description">Luminarias para interior y exterior.</span>
//   </arq-page-header>
//
//   <arq-page-header type="detail" show-back back-href="/arq/productos" show-description show-action>
//     <span slot="back">Volver a productos</span>
//     <h1 slot="title">Comparativa</h1>
//     <span slot="description">…</span>
//     <arq-button slot="action" show-icon icon="download" data-arq-print>Descargar comparación</arq-button>
//   </arq-page-header>
//
// El <h1> llega por slot title (AGENTS.md: los encabezados van en el HTML) y
// toma el estilo del contenedor (::slotted de la hoja base): role/display-lg
// en Desktop Type=List y role/display en Mobile y en Type=Detail. Es un
// <div> y no un <header> (dentro del Shadow DOM podría tomarse como el banner
// de la página). Aplica su propio layout/gutter, como navbar y footer.
//
// Type=List: breadcrumb + título a la izquierda y bajada a la derecha (Desktop).
// Type=Detail: Volver arriba; título con la bajada debajo y acción a la derecha.
// Show breadcrumb, Show description, Show back y Show action vienen en true en
// Figma; en código son atributos de presencia (sin el atributo no se ven).

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import css from './page-header.css?inline';

const mobile = matchMedia('(max-width: 767px)');

class ArqPageHeader extends ArqElement {
  static tag = 'arq-page-header';
  static styles = css;
  static properties = {
    type: { type: String, values: ['list', 'detail'], default: 'list' }, // Type
    showBreadcrumb: { type: Boolean }, // Show breadcrumb
    showDescription: { type: Boolean }, // Show description
    showBack: { type: Boolean }, // Show back (solo Detail)
    showAction: { type: Boolean }, // Show action (solo Detail)
    backHref: { type: String }, // destino de Volver: la página padre
    searchTitle: { type: Boolean }, // solo de código: título de búsqueda en role/display
  };
  static template =
    `<div class="header">` +
    `<arq-button class="back" type="underline" show-leading-icon leading-icon="chevron-left" hidden><slot name="back"></slot></arq-button>` +
    `<div class="row">` +
    `<div class="main">` +
    `<div class="heading">` +
    `<div class="breadcrumb" hidden><slot name="breadcrumb"></slot></div>` +
    `<div class="title role-display"><slot name="title"></slot></div>` +
    `</div>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `</div>` +
    `<div class="action" hidden><slot name="action"></slot></div>` +
    `</div>` +
    `</div>`;

  setup() {
    for (const slot of this.shadowRoot.querySelectorAll('slot[name]')) {
      slot.addEventListener('slotchange', () => this.update());
    }
    mobile.addEventListener('change', () => this.update());
  }

  update() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    const detail = this.type === 'detail';

    root.querySelector('.breadcrumb').hidden = !this.showBreadcrumb || !filled('breadcrumb');
    root.querySelector('.description').hidden = !this.showDescription || !filled('description');
    root.querySelector('.action').hidden = !detail || !this.showAction || !filled('action');

    // Volver es un link real a la página padre (no history.back): funciona si se entra directo.
    const back = root.querySelector('.back');
    const hasBack = detail && this.showBack && Boolean(this.backHref) && filled('back');
    back.hidden = !hasBack;
    if (hasBack) back.setAttribute('href', this.backHref);
    else back.removeAttribute('href');

    // Desktop Type=List: título role/display-lg y bajada role/body. Mobile y
    // Type=Detail: role/display y role/body-lg.
    // search-title (solo de código): "Resultados para «…»" va en role/display.
    const large = !detail && !mobile.matches && !this.searchTitle;
    const title = root.querySelector('.title');
    title.classList.toggle('role-display-lg', large);
    title.classList.toggle('role-display', !large);
    const description = root.querySelector('.description');
    description.classList.toggle('role-body', large);
    description.classList.toggle('role-body-lg', !large);
  }
}

ArqPageHeader.define();

export { ArqPageHeader };
