// download-item · Figma 1101:5542 · ficha doc/download-item
//
// Opción del modal de descargas: texto (role/body-xl) + ícono. Los archivos de
// la base se abren en una pestaña nueva (icon/arrow-up-right); la ficha técnica
// se genera y lleva icon/download.
//
//   <arq-download-item href="…/kanu.ies">IES</arq-download-item>
//   <arq-download-item emphasis="featured">Ficha técnica</arq-download-item>
//
// - Con href es un <a target="_blank"> con icon/arrow-up-right (archivo de la
//   base: IES, CAD, Manual, Fotometría, Cotas): son PDF que el navegador abre,
//   no descarga (decisión 2026-10-29 · Archivos que se abren). Sin href es un
//   <button> con icon/download que emite arq:download: la ficha técnica se
//   genera al hacer clic (decisión 2026-10-02 · Ficha técnica en PDF).
// - loading (solo sin href): mientras se genera la ficha técnica el nombre pasa a
//   «Generando…» (como button Loading), con aria-busy; otro clic no hace nada.
// - show-format (variante, apagada por defecto): muestra el formato (slot meta,
//   «PDF», «DWG») debajo del nombre. Por ahora ninguna página lo usa.
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
    loading: { type: Boolean }, // generando la ficha técnica (sin href)
    showFormat: { type: Boolean }, // Show format: formato del archivo (slot meta). Apagado por defecto
  };
  static template = `<div class="slot-host"></div>`;

  #control = null;

  update(changed) {
    // Default va en la lista del modal; Featured queda fuera de la lista.
    if (this.emphasis === 'featured') this.removeAttribute('role');
    else this.setAttribute('role', 'listitem');
    if (changed.has('loading') || changed.has('showFormat') || this.#control) this.#busy();
    if (!changed.has('href') && this.#control) return;
    // <a> (pestaña nueva) con href; <button> sin href. Se rehace solo si cambia el tipo.
    const tag = this.href ? 'a' : 'button';
    if (this.#control?.localName !== tag) {
      const control = document.createElement(tag);
      control.className = 'row';
      control.innerHTML = `<span class="info"><span class="label role-body-xl"><span class="name"><slot></slot></span><span class="busy" hidden>Generando…</span></span><span class="meta role-body-compact-regular" hidden><slot name="meta"></slot></span></span>${icon(tag === 'a' ? 'arrow-up-right' : 'download')}`;
      if (tag === 'button') {
        control.type = 'button';
        control.addEventListener('click', () => {
          if (!this.loading) this.emit('download', {});
        });
      }
      this.shadowRoot.querySelector('.slot-host').replaceChildren(control);
      this.#control = control;
      this.#busy();
    }
    if (this.href) {
      this.#control.setAttribute('href', this.href);
      this.#control.setAttribute('target', '_blank');
      this.#control.setAttribute('rel', 'noopener');
    }
  }

  // loading (sin href): el nombre pasa a «Generando…», con aria-busy
  #busy() {
    if (!this.#control) return;
    const busy = Boolean(this.loading && !this.href);
    this.#control.toggleAttribute('aria-busy', busy);
    this.#control.querySelector('.name').hidden = busy;
    this.#control.querySelector('.busy').hidden = !busy;
    this.#control.querySelector('.meta').hidden = !this.showFormat || !this.querySelector(':scope > [slot="meta"]');
  }

  /** El foco va al link o botón interno. */
  focus(options) {
    if (this.#control) this.#control.focus(options);
    else super.focus(options);
  }
}

ArqDownloadItem.define();

export { ArqDownloadItem };
