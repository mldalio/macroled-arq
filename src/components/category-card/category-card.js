// category-card · Figma 1036:2461 · ficha doc/category-card (1452:5984)
//
// Tarjeta de categoría del Home (Interior, Exterior…): imagen + nombre +
// flecha. Toda la tarjeta lleva al listado filtrado. No confundir con
// line-card (editorial) ni family-card (ficha).
//
//   <arq-category-card href="/arq/productos…">
//     <img slot="image" src="…" alt="" loading="lazy">
//     <span slot="name">Interior</span>
//   </arq-category-card>
//
// Link estirado (src/base/card-link.css): el <a> envuelve solo el nombre y su
// ::after cubre la tarjeta. Imagen en ratio/portrait-soft (4:5) en Desktop y
// Mobile. State no es prop: Hover y Focus por CSS sobre toda la tarjeta.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import cardLinkCss from '../../base/card-link.css?inline';
import css from './category-card.css?inline';

class ArqCategoryCard extends ArqElement {
  static tag = 'arq-category-card';
  static styles = cardLinkCss + css;
  static properties = {
    href: { type: String }, // destino: el listado filtrado
    overlay: { type: Boolean }, // Home v2: nombre y flecha sobre la foto
  };
  static template =
    `<div class="card">` +
    `<div class="card-media"><slot name="image"></slot></div>` +
    `<div class="caption">` +
    `<div class="title-row">` +
    `<a class="card-link name role-heading-3"><slot name="name"></slot></a>` +
    `${icon('arrow-right')}` +
    `</div>` +
    `<p class="description role-body" hidden><span class="description-inner"><slot name="description"></slot></span></p>` +
    `</div>` +
    `</div>`;

  #observer = null;

  // Entrada al hacer scroll: la tarjeta sube y aparece cuando entra en
  // pantalla, una sola vez. Escalonada según su lugar entre las hermanas.
  // Sin JS o con prefers-reduced-motion se ve quieta desde el principio.
  setup() {
    this.shadowRoot.querySelector('slot[name="description"]').addEventListener('slotchange', () => this.update(new Set()));
    // overlay: cuánto baja el bloque en reposo para que solo se vea el título
    // (la bajada, más el gap). La subida en hover es un transform (CSS).
    const caption = this.shadowRoot.querySelector('.caption');
    const titleRow = this.shadowRoot.querySelector('.title-row');
    new ResizeObserver(() => {
      const shift = caption.offsetHeight - (titleRow.offsetTop + titleRow.offsetHeight);
      caption.style.setProperty('--description-shift', `${Math.max(shift, 0)}px`);
    }).observe(caption);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = this.shadowRoot.querySelector('.card');
    const index = [...this.parentElement.children].filter((el) => el.localName === this.localName).indexOf(this);
    card.style.setProperty('--reveal-index', String(Math.max(index, 0)));
    card.classList.add('reveal');
    this.#observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        card.classList.add('revealed');
        this.#observer.disconnect();
      },
      { threshold: 0.15 },
    );
    this.#observer.observe(this);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (!changed.size || changed.has('href')) {
      const link = root.querySelector('.card-link');
      if (this.href) link.setAttribute('href', this.href);
      else link.removeAttribute('href');
    }
    const hasDescription = root
      .querySelector('slot[name="description"]')
      .assignedNodes({ flatten: true })
      .some((node) => node.textContent.trim());
    const description = root.querySelector('.description');
    if (description) description.hidden = !hasDescription;
    const name = this.overlay ? 'arrow-up-right' : 'arrow-right';
    const glyph = root.querySelector('.title-row .icon');
    if (glyph && glyph.dataset.icon !== name) glyph.outerHTML = icon(name);
  }
}

ArqCategoryCard.define();

export { ArqCategoryCard };
