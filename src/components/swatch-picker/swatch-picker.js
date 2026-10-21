// swatch-picker · Figma 1063:4881 · ficha doc/swatch-picker (1461:8862)
//
// Selector de acabado por muestras: fila de arq-swatch (role="radiogroup").
// Va dentro de option-group Type=Swatches, que le pasa su etiqueta como nombre
// accesible. La cantidad de muestras es libre.
//
//   <arq-swatch-picker label="Color">
//     <arq-swatch value="negro" selected src="…">Negro</arq-swatch>
//     <arq-swatch value="verde" src="…">Verde</arq-swatch>
//     <arq-swatch value="terracota" disabled>Terracota</arq-swatch>
//   </arq-swatch-picker>
//
// - Una sola elegida; flechas, Inicio y Fin; las deshabilitadas se saltean
//   (SingleSelect). Emite el arq:change de la muestra elegida.
// - Tamaño automático: todas en Size=XLarge (swatch/xl, 32), la elegida no
//   crece (decisiones.md, 2026-10-21 · Configurador de la ficha). No hace falta
//   escribir size en las muestras.

import { ArqElement } from '../../base/arq-element.js';
import { SingleSelect } from '../../base/single-select.js';
import css from './swatch-picker.css?inline';

class ArqSwatchPicker extends ArqElement {
  static tag = 'arq-swatch-picker';
  static styles = css;
  static properties = {
    label: { type: String }, // nombre accesible del grupo (option-group lo completa)
  };
  static template = `<slot></slot>`;

  setup() {
    this.setAttribute('role', 'radiogroup');
    this.select = new SingleSelect(this, { items: 'arq-swatch' });
    const sizes = () => {
      for (const swatch of this.select.items) if (swatch.getAttribute('size') !== 'xlarge') swatch.setAttribute('size', 'xlarge');
    };
    new MutationObserver(sizes).observe(this, { childList: true, subtree: true });
    sizes();
  }

  update(changed) {
    if (changed.has('label')) {
      if (this.label) this.setAttribute('aria-label', this.label);
      else this.removeAttribute('aria-label');
    }
  }
}

ArqSwatchPicker.define();

export { ArqSwatchPicker };
