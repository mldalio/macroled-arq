// grid · componente de layout de página (sin set en Figma; pantallas de Final)
//
// Grilla de tarjetas o bloques de una página. Las tarjetas toman el ancho de
// su columna (DESIGN.md §8 · Reutilización: FILL).
//
//   <arq-grid columns="3" mobile="carousel">        categorías del Home
//   <arq-grid columns="2">                          líneas del Home (Mobile apila)
//   <arq-grid columns="4" mobile="two-columns">     productos destacados
//   <arq-grid>                                      catálogo: auto-fill con layout/card-min
//
// - columns: cantidad de columnas en Desktop. Sin columns, auto-fill con
//   layout/card-min (layout/card-min-wide desde 1600 px, DESIGN.md §2).
// - mobile (hasta 767 px): stack (una columna, separadas space/section/md),
//   two-columns (dos, a space/gap/sm-md) o carousel (fila con scroll y snap,
//   la tarjeta siguiente asoma; llega hasta el borde derecho de la pantalla).
// - gap="sm": space/gap/sm entre tarjetas en Desktop y Mobile (Explorar por
//   espacio del Home).
// - stagger (PRUEBA, fuera de Figma): en Desktop, las tarjetas pares bajan
//   space/section-lg (líneas del Home).
// - El scroll del carrusel es el propio elemento: carousel-controls puede
//   manejarlo con for="<id del arq-grid>".

import { ArqElement } from '../../base/arq-element.js';
import css from './grid.css?inline';

class ArqGrid extends ArqElement {
  static tag = 'arq-grid';
  static styles = css;
  static properties = {
    columns: { type: Number }, // columnas en Desktop
    mobile: { type: String, values: ['stack', 'two-columns', 'carousel'], default: 'stack' },
    gap: { type: String, values: ['default', 'sm'], default: 'default' }, // sm: space/gap/sm entre tarjetas
    layout: { type: String, values: ['default', 'editorial'], default: 'default' },
    stagger: { type: Boolean }, // PRUEBA: tarjetas pares más abajo en Desktop
  };
  static template = `<div class="grid" part="grid"><slot></slot></div>`;

  update() {
    const grid = this.shadowRoot.querySelector('.grid');
    const columns = Math.trunc(this.columns);
    const editorial = this.layout === 'editorial';
    if (!editorial && columns > 0) grid.style.setProperty('--columns', columns);
    else grid.style.removeProperty('--columns');
    grid.classList.toggle('editorial', editorial);
    grid.classList.toggle('auto', !editorial && !(columns > 0));
  }
}

ArqGrid.define();

export { ArqGrid };
