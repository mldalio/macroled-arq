// select · Figma 921:2544 · ficha doc/select
//
// Selector con menú desplegable (select-menu). Type=Field: campo del
// configurador (muestra + nombre). Type=Filter: celda de filter-bar (etiqueta
// + valor; "Todos" primero).
//
//   <arq-select type="filter" label="Acabado" name="color_carcasa"></arq-select>
//   select.options = [
//     { value: 'Negro', label: 'Negro', swatch: '…/negro.jpg' },
//     { value: 'Verde', label: 'Verde', disabled: true },
//   ];
//
// - Las opciones las arma el componente con los datos (options, solo JS): así
//   el campo y la lista están en el mismo Shadow DOM y funciona el patrón de
//   select de un solo valor (combobox + listbox con aria-activedescendant).
//   Filter suma primero "Todos" (value "").
// - Teclado: cerrado, flechas, Enter, Espacio o una letra abren; abierto,
//   flechas, Inicio, Fin y letras mueven la opción resaltada (saltean las
//   deshabilitadas), Enter o Espacio eligen y Esc o Tab cierran. El foco queda
//   en el campo.
// - Emite arq:change { value } al elegir. Filled (Filter con un valor) se pone
//   solo como atributo.
// - Donde la descripción difiere del set se sigue al set (Hover del Field en
//   color/surface/faint; valor del Filter en role/body-medium).

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import { Combobox } from '../../base/combobox.js';
import '../select-menu/select-menu.js';
import '../swatch/swatch.js';
import css from './select.css?inline';

let uid = 0;

class ArqSelect extends ArqElement {
  static tag = 'arq-select';
  static styles = css;
  static properties = {
    type: { type: String, values: ['field', 'filter'], default: 'field' }, // Type
    label: { type: String }, // Label (Filter: visible; Field: nombre accesible)
    value: { type: String }, // valor elegido (Field: Name; Filter: Value)
    name: { type: String }, // campo al que corresponde (lo usa filter-bar)
    disabled: { type: Boolean }, // State=Disabled
    open: { type: Boolean }, // Open
    filled: { type: Boolean }, // State=Filled (lo pone el componente)
    allLabel: { type: String, default: 'Todos' }, // primera opción de Filter
  };
  static template =
    `<div class="select">` +
    `<span class="label role-label-sm" hidden></span>` +
    `<button type="button" class="trigger" aria-expanded="false">` +
    `<arq-swatch class="swatch" aria-hidden="true" hidden></arq-swatch>` +
    `<span class="value"></span>` +
    `<span class="chevron">${icon('chevron-down')}${icon('chevron-up')}</span>` +
    `</button>` +
    `<arq-select-menu class="menu" hidden></arq-select-menu>` +
    `</div>`;

  #options = [];
  #combobox = null;

  get options() {
    return this.#options;
  }

  set options(list) {
    this.#options = Array.isArray(list) ? list : [];
    if (this.isConnected) this.#render();
  }

  setup() {
    const root = this.shadowRoot;
    const id = `arq-select-${++uid}`;
    this.trigger = root.querySelector('.trigger');
    this.menu = root.querySelector('.menu');
    this.menu.id = `${id}-menu`;
    root.querySelector('.label').id = `${id}-label`;
    this.trigger.id = `${id}-trigger`;
    // Teclado, resaltado y clics: src/base/combobox.js (el mismo de input Select)
    this.#combobox = new Combobox({
      trigger: this.trigger,
      menu: this.menu,
      options: () => this.#list(),
      selected: () => this.#list().findIndex((o) => o.value === (this.value ?? '')),
      isOpen: () => this.open,
      setOpen: (open) => (this.open = open),
      choose: (index) => this.#choose(index),
    });
    this.#render();
  }

  update(changed) {
    const root = this.shadowRoot;
    const filter = this.type === 'filter';
    const label = root.querySelector('.label');
    label.hidden = !filter;
    label.textContent = this.label ?? '';
    label.className = `label role-label-sm`;
    if (filter) {
      this.trigger.setAttribute('aria-labelledby', `${label.id} ${this.trigger.id}`);
      this.trigger.removeAttribute('aria-label');
    } else {
      this.trigger.removeAttribute('aria-labelledby');
      if (this.label) this.trigger.setAttribute('aria-label', this.label);
    }
    this.trigger.disabled = this.disabled;
    this.menu.type = filter ? 'filter' : 'finishes';
    if (changed.has('open')) {
      this.menu.hidden = !this.open;
      this.trigger.setAttribute('aria-expanded', String(this.open));
      if (!this.open) this.#combobox.closed();
    }
    this.#render();
  }

  /** Abre el menú con la opción elegida resaltada. */
  show() {
    if (this.disabled) return;
    this.#combobox.show();
  }

  /** Cierra el menú. */
  close(focus = true) {
    this.#combobox.close(focus);
  }

  /** El foco va al campo. */
  focus(options) {
    this.trigger ? this.trigger.focus(options) : super.focus(options);
  }

  // Opciones con "Todos" primero en Filter.
  #list() {
    const list = this.#options.map((o) => ({ value: String(o.value), label: o.label ?? String(o.value), swatch: o.swatch, showSwatch: Boolean(o.swatch || o.showSwatch), disabled: Boolean(o.disabled) }));
    if (this.type === 'filter') list.unshift({ value: '', label: this.allLabel ?? 'Todos', showSwatch: false, disabled: false });
    return list;
  }

  #render() {
    if (!this.trigger) return;
    const list = this.#list();
    const current = list.find((o) => o.value === (this.value ?? '')) ?? (this.type === 'filter' ? list[0] : null);
    const filled = this.type === 'filter' && Boolean(this.value);
    if (this.filled !== filled) this.filled = filled;
    // Campo: muestra (Field Large; Filter Small, solo si hay un acabado elegido) + nombre
    const swatch = this.shadowRoot.querySelector('.swatch');
    const showSwatch = Boolean(current?.showSwatch) && (this.type === 'field' || filled);
    swatch.hidden = !showSwatch;
    swatch.setAttribute('size', this.type === 'field' ? 'large' : 'small');
    if (current?.swatch) swatch.setAttribute('src', current.swatch);
    else swatch.removeAttribute('src');
    swatch.textContent = current?.label ?? '';
    const value = this.shadowRoot.querySelector('.value');
    value.textContent = current?.label ?? '';
    value.className = `value ${this.type === 'filter' && !this.disabled ? 'role-body-medium' : 'role-body-regular'}`;
    // Menú: se reusan las opciones (el resaltado no se pierde)
    const menu = this.menu;
    while (menu.children.length > list.length) menu.lastElementChild.remove();
    while (menu.children.length < list.length) menu.append(document.createElement('arq-select-option'));
    list.forEach((o, i) => {
      const el = menu.children[i];
      el.id = `${menu.id}-${i}`;
      el.dataset.index = String(i);
      el.value = o.value;
      el.textContent = o.label;
      el.showSwatch = o.showSwatch;
      el.swatchSrc = o.swatch ?? null;
      el.disabled = o.disabled;
      el.selected = o === current;
    });
  }

  // El combobox ya validó la opción y cierra el menú después.
  #choose(index) {
    const option = this.#list()[index];
    const changed = option.value !== (this.value ?? '');
    this.value = option.value;
    if (changed) this.emit('change', { value: option.value });
  }
}

ArqSelect.define();

export { ArqSelect };
