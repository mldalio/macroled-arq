// input · Figma 930:2364 · ficha doc/input (1451:5397)
//
// Campo de formulario con línea inferior (sin caja): Contacto, email del Home
// (sin label visible) y versión oscura (modo Dark).
//
//   <arq-input name="nombre" placeholder="Tu nombre completo" autocomplete="name" show-label>Nombre</arq-input>
//   <arq-input name="email" input-type="email" autocomplete="email" show-label show-helper>
//     Email<span slot="helper">Te respondemos en 48 h</span>
//   </arq-input>
//   <arq-input type="textarea" name="mensaje" show-label>Mensaje</arq-input>
//   <arq-input name="email" error="Revisá el formato del email" show-label>Email</arq-input>
//
// Es un <input> / <textarea> real (dentro del Shadow DOM) con su <label>. Va
// con el formulario por ElementInternals y le pasa su validación nativa
// (required, type="email"…) al formulario.
// State: Empty / Filled salen del valor; Focus es :focus-within; Error es la
// prop error (mensaje); Disabled es disabled.
// Type=Select: un botón role="combobox" con la línea del campo y la lista
// select-menu Type=Text flotando debajo (Figma Open=True), con el mismo
// teclado que arq-select (src/base/combobox.js). Las opciones van en la prop
// options (solo JS): [{ value, label?, disabled? }].

import { ArqElement } from '../../base/arq-element.js';
import { Combobox } from '../../base/combobox.js';
import { icon } from '../../base/icons.js';
import '../select-menu/select-menu.js';
import css from './input.css?inline';

const uid = (() => {
  let n = 0;
  return () => `arq-input-${++n}`;
})();

// Atributos que pasan tal cual al control nativo.
const TEXTAREA_ROWS = 4;
const FORWARDED = ['placeholder', 'autocomplete', 'required', 'minlength', 'maxlength', 'pattern', 'inputmode', 'rows'];

class ArqInput extends ArqElement {
  static tag = 'arq-input';
  static styles = css;
  static formAssociated = true;
  static properties = {
    type: { type: String, values: ['text', 'select', 'textarea'], default: 'text' }, // Type
    showLabel: { type: Boolean }, // Show label
    showHelper: { type: Boolean }, // Show helper
    error: { type: String }, // State=Error (mensaje)
    disabled: { type: Boolean }, // State=Disabled
    name: { type: String },
    inputType: { type: String, values: ['text', 'email', 'tel', 'url', 'number', 'search'], default: 'text' },
    placeholder: { type: String },
    autocomplete: { type: String },
    required: { type: Boolean },
    open: { type: Boolean }, // Open (solo Select)
  };
  static template =
    `<div class="input">` +
    `<label class="label role-label"><slot></slot></label>` +
    `<div class="field"></div>` +
    `<p class="helper role-body-sm"><slot name="helper"></slot></p>` +
    `<p class="error role-body-sm" aria-live="polite"></p>` +
    `</div>`;

  #internals = this.attachInternals();
  #control = null;
  #ids = { control: uid(), helper: uid(), error: uid() };
  #initial = '';
  #options = [];
  #selectValue = '';
  #combobox = null;

  /** Opciones de Type=Select: [{ value, label?, disabled? }] (solo JS). */
  get options() {
    return this.#options;
  }

