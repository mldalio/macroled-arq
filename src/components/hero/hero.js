// hero · Figma 1311:4340 · ficha doc/hero (Documentación)
//
// Hero de página de Home y Contacto: media a sangre (imagen o video), scrim,
// eyebrow, título (el <h1> de la página), bajada y CTA opcionales.
//
//   <arq-hero>
//     <img slot="media" src="…" alt="…" fetchpriority="high">
//     <span slot="eyebrow">Iluminación profesional</span>
//     <h1 slot="title">Materia, forma, atmósfera.</h1>
//     <span slot="description">Bajada opcional.</span>
//     <arq-button slot="action" type="outline" href="/arq/productos" data-arq-menu="colecciones">Explorar colecciones</arq-button>
//   </arq-hero>
//
// - El <h1> va en el HTML de la página (slot title): el componente lo estiliza
//   con role/display desde un contenedor interno (::slotted(h1) hereda).
// - Media por slot: está en el HTML del embed y el navegador la descubre sin
//   esperar al JS (es el LCP). Con video y prefers-reduced-motion se pausa y
//   queda el poster. Un video sin autoplay ni loop se reproduce una vez y
//   queda en el último frame (src/base/play-once.js).
// - El navbar no va adentro: la página pone <arq-navbar theme="transparent">
//   encima (README).
// - Dark local (DESIGN.md §2): el slot action va en un contenedor interno con
//   data-arq-theme="dark", así el button Outline se ve claro. Los textos van
//   en color/text/inverse.
// - Show eyebrow, Show description y Show button no son atributos: cada parte
//   se muestra si su slot tiene contenido.
// - Es un <div> y no un <header>: el banner de la página es el navbar.
// - full-height (solo código, la usa la Home): ocupa todo el alto del viewport
//   (100svh) en Desktop y Mobile, en lugar de 70svh. Si hay announcement-bar,
//   descuenta su alto: barra + hero ocupan la pantalla.
// - size="compact" (Size=Compact, Contacto): título en role/display-lg y hero
//   más bajo (decisiones.md, 2026-10-14 · Contacto v3).

import { ArqElement } from '../../base/arq-element.js';
import { playOnce } from '../../base/play-once.js';
import css from './hero.css?inline';

const OPTIONAL = ['eyebrow', 'description', 'action'];

class ArqHero extends ArqElement {
  static tag = 'arq-hero';
  static styles = css;
  static properties = {
    fullHeight: { type: Boolean },
    tall: { type: Boolean }, // un poco más que 70svh; solo la banda de la Home
    parallax: { type: Boolean }, // la foto queda fija mientras la página pasa (como la descripción de la ficha)
    size: { type: String, values: ['default', 'compact'], default: 'default' }, // Size
  };
  static template =
    `<div class="hero">` +
    `<div class="media"><slot name="media"></slot></div>` +
    `<div class="scrim" aria-hidden="true"></div>` +
    `<div class="content">` +
    `<div class="text">` +
    `<p class="eyebrow role-label" hidden><slot name="eyebrow"></slot></p>` +
    `<div class="title role-display"><slot name="title"></slot></div>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `</div>` +
    `<div class="action" hidden><slot name="action"></slot></div>` +
    `</div>` +
    `</div>`;

  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  setup() {
    for (const slot of this.shadowRoot.querySelectorAll('slot[name]')) {
      slot.addEventListener('slotchange', () => this.update());
    }
    this.#reducedMotion.addEventListener('change', () => this.#syncVideo());
    // full-height: con announcement-bar arriba del navbar, la barra y el hero
    // juntos ocupan la pantalla. Se mide la barra (si el texto baja de línea,
    // cambia de alto) y se descuenta en el CSS con --announcement-height.
    const bar = document.querySelector('arq-announcement-bar');
    if (bar) {
      new ResizeObserver(() => this.style.setProperty('--announcement-height', `${bar.offsetHeight}px`)).observe(bar);
    }
  }

  update() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    for (const name of OPTIONAL) root.querySelector(`.${name}`).hidden = !filled(name);
    const title = root.querySelector('.title');
    // Home a pantalla completa: el título del frame es role/display-lg (80).
    const displayLg = this.size === 'compact' || this.fullHeight;
    title.classList.toggle('role-display', !displayLg);
    title.classList.toggle('role-display-lg', displayLg);
    // Filled queda oscuro sobre la foto (Home v2). Outline y Underline
    // siguen en Dark local para verse claros.
    const action = root.querySelector('.action');
    const button = root
      .querySelector('slot[name="action"]')
      .assignedElements({ flatten: true })
      .find((el) => el.localName === 'arq-button');
    const type = button?.getAttribute('type') || 'filled';
    if (button && type !== 'filled') action.setAttribute('data-arq-theme', 'dark');
    else action.removeAttribute('data-arq-theme');
    this.#syncVideo();
    playOnce(root.querySelector('slot[name="media"]').assignedElements());
  }

  // Videos que venían con autoplay en el HTML (para volver a reproducirlos).
  #autoplay = new WeakSet();

  // Video con movimiento reducido: sin reproducción, solo el poster. load()
  // vuelve al poster; sin el atributo autoplay no arranca otra vez.
  #syncVideo() {
    const videos = this.shadowRoot
      .querySelector('slot[name="media"]')
      .assignedElements()
      .filter((el) => el.localName === 'video');
    for (const video of videos) {
      if (video.autoplay) this.#autoplay.add(video);
      if (!this.#autoplay.has(video)) continue;
      if (this.#reducedMotion.matches) {
        if (!video.autoplay && video.paused) continue;
        video.autoplay = false;
        video.pause();
        video.load();
      } else if (!video.autoplay) {
        video.autoplay = true;
        video.play().catch(() => {});
      }
    }
  }
}

ArqHero.define();

export { ArqHero };
