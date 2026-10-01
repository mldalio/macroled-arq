// tab · Figma 929:2287 · ficha doc/tab (1451:5248)
//
// Pestaña para cambiar entre vistas de un mismo contenido sin salir de la
// página. Hoy la usa el mega-menu de Productos. Si cada opción lleva a otra
// URL, se usa nav-link.
//
//   <arq-tab aria-controls="panel-aplicacion" selected>Aplicación</arq-tab>
//
// El elemento es la pestaña (role="tab", aria-selected). Clic, Enter o
// Espacio la eligen y emite arq:change. El tablist (role="tablist", flechas
// ← →, Inicio / Fin, panel role="tabpanel") lo arma el mega-menu.

import { ArqElement } from '../../base/arq-element.js';
import { Selectable } from '../../base/selectable.js';
import css from './tab.css?inline';

class ArqTab extends ArqElement {
  static tag = 'arq-tab';
  static styles = css;
  static properties = {
    selected: { type: Boolean }, // State=Selected
    disabled: { type: Boolean }, // State=Disabled
    value: { type: String },
  };
  static template = `<span class="tab role-label"><slot></slot></span>`;

  setup() {
    this.selectable = new Selectable(this, { role: 'tab', state: 'aria-selected' });
    // role/label pone mayúsculas: el nombre accesible va en caja normal
    // (docs/decisiones.md · Textos en mayúsculas).
    const sync = () => {
      const text = this.textContent.trim();
      if (text) this.setAttribute('aria-label', text);
    };
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', sync);
    sync();
  }
}

ArqTab.define();

export { ArqTab };
