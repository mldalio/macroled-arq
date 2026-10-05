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
//     <arq-button slot="action" type="outline" href="/arq/colecciones">Explorar colecciones</arq-button>
//   </arq-hero>
//
// - El <h1> va en el HTML de la página (slot title): el componente lo estiliza
//   con role/display desde un contenedor interno (::slotted(h1) hereda).
// - Media por slot: está en el HTML del embed y el navegador la descubre sin
//   esperar al JS (es el LCP). Con video y prefers-reduced-motion se pausa y
//   queda el poster.
// - El navbar no va adentro: la página pone <arq-navbar theme="transparent">
//   encima (README).
// - Dark local (DESIGN.md §2): el slot action va en un contenedor interno con
//   data-arq-theme="dark", así el button Outline se ve claro. Los textos van
//   en color/text/inverse.
// - Show eyebrow, Show description y Show button no son atributos: cada parte
//   se muestra si su slot tiene contenido.
// - Es un <div> y no un <header>: el banner de la página es el navbar.
// - full-height (solo código, la usa la Home): ocupa todo el alto del viewport
//   (100svh) en Desktop y Mobile, en lugar de 70svh.

import { ArqElement } from '../../base/arq-element.js';
import css from './hero.css?inline';

const OPTIONAL = ['eyebrow', 'description', 'action'];

class ArqHero extends ArqElement {
  static tag = 'arq-hero';
  static styles = css;
  static properties = {
    fullHeight: { type: Boolean },
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
    `<div class="action" data-arq-theme="dark" hidden><slot name="action"></slot></div>` +
    `</div>` +
    `</div>`;

  #reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  setup() {
    for (const slot of this.shadowRoot.querySelectorAll('slot[name]')) {
      slot.addEventListener('slotchange', () => this.update());
    }
    this.#reducedMotion.addEventListener('change', () => this.#syncVideo());
  }

  update() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    for (const name of OPTIONAL) root.querySelector(`.${name}`).hidden = !filled(name);
    this.#syncVideo();
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
