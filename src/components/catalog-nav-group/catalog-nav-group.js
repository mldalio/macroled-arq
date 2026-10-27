// catalog-nav-group · Figma 1035:2410 · ficha doc/catalog-nav-group (1426:2110)
//
// Grupo desplegable del sidebar de catálogo: una macrofamilia (Interior,
// Exterior, Lámparas…) con su lista de catalog-nav-item.
//
//   <arq-catalog-nav-group open selected>
//     <span slot="label">Interior</span>
//     <arq-catalog-nav-item href="…" selected>Todo interior</arq-catalog-nav-item>
//     <arq-catalog-nav-item href="…">Embutir</arq-catalog-nav-item>
//   </arq-catalog-nav-group>
//
// - Selected (Figma: prop Selected del set): el grupo guarda la categoría
//   actual. Es el grupo, no el ítem, el que le dice a catalog-nav cuál abrir y
//   qué texto mostrar en Mobile. Si el HTML solo marca un ítem como selected,
//   el grupo se marca solo; si se marca el grupo a mano, se respeta. Figma no
//   dibuja diferencia entre Selected=False y Selected=True: es estado, no
//   estilo.
// - Encabezado <button> con aria-expanded (Disclosure); la lista queda en el
//   HTML aunque esté cerrada (indexable).
// - Open: lo decide el HTML (el grupo de la categoría actual). Si ningún grupo
//   viene abierto, catalog-nav abre el que tiene el ítem elegido.
// - El chevron (abajo cerrado, arriba abierto) tiene las medidas de
//   icon-button Size=Default (24, ícono 16) pero es parte del botón, no otro
//   botón. Es un solo chevron-down que gira al abrir.
// - Abrir y cerrar se desliza como compare-bar (decisión 2026-10-19 · Sidebar
//   de catálogo como compare-bar): la lista cambia de golpe y la línea del
//   grupo y los grupos de abajo vuelven con transform desde donde estaban
//   (motion/duration/expand + motion/easing/standard). Al abrir, la lista se
//   descubre con clip-path al mismo ritmo. No se anima el alto.
// - Selected: el grupo de la categoría actual. Sin cambio visual; lo pone
//   catalog-nav en el grupo que tiene el catalog-nav-item elegido.

import { ArqElement } from '../../base/arq-element.js';
import { Disclosure } from '../../base/disclosure.js';
import { icon } from '../../base/icons.js';
import css from './catalog-nav-group.css?inline';

class ArqCatalogNavGroup extends ArqElement {
  static tag = 'arq-catalog-nav-group';
  static styles = css;
  static properties = {
    open: { type: Boolean }, // Open
    selected: { type: Boolean }, // Selected (el grupo de la categoría actual)
  };
  static template =
    `<div class="group">` +
    `<button type="button" class="header">` +
    `<span class="label role-body-xl"><slot name="label"></slot></span>` +
    `<span class="icon-box">${icon('chevron-down')}</span>` +
    `</button>` +
    `<div class="items" part="panel"><div class="items-clip"><div class="items-inner"><div class="rail" role="list"><slot></slot></div></div></div></div>` +
    `</div>`;

  #auto = false; // selected lo puso el grupo al ver un ítem selected (no el HTML)
  #itemHeight = 0; // alto de un ítem, medido con la lista a la vista

  // Al cerrar, la lista ya está oculta cuando se calcula el recorrido: se usa
  // el alto medido en el clic, antes de cerrarse.
  #measureItem() {
    this.#itemHeight = this.querySelector(':scope > arq-catalog-nav-item')?.offsetHeight || this.#itemHeight;
    return this.#itemHeight;
  }

  setup() {
    const header = this.shadowRoot.querySelector('.header');
    // Alto antes del cambio. Se registra antes que Disclosure, así se mide
    // antes de que cambie open.
    let before = null;
    header.addEventListener('click', () => {
      before = this.getBoundingClientRect().height;
      this.#measureItem();
    });
    this.disclosure = new Disclosure(this, {
      trigger: header,
      panel: this.shadowRoot.querySelector('.items'),
    });
    this.addEventListener('arq:toggle', (event) => {
      if (event.target !== this) return;
      this.#slide(before);
      before = null;
    });
    const sync = () => this.#syncSelected();
    this.shadowRoot.querySelector('slot:not([name])').addEventListener('slotchange', sync);
    new MutationObserver(sync).observe(this, { subtree: true, attributes: true, attributeFilter: ['selected'] });
    sync();
  }

  // Como #slide de compare-bar: lo de abajo arranca donde estaba y llega a su
  // lugar nuevo con transform. La duración sale del recorrido: al abrir, de
  // motion/duration/slow (hasta 4 ítems) a motion/duration/fold (desde 15);
  // al cerrar, más corta, de motion/duration/expand a motion/duration/panel;
  // en el medio, lineal. Así una lista larga (Colecciones) no se descubre de
  // un salto. Con reduced motion las duraciones valen 0: cambia de golpe y
  // queda el fundido de Disclosure.
  #slide(before) {
    if (before === null) return;
    const styles = getComputedStyle(this);
    const ms = (name) => Number.parseFloat(styles.getPropertyValue(name)) || 0;
    const short = ms(this.open ? '--arq-motion-duration-slow' : '--arq-motion-duration-expand');
    if (!short) return;
    const group = this.shadowRoot.querySelector('.group');
    const items = this.shadowRoot.querySelector('.items');
    const icon = this.shadowRoot.querySelector('.icon');
    const below = [];
    for (let next = this.nextElementSibling; next; next = next.nextElementSibling) below.push(next);
    // Si se vuelve a tocar a mitad del desplazamiento, arranca desde donde se
    // ve ahora (el desplazamiento en curso), no desde el lugar de reposo.
    const current = below.length ? new DOMMatrixReadOnly(getComputedStyle(below[0]).transform).m42 : 0;
    const angle = getComputedStyle(icon).rotate;
    for (const element of [group, items, icon, ...below]) element.getAnimations().forEach((animation) => animation.cancel());
    const delta = before - this.getBoundingClientRect().height + current;
    if (!delta) return;
    const itemHeight = this.#measureItem() || Math.abs(delta);
    const progress = Math.min(Math.max((Math.abs(delta) / itemHeight - 4) / (15 - 4), 0), 1);
    const long = ms(this.open ? '--arq-motion-duration-fold' : '--arq-motion-duration-panel');
    const duration = Math.round(short + (long - short) * progress);
    const options = { duration, easing: styles.getPropertyValue('--arq-motion-easing-standard').trim() || 'ease-out' };
    const from = [{ transform: `translateY(${delta}px)` }, { transform: 'none' }];
    group.animate(from, { ...options, pseudoElement: '::after' });
    for (const element of below) element.animate(from, options);
    if (this.open) items.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }], options);
    // El chevron gira con el mismo tiempo, desde donde esté (su transition de
    // CSS ya había arrancado con expand)
    icon.animate([{ rotate: angle }, { rotate: getComputedStyle(icon).rotate }], options);
  }

  #syncSelected() {
    const hasItem = Boolean(this.querySelector(':scope > arq-catalog-nav-item[selected]'));
    if (hasItem && !this.selected) {
      this.#auto = true;
      this.selected = true;
    } else if (!hasItem && this.selected && this.#auto) {
      this.#auto = false;
      this.selected = false;
    }
  }
}

ArqCatalogNavGroup.define();

export { ArqCatalogNavGroup };
