// featured-products · contenedor de página (Home de Final: productos-destacados
// 1203:9846 · 1204:10062)
//
// Productos elegidos a mano. El embed lista un link por grupo
// (PRODUCT_GROUP_ID en data-group) y el componente arma las product-card con
// los datos del catálogo (nombre, meta e imágenes), en el mismo orden.
//
//   <arq-featured-products>
//     <a href="/arq/producto/kanu-jardin" data-group="kanu-jardin">Kanu Jardín</a>
//     <a href="/arq/producto/douli-colgante" data-group="douli-colgante">Douli</a>
//   </arq-featured-products>
//
// - Los links quedan en el HTML de la página (indexables) y son la reserva: si
//   el catálogo no carga o ningún grupo existe, se muestran como lista.
// - Como el navbar, es un contenedor que consulta por src/data/ (decisiones.md,
//   2026-10-02 · Home); las product-card que muestra reciben datos.
// - Grilla: arq-grid de 4 columnas en Desktop y 2 en Mobile (Size=Large, que
//   pasa sola al aspecto Small hasta 767 px).

import { ArqElement } from '../../base/arq-element.js';
import { getProductCards } from '../../data/catalog.js';
import '../grid/grid.js';
import '../product-card/product-card.js';
import css from './featured-products.css?inline';

class ArqFeaturedProducts extends ArqElement {
  static tag = 'arq-featured-products';
  static styles = css;
  static template =
    `<arq-grid class="grid" columns="4" mobile="two-columns"></arq-grid>` +
    `<div class="fallback role-body" hidden><slot></slot></div>`;

  #groups = '';
  #request = 0;

  setup() {
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => this.#load());
    this.#load();
  }

  async #load() {
    const groups = [...this.querySelectorAll(':scope > a[data-group]')].map((link) => link.dataset.group.trim()).filter(Boolean);
    const key = groups.join('\n');
    if (key === this.#groups) return;
    this.#groups = key;

    const request = ++this.#request;
    this.setAttribute('aria-busy', 'true');
    let cards = [];
    try {
      cards = groups.length ? await getProductCards(groups) : [];
    } catch (error) {
      console.error('[arq] featured-products: no se pudo cargar el catálogo', error);
    }
    if (request !== this.#request) return;
    this.removeAttribute('aria-busy');
    this.#render(cards);
  }

  #render(cards) {
    const root = this.shadowRoot;
    root.querySelector('.grid').replaceChildren(...cards.map((card) => this.#card(card)));
    root.querySelector('.grid').hidden = cards.length === 0;
    root.querySelector('.fallback').hidden = cards.length > 0;
  }

  #card({ name, meta, href, image, imageHover, imageLit, imageHoverLit }) {
    const card = document.createElement('arq-product-card');
    card.href = href;
    card.image = image;
    card.imageHover = imageHover;
    card.imageLit = imageLit;
    card.imageHoverLit = imageHoverLit;
    const title = document.createElement('h3');
    title.slot = 'name';
    title.textContent = name;
    card.append(title);
    if (meta) {
      const text = document.createElement('span');
      text.slot = 'meta';
      text.textContent = meta;
      card.append(text);
    }
    return card;
  }
}

ArqFeaturedProducts.define();

export { ArqFeaturedProducts };
