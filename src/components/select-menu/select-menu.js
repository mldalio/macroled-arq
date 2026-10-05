// select-menu · Figma 1061:4867 · ficha doc/select-menu
//
// Lista desplegable de select: arq-select-option en una lista (role="listbox").
// La arma y la maneja select (teclado, foco, posición); no se usa suelta.
//
//   <arq-select-menu type="filter">
//     <arq-select-option value="" selected>Todos</arq-select-option>
//     <arq-select-option value="Negro" show-swatch swatch-src="…">Negro</arq-select-option>
//   </arq-select-menu>
//
// - Type: Finishes (ancho del campo, opciones con muestra), Filter (ancho
//   propio; "Todos" primero) y Text (ancho propio, sin muestras).
// - Hasta 7 opciones a la vista; con más, la lista tiene scroll.
// - Fondo color/surface/default, borde color/border/default, sin sombra.

import { ArqElement } from '../../base/arq-element.js';
import '../select-option/select-option.js';
import css from './select-menu.css?inline';

class ArqSelectMenu extends ArqElement {
  static tag = 'arq-select-menu';
  static styles = css;
  static properties = {
    type: { type: String, values: ['finishes', 'filter', 'text'], default: 'finishes' }, // Type
  };
  static template = `<div class="menu"><slot></slot></div>`;

  setup() {
    this.setAttribute('role', 'listbox');
    // Con más de 7 opciones el listbox tiene scroll, y una región con scroll
    // tiene que poder recibir el foco (axe: scrollable-region-focusable).
    // tabindex -1: no suma una parada de Tab; el teclado se maneja desde el
    // campo (src/base/combobox.js).
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');
  }
}

ArqSelectMenu.define();

export { ArqSelectMenu };
