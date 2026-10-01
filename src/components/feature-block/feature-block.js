// feature-block · Figma 1036:2535 · ficha doc/feature-block (1455:7570)
//
// Bloque editorial del Home con imagen protagonista: foto grande (y una
// secundaria opcional) + eyebrow, título, bajada y un button.
//
//   <arq-feature-block>                    (layout="image-right" lo espeja)
//     <img slot="image" src="…" alt="…" loading="lazy">
//     <span slot="label">Colección destacada</span>
//     <h2 slot="title">Kanu</h2>
//     <span slot="description">…</span>
//     <arq-button slot="action" type="underline" show-underline show-icon icon="arrow-right" href="/arq/coleccion/kanu">Ver colección</arq-button>
//     <img slot="secondary" src="…" alt="…" loading="lazy">
//   </arq-feature-block>
//
// - Layout: Image left (def.) · Image right, con la misma estructura HTML. En
//   Mobile se apila: imagen, textos y, al final, la secundaria.
// - Show secondary image no es atributo: la secundaria se muestra si su slot
//   tiene contenido.
// - Imagen principal en ratio/portrait-soft (4:5). La secundaria en
//   ratio/wide (TODO: en el set tiene alto fijo, sin ratio).

import { ArqElement } from '../../base/arq-element.js';
import css from './feature-block.css?inline';

const OPTIONAL = ['label', 'description', 'action', 'secondary'];

class ArqFeatureBlock extends ArqElement {
  static tag = 'arq-feature-block';
  static styles = css;
  static properties = {
    layout: { type: String, values: ['image-left', 'image-right'], default: 'image-left' }, // Layout
  };
  static template =
    `<div class="block">` +
    `<div class="media image"><slot name="image"></slot></div>` +
    `<div class="content">` +
    `<p class="label role-label" hidden><slot name="label"></slot></p>` +
    `<div class="title role-display-sm"><slot name="title"></slot></div>` +
    `<p class="description role-body-lg" hidden><slot name="description"></slot></p>` +
    `<div class="action" hidden><slot name="action"></slot></div>` +
    `</div>` +
    `<div class="media secondary" hidden><slot name="secondary"></slot></div>` +
    `</div>`;

  setup() {
    for (const name of OPTIONAL) {
      this.shadowRoot.querySelector(`slot[name="${name}"]`).addEventListener('slotchange', () => this.update());
    }
  }

  update() {
    const root = this.shadowRoot;
    for (const name of OPTIONAL) {
      root.querySelector(`.${name}`).hidden = !root
        .querySelector(`slot[name="${name}"]`)
        .assignedNodes({ flatten: true })
        .some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());
    }
  }
}

ArqFeatureBlock.define();

export { ArqFeatureBlock };
