// compare-product · Figma 1057:2522 · ficha doc/compare-product
//
// Columna de producto dentro de compare-header: foto, nombre + link a la
// ficha, SKU y un select por atributo de variante (State=Filled); o una caja
// clickeable para agregar un producto cuando queda un lugar libre (State=
// Empty, hasta 3).
//
//   <arq-compare-product></arq-compare-product>
//   product.data = {
//     sku: 'KANU-J-500-12W-N-WW', name: 'Kanu Jardín', href: '/arq/producto/kanu-jardin', image: '…',
//     attributes: [  // uno por campo de VARIANT_ATTRIBUTES, como el configurador de la ficha
//       { field: 'color_carcasa', label: 'Color', value: 'Negro', options: [{ value, label, disabled, showSwatch }] },
//       { field: 'altura', label: 'Altura', value: '50 cm', options: [{ value, label, disabled }] },
//     ],
//   };
//   product.addEventListener('arq:add', () => abrirModalDeProductos());  // State=Empty
//
// - State lo pone el componente (atributo empty): Empty si no hay data.
// - Emite arq:change { field, value } al elegir un select (field: el campo del
//   atributo, p. ej. 'altura') y arq:remove { sku } al quitar (Filled). La
//   página resuelve el nuevo SKU con src/data/catalog.js y vuelve a asignar
//   data (el componente no consulta Typesense). Para cambiar de producto se
//   quita y se agrega otro, no hay select de familia.
// - Empty es un <button>: emite arq:add al clickear. TODO (diseño + código):
//   todavía no abre nada — la ficha dice que más adelante abre un modal para
//   elegir producto; por ahora solo el Hover (State=empty-hover) está listo.
// - Imagen 1:1 (aspect-ratio bloqueado), tope layout/compare-media-max.
// - Al imprimir, los selects se reemplazan por la variante elegida como texto
//   (.variant: etiqueta y valor de cada atributo).
// - Las opciones de familia/variante se arman en la página: el componente
//   solo las muestra (AGENTS.md · Datos).

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import '../icon-button/icon-button.js';
import '../select/select.js';
import css from './compare-product.css?inline';

class ArqCompareProduct extends ArqElement {
  static tag = 'arq-compare-product';
  static styles = css;
  static properties = {
    addLabel: { type: String, default: 'Agregar producto' },
  };
  static template =
    `<div class="product">` +
    `<div class="media">` +
    `<img alt="" hidden>` +
    `<arq-icon-button icon="close" class="remove"></arq-icon-button>` +
    `<button type="button" class="add">` +
    `<span class="add-icon">${icon('plus')}</span>` +
    `<span class="add-label role-body"></span>` +
    `</button>` +
    `</div>` +
    `<div class="info">` +
    `<a class="title"><span class="name role-heading-3"></span>${icon('arrow-up-right')}</a>` +
    `<p class="sku role-label"></p>` +
    `</div>` +
    `<div class="selects"></div>` +
    `<dl class="variant"></dl>` +
    `</div>`;

  #data = null;

  /** { sku, name, href, image, attributes: [{ field, label, value, options }] } o null (Empty). */
  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = value ?? null;
    this.toggleAttribute('empty', !value);
    if (this.isConnected) this.#render();
  }

  setup() {
    const root = this.shadowRoot;
    root.querySelector('.remove').addEventListener('click', () => this.emit('remove', { sku: this.#data?.sku ?? null }));
    root.querySelector('.add').addEventListener('click', () => this.emit('add'));
    root.querySelector('.selects').addEventListener('arq:change', (event) => {
      event.stopPropagation();
      const field = event.target.dataset.field;
      if (field) this.emit('change', { field, value: event.detail.value });
    });
    this.#render();
  }

  update() {
    this.#render();
  }

  #render() {
    const root = this.shadowRoot;
    const data = this.#data;
    const img = root.querySelector('img');
    if (data?.image) {
      img.src = data.image;
      img.hidden = false;
    } else {
      img.removeAttribute('src');
      img.hidden = true;
    }
    root.querySelector('.add-label').textContent = this.addLabel ?? '';
    root.querySelector('.name').textContent = data?.name ?? '';
    const title = root.querySelector('.title');
    if (data?.href) title.href = data.href;
    else title.removeAttribute('href');
    title.setAttribute('aria-label', data ? `Ver ficha de ${data.name}` : '');
    root.querySelector('.sku').textContent = data?.sku ?? '';
    // Siempre con nombre accesible, aunque esté oculto en State=Empty (icon-button lo exige).
    root.querySelector('.remove').textContent = data ? `Quitar ${data.name}` : 'Quitar';
    this.#renderSelects(data);
  }

  // Un select por atributo de variante (Color, Altura…), como el configurador
  // de la ficha. Se reusan los <arq-select> que ya están.
  #renderSelects(data) {
    const selects = this.shadowRoot.querySelector('.selects');
    const defs = (data?.attributes ?? []).map((a) => ({ field: a.field, label: a.label, value: a.value ?? '', options: a.options ?? [] }));
    while (selects.children.length > defs.length) selects.lastElementChild.remove();
    while (selects.children.length < defs.length) {
      const select = document.createElement('arq-select');
      select.type = 'field';
      selects.append(select);
    }
    defs.forEach((def, i) => {
      const select = selects.children[i];
      select.dataset.field = def.field;
      select.label = def.label;
      select.options = def.options;
      select.value = def.value;
    });
    // Para imprimir: la opción elegida como texto (con su label, si lo tiene).
    this.shadowRoot.querySelector('.variant').replaceChildren(
      ...defs
        .filter((def) => def.value !== '')
        .map((def) => {
          const item = document.createElement('div');
          const term = document.createElement('dt');
          term.className = 'role-label';
          term.textContent = def.label;
          const detail = document.createElement('dd');
          detail.className = 'role-body-regular';
          detail.textContent = def.options.find((o) => String(o.value) === String(def.value))?.label ?? def.value;
          item.append(term, detail);
          return item;
        }),
    );
  }
}

ArqCompareProduct.define();

export { ArqCompareProduct };
