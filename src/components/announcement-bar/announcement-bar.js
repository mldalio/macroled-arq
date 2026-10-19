// announcement-bar · Figma 2780:8595 · ficha doc/announcement-bar (2781:13825)
//
// Línea fina arriba del navbar, solo en la Home, con un aviso y su link
// («Suscribite al newsletter»).
//
//   <arq-announcement-bar>
//     <arq-button type="underline" compact show-icon icon="arrow-up-right" href="/arq#newsletter">Suscribite al newsletter</arq-button>
//   </arq-announcement-bar>
//   <arq-navbar>…</arq-navbar>
//
// - El link llega por slot (indexable): un button Underline con ícono.
// - Siempre oscura: Dark local en el contenedor interno (DESIGN.md §2), como
//   compare-bar. No cambia con Iluminar.
// - Al hacer scroll se oculta: va en el flujo de la página, antes del navbar,
//   y se va con el resto del contenido. El navbar (sticky, también en
//   Transparent) queda pegado arriba. Sin JS de scroll.
// - label: nombre accesible de la región (aria-label del <aside>).

import { ArqElement } from '../../base/arq-element.js';
import '../button/button.js';
import css from './announcement-bar.css?inline';

class ArqAnnouncementBar extends ArqElement {
  static tag = 'arq-announcement-bar';
  static styles = css;
  static properties = {
    label: { type: String },
  };
  static template = `<aside class="bar" data-arq-theme="dark"><slot></slot></aside>`;

  update(changed) {
    if (!changed.has('label')) return;
    const bar = this.shadowRoot.querySelector('.bar');
    if (this.label) bar.setAttribute('aria-label', this.label);
    else bar.removeAttribute('aria-label');
  }
}

ArqAnnouncementBar.define();

export { ArqAnnouncementBar };
