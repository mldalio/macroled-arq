// compatible-products · sección «Productos compatibles» de la ficha de Daö
//
// Una grilla de product-card (imagen, nombre, datos y acabados) con los productos
// que se arman con el de la ficha; cada tarjeta lleva a su ficha. El título llega
// por slot (el <h2> lo escribe la página) y la lista, por la prop items.
//
//   <arq-compatible-products>
//     <h2 slot="title">Productos compatibles</h2>
//   </arq-compatible-products>
//   section.items = [{ name, href, image, specs: ['6 – 12 W'], finishes: [{ name, src }] }];
//   (los items del configurador de Daö traen meta en lugar de specs)
//
// - Sin items no se muestra. Sin href, la tarjeta no es un link.
// - Los títulos y qué se muestra los decide la ficha (ver compatibleProducts).
// - Las tarjetas entran al hacer scroll como las de Productos (src/base/reveal.js).
//   Si la ficha vuelve a pasar la misma lista (al cambiar de variante), quedan quietas.

import { ArqElement } from '../../base/arq-element.js';
import { reveal, revealCss } from '../../base/reveal.js';
import { appendFinishes, appendSpecs } from '../product-card/product-card.js';
import css from './compatible-products.css?inline';

class ArqCompatibleProducts extends ArqElement {
  static tag = 'arq-compatible-products';
  static styles = revealCss + css;
  static template =
    `<section class="section" hidden>` +
    `<div class="heading">` +
    `<div class="title role-heading-2"><slot name="title"></slot></div>` +
    `<slot name="action"></slot>` +
    `</div>` +
    `<ul class="grid"></ul>` +
    `</section>`;

  #items = [];
  #json = '[]';
  #reveal = null;

  get items() {
    return this.#items;
  }

  set items(list) {
    this.#items = Array.isArray(list) ? list : [];
    const json = JSON.stringify(this.#items);
    if (json === this.#json) return;
    this.#json = json;
    this.#render();
  }

  #render() {
    const root = this.shadowRoot;
    root.querySelector('.section').hidden = !this.#items.length;
    const items = this.#items.map((item) => {
      const li = document.createElement('li');
      const card = document.createElement('arq-product-card');
      if (item.href) card.href = item.href;
      card.family = item.family;
      card.image = item.image;
      card.imageHover = item.imageHover;
      card.imageLit = item.imageLit;
      card.imageHoverLit = item.imageHoverLit;
      // <h3>: debajo del <h2> de la sección
      const title = document.createElement('h3');
      title.slot = 'name';
      title.textContent = item.name;
      card.append(title);
      appendSpecs(card, item.specs ?? (item.meta ? [item.meta] : []));
      appendFinishes(card, item.finishes);
      li.append(card);
      return li;
    });
    this.#reveal?.disconnect();
    root.querySelector('.grid').replaceChildren(...items);
    this.#reveal = reveal(items);
  }
}

ArqCompatibleProducts.define();

export { ArqCompatibleProducts };
