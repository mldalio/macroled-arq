// option-tile · Figma 921:2487 · ficha doc/option-tile (1461:9043)
//
// Opción de configuración de la ficha (altura, potencia, temperatura). Funciona
// como radio dentro de option-group Type=Tiles (role="radiogroup"). No confundir con choice-chip (formularios).
//
//   <arq-option-tile value="50" selected>50 cm</arq-option-tile>
//
// Clic, Enter o Espacio la eligen y emite arq:change { value, selected }.
// Las flechas entre opciones las maneja el grupo (SingleSelect).
//
// Type=Value (solo la pone option-group): cuando el grupo tiene una sola
// opción no hay nada que elegir, así que se muestra como dato: sin línea, sin
// role ni foco, sin cursor de click. Con más opciones vuelve a Type=Option.

import { ArqElement } from '../../base/arq-element.js';
import { Selectable } from '../../base/selectable.js';
import css from './option-tile.css?inline';

class ArqOptionTile extends ArqElement {
  static tag = 'arq-option-tile';
  static styles = css;
  static properties = {
    type: { type: String, values: ['option', 'value'], default: 'option' }, // Type
    selected: { type: Boolean }, // State=Selected
    disabled: { type: Boolean }, // State=Disabled
    value: { type: String },
  };
  static template = `<span class="tile role-body-regular"><slot></slot></span>`;

  setup() {
    this.selectable = new Selectable(this, { role: 'radio', state: 'aria-checked' });
  }
}

ArqOptionTile.define();

export { ArqOptionTile };
