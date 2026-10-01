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
// Type=Select: TODO, se construye con select y select-menu.

import { ArqElement } from '../../base/arq-element.js';
import css from './input.css?inline';

const uid = (() => {
  let n = 0;
  return () => `arq-input-${++n}`;
})();

// Atributos que pasan tal cual al control nativo.
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

  setup() {
    this.#initial = this.getAttribute('value') ?? '';
    const root = this.shadowRoot;
    root.querySelector('.label').htmlFor = this.#ids.control;
    root.querySelector('.helper').id = this.#ids.helper;
    root.querySelector('.error').id = this.#ids.error;
    if (this.type === 'select') {
      console.warn('[arq] <arq-input type="select"> todavía no está: se construye con select y select-menu. Se muestra como Text.');
    }
  }

  /** Valor actual (lo que la persona escribió). El atributo value es el inicial. */
  get value() {
    return this.#control?.value ?? this.getAttribute('value') ?? '';
  }

  set value(next) {
    const text = next == null ? '' : String(next);
    if (this.#control) {
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

  update(changed) {
    if (changed.has('type') || !this.#control) this.#renderControl();
    const control = this.#control;
    const root = this.shadowRoot;

    if (control.localName === 'input') control.type = this.inputType;
    for (const attr of FORWARDED) {
      if (this.hasAttribute(attr)) control.setAttribute(attr, this.getAttribute(attr));
      else control.removeAttribute(attr);
    }
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

    this.#sync();
  }

  formResetCallback() {
    this.value = this.#initial;
  }

  formDisabledCallback(disabled) {
    this.#control.disabled = disabled || this.disabled;
  }

  // <input> para Text (y Select hasta que exista), <textarea> para Textarea.
  #renderControl() {
    const tag = this.type === 'textarea' ? 'textarea' : 'input';
    if (this.#control?.localName === tag) return;
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

  // Valor y validez nativa → formulario.
  #sync() {
    const control = this.#control;
    this.#internals.setFormValue(control.value);
    if (control.validity.valid) this.#internals.setValidity({});
    else this.#internals.setValidity(control.validity, control.validationMessage, control);
  }
}

ArqInput.define();

export { ArqInput };
