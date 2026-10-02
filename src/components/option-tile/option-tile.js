// option-tile · Figma 921:2487 · ficha doc/option-tile (1461:9043)
//
// Opción de configuración de la ficha (altura, potencia, temperatura). Funciona
// como radio dentro de option-group Type=Tiles (role="radiogroup"). No confundir con choice-chip (formularios).
//
//   <arq-option-tile value="50" selected>50 cm</arq-option-tile>
//
// Clic, Enter o Espacio la eligen y emite arq:change { value, selected }.
// Las flechas entre opciones las maneja el grupo (SingleSelect).

import { ArqElement } from '../../base/arq-element.js';
import { Selectable } from '../../base/selectable.js';
import css from './option-tile.css?inline';

class ArqOptionTile extends ArqElement {
  static tag = 'arq-option-tile';
  static styles = css;
  static properties = {
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
