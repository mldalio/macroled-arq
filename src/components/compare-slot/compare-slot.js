// compare-slot · Figma 1233:3656 · ficha doc/compare-slot
//
// Lugar de producto en compare-bar (Desktop y la lista apilada de Mobile).
//
//   <arq-compare-slot image="…/kanu.jpg" sku="KANU-J-500-12W-N-WW">
//     <span slot="name">Kanu Jardín</span>
//     <span slot="meta">Exterior · Jardín</span>
//   </arq-compare-slot>
//   <arq-compare-slot></arq-compare-slot>                       Empty
//
// - State: Filled si tiene nombre; Empty ("Agregar producto") si no. Lo pone el
//   componente (atributo filled).
// - Foto (layout/compare-thumb) + nombre (role/label) + meta y quitar
//   (icon-button); ancho máximo layout/compare-slot. Un solo tamaño: Size=Compact
//   se quitó del set y del código (decisiones.md, 2026-10-19).
// - Quitar emite arq:remove { sku }.
// - Empty es clickeable: todo el lugar es un botón «Agregar producto» que
//   emite arq:add (en Productos abre compare-picker). Mantiene el dibujo del
//   set (foto en color/surface/subtle con el «+» resaltado y el texto) dentro
//   de una caja punteada, como el lugar vacío de compare-product Compact
//   (Comparativa); Hover con fondo color/surface/faint y borde
//   color/border/strong (en el set, State=empty-hover; en código, :hover).

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import '../icon-button/icon-button.js';
import css from './compare-slot.css?inline';

class ArqCompareSlot extends ArqElement {
  static tag = 'arq-compare-slot';
  static styles = css;
  static properties = {
    filled: { type: Boolean }, // State=Filled (lo pone el componente)
    image: { type: String }, // foto del producto
    sku: { type: String }, // identifica el producto en arq:remove
    emptyLabel: { type: String, default: 'Agregar producto' },
  };
  static template =
    `<div class="slot">` +
    `<span class="thumb"><img alt="" hidden>${icon('plus')}</span>` +
    `<span class="info">` +
    `<span class="name role-label"><slot name="name"></slot></span>` +
    `<span class="meta role-body-sm"><slot name="meta"></slot></span>` +
    `<span class="empty role-body-sm"></span>` +
    `</span>` +
    `<arq-icon-button icon="close" class="remove"></arq-icon-button>` +
    `<button type="button" class="add" hidden></button>` +
    `</div>`;

  setup() {
    const root = this.shadowRoot;
    const img = root.querySelector('img');
    img.addEventListener('load', () => (img.hidden = false));
    img.addEventListener('error', () => (img.hidden = true));
    root.querySelector('.remove').addEventListener('click', () => this.emit('remove', { sku: this.sku ?? null }));
    root.querySelector('.add').addEventListener('click', () => this.emit('add'));
    for (const slot of root.querySelectorAll('slot')) slot.addEventListener('slotchange', () => this.#sync());
  }

  update(changed) {
    const img = this.shadowRoot.querySelector('img');
    if (changed.has('image')) {
      if (this.image) img.src = this.image;
      else {
        img.removeAttribute('src');
        img.hidden = true;
      }
    }
    this.#sync();
  }

  #sync() {
    const root = this.shadowRoot;
    const name = this.querySelector('[slot="name"]')?.textContent.trim() ?? '';
    const filled = Boolean(name);
    if (this.filled !== filled) this.filled = filled;
    root.querySelector('.empty').textContent = filled ? '' : this.emptyLabel ?? '';
    const remove = root.querySelector('.remove');
    remove.textContent = `Quitar ${name}`;
    remove.hidden = !filled;
    const add = root.querySelector('.add');
    add.hidden = filled;
    add.setAttribute('aria-label', this.emptyLabel ?? '');
  }
}

ArqCompareSlot.define();

export { ArqCompareSlot };
