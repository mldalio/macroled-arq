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
// - reveal: el texto (título, bajada y botón) entra al hacer scroll, como las
//   secciones del Home. La foto no. Lo usa la banda «Iluminación de vanguardia».

import { ArqElement } from '../../base/arq-element.js';
import { playOnce } from '../../base/play-once.js';
import { reveal, revealCss } from '../../base/reveal.js';
import css from './hero.css?inline';

const OPTIONAL = ['eyebrow', 'description', 'action'];

class ArqHero extends ArqElement {
  static tag = 'arq-hero';
  static styles = revealCss + css;
  static properties = {
    fullHeight: { type: Boolean },
    tall: { type: Boolean }, // un poco más que 70svh; solo la banda de la Home
    parallax: { type: Boolean }, // la foto queda fija mientras la página pasa (como la descripción de la ficha)
    reveal: { type: Boolean }, // el texto entra al hacer scroll
    size: { type: String, values: ['default', 'compact'], default: 'default' }, // Size
  };
  static template =
    `<div class="hero">` +
    `<div class="media"><slot name="media"></slot></div>` +
    `<div class="veil" aria-hidden="true"></div>` +
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
    const pre = document.querySelector('arq-preloader[page]');
    this.#holdPlayback = !!pre?.hasAttribute('open');
    this.#armCover();
    // full-height: con announcement-bar arriba del navbar, la barra y el hero
    // juntos ocupan la pantalla. Se mide la barra (si el texto baja de línea,
    // cambia de alto) y se descuenta en el CSS con --announcement-height.
    const bar = document.querySelector('arq-announcement-bar');
    if (bar) {
      new ResizeObserver(() => this.style.setProperty('--announcement-height', `${bar.offsetHeight}px`)).observe(bar);
    }
  }

  update(changed) {
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
    if (changed?.has('reveal')) this.#armText();
  }

  #coverObserver = null;
  #coverTimer = 0;
  #holdPlayback = false;
  #textReveal = null;

  // Portada (full-height): al irse el preloader la foto arranca apenas
  // oscura y se enciende, y el título entra después. El video de la media,
  // si tenía autoplay, espera a ese mismo momento y arranca desde el
  // primer frame. TODO (diseño): la entrada no está en Figma. Con movimiento
  // reducido no hay entrada ni reproducción.
  #armCover() {
    const hero = this.shadowRoot.querySelector('.hero');
    const intro = this.fullHeight && !this.#reducedMotion.matches;
    if (intro) hero.classList.add('intro');
    const start = () => {
      this.#holdPlayback = false;
      this.#playFromStart();
      if (intro) hero.classList.add('entered');
    };
    const pre = document.querySelector('arq-preloader[page]');
    if (!pre?.hasAttribute('open')) {
      if (intro) requestAnimationFrame(() => requestAnimationFrame(start));
      else start();
      return;
    }
    this.#coverObserver = new MutationObserver(() => {
      if (pre.hasAttribute('open')) return;
      this.#coverObserver.disconnect();
      this.#coverObserver = null;
      // El preloader todavía se funde: el video arranca cuando ya se fue.
      const go = (event) => {
        if (event && (event.target !== pre || event.propertyName !== 'opacity')) return;
        pre.removeEventListener('transitionend', go);
        window.clearTimeout(this.#coverTimer);
        start();
      };
      pre.addEventListener('transitionend', go);
      const ms = Number.parseFloat(getComputedStyle(pre).transitionDuration) * 1000 || 0;
      this.#coverTimer = window.setTimeout(go, ms + 40);
    });
    this.#coverObserver.observe(pre, { attributes: true, attributeFilter: ['open'] });
  }

  // El texto de la banda entra cuando llega a la pantalla. La foto queda.
  #armText() {
    this.#textReveal?.disconnect();
    this.#textReveal = null;
    if (!this.reveal) return;
    this.#textReveal = reveal([this.shadowRoot.querySelector('.content')]);
  }

  disconnectedCallback() {
    this.#coverObserver?.disconnect();
    this.#coverObserver = null;
    window.clearTimeout(this.#coverTimer);
    this.#textReveal?.disconnect();
    this.#textReveal = null;
  }

  // Videos que venían con autoplay en el HTML (para volver a reproducirlos).
  #autoplay = new WeakSet();
  #pinned = new WeakSet();

  #videos() {
    return this.shadowRoot
      .querySelector('slot[name="media"]')
      .assignedElements()
      .filter((el) => el.localName === 'video');
  }

  // Mientras el preloader tapa la página, el video no corre: si arrancara
  // ahora, al descubrirse ya iría por el medio.
  #pinAtStart(video) {
    if (this.#pinned.has(video)) return;
    this.#pinned.add(video);
    const pin = () => {
      if (!this.#holdPlayback) return;
      video.pause();
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.currentTime !== 0) video.currentTime = 0;
    };
    video.addEventListener('play', pin);
    video.addEventListener('loadedmetadata', pin);
    pin();
  }

  #playFromStart() {
    if (this.#reducedMotion.matches) {
      this.#syncVideo();
      return;
    }
    for (const video of this.#videos()) {
      if (video.autoplay) this.#autoplay.add(video);
      if (!this.#autoplay.has(video)) continue;
      video.autoplay = true;
      const go = () => {
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) video.currentTime = 0;
        video.play().catch(() => {});
      };
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) go();
      else video.addEventListener('loadedmetadata', go, { once: true });
    }
  }

  // Video con movimiento reducido: sin reproducción, solo el poster. load()
  // vuelve al poster; sin el atributo autoplay no arranca otra vez.
  #syncVideo() {
    for (const video of this.#videos()) {
      if (video.autoplay) this.#autoplay.add(video);
      if (!this.#autoplay.has(video)) continue;
      if (this.#holdPlayback) {
        video.autoplay = false;
        video.pause();
        this.#pinAtStart(video);
        continue;
      }
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
