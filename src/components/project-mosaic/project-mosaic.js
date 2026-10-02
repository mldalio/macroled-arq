// project-mosaic · componente de layout de página (DESIGN.md §12: se resuelve
// en código, con grid + aspect-ratio; no es un set de Figma)
//
// Mosaico de fotos de proyectos del Home ("Diseño que inspira").
//
//   <arq-project-mosaic>
//     <img src="…" alt="Balizas Kanu en un patio con muros de hormigón" loading="lazy">
//     <img src="…" alt="…" loading="lazy">
//     <img src="…" alt="…" loading="lazy">
//     <img src="…" alt="…" loading="lazy">
//   </arq-project-mosaic>
//
// - Desktop: la 1.ª ocupa la mitad izquierda a todo el alto; la 2.ª la mitad
//   derecha arriba; la 3.ª y la 4.ª abajo a la derecha, una al lado de la otra.
// - Mobile: la 1.ª a todo el ancho y la 2.ª y la 3.ª debajo; la 4.ª no se ve.
// - Las fotos llegan por slot y son contenido: van con alt descriptivo.
// - Más de cuatro: no se muestran (la cantidad de las galerías está pendiente,
//   DESIGN.md §12).

import { ArqElement } from '../../base/arq-element.js';
import css from './project-mosaic.css?inline';

class ArqProjectMosaic extends ArqElement {
  static tag = 'arq-project-mosaic';
  static styles = css;
  static template = `<div class="mosaic"><slot></slot></div>`;
}

ArqProjectMosaic.define();

export { ArqProjectMosaic };
