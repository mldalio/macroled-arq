// product-card · Figma 990:2372 · ficha doc/product-card (1430:2371)
//
// Tarjeta de producto (Productos) o de colección (Colecciones, página de
// colección), siempre vertical con imagen 7:10. Toda la tarjeta es un link;
// "Comparar" queda fuera del link.
//
//   <arq-product-card href="/arq/producto/kanu-jardin" show-compare
//     image="…/estudio.jpg" image-hover="…/contexto.jpg"
//     image-lit="…/estudio-on.jpg" image-hover-lit="…/contexto-on.jpg">
//     <h3 slot="name">Kanu Jardín</h3>
//     <span slot="meta">35 cm – 50 cm · 12 W</span>
//     <arq-swatch slot="finishes" src="…">Negro</arq-swatch>
//   </arq-product-card>
//
// - Link estirado (src/base/card-link.css): el <a> envuelve solo el nombre.
// - Imágenes (DESIGN.md §8): reposo = estudio; hover sobre la imagen y foco =
//   contexto, con un
//   fundido entre dos <img> (motion/duration/slow). Iluminar (data-arq-theme=
//   "dark" en un ancestro, src/base/theme.js) pasa a las versiones encendidas.
//   Sin contexto no hay cambio; sin encendida queda la apagada; sin estudio, un
//   fondo color/surface/subtle con el nombre. En táctiles no hay hover.
// - Carga: solo la imagen visible de entrada; la de hover al primer hover o
//   foco; las encendidas cuando se activa Iluminar.
// - Size: Large (listados) o Small. Large pasa sola al aspecto Small hasta
//   767 px (grilla mobile; decisión 2026-10-02 · product-card).
// - Show meta y Show finishes: se muestran si su slot tiene contenido.
// - Show compare: checkbox "Comparar"; emite arq:compare { checked }.

import { ArqElement } from '../../base/arq-element.js';
import { watchTheme } from '../../base/theme.js';
import '../checkbox/checkbox.js';
import cardLinkCss from '../../base/card-link.css?inline';
import css from './product-card.css?inline';

const MOBILE = matchMedia('(max-width: 767px)');

class ArqProductCard extends ArqElement {
  static tag = 'arq-product-card';
  static styles = cardLinkCss + css;
  static properties = {
    size: { type: String, values: ['large', 'small'], default: 'large' }, // Size
    showCompare: { type: Boolean }, // Show compare
    compared: { type: Boolean }, // checkbox "Comparar" marcado
    href: { type: String },
    image: { type: String }, // estudio, luz apagada
    imageHover: { type: String }, // contexto, luz apagada
    imageLit: { type: String }, // estudio, luz encendida
    imageHoverLit: { type: String }, // contexto, luz encendida
  };
  static template =
    `<div class="card">` +
    `<div class="card-media">` +
    `<img class="img base" alt="" loading="lazy" decoding="async">` +
    `<img class="img hover" alt="" decoding="async">` +
    `<span class="fallback role-body-sm" aria-hidden="true"></span>` +
    `</div>` +
    `<div class="info">` +
    `<div class="title"><a class="card-link name"><slot name="name"></slot></a><span class="finishes" hidden><slot name="finishes"></slot></span></div>` +
    `<p class="meta" hidden><slot name="meta"></slot></p>` +
    `<arq-checkbox class="compare" show-label hidden>Comparar</arq-checkbox>` +
    `</div>` +
    `</div>`;

  #dark = false;
  #hoverWanted = false;

