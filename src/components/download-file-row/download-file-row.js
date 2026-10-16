// download-file-row · Figma 2554:20047 (Descargas · propuesta final 2575:22875)
//
// Fila de archivo del modal de descargas de la página Descargas: nombre
// (role/body-xl), formato y peso (role/body-compact-regular en
// color/text/tertiary) e icon/download. Cada fila descarga su archivo.
//
//   <arq-download-file-row href="…/kanu.ies">IES<span slot="meta">IES</span></arq-download-file-row>
//   <arq-download-file-row>Ficha técnica<span slot="meta">PDF</span></arq-download-file-row>
//
// - Con href es un <a download>; sin href, un <button> que emite
//   arq:download (la ficha técnica se genera al hacer clic), como download-item.
// - Availability=Unavailable (la variante no tiene ese archivo): la página no
//   pone la fila, como download-item. TODO (diseño): si se quiere mostrar la
//   fila deshabilitada, falta ver la variante Unavailable del set.
// - Sin slot meta, la fila muestra solo el nombre (Descargas, 2026-10-15).
// - Hover subraya el nombre (como download-item Default); Focus, anillo de
//   DESIGN.md §7. No son props.
// - loading (sin href): mientras se genera la ficha técnica el nombre pasa a
//   «Generando…» (como button Loading en la ficha), con aria-busy, y otro clic
//   no hace nada. TODO (diseño): download-file-row no tiene State=Loading en
//   Figma.

import { ArqElement } from '../../base/arq-element.js';
import { icon } from '../../base/icons.js';
import css from './download-file-row.css?inline';

class ArqDownloadFileRow extends ArqElement {
  static tag = 'arq-download-file-row';
  static styles = css;
  static properties = {
    href: { type: String }, // URL del archivo
    loading: { type: Boolean }, // generando la ficha técnica (sin href)
  };
  static template = `<div class="slot-host"></div>`;

  #control = null;

  update(changed) {
    this.setAttribute('role', 'listitem');
    if (changed.has('href') || !this.#control) this.#build();
    const busy = Boolean(this.loading && !this.href);
    this.#control.toggleAttribute('aria-busy', busy);
    this.#control.querySelector('.name').hidden = busy;
    this.#control.querySelector('.busy').hidden = !busy;
  }

  #build() {
    // <a download> con href; <button> sin href. Se rehace solo si cambia el tipo.
    const tag = this.href ? 'a' : 'button';
    if (this.#control?.localName !== tag) {
      const control = document.createElement(tag);
      control.className = 'row';
      control.innerHTML =
        `<span class="info"><span class="label role-body-xl"><span class="name"><slot></slot></span><span class="busy" hidden>Generando…</span></span>` +
        `<span class="meta role-body-compact-regular"><slot name="meta"></slot></span></span>${icon('download')}`;
      // Sin formato, la línea de meta no ocupa lugar
      const metaSlot = control.querySelector('slot[name="meta"]');
      const syncMeta = () => (metaSlot.parentElement.hidden = !metaSlot.assignedNodes().length);
      metaSlot.addEventListener('slotchange', syncMeta);
      syncMeta();
      if (tag === 'button') {
        control.type = 'button';
        control.addEventListener('click', () => {
          if (!this.loading) this.emit('download', {});
        });
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

ArqDownloadFileRow.define();

export { ArqDownloadFileRow };
