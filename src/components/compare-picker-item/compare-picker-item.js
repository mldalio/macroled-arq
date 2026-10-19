// compare-picker-item · Figma 2723:8420
//
// Fila del modal «Agregar producto» de la comparativa (compare-picker):
// miniatura, nombre, meta y el botón «Agregar».
//
//   <arq-compare-picker-item image="…/kanu.jpg" sku="KANU-J-500-12W-N-WW">
//     <span slot="name">Kanu Jardín</span>
//     <span slot="meta">Exterior · Jardín</span>
//   </arq-compare-picker-item>
//
// - State: Default y Hover (:hover de la fila) con «+ Agregar»; Added (atributo
//   added: el producto ya está en la comparativa, «Agregado» deshabilitado,
//   sin ícono); Disabled (atributo disabled: ya hay 3 productos; «+ Agregar»
//   deshabilitado, texto en color/text/disabled y la miniatura con
//   opacity/disabled).
// - «Agregar» emite arq:add { sku }. El nombre accesible del botón suma el
//   nombre del producto («Agregar Kanu Jardín»).
// - Sin imagen (o si no carga): queda el fondo color/surface/subtle.
// - focus() va a «Agregar».

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import css from './compare-picker-item.css?inline';

class ArqComparePickerItem extends ArqElement {
  static tag = 'arq-compare-picker-item';
  static styles = css;
  static properties = {
    added: { type: Boolean }, // State=Added
    disabled: { type: Boolean }, // State=Disabled
    image: { type: String }, // miniatura del producto
    sku: { type: String }, // SKU que se agrega (arq:add)
  };
  static template =
    `<div class="item">` +
    `<span class="thumb"><img alt="" hidden></span>` +
    `<span class="info">` +
    `<span class="name role-body-compact-regular"><slot name="name"></slot></span>` +
    `<span class="meta role-caption"><slot name="meta"></slot></span>` +
    `</span>` +
    `<arq-button type="outline" class="action" show-leading-icon leading-icon="plus">` +
    `<span class="label"></span><span class="visually-hidden product"></span>` +
    `</arq-button>` +
    `</div>`;

  setup() {
    const root = this.shadowRoot;
    const img = root.querySelector('img');
    img.addEventListener('load', () => (img.hidden = false));
    img.addEventListener('error', () => (img.hidden = true));
    root.querySelector('.action').addEventListener('click', () => {
      if (this.added || this.disabled) return;
      this.emit('add', { sku: this.sku ?? null });
    });
    root.querySelector('slot[name="name"]').addEventListener('slotchange', () => this.#name());
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('image')) {
      const img = root.querySelector('img');
      if (this.image) img.src = this.image;
      else {
        img.removeAttribute('src');
        img.hidden = true;
      }
    }
    const action = root.querySelector('.action');
    action.disabled = this.added || this.disabled;
    action.showLeadingIcon = !this.added;
    root.querySelector('.label').textContent = this.added ? 'Agregado' : 'Agregar';
    this.#name();
  }

  /** El foco va a «Agregar». */
  focus(options) {
    const action = this.shadowRoot?.querySelector('.action');
    if (action) action.focus(options);
    else super.focus(options);
  }

  #name() {
    const name = this.querySelector('[slot="name"]')?.textContent.trim() ?? '';
    this.shadowRoot.querySelector('.product').textContent = name ? ` ${name}` : '';
  }
}

ArqComparePickerItem.define();

export { ArqComparePickerItem };