  set options(list) {
    this.#options = Array.isArray(list)
      ? list.map((o) => ({ value: String(o.value), label: o.label ?? String(o.value), disabled: Boolean(o.disabled) }))
      : [];
    if (this.#combobox) this.#renderSelect();
  }

  setup() {
    this.#initial = this.getAttribute('value') ?? '';
    const root = this.shadowRoot;
    root.querySelector('.label').htmlFor = this.#ids.control;
    root.querySelector('.helper').id = this.#ids.helper;
    root.querySelector('.error').id = this.#ids.error;
  }

  /** Valor actual (lo que la persona escribió). El atributo value es el inicial. */
  get value() {
    if (this.#combobox) return this.#selectValue;
    return this.#control?.value ?? this.getAttribute('value') ?? '';
  }

  set value(next) {
    const text = next == null ? '' : String(next);
    if (this.#combobox) {
      this.#selectValue = text;
      this.#renderSelect();
      this.#sync();
    } else if (this.#control) {
      this.#control.value = text;
      this.#sync();
    } else {
      this.setAttribute('value', text);
    }
  }

  /** El foco va al control nativo. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }

  /** Validación nativa del control (required, type="email"…). */
  checkValidity() {
    return this.#internals.checkValidity();
  }

  reportValidity() {
    return this.#internals.reportValidity();
  }

  /** ValidityState del campo (valueMissing, typeMismatch…), para elegir el mensaje. */
  get validity() {
    return this.#internals.validity;
  }

  update(changed) {
    if (changed.has('type') || !this.#control) this.#renderControl();
    const control = this.#control;
    const root = this.shadowRoot;

    if (control.localName === 'input') control.type = this.inputType;
    const select = Boolean(this.#combobox);
    for (const attr of select ? [] : FORWARDED) {
      if (this.hasAttribute(attr)) control.setAttribute(attr, this.getAttribute(attr));
      else control.removeAttribute(attr);
    }
    // Textarea: 4 filas visibles por defecto (Figma).
    if (control.localName === 'textarea' && !this.hasAttribute('rows')) control.rows = TEXTAREA_ROWS;
    control.disabled = this.disabled;

    // Show label=false (email del Home): el label queda solo para lectores.
    root.querySelector('.label').classList.toggle('visually-hidden', !this.showLabel);

    // Error: el mensaje reemplaza al helper y siempre se ve.
    const hasError = Boolean(this.error);
    const helper = root.querySelector('.helper');
    const error = root.querySelector('.error');
    error.textContent = this.error ?? '';
    error.hidden = !hasError;
    helper.hidden = hasError || !this.showHelper;
    control.setAttribute('aria-invalid', String(hasError));
    const describedBy = [hasError ? this.#ids.error : null, !helper.hidden ? this.#ids.helper : null].filter(Boolean);
    if (describedBy.length) control.setAttribute('aria-describedby', describedBy.join(' '));
    else control.removeAttribute('aria-describedby');

    if (select) {
      if (changed.has('open')) {
        root.querySelector('.menu').hidden = !this.open;
        control.setAttribute('aria-expanded', String(this.open));
        if (!this.open) this.#combobox.closed();
      }
      this.#renderSelect();
    }
    this.#sync();
  }

  formResetCallback() {
    this.value = this.#initial;
  }

  formDisabledCallback(disabled) {
    this.#control.disabled = disabled || this.disabled;
  }

  // <input> para Text, <textarea> para Textarea, <button> combobox para Select.
  #renderControl() {
    const tag = { textarea: 'textarea', select: 'button' }[this.type] ?? 'input';
    if (this.#control?.localName === tag) return;
    this.#combobox = null;
    this.shadowRoot.querySelector('.menu')?.remove();
    if (tag === 'button') {
      this.#renderSelectControl();
      return;
    }
    const next = document.createElement(tag);
    next.className = 'control role-body';
    next.id = this.#ids.control;
    next.value = this.#control?.value ?? this.getAttribute('value') ?? '';
    next.addEventListener('input', () => {
      this.#sync();
      this.emit('input', { value: next.value });
    });
    next.addEventListener('change', () => this.emit('change', { value: next.value }));
    const field = this.shadowRoot.querySelector('.field');
    field.replaceChildren(next);
    this.#control = next;
  }

  #renderSelectControl() {
    const root = this.shadowRoot;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'control trigger role-body';
    trigger.id = this.#ids.control;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span class="select-value"></span><span class="chevron">${icon('chevron-down')}${icon('chevron-up')}</span>`;
    const field = root.querySelector('.field');
    field.replaceChildren(trigger);
    const menu = document.createElement('arq-select-menu');
    menu.type = 'text';
    menu.className = 'menu';
    menu.id = `${this.#ids.control}-menu`;
    menu.hidden = true;
    field.append(menu);
    this.#control = trigger;
    this.#selectValue = this.getAttribute('value') ?? '';
    this.#combobox = new Combobox({
      trigger,
      menu,
      options: () => this.#options,
      selected: () => this.#options.findIndex((o) => o.value === this.#selectValue),
      isOpen: () => this.open,
      setOpen: (open) => (this.open = open),
      choose: (index) => {
        const option = this.#options[index];
        if (option.value === this.#selectValue) return;
        this.value = option.value;
        this.emit('input', { value: option.value });
        this.emit('change', { value: option.value });
      },
    });
  }

  // Campo (valor elegido o placeholder) y opciones del menú. Las opciones se
  // reusan: así el resaltado no se pierde.
  #renderSelect() {
    const root = this.shadowRoot;
    const current = this.#options.find((o) => o.value === this.#selectValue);
    const value = root.querySelector('.select-value');
    value.textContent = current?.label ?? this.placeholder ?? '';
    value.classList.toggle('placeholder', !current);
    const menu = root.querySelector('.menu');
    while (menu.children.length > this.#options.length) menu.lastElementChild.remove();
    while (menu.children.length < this.#options.length) menu.append(document.createElement('arq-select-option'));
    this.#options.forEach((o, i) => {
      const el = menu.children[i];
      el.id = `${menu.id}-${i}`;
      el.value = o.value;
      el.textContent = o.label;
      el.disabled = o.disabled;
      el.selected = o === current;
    });
  }

  // Valor y validez nativa → formulario.
  #sync() {
    const control = this.#control;
    if (this.#combobox) {
      this.#internals.setFormValue(this.#selectValue || null);
      if (this.required && !this.#selectValue) this.#internals.setValidity({ valueMissing: true }, 'Elegí una opción.', control);
      else this.#internals.setValidity({});
      return;
    }
    this.#internals.setFormValue(control.value);
    if (control.validity.valid) this.#internals.setValidity({});
    else this.#internals.setValidity(control.validity, control.validationMessage, control);
  }
}

ArqInput.define();

export { ArqInput };
