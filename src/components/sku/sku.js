// sku · Figma 920:2539 · ficha doc/sku (1462:8671)
//
// Código de producto con botón de copiar.
//
//   <arq-sku>KANU-J-500-12W-N-WW</arq-sku>                    Size=Default (configurador, con etiqueta SKU)
//   <arq-sku size="compact">KANU-J-500-12W-N-WW</arq-sku>     Size=Compact (fila de la tabla de variantes)
//
// Toda la fila (código + ícono) es el botón: así el área táctil supera 24 × 24.
// Al copiar, State=Copied: "Copiado" en lugar del ícono durante 2 s, anunciado
// con aria-live. El SKU es un identificador opaco (AGENTS.md): se copia tal cual.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './sku.css?inline';

// TODO: no hay token de duración; la ficha dice "unos 2 s".
const COPIED_MS = 2000;
const COPIED_TEXT = 'Copiado';

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
    `<span class="copied role-caption" aria-hidden="true">${COPIED_TEXT}</span></button>` +
    `<span class="visually-hidden" aria-live="polite"></span>` +
    `</span>`;

  #control = null;
  #timer = 0;

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

  /** Copia el código al portapapeles y muestra "Copiado". */
  async copy() {
    try {
      await navigator.clipboard.writeText(this.code);
    } catch (error) {
      // TODO: Figma no define qué mostrar si el portapapeles falla.
      console.warn('[arq] <arq-sku> no se pudo copiar el código:', error);
      return;
    }
    this.copied = true;
    this.emit('copy', { code: this.code });
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => (this.copied = false), COPIED_MS);
  }

  update() {
    this.shadowRoot.querySelector('.code').classList.toggle('role-body-lg', this.size !== 'compact');
    this.shadowRoot.querySelector('.code').classList.toggle('role-body', this.size === 'compact');
    // La región aria-live existe desde el principio; el texto llega al copiar.
    this.shadowRoot.querySelector('[aria-live]').textContent = this.copied ? COPIED_TEXT : '';
  }

  disconnectedCallback() {
    clearTimeout(this.#timer);
  }
}

ArqSku.define();

export { ArqSku };
