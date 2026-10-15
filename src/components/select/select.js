// select · Figma 921:2544 · ficha doc/select
//
// Selector con menú desplegable (select-menu). Type=Field: campo del
// configurador (etiqueta siempre visible arriba + nombre; muestra solo si la
// opción es un acabado/color). Type=Filter: celda de filter-bar (etiqueta +
// valor; "Todos" primero).
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
// - Field: etiqueta sin gap + trigger con línea inferior. Filter: etiqueta a
//   space/gap/sm y trigger sin línea (salvo Disabled). Con hide-all, Filter no
//   suma "Todos" (compare-product). Hover y Open en color/surface/faint en los dos, y el texto va
//   en role/body-regular, salvo el valor elegido de Filter (Filled), que va en
//   role/body-medium.
// - size (Figma: Size) solo cambia la etiqueta de Filter: Default en
//   role/label-lg (14, filter-bar y Descargas), Small en role/label (12,
//   compare-product). Field siempre va en role/label.
//   role/label-sm (10 px) ya no se usa acá.
// - show-swatch (Figma: Show swatch): muestra la muestra de color en todas las
//   opciones. Sin el atributo, cada opción decide con swatch / showSwatch.
//   En Figma la prop viene activada; en código va desactivada (atributo de
//   presencia).
// - multiple (solo Filter; página Descargas · propuesta 2575:22875, «select ·
//   Potencia (abierto, múltiple)»): el menú lista las opciones con la caja de
//   checkbox, sin «Todos», y queda abierto al marcar. El campo muestra los
//   valores elegidos separados por coma («8 W, 12 W», Filled) o allLabel si no
//   hay ninguno. Los valores van en values (array, solo JS) y arq:change
//   emite { value, values } (value: el primero, o "").

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
    size: { type: String, values: ['default', 'small'], default: 'default' }, // Size (solo cambia en Filter)
    label: { type: String }, // Label (Filter: visible; Field: nombre accesible)
    value: { type: String }, // valor elegido (Field: Name; Filter: Value)
    name: { type: String }, // campo al que corresponde (lo usa filter-bar)
    disabled: { type: Boolean }, // State=Disabled
    open: { type: Boolean }, // Open
    filled: { type: Boolean }, // State=Filled (lo pone el componente)
    allLabel: { type: String, default: 'Todos' }, // primera opción de Filter
    hideAll: { type: Boolean }, // Filter sin "Todos" (compare-product: siempre hay un valor)
    showSwatch: { type: Boolean }, // Show swatch: muestra de color en las opciones
    multiple: { type: Boolean }, // solo de código: selección múltiple (Descargas)
  };
  static template =
    `<div class="select">` +
    `<span class="label role-label" hidden></span>` +
    `<button type="button" class="trigger" aria-expanded="false">` +
    `<arq-swatch class="swatch" aria-hidden="true" hidden></arq-swatch>` +
    `<span class="value"></span>` +
    `<span class="chevron">${icon('chevron-down')}${icon('chevron-up')}</span>` +
    `</button>` +
    `<arq-select-menu class="menu" hidden></arq-select-menu>` +
    `</div>`;

  #options = [];
  #values = [];
  #combobox = null;

  /** Valores elegidos con multiple (array). */
  get values() {
    return [...this.#values];
  }

  set values(list) {
    this.#values = Array.isArray(list) ? list.map(String) : [];
    if (this.isConnected) this.#render();
  }

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
      selected: () => this.#list().findIndex((o) => this.#isSelected(o)),
      multiple: () => this.multiple,
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
    // La etiqueta se ve siempre arriba del campo, en los dos Type y en
    // cualquier State (incluido Disabled).
    label.hidden = false;
    label.textContent = this.label ?? '';
    // Field y Filter Size=Small: role/label (12) · Filter Size=Default: role/label-lg (14)
    label.className = `label ${filter && this.size !== 'small' ? 'role-label-lg' : 'role-label'}`;
    this.trigger.setAttribute('aria-labelledby', `${label.id} ${this.trigger.id}`);
    this.trigger.removeAttribute('aria-label');
    this.trigger.disabled = this.disabled;
    // Size=Small (compare-product, columnas angostas): menú del ancho del
    // campo, así no se sale de la columna ni de la pantalla.
    // multiple: el menú también toma el ancho del campo (propuesta Descargas).
    this.menu.type = filter && this.size !== 'small' && !this.multiple ? 'filter' : 'finishes';
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
    const list = this.#options.map((o) => ({
      value: String(o.value),
      label: o.label ?? String(o.value),
      swatch: o.swatch,
      // show-swatch del select lo activa para todas; una opción lo apaga con showSwatch: false
      showSwatch: o.showSwatch === false ? false : Boolean(o.swatch || o.showSwatch || this.showSwatch),
      disabled: Boolean(o.disabled),
    }));
    if (this.type === 'filter' && !this.hideAll && !this.multiple) list.unshift({ value: '', label: this.allLabel ?? 'Todos', showSwatch: false, disabled: false });
    return list;
  }

  #render() {
    if (!this.trigger) return;
    const list = this.#list();
    const chosen = this.multiple ? list.filter((o) => this.#values.includes(o.value)) : [];
    const current = this.multiple
      ? (chosen.length === 1 ? chosen[0] : { label: chosen.length ? chosen.map((o) => o.label).join(', ') : (this.allLabel ?? 'Todos') })
      : (list.find((o) => o.value === (this.value ?? '')) ?? (this.type === 'filter' ? list[0] : null));
    const filled = this.type === 'filter' && (this.multiple ? chosen.length > 0 : Boolean(this.value));
    if (this.filled !== filled) this.filled = filled;
    // Muestra (swatch): solo si la opción es un acabado/color (showSwatch),
    // en Field siempre que la haya y en Filter solo con un valor elegido.
    // TODO (diseño): falta definir qué campos cuentan como "color" (p. ej.
    // color de carcasa) — hasta entonces, show-swatch (en el select) o
    // showSwatch (en cada opción) lo decide quien arma el select.
    const swatch = this.shadowRoot.querySelector('.swatch');
    const showSwatch = Boolean(current?.showSwatch) && (this.type === 'field' || filled);
    swatch.hidden = !showSwatch;
    // Field: swatch/md · Filter: swatch/sm (Figma 921:2544)
    swatch.setAttribute('size', this.type === 'field' ? 'default' : 'small');
    if (current?.swatch) swatch.setAttribute('src', current.swatch);
    else swatch.removeAttribute('src');
    swatch.textContent = current?.label ?? '';
    const value = this.shadowRoot.querySelector('.value');
    value.textContent = current?.label ?? '';
    // role/body-regular en reposo; el valor elegido de Filter (Filled), en role/body-medium
    value.className = `value ${filled && !this.disabled ? 'role-body-medium' : 'role-body-regular'}`;
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
      el.multiple = this.multiple;
      el.selected = this.multiple ? this.#values.includes(o.value) : o === current;
    });
  }

  #isSelected(option) {
    return this.multiple ? this.#values.includes(option.value) : option.value === (this.value ?? '');
  }

  // El combobox ya validó la opción y cierra el menú después (con multiple,
  // lo deja abierto).
  #choose(index) {
    const option = this.#list()[index];
    if (this.multiple) {
      const values = this.#values.includes(option.value) ? this.#values.filter((v) => v !== option.value) : [...this.#values, option.value];
      // En el orden del menú, no en el de los clics
      const order = this.#list().map((o) => o.value);
      this.#values = values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      this.#render();
      this.emit('change', { value: this.#values[0] ?? '', values: this.values });
      return;
    }
    const changed = option.value !== (this.value ?? '');
    this.value = option.value;
    if (changed) this.emit('change', { value: option.value });
  }
}

ArqSelect.define();

export { ArqSelect };
