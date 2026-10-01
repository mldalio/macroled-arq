// file-upload · Figma 1113:2499 · ficha doc/file-upload (1451:5767)
//
// Zona para adjuntar un archivo al formulario de Contacto (planos, renders,
// fotos). Un solo archivo.
//
//   <arq-file-upload name="adjunto">
//     Adjuntar archivos
//     <span slot="helper">PDF, DWG, JPG o PNG · hasta 10 MB</span>
//   </arq-file-upload>
//
// Es un <input type="file"> real: la zona es su <label> y acepta arrastrar y
// soltar. Valida formato (accept) y tamaño (max-size, en MB) antes de enviar.
// State=Empty / Attached sale de si hay archivo. Va con el formulario por
// ElementInternals (el archivo viaja en el FormData).

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import '../button/button.js';
import css from './file-upload.css?inline';

const DEFAULT_ACCEPT = '.pdf,.dwg,.jpg,.jpeg,.png';
const DEFAULT_MAX_MB = 10;
// TODO: textos de error sin diseñar (la ficha dice "mostrá el error").
const ERRORS = {
  type: 'El formato no está admitido.',
  size: (mb) => `El archivo supera los ${mb} MB.`,
};

class ArqFileUpload extends ArqElement {
  static tag = 'arq-file-upload';
  static styles = css;
  static formAssociated = true;
  static properties = {
    accept: { type: String, default: DEFAULT_ACCEPT },
    maxSize: { type: Number, default: DEFAULT_MAX_MB }, // MB
    name: { type: String },
    required: { type: Boolean },
  };
  static template =
    `<div class="upload">` +
    `<span class="label role-label" id="label"><slot></slot></span>` +
    `<label class="zone" id="zone">` +
    `<input type="file" class="native visually-hidden" aria-labelledby="label" aria-describedby="helper error">` +
    `<span class="empty">${icon('plus')}<span class="prompt role-body"><slot name="prompt">Arrastrá o seleccioná planos, renders o fotos</slot></span></span>` +
    `</label>` +
    `<div class="attached" hidden>` +
    `<span class="file role-body-regular"></span>` +
    `<arq-button type="underline" show-underline class="remove">Quitar<span class="visually-hidden"></span></arq-button>` +
    `</div>` +
    `<p class="helper role-body-sm" id="helper"><slot name="helper"></slot></p>` +
    `<p class="error role-body-sm" id="error" aria-live="polite" hidden></p>` +
    `</div>`;

  #internals = this.attachInternals();
  #input = null;
  #file = null;
  #error = '';

  setup() {
    const root = this.shadowRoot;
    this.#input = root.querySelector('.native');
    this.#input.addEventListener('change', () => this.#take(this.#input.files[0] ?? null));

    const zone = root.querySelector('.zone');
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      // TODO: Figma no tiene estado para arrastrar encima.
    });
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (file) this.#take(file);
    });

    root.querySelector('.remove').addEventListener('click', () => {
      this.clear();
      this.#input.focus();
    });
  }

  /** Archivo adjunto (o null). */
  get file() {
    return this.#file;
  }

  /** El foco va al <input type="file">. */
  focus(options) {
    if (this.#input) this.#input.focus(options);
    else super.focus(options);
  }

  /** Quita el archivo. */
  clear() {
    this.#input.value = '';
    this.#set(null, '');
    this.emit('change', { file: null });
  }

  update() {
    this.#input.accept = this.accept;
    this.#input.required = this.required;
    this.#render();
  }

  formResetCallback() {
    this.#input.value = '';
    this.#set(null, '');
  }

  #take(file) {
    if (!file) return;
    const problem = this.#validate(file);
    if (problem) {
      this.#input.value = '';
      this.#set(null, problem);
      return;
    }
    this.#set(file, '');
    this.emit('change', { file });
  }

  #validate(file) {
    const accepted = this.accept.split(',').map((ext) => ext.trim().toLowerCase()).filter(Boolean);
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (accepted.length && !accepted.includes(ext)) return ERRORS.type;
    if (this.maxSize && file.size > this.maxSize * 1024 * 1024) return ERRORS.size(this.maxSize);
    return '';
  }

  #set(file, error) {
    this.#file = file;
    this.#error = error;
    this.#internals.setFormValue(file);
    if (this.required && !file) this.#internals.setValidity({ valueMissing: true }, 'Adjuntá un archivo.', this.#input);
    else this.#internals.setValidity({});
    this.#render();
  }

  #render() {
    const root = this.shadowRoot;
    const file = this.#file;
    root.querySelector('.zone').hidden = Boolean(file);
    root.querySelector('.attached').hidden = !file;
    root.querySelector('.file').textContent = file?.name ?? '';
    root.querySelector('.remove .visually-hidden').textContent = file ? ` archivo ${file.name}` : '';
    const error = root.querySelector('.error');
    error.textContent = this.#error;
    error.hidden = !this.#error;
    root.querySelector('.helper').hidden = Boolean(this.#error);
    // Estado error con CustomStateSet (:host(:state(error))): no toca atributos del elemento.
    if (this.#error) this.#internals.states.add('error');
    else this.#internals.states.delete('error');
    this.#input.setAttribute('aria-invalid', String(Boolean(this.#error)));
  }
}

ArqFileUpload.define();

export { ArqFileUpload };
