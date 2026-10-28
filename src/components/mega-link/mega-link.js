// mega-link · Figma 840:2070 · ficha doc/mega-link (1446:7440)
//
// Link del mega-menu (desktop) y del submenú de Productos (navbar mobile).
//
//   <arq-mega-link href="/arq/productos?…" show-arrow>Jardín</arq-mega-link>
//   <arq-mega-link href="/arq/productos?collection=kanu" show-arrow>Kanu<span slot="meta">Jardín · Pared</span></arq-mega-link>
//   <arq-mega-link type="group">Interior
//     <a slot="links" href="…">Embutir</a>
//     <arq-button slot="links" type="underline" show-underline href="…">Ver todo</arq-button>
//   </arq-mega-link>
//
// - Type=Link: un <a> con el nombre (slot por defecto), la bajada (slot meta;
//   sin contenido no se muestra), la miniatura (show-image) y la flecha
//   (show-arrow). Size Default (role/body-xl, mega-menu; frames 2295:23636 y
//   2295:23730) o Large (role/heading-3, submenús mobile; bajada
//   role/caption). Las filas submenu también van en role/heading-3: todo el
//   menú mobile navega con un solo estilo (decisión 2026-10-14 · Textos del
//   menú mobile).
// - La flecha (arrow-right) aparece solo en Hover y Focus (frames del
//   mega-menu: el link en reposo no la lleva).
// - submenu (solo de código): la fila abre un submenú del menú mobile (lista
//   de Productos, frame 2295:23568). Es un <button> con chevron-right siempre
//   visible; quien lo usa escucha el click.
// - Type=Group: encabezado desplegable (<button aria-expanded>, Disclosure)
//   con + / –. Abierto muestra los links del slot links (role/body-lg) y el
//   "Ver todo" que pone la página.
// - Show arrow viene en true en Figma; en código es un atributo de presencia.
// - State no es prop: Hover (:hover) y Focus (:focus-visible).
// - Type y submenu se leen al conectarse (no cambian después).

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './mega-link.css?inline';

const ROW = (tag, end) =>
  `<${tag} class="link"${tag === 'button' ? ' type="button"' : ''}>` +
  `<span class="text">` +
  `<span class="name"><slot></slot></span>` +
  `<span class="meta"><slot name="meta"></slot></span>` +
  `</span>` +
  `<span class="thumb" hidden><img alt="" hidden></span>` +
  end +
  `</${tag}>`;
const LINK = ROW('a', `<span class="arrow">${icon('arrow-right')}</span>`);
const SUBMENU = ROW('button', `<span class="chevron">${icon('chevron-right')}</span>`);

const GROUP =
  `<div class="group">` +
  `<button type="button" class="trigger">` +
  `<span class="name role-body-xl"><slot></slot></span>` +
  `<span class="toggle">${icon('plus')}${icon('minus')}</span>` +
  `</button>` +
  `<div class="links"><slot name="links"></slot></div>` +
  `</div>`;

class ArqMegaLink extends ArqElement {
  #queue = []; // fotos de respaldo que le quedan a la miniatura
  #key = ''; // image y fallbacks con los que se armó #queue
  static tag = 'arq-mega-link';
  static styles = css;
  static properties = {
    type: { type: String, values: ['link', 'group'], default: 'link' }, // Type
    size: { type: String, values: ['default', 'large'], default: 'default' }, // Size
    open: { type: Boolean }, // Open (solo Group)
    showArrow: { type: Boolean }, // Show arrow
    showImage: { type: Boolean }, // Show image
    image: { type: String }, // miniatura (Show image); sin imagen, fondo neutro
    fallbacks: { type: String }, // solo de código: JSON con las fotos que prueba, en orden, si image no carga
    submenu: { type: Boolean }, // solo de código: abre un submenú mobile
    href: { type: String },
  };

  setup() {
    const root = this.shadowRoot;
    const template = document.createElement('template');
    template.innerHTML = this.type === 'group' ? GROUP : this.submenu ? SUBMENU : LINK;
    root.append(template.content);
    if (this.type === 'group') {
      this.disclosure = new Disclosure(this, {
        trigger: root.querySelector('.trigger'),
        panel: root.querySelector('.links'),
      });
    } else {
      root.querySelector('slot[name="meta"]').addEventListener('slotchange', () => this.#syncMeta());
      const img = root.querySelector('img');
      img.addEventListener('load', () => (img.hidden = false));
      img.addEventListener('error', () => {
        const next = this.#queue.shift();
        if (next) img.src = next;
        else img.hidden = true;
      });
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
    if (link.localName === 'a') {
      if (this.href) link.setAttribute('href', this.href);
      else link.removeAttribute('href');
      this.shadowRoot.querySelector('.arrow').hidden = !this.showArrow;
    }
    // Menú mobile (Large y submenu): role/heading-3, como los nav-link del Menú
    const large = this.size === 'large';
    link.querySelector('.name').className = `name ${large || this.submenu ? 'role-heading-3' : 'role-body-xl'}`;
    link.querySelector('.meta').className = 'meta role-body-compact-regular'; // 14 px, también en Large
    this.#syncMeta();
    this.#syncImage();
  }

  #syncMeta() {
    const slot = this.shadowRoot.querySelector('slot[name="meta"]');
    if (!slot) return;
    const hasMeta = slot.assignedNodes({ flatten: true }).some((n) => n.textContent.trim());
    slot.parentElement.hidden = !hasMeta;
    this.shadowRoot.querySelector('.link').classList.toggle('with-meta', hasMeta);
  }

  #syncImage() {
    const thumb = this.shadowRoot.querySelector('.thumb');
    const img = thumb.querySelector('img');
    thumb.hidden = !this.showImage;
    if (this.showImage && this.image) {
      // La lista de respaldo se toma siempre que cambia image o fallbacks (los atributos pueden
      // llegar en cualquier orden); si ya se estaba probando otra foto, no se vuelve a la primera.
      const key = `${this.image}|${this.fallbacks ?? ''}`;
      if (key !== this.#key) {
        this.#key = key;
        try {
          this.#queue = JSON.parse(this.fallbacks || '[]').filter((src) => src && src !== this.image);
        } catch {
          this.#queue = [];
        }
        if (img.getAttribute('src') !== this.image) img.src = this.image;
        else if (img.hidden && img.complete) img.dispatchEvent(new Event('error')); // la primera ya falló: sigue con la lista
      }
    } else {
      img.removeAttribute('src');
      img.hidden = true;
    }
  }
}

ArqMegaLink.define();

export { ArqMegaLink };
