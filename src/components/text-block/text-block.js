// text-block · Home v2 (Final 2072:20657)
//
// Kicker, título y bajada de una escena del Home, con una flecha opcional.
// El <h2> llega por slot (AGENTS.md). La flecha es un link: el nombre
// accesible va en el slot link y no se muestra.
//
//   <arq-text-block href="/arq/productos">
//     <span slot="kicker">02 – Selección</span>
//     <h2 slot="title">Productos destacados</h2>
//     <span slot="description">Una selección de piezas para empezar a proyectar.</span>
//     <span slot="link">Ver todos los productos</span>
//   </arq-text-block>
//
// TODO (diseño): el título de Home v2 es Regular 50/64 y no hay role/*. Se
// usa role/display-sm (48/56) en Regular.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './text-block.css?inline';

const OPTIONAL = ['kicker', 'title', 'description'];

class ArqTextBlock extends ArqElement {
  static tag = 'arq-text-block';
  static styles = css;
  static properties = {
    href: { type: String }, // destino de la flecha
  };
  static template =
    `<div class="block">` +
    `<p class="kicker role-label" hidden><slot name="kicker"></slot></p>` +
    `<div class="title role-display-sm"><slot name="title"></slot></div>` +
    `<p class="description role-body" hidden><slot name="description"></slot></p>` +
    `<a class="arrow" hidden>${icon('arrow-right')}<span class="visually-hidden"><slot name="link"></slot></span></a>` +
    `</div>`;

  setup() {
    for (const name of OPTIONAL) {
      this.shadowRoot.querySelector(`slot[name="${name}"]`).addEventListener('slotchange', () => this.update());
    }
  }

  update() {
    const root = this.shadowRoot;
    const filled = (name) =>
      root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.textContent.trim());
    for (const name of OPTIONAL) root.querySelector(`.${name}`).hidden = !filled(name);

    const arrow = root.querySelector('.arrow');
    if (this.href) {
      arrow.hidden = false;
      arrow.href = this.href;
    } else {
      arrow.hidden = true;
      arrow.removeAttribute('href');
    }
  }
}

ArqTextBlock.define();

export { ArqTextBlock };
