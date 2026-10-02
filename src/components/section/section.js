// section · componente de layout de página (sin set en Figma; pantallas de Final)
//
// Bloque de página: margen lateral layout/gutter, padding inferior
// space/section/xl y el armado encabezado → contenido → acción. Lo usan las
// páginas de src/pages/ (decisiones.md, 2026-10-02 · Layout de página).
//
//   <arq-section padding-top>
//     <arq-section-header slot="header" type="link" href="/arq/productos">
//       <h2 slot="title">Explorar por espacio</h2>
//       <span slot="link">Ver catálogo</span>
//     </arq-section-header>
//     <arq-grid columns="3" mobile="carousel">…</arq-grid>
//     <arq-button slot="mobile-action" type="underline" show-underline show-icon icon="arrow-right" href="/arq/productos">Ver catálogo</arq-button>
//   </arq-section>
//
// - Slots: header (section-header), el contenido por defecto, action (button
//   al final del bloque, en Desktop y Mobile) y mobile-action (solo hasta
//   767 px: el link de un section-header Type=Link, que en Mobile no se ve).
// - layout="split": en Desktop el encabezado y la acción van en una columna de
//   layout/measure y el contenido a la derecha (FAQ del Home). En Mobile apila.
// - padding-top: suma space/section/xl arriba (primer bloque después del hero).
// - Es un <section> de la página solo si la página lo pone: el componente no
//   agrega landmarks (el <h2> del encabezado alcanza para navegar).

import { ArqElement } from '../../base/arq-element.js';
import css from './section.css?inline';

const SLOTS = ['header', 'action', 'mobile-action'];

class ArqSection extends ArqElement {
  static tag = 'arq-section';
  static styles = css;
  static properties = {
    layout: { type: String, values: ['stack', 'split'], default: 'stack' },
    paddingTop: { type: Boolean }, // space/section/xl arriba
  };
  static template =
    `<div class="section">` +
    `<div class="head" hidden><slot name="header"></slot></div>` +
    `<div class="body"><slot></slot></div>` +
    `<div class="action" hidden><slot name="action"></slot></div>` +
    `<div class="mobile-action" hidden><slot name="mobile-action"></slot></div>` +
    `</div>`;

  setup() {
    // Un contenedor sin contenido se oculta: así no suma el gap.
    for (const name of SLOTS) {
      const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
      const sync = () => (slot.parentElement.hidden = slot.assignedElements({ flatten: true }).length === 0);
      slot.addEventListener('slotchange', sync);
      sync();
    }
  }
}

ArqSection.define();

export { ArqSection };
