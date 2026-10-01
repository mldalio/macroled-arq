// sku · Figma 920:2539 · ficha doc/sku (1462:8671)
//
// Código de producto con botón de copiar.
//
//   <arq-sku>KANU-J-500-12W-N-WW</arq-sku>                    Size=Default (configurador, con etiqueta SKU)
//   <arq-sku size="compact">KANU-J-500-12W-N-WW</arq-sku>     Size=Compact (fila de la tabla de variantes)
//
// Toda la fila (código + ícono) es el botón: así el área táctil supera 24 × 24.
// Al copiar, State=Copied: "Copiado" en lugar del ícono durante
// motion/duration/feedback, anunciado con aria-live. Si el portapapeles falla,
// el código queda seleccionado y se anuncia "Copialo con Ctrl+C" ("⌘C" en Mac) en lugar de
// "Copiado" (descripción del set). El SKU es un identificador opaco
// (AGENTS.md): se copia tal cual.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './sku.css?inline';

const COPIED_TEXT = 'Copiado';
// En Mac (y iPad con teclado) el atajo es ⌘C (descripción del set).
const isApple = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform ?? navigator.platform ?? '');
const FAILED_TEXT = isApple ? 'Copialo con ⌘C' : 'Copialo con Ctrl+C';

// motion/duration/feedback ("2000ms" o "2s") en milisegundos. Sale de tokens.css
// (dist/arq.css), así el tiempo se cambia desde Figma.
function feedbackMs(element) {
  const raw = getComputedStyle(element).getPropertyValue('--arq-motion-duration-feedback').trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) {
    if (import.meta.env.DEV) console.warn('[arq] <arq-sku>: falta --arq-motion-duration-feedback (¿se cargó arq.css?)');
    return 0;
  }
  return raw.endsWith('ms') ? value : value * 1000;
}

class ArqSku extends ArqElement {
  static tag = 'arq-sku';
  static styles = css;
  static properties = {
    size: { type: String, values: ['default', 'compact'], default: 'default' }, // Size
    copied: { type: Boolean }, // State=Copied
  };
  static template =
    `<span class="sku">` +
    `<span class="label role-label">SKU</span>` +
    `<button type="button" class="row"><span class="code"><slot></slot></span>` +
    `<span class="copy">${icon('copy')}</span>` +
    `<span class="copied role-caption" aria-hidden="true">${COPIED_TEXT}</span>` +
    `<span class="failed role-caption" aria-hidden="true">${FAILED_TEXT}</span></button>` +
    `<span class="visually-hidden" aria-live="polite"></span>` +
    `</span>`;

  #control = null;
  #timer = 0;
  #internals = this.attachInternals();

  setup() {
    this.#control = this.shadowRoot.querySelector('.row');
    this.#control.addEventListener('click', () => this.copy());
    const sync = () => this.#control.setAttribute('aria-label', `Copiar SKU ${this.code}`);
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', sync);
    sync();
  }

  /** El código tal como llega del HTML. */
  get code() {
    return this.textContent.trim();
  }

  /** El foco va al botón interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }

  /** Copia el código al portapapeles y muestra "Copiado" (o "Copialo con Ctrl+C" si falla). */
  async copy() {
    clearTimeout(this.#timer);
    this.#setFailed(false);
    try {
      await navigator.clipboard.writeText(this.code);
    } catch {
      // El código está en el DOM de la página (slot): se selecciona para que
      // Ctrl+C lo copie aunque el foco siga en el botón.
      getSelection()?.selectAllChildren(this);
      this.copied = false;
      this.#setFailed(true);
      this.#timer = setTimeout(() => this.#setFailed(false), feedbackMs(this));
      return;
    }
    this.copied = true;
    this.emit('copy', { code: this.code });
    this.#timer = setTimeout(() => (this.copied = false), feedbackMs(this));
  }

  update() {
    this.shadowRoot.querySelector('.code').classList.toggle('role-body-lg', this.size !== 'compact');
    this.shadowRoot.querySelector('.code').classList.toggle('role-body', this.size === 'compact');
    this.#announce();
  }

  disconnectedCallback() {
    clearTimeout(this.#timer);
  }

  // Estado con CustomStateSet (:host(:state(copy-failed))): no toca atributos del elemento.
  #setFailed(on) {
    if (on) this.#internals.states.add('copy-failed');
    else this.#internals.states.delete('copy-failed');
    this.#announce();
  }

  // La región aria-live existe desde el principio; el texto llega al copiar.
  #announce() {
    const failed = this.#internals.states.has('copy-failed');
    this.shadowRoot.querySelector('[aria-live]').textContent = failed ? FAILED_TEXT : this.copied ? COPIED_TEXT : '';
  }
}

ArqSku.define();

export { ArqSku };
