// mega-link · Figma 840:2070 · ficha doc/mega-link (1446:7440)
//
// Link del mega-menu (desktop) y del submenú de Productos (navbar mobile).
//
//   <arq-mega-link href="/arq/productos?…" show-arrow>Jardín</arq-mega-link>
//   <arq-mega-link href="/arq/coleccion/kanu" show-image image="…">Kanu<span slot="meta">Jardín · Pared</span></arq-mega-link>
//   <arq-mega-link button show-arrow icon="chevron-right">Interior</arq-mega-link>
//   <arq-mega-link type="group">Interior
//     <a slot="links" href="…">Embutir</a>
//     <arq-button slot="links" type="underline" show-underline href="…">Ver todo</arq-button>
//   </arq-mega-link>
//
// - Type=Link: un <a> con el nombre (slot por defecto), la bajada (slot meta;
//   sin contenido no se muestra), la miniatura (show-image) y la flecha
//   (show-arrow). Size Default (role/body) o Large (role/body-lg): son los dos
//   únicos tamaños del set (2026-10-13: se quitaron XL y Small).
// - button: el link entra a un submenú (navbar mobile, Mode=Products) en lugar
//   de ir a una URL: se dibuja como <button> y el padre escucha el click. En
//   Figma la flecha de esa fila es icon/chevron-right (prop icon).
// - Type=Group: encabezado desplegable (<button aria-expanded>, Disclosure)
//   con + / –. Abierto muestra los links del slot links (role/body-lg) y el
//   "Ver todo" que pone la página.
// - Show arrow viene en true en Figma; en código es un atributo de presencia.
//   Show image, en false (en Figma tiene la miniatura de 60 × 60 con
//   color/surface/subtle como fondo).
// - State no es prop: Hover (:hover) y Focus (:focus-visible).
// - Nombre del Group en role/body-xl, como el set (la ficha dice role/body-lg:
//   manda el set).
// - Type se lee al conectarse (no cambia después).
// TODO (show-image): la miniatura mide 60 en Figma y no hay token; se usa
// layout/table-thumb (56), el más cercano.

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './mega-link.css?inline';

const linkTemplate = (tag) =>
  `<${tag} class="link"${tag === 'button' ? ' type="button"' : ''}>` +
  `<span class="text">` +
  `<span class="name role-body"><slot></slot></span>` +
  `<span class="meta role-caption"><slot name="meta"></slot></span>` +
  `</span>` +
  `<span class="thumb" hidden><img alt="" hidden></span>` +
  `<span class="arrow">${icon('arrow-right')}</span>` +
  `</${tag}>`;

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
    showImage: { type: Boolean }, // Show image
    image: { type: String }, // URL de la miniatura (Show image)
    icon: { type: String, default: 'arrow-right' }, // ícono de la flecha
    button: { type: Boolean }, // el link abre un submenú: <button> en lugar de <a>
    href: { type: String },
  };

  setup() {
    const root = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = this.type === 'group' ? GROUP : linkTemplate(this.button ? 'button' : 'a');
    root.append(template.content);
    if (this.type === 'group') {
      this.disclosure = new Disclosure(this, {
        trigger: root.querySelector('.trigger'),
        panel: root.querySelector('.links'),
      });
    } else {
      root.querySelector('slot[name="meta"]').addEventListener('slotchange', () => this.#syncMeta());
      const img = root.querySelector('.thumb img');
      img.addEventListener('load', () => (img.hidden = false));
      img.addEventListener('error', () => (img.hidden = true));
    }
  }

  /** El foco va al <a> o al <button> interno. */
  focus(options) {
    const control = this.shadowRoot.querySelector('.link, .trigger');
    if (control) control.focus(options);
    else super.focus(options);
  }

  update(changed) {
    const root = this.shadowRoot;
    const link = root.querySelector('.link');
    if (!link) return;
    if (link.localName === 'a') {
      if (this.href) link.setAttribute('href', this.href);
      else link.removeAttribute('href');
    }
    const arrow = root.querySelector('.arrow');
    arrow.hidden = !this.showArrow;
    if (changed.has('icon')) arrow.innerHTML = icon(this.icon);
    const thumb = root.querySelector('.thumb');
    thumb.hidden = !this.showImage;
    if (changed.has('image') || changed.has('showImage')) {
      const img = thumb.querySelector('img');
      if (this.showImage && this.image) img.src = this.image;
      else {
        img.removeAttribute('src');
        img.hidden = true;
      }
    }
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
