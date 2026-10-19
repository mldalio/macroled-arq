// project-slide · Figma 2153:20656
//
// Slide del carrusel de proyectos (scene/proyectos de Home v2). Activo = el
// central, sin velo. Inactivo = laterales, con velo. La foto llega por slot.
//
//   <arq-project-slide>
//     <img slot="image" src="…" alt="…" loading="lazy">
//   </arq-project-slide>

import { ArqElement } from '../../base/arq-element.js';
import css from './project-slide.css?inline';

class ArqProjectSlide extends ArqElement {
  static tag = 'arq-project-slide';
  static styles = css;
  static properties = {
    active: { type: Boolean }, // Estado=Activo
  };
  static template =
    `<div class="slide">` +
    `<slot name="image"></slot>` +
    `<span class="veil" aria-hidden="true"></span>` +
    `</div>`;
}

ArqProjectSlide.define();

export { ArqProjectSlide };