  setup() {
    const root = this.shadowRoot;
    for (const img of root.querySelectorAll('.img')) {
      // Se muestra al cargar. No se usa hidden: una <img> lazy oculta no se carga.
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => {
        img.classList.remove('loaded');
        if (img.classList.contains('base')) this.#renderFallback(true);
      });
    }
    // La de hover se pide recién al primer hover o foco.
    const wantHover = () => {
      if (this.#hoverWanted) return;
      this.#hoverWanted = true;
      this.#renderImages();
    };
    const card = root.querySelector('.card');
    card.addEventListener('pointerenter', wantHover);
    root.querySelector('.card-link').addEventListener('focus', wantHover);
    // El cambio de imagen es solo con el mouse sobre la imagen. El ::after del
    // link tapa .card-media (no recibe :hover), así que se mide la posición.
    const media = root.querySelector('.card-media');
    const setMediaHover = (on) => card.classList.toggle('is-media-hover', on);
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const r = media.getBoundingClientRect();
      setMediaHover(event.clientX >= r.left && event.clientX < r.right && event.clientY >= r.top && event.clientY < r.bottom);
    });
    card.addEventListener('pointerleave', () => setMediaHover(false));
    for (const name of ['name', 'meta', 'finishes']) {
      root.querySelector(`slot[name="${name}"]`).addEventListener('slotchange', () => this.#renderSlots());
    }
    const compare = root.querySelector('.compare');
    compare.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.compared = event.detail.checked;
      this.emit('compare', { checked: event.detail.checked });
    });
    MOBILE.addEventListener('change', () => this.#renderSize());
    watchTheme(this, 'themeChanged');
  }

  /** Iluminar (src/base/theme.js): pasa a las imágenes encendidas. */
  themeChanged(dark) {
    this.#dark = dark;
    this.#renderImages();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('href')) {
      const link = root.querySelector('.card-link');
      if (this.href) link.setAttribute('href', this.href);
      else link.removeAttribute('href');
    }
    const compare = root.querySelector('.compare');
    compare.hidden = !this.showCompare;
    compare.checked = this.compared;
    if (changed.has('size')) this.#renderSize();
    if ([...changed].some((prop) => prop.startsWith('image'))) this.#renderImages();
    this.#renderSlots();
  }

  #small() {
    return this.size === 'small' || MOBILE.matches;
  }

  // Los role/* son clases: el aspecto Small en mobile lo pone el JS (como nav-link).
  #renderSize() {
    const small = this.#small();
    const root = this.shadowRoot;
    root.querySelector('.card').classList.toggle('is-small', small);
    root.querySelector('.name').className = `card-link name ${small ? 'role-body-regular' : 'role-heading-3'}`;
    root.querySelector('.meta').className = `meta ${small ? 'role-body-sm' : 'role-body'}`;
    for (const swatch of this.querySelectorAll(':scope > arq-swatch[slot="finishes"]')) {
      swatch.setAttribute('size', small ? 'small' : 'default');
    }
  }

  #renderSlots() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root.querySelector(`slot[name="${name}"]`).assignedNodes({ flatten: true }).some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    root.querySelector('.meta').hidden = !filled('meta');
    root.querySelector('.finishes').hidden = !filled('finishes');
    root.querySelector('.fallback').textContent = this.querySelector('[slot="name"]')?.textContent.trim() ?? '';
    this.#renderSize();
  }

  #renderImages() {
    const root = this.shadowRoot;
    const base = root.querySelector('.base');
    const hover = root.querySelector('.hover');
    const baseSrc = (this.#dark && this.imageLit) || this.image;
    const hoverSrc = (this.#dark && this.imageHoverLit) || this.imageHover;
    this.#setSrc(base, baseSrc);
    this.#renderFallback(!baseSrc);
    root.querySelector('.card').classList.toggle('has-hover', Boolean(baseSrc && hoverSrc));
    this.#setSrc(hover, this.#hoverWanted ? hoverSrc : null);
  }

  #setSrc(img, src) {
    if (img.getAttribute('src') === (src ?? null)) return;
    img.classList.remove('loaded');
    if (src) img.src = src;
    else img.removeAttribute('src');
  }

  #renderFallback(show) {
    this.shadowRoot.querySelector('.fallback').hidden = !show;
  }
}

ArqProductCard.define();

export { ArqProductCard };
