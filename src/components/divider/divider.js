// divider · Figma 1244:3990 · ficha doc/divider (1440:4328)
//
// Línea divisoria de 1 px.
//
//   <arq-divider></arq-divider>                                   Horizontal, ancho del contenedor
//   <arq-divider orientation="vertical"></arq-divider>            Vertical, alto del contenedor
//   <arq-divider emphasis="default"></arq-divider>                Más contraste
//
// Horizontal es un separador (como <hr>); Vertical es decorativo (entre
// acciones de una barra) y queda oculto para lectores de pantalla.
// Los roles van por ElementInternals: no se agregan atributos al elemento.

import { ArqElement } from '../../base/arq-element.js';
import css from './divider.css?inline';

class ArqDivider extends ArqElement {
  static tag = 'arq-divider';
  static styles = css;
  static properties = {
    orientation: { type: String, values: ['horizontal', 'vertical'], default: 'horizontal' }, // Orientation
    emphasis: { type: String, values: ['subtle', 'default'], default: 'subtle' }, // Emphasis
  };

  #internals = this.attachInternals();

  update() {
    const vertical = this.orientation === 'vertical';
    this.#internals.role = vertical ? null : 'separator';
    this.#internals.ariaHidden = vertical ? 'true' : null;
  }
}

ArqDivider.define();

export { ArqDivider };
