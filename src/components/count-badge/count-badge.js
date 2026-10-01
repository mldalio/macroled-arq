// count-badge · Figma 1231:3557 · ficha doc/count-badge (1433:3961)
//
// Contador: productos seleccionados (compare-bar) o filtros activos (button
// Filtrar). Solo números. Si el número es 0 o falta, no se muestra.
//
//   <arq-count-badge count="3"></arq-count-badge>
//   <arq-count-badge count="3" tone="inverse"></arq-count-badge>   (dentro de color/action/primary)
//
// El número solo no alcanza para un lector de pantalla: el texto ("3 filtros
// activos") lo pone el control que lo contiene (p. ej. count-label en button).

import { ArqElement } from '../../base/arq-element.js';
import css from './count-badge.css?inline';

class ArqCountBadge extends ArqElement {
  static tag = 'arq-count-badge';
  static styles = css;
  static properties = {
    count: { type: Number }, // Count
    tone: { type: String, values: ['primary', 'inverse'], default: 'primary' }, // Tone
  };
  static template = `<span class="badge role-caption-medium"></span>`;

  // Estado "empty" con CustomStateSet (:host(:state(empty))): oculta el badge
  // sin tocar atributos del elemento.
  #internals = this.attachInternals();

  update() {
    const empty = !this.count;
    this.shadowRoot.querySelector('.badge').textContent = empty ? '' : String(this.count);
    if (empty) this.#internals.states.add('empty');
    else this.#internals.states.delete('empty');
  }
}

ArqCountBadge.define();

export { ArqCountBadge };
