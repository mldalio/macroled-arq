// file-upload · Figma 1113:2499 · ficha doc/file-upload (1451:5767)
//
// Zona para adjuntar un archivo al formulario de Contacto (planos, renders,
// fotos). Un solo archivo.
//
//   <arq-file-upload name="adjunto">
//     <span slot="helper">PDF, DWG, JPG o PNG · hasta 10 MB</span>
//   </arq-file-upload>
//
// Es un <input type="file"> real: la zona es su <label> y acepta arrastrar y
// soltar. Valida formato (accept) y tamaño (max-size, en MB) antes de enviar.
// State: Empty / Attached salen de si hay archivo; Drag over mientras se
// arrastra un archivo encima; Error si el archivo no pasa la validación;
// Disabled es la prop disabled. Va con el formulario por ElementInternals (el
// archivo viaja en el FormData).

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import '../button/button.js';
import css from './file-upload.css?inline';

const DEFAULT_ACCEPT = '.pdf,.dwg,.jpg,.jpeg,.png';
const DEFAULT_MAX_MB = 10;
// Mensaje de State=Error en Figma: "El archivo supera los 10 MB. Formatos:
// PDF, DWG, JPG o PNG." El problema va primero y después los formatos.
// TODO: Figma solo muestra el de tamaño; el de formato sigue el mismo patrón.
const ERRORS = {
  type: 'El formato no está admitido.',
  size: (mb) => `El archivo supera los ${mb} MB.`,
};

// ".pdf,.dwg,.jpg,.jpeg,.png" → "PDF, DWG, JPG o PNG" (JPEG se muestra como JPG).
function formatList(accept) {
  const names = [
    ...new Set(
      accept
        .split(',')
        .map((ext) => ext.trim().replace(/^\./, '').toUpperCase())
        .filter(Boolean)
        .map((ext) => (ext === 'JPEG' ? 'JPG' : ext)),
    ),
  ];
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} o ${names.at(-1)}` : names.join('');
}

class ArqFileUpload extends ArqElement {
  static tag = 'arq-file-upload';
  static styles = css;
  static formAssociated = true;
  static properties = {
    accept: { type: String, default: DEFAULT_ACCEPT },
    maxSize: { type: Number, default: DEFAULT_MAX_MB }, // MB
    name: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean }, // State=Disabled
  };
  static template =
    `<div class="upload">` +
    `<span class="label role-label" id="label"><slot>Adjuntar archivo</slot></span>` +
    `<label class="zone" id="zone">` +
    `<input type="file" class="native visually-hidden" aria-labelledby="label" aria-describedby="helper error">` +
    `<span class="empty">${icon('plus')}<span class="prompt role-body"><slot name="prompt">Arrastrá o seleccioná planos, renders o fotos</slot></span>` +
    `<span class="drop role-body" aria-hidden="true"><slot name="drop">Soltá el archivo acá</slot></span></span>` +
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
  #dragDepth = 0;

  setup() {
    const root = this.shadowRoot;
    this.#input = root.querySelector('.native');
    this.#input.addEventListener('change', () => this.#take(this.#input.files[0] ?? null));

    // Drag over: dragenter / dragleave también llegan al pasar por los hijos
    // de la zona, por eso se cuenta la profundidad.
    const zone = root.querySelector('.zone');
    zone.addEventListener('dragenter', (event) => {
      event.preventDefault();
      if (this.disabled) return;
      this.#dragDepth += 1;
      this.#setDragOver(true);
    });
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = this.disabled ? 'none' : 'copy';
    });
    zone.addEventListener('dragleave', () => {
      this.#dragDepth = Math.max(0, this.#dragDepth - 1);
      if (!this.#dragDepth) this.#setDragOver(false);
    });
    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      this.#dragDepth = 0;
      this.#setDragOver(false);
      if (this.disabled) return;
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
    this.#input.disabled = this.disabled;
    this.shadowRoot.querySelector('.remove').disabled = this.disabled;
    this.#render();
  }

  formDisabledCallback(disabled) {
    this.#input.disabled = disabled || this.disabled;
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
    const formats = accepted.length ? ` Formatos: ${formatList(this.accept)}.` : '';
    if (accepted.length && !accepted.includes(ext)) return ERRORS.type + formats;
    if (this.maxSize && file.size > this.maxSize * 1024 * 1024) return ERRORS.size(this.maxSize) + formats;
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

  // Estado con CustomStateSet (:host(:state(drag-over))): no toca atributos del elemento.
  #setDragOver(on) {
    if (on) this.#internals.states.add('drag-over');
    else this.#internals.states.delete('drag-over');
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
