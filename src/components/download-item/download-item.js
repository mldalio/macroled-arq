// download-item · Figma 1101:5542 · ficha doc/download-item
//
// Opción del modal de descargas: texto (role/body-xl) + icon/download. Cada
// opción descarga su archivo directamente.
//
//   <arq-download-item href="…/kanu.ies">IES</arq-download-item>
//   <arq-download-item emphasis="featured">Ficha técnica</arq-download-item>
//
// - Con href es un <a download> (archivo de la base: IES, CAD, MANUAL,
//   FOTOMETRIA). Sin href es un <button> que emite arq:download: la ficha
//   técnica se genera al hacer clic (decisión 2026-10-02 · Ficha técnica en PDF).
// - Si un archivo falta, la página no pone la opción.
// - Emphasis: Default (línea inferior; Hover subraya el texto, como dice la
//   descripción) o Featured (caja con borde; para la ficha técnica; Hover
//   color/surface/faint). Hover y Focus son CSS.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './download-item.css?inline';

class ArqDownloadItem extends ArqElement {
  static tag = 'arq-download-item';
  static styles = css;
  static properties = {
    emphasis: { type: String, values: ['default', 'featured'], default: 'default' }, // Emphasis
    href: { type: String }, // URL del archivo
  };
  static template = `<div class="slot-host"></div>`;

  #control = null;

  update(changed) {
    // Default va en la lista del modal; Featured queda fuera de la lista.
    if (this.emphasis === 'featured') this.removeAttribute('role');
    else this.setAttribute('role', 'listitem');
    if (!changed.has('href') && this.#control) return;
    // <a download> con href; <button> sin href. Se rehace solo si cambia el tipo.
    const tag = this.href ? 'a' : 'button';
    if (this.#control?.localName !== tag) {
      const control = document.createElement(tag);
      control.className = 'row';
      control.innerHTML = `<span class="label role-body-xl"><slot></slot></span>${icon('download')}`;
      if (tag === 'button') {
        control.type = 'button';
        control.addEventListener('click', () => this.emit('download', {}));
      }
      this.shadowRoot.querySelector('.slot-host').replaceChildren(control);
      this.#control = control;
    }
    if (this.href) {
      this.#control.setAttribute('href', this.href);
      this.#control.setAttribute('download', '');
    }
  }

  /** El foco va al link o botón interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }
}

ArqDownloadItem.define();

export { ArqDownloadItem };
