// option-group · Figma 921:2560 · ficha doc/option-group (1461:9308)
//
// Grupo de configuración de la ficha con etiqueta (role/label). Las opciones
// llegan por slot; la cantidad es libre.
//
//   <arq-option-group label="Altura">                    Type=Tiles (por defecto)
//     <arq-option-tile value="50 cm" selected>50 cm</arq-option-tile>
//     <arq-option-tile value="90 cm" disabled>90 cm</arq-option-tile>
//   </arq-option-group>
//
//   <arq-option-group type="swatches" label="Color">     Type=Swatches
//     <arq-swatch-picker>
//       <arq-swatch value="negro" selected src="…">Negro</arq-swatch>
//     </arq-swatch-picker>
//   </arq-option-group>
//
// - Tiles: el propio grupo es el radiogroup (SingleSelect: flechas, Inicio /
//   Fin, una sola elegida). Los tiles van en Fill y bajan a otra línea si no
//   entran.
// - Swatches: el radiogroup es el swatch-picker de adentro; el grupo le pasa su
//   etiqueta. Así no quedan dos radiogroups anidados.
// - Select: queda para select Field (TODO: select todavía no existe; decisión
//   2026-10-02, sin uso por ahora).
// - La etiqueta es visible en el Shadow DOM y llega al grupo como aria-label
//   (un aria-labelledby no cruza el Shadow DOM). La ficha pide fieldset +
//   legend: se usa radiogroup con nombre, que da el mismo anuncio.
// - El arq:change de la opción elegida sale del grupo (bubbles + composed).

import { ArqElement } from '../../base/arq-element.js';
import { SingleSelect } from '../../base/single-select.js';
import css from './option-group.css?inline';

class ArqOptionGroup extends ArqElement {
  static tag = 'arq-option-group';
  static styles = css;
  static properties = {
    label: { type: String }, // Label
    type: { type: String, values: ['tiles', 'select', 'swatches'], default: 'tiles' }, // Type
  };
  static template = `<div class="group"><span class="label role-label"></span><div class="options"><slot></slot></div></div>`;

  setup() {
    this.select = new SingleSelect(this, { items: 'arq-option-tile' });
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => this.#labelPicker());
  }

  update(changed) {
    if (changed.has('label')) this.shadowRoot.querySelector('.label').textContent = this.label ?? '';
    if (this.type === 'tiles') {
      this.setAttribute('role', 'radiogroup');
      if (this.label) this.setAttribute('aria-label', this.label);
      else this.removeAttribute('aria-label');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }
    this.#labelPicker();
  }

  // Type=Swatches: el swatch-picker toma la etiqueta del grupo si no trae la suya.
  #labelPicker() {
    if (this.type !== 'swatches') return;
    const picker = this.querySelector('arq-swatch-picker');
    if (picker && !picker.hasAttribute('label') && this.label) picker.label = this.label;
  }
}

ArqOptionGroup.define();

export { ArqOptionGroup };
