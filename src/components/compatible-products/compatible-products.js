// compatible-products · sección «Productos compatibles» de la ficha de Daö
//
// Una grilla de search-card (imagen cuadrada y nombre) con los productos que
// se arman con el de la ficha; cada tarjeta lleva a su ficha. El título llega
// por slot (el <h2> lo escribe la página) y la lista, por la prop items.
//
//   <arq-compatible-products>
//     <h2 slot="title">Productos compatibles</h2>
//   </arq-compatible-products>
//   section.items = [{ name, href, image, finishes: [{ name, src }], meta }];
//
// - Sin items no se muestra. Sin href, la tarjeta no es un link.
// - Los títulos y qué se muestra los decide la ficha (ver compatibleProducts).

import { ArqElement } from '../../base/arq-element.js';
import '../search-card/search-card.js';
import '../swatch/swatch.js';
import css from './compatible-products.css?inline';

class ArqCompatibleProducts extends ArqElement {
  static tag = 'arq-compatible-products';
  static styles = css;
  static template =
    `<section class="section" hidden>` +
    `<div class="title role-heading-2"><slot name="title"></slot></div>` +
    `<ul class="grid"></ul>` +
    `</section>`;

  #items = [];

  get items() {
    return this.#items;
  }

  set items(list) {
    this.#items = Array.isArray(list) ? list : [];
    this.#render();
  }

  #render() {
    const root = this.shadowRoot;
    root.querySelector('.section').hidden = !this.#items.length;
    root.querySelector('.grid').replaceChildren(
      ...this.#items.map((item) => {
        const li = document.createElement('li');
        const card = document.createElement('arq-search-card');
        card.size = 'large';
        if (item.href) card.href = item.href;
        if (item.image) card.image = item.image;
        card.textContent = item.name;
        for (const finish of item.finishes ?? []) {
          const swatch = document.createElement('arq-swatch');
          swatch.slot = 'finishes';
          swatch.textContent = finish.name;
          if (finish.src) swatch.src = finish.src;
          card.append(swatch);
        }
        if (item.meta) {
          const meta = document.createElement('span');
          meta.slot = 'meta';
          meta.textContent = item.meta;
          card.append(meta);
        }
        li.append(card);
        return li;
      }),
    );
  }
}

ArqCompatibleProducts.define();

export { ArqCompatibleProducts };
