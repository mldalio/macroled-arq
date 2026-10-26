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
// Type=Card (solo del configurador de Daö; la pone option-group Type=Cards): la
// opción en una caja, con título (role/body-regular), un subtítulo opcional
// debajo (slot meta, role/body-compact) y un swatch opcional antes del título
// (slot swatch). Sin subtítulo ni swatch es solo el título.
//
//   <arq-option-tile value="dim24">Dim to warm 24°<span slot="meta">1800–2700K</span></arq-option-tile>
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
    type: { type: String, values: ['option', 'value', 'card'], default: 'option' }, // Type
    selected: { type: Boolean }, // State=Selected
    disabled: { type: Boolean }, // State=Disabled
    value: { type: String },
  };
  static template =
    `<span class="tile">` +
    `<span class="title role-body-regular"><slot name="swatch"></slot><slot></slot></span>` +
    `<span class="meta role-body-compact" hidden><slot name="meta"></slot></span>` +
    `</span>`;

  setup() {
    this.selectable = new Selectable(this, { role: 'radio', state: 'aria-checked' });
    // El subtítulo solo se reserva si trae contenido
    const slot = this.shadowRoot.querySelector('slot[name="meta"]');
    const sync = () => (slot.parentElement.hidden = !slot.assignedNodes().some((node) => node.nodeType === 1 || node.textContent.trim()));
    slot.addEventListener('slotchange', sync);
    sync();
  }
}

ArqOptionTile.define();

export { ArqOptionTile };
