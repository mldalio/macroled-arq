// collection-mosaic · Home v2 (Final 2063:29996)
//
// Mosaico de cuatro collection-tile (frame 2306:23088): Kanu alta a la
// izquierda; Douli ancha, más abajo; debajo, otra Douli y Sento, que sigue
// más abajo que el resto.
//
//   <arq-collection-mosaic>
//     <arq-collection-tile slot="primary" href="…">…</arq-collection-tile>
//     <arq-collection-tile slot="wide" href="…">…</arq-collection-tile>
//     <arq-collection-tile slot="stack" href="…">…</arq-collection-tile>
//     <arq-collection-tile slot="stack" href="…">…</arq-collection-tile>
//   </arq-collection-mosaic>
//
// En Mobile se apilan. TODO (diseño): Home v2 no tiene frame Mobile.
//
// Entrada: cada tarjeta sube y aparece al entrar el mosaico en pantalla,
// una vez, en el orden de los slots (Kanu, Douli ancha, Douli, Sento).
// La animación vive en collection-tile (:host(.reveal)); acá solo se
// marca el orden. Con prefers-reduced-motion no se anima.

import { ArqElement } from '../../base/arq-element.js';
import css from './collection-mosaic.css?inline';

class ArqCollectionMosaic extends ArqElement {
  static tag = 'arq-collection-mosaic';
  static styles = css;
  static template =
    `<div class="mosaic">` +
    `<slot name="primary"></slot>` +
    `<slot name="wide"></slot>` +
    `<slot name="stack"></slot>` +
    `</div>`;

  #observer = null;
  #seen = false;
  #reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setup() {
    const slots = [...this.shadowRoot.querySelectorAll('slot')];
    const tiles = () => slots.flatMap((slot) => slot.assignedElements());
    const arm = () => {
      const items = tiles();
      items.forEach((tile, index) => {
        tile.style.setProperty('--reveal-index', String(index));
        if (!this.#reduced) tile.classList.add('reveal');
      });
      if (this.#seen) for (const tile of items) tile.classList.add('revealed');
    };
    for (const slot of slots) slot.addEventListener('slotchange', arm);
    arm();
    if (this.#reduced) return;
    this.#observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.#seen = true;
      for (const tile of tiles()) tile.classList.add('revealed');
      this.#observer.disconnect();
    }, { threshold: 0.15 });
    this.#observer.observe(this);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
  }
}

ArqCollectionMosaic.define();

export { ArqCollectionMosaic };
