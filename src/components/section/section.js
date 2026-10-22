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
// - layout="split": desde 1024 el encabezado y la acción van en una columna de
//   layout/measure y el contenido a la derecha (FAQ del Home). Hasta ahí apila.
//   El margen lateral es --page-gutter.
// - padding-top: suma space/section/md arriba (primer bloque después del hero,
//   o el que sigue a una banda con background="subtle").
// - background="subtle": banda color/bg/subtle con space/section/md arriba y
//   abajo (Home: Explorar por espacio y Diseño que inspira).
// - Es un <section> de la página solo si la página lo pone: el componente no
//   agrega landmarks (el <h2> del encabezado alcanza para navegar).

import { ArqElement } from '../../base/arq-element.js';
import { revealCss } from '../../base/reveal.js';
import css from './section.css?inline';

const SLOTS = ['header', 'lead', 'action', 'mobile-action'];

class ArqSection extends ArqElement {
  static tag = 'arq-section';
  static styles = revealCss + css;
  static properties = {
    layout: { type: String, values: ['stack', 'split', 'tools'], default: 'stack' },
    paddingTop: { type: Boolean }, // space/section/md arriba
    padding: { type: String, values: ['default', 'section', 'wide'], default: 'default' },
    bleed: { type: String, values: ['none', 'end'], default: 'none' },
    background: { type: String, values: ['default', 'subtle', 'bone', 'sand'], default: 'default' },
    reveal: { type: Boolean }, // fade al entrar; al subir se va y vuelve a entrar la próxima vez
  };
  static template =
    `<div class="section">` +
    `<div class="head" hidden><slot name="header"></slot></div>` +
    `<div class="rail">` +
    `<div class="lead" hidden><slot name="lead"></slot></div>` +
    `<div class="body"><slot></slot></div>` +
    `</div>` +
    `<div class="action" hidden><slot name="action"></slot></div>` +
    `<div class="mobile-action" hidden><slot name="mobile-action"></slot></div>` +
    `</div>`;

  #observer = null;
  #onScroll = null;
  #scrollY = 0;
  #scrollingUp = false;

  setup() {
    // Un contenedor sin contenido se oculta: así no suma el gap.
    for (const name of SLOTS) {
      const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
      const sync = () => (slot.parentElement.hidden = slot.assignedElements({ flatten: true }).length === 0);
      slot.addEventListener('slotchange', sync);
      sync();
    }
  }

  disconnectedCallback() {
    this.#stopReveal();
  }

  update(changed) {
    if (changed.has('reveal')) this.#armReveal();
  }

  // El bloque entero aparece al entrar en pantalla y se va al hacer scroll
  // hacia arriba, para que la entrada se repita. Al bajar y dejarlo atrás
  // queda visible. Misma entrada que el resto del Home (src/base/reveal.js).
  // Con prefers-reduced-motion se ve quieto.
  #armReveal() {
    this.#stopReveal();
    const section = this.shadowRoot.querySelector('.section');
    section.classList.remove('reveal', 'revealed');
    if (!this.reveal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    section.classList.add('reveal');
    this.#scrollY = window.scrollY;
    this.#onScroll = () => {
      const y = window.scrollY;
      this.#scrollingUp = y < this.#scrollY;
      this.#scrollY = y;
    };
    window.addEventListener('scroll', this.#onScroll, { passive: true });
    this.#observer = new IntersectionObserver(
      ([entry]) => {
        if (this.#scrollingUp && entry.intersectionRatio < 0.35) section.classList.remove('revealed');
        else if (entry.intersectionRatio >= 0.15) section.classList.add('revealed');
      },
      { threshold: [0, 0.15, 0.35] },
    );
    this.#observer.observe(this);
  }

  #stopReveal() {
    this.#observer?.disconnect();
    this.#observer = null;
    if (this.#onScroll) window.removeEventListener('scroll', this.#onScroll);
    this.#onScroll = null;
  }
}

ArqSection.define();

export { ArqSection };
