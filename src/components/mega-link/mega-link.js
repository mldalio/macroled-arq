// mega-link · Figma 840:2070 · ficha doc/mega-link (1446:7440)
//
// Link del mega-menu (desktop) y del submenú de Productos (navbar mobile).
//
//   <arq-mega-link href="/arq/productos?…" show-arrow>Jardín</arq-mega-link>
//   <arq-mega-link href="/arq/coleccion/kanu" show-arrow>Kanu<span slot="meta">Jardín · Pared</span></arq-mega-link>
//   <arq-mega-link type="group">Interior
//     <a slot="links" href="…">Embutir</a>
//     <arq-button slot="links" type="underline" show-underline href="…">Ver todo</arq-button>
//   </arq-mega-link>
//
// - Type=Link: un <a> con el nombre (slot por defecto), la bajada (slot meta;
//   sin contenido no se muestra) y la flecha (show-arrow). Size Default
//   (role/body, mega-menu) o Large (role/body-lg, submenú mobile).
// - Type=Group: encabezado desplegable (<button aria-expanded>, Disclosure)
//   con + / –. Abierto muestra los links del slot links (role/body-lg) y el
//   "Ver todo" que pone la página.
// - Show arrow viene en true en Figma; en código es un atributo de presencia.
// - State no es prop: Hover (:hover) y Focus (:focus-visible).
// - Nombre del Group en role/body-xl, como el set (la ficha dice role/body-lg:
//   manda el set).
// - Type se lee al conectarse (no cambia después).
// TODO (show-image): Show image no se usa en ninguna pantalla y la miniatura
// (60) no tiene token. No está implementada.

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './mega-link.css?inline';

const LINK =
  `<a class="link">` +
  `<span class="text">` +
  `<span class="name role-body"><slot></slot></span>` +
  `<span class="meta role-caption"><slot name="meta"></slot></span>` +
  `</span>` +
  `<span class="arrow">${icon('arrow-right')}</span>` +
  `</a>`;

const GROUP =
  `<div class="group">` +
  `<button type="button" class="trigger">` +
  `<span class="name role-body-xl"><slot></slot></span>` +
  `<span class="toggle">${icon('plus')}${icon('minus')}</span>` +
  `</button>` +
  `<div class="links"><slot name="links"></slot></div>` +
  `</div>`;

class ArqMegaLink extends ArqElement {
  static tag = 'arq-mega-link';
  static styles = css;
  static properties = {
    type: { type: String, values: ['link', 'group'], default: 'link' }, // Type
    size: { type: String, values: ['default', 'large'], default: 'default' }, // Size
    open: { type: Boolean }, // Open (solo Group)
    showArrow: { type: Boolean }, // Show arrow
    href: { type: String },
  };

  setup() {
    const root = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = this.type === 'group' ? GROUP : LINK;
    root.append(template.content);
    if (this.type === 'group') {
      this.disclosure = new Disclosure(this, {
        trigger: root.querySelector('.trigger'),
        panel: root.querySelector('.links'),
      });
    } else {
      root.querySelector('slot[name="meta"]').addEventListener('slotchange', () => this.#syncMeta());
    }
  }

  /** El foco va al <a> o al <button> interno. */
  focus(options) {
    const control = this.shadowRoot.querySelector('.link, .trigger');
    if (control) control.focus(options);
    else super.focus(options);
  }

  update() {
    const link = this.shadowRoot.querySelector('.link');
    if (!link) return;
    if (this.href) link.setAttribute('href', this.href);
    else link.removeAttribute('href');
    this.shadowRoot.querySelector('.arrow').hidden = !this.showArrow;
    const name = link.querySelector('.name');
    name.classList.toggle('role-body', this.size !== 'large');
    name.classList.toggle('role-body-lg', this.size === 'large');
    this.#syncMeta();
  }

  #syncMeta() {
    const slot = this.shadowRoot.querySelector('slot[name="meta"]');
    if (slot) slot.parentElement.hidden = !slot.assignedNodes({ flatten: true }).some((n) => n.textContent.trim());
  }
}

ArqMegaLink.define();

export { ArqMegaLink };
