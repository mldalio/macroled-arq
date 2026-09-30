// Los 20 íconos de Figma (icon/*, sección icons 1075:4571), leídos por MCP
// desde la variante Theme=Default de cada uno (node id en cada entrada).
// Son trazos de 1 px en una grilla de 16 × 16. En código:
// - stroke="currentColor": el color lo pone el componente (color/icon/*).
//   Theme=Inverse no es otro SVG: es el mismo con color/icon/inverse.
// - vector-effect="non-scaling-stroke": el trazo queda en 1 px en cualquier
//   tamaño (icon/sm … icon/2xl). Sin esto, a 24 px el trazo pasaría a 1,5 px.
// - Sin width/height: el tamaño lo define el CSS del componente con --arq-icon-*.
// - aria-hidden: el nombre accesible lo lleva el botón o link que contiene al ícono.

const paths = {
  // 1242:21745
  'arrow-down': '<path vector-effect="non-scaling-stroke" d="M8 2V13.3M12.65 8.65L8 13.3L3.35 8.65"/>',
  // 1242:21597
  'arrow-left': '<path vector-effect="non-scaling-stroke" d="M14 8H2.7M7.35 12.65L2.7 8L7.35 3.35"/>',
  // 795:2153
  'arrow-right': '<path vector-effect="non-scaling-stroke" d="M2 8H13.3M8.65 12.65L13.3 8L8.65 3.35"/>',
  // 1242:21746
  'arrow-up': '<path vector-effect="non-scaling-stroke" d="M8 14V2.7M12.65 7.35L8 2.7L3.35 7.35"/>',
  // 898:2284
  'arrow-up-right': '<path vector-effect="non-scaling-stroke" d="M3.35 12.65L12.5 3.5M12.5 11V3.5H5"/>',
  // 840:1968
  'chevron-down': '<path vector-effect="non-scaling-stroke" d="M3.35 5.65L8 10.3L12.65 5.65"/>',
  // 795:2151
  'chevron-left': '<path vector-effect="non-scaling-stroke" d="M10.35 3.35L5.7 8L10.35 12.65"/>',
  // 840:1970
  'chevron-right': '<path vector-effect="non-scaling-stroke" d="M5.65 3.35L10.3 8L5.65 12.65"/>',
  // 1247:22233
  'chevron-up': '<path vector-effect="non-scaling-stroke" d="M3.35 10.35L8 5.7L12.65 10.35"/>',
  // 751:4289
  'close': '<path vector-effect="non-scaling-stroke" d="M2.5 2.5L13.5 13.5M13.5 2.5L2.5 13.5" stroke-linejoin="round"/>',
  // 918:2462
  'copy': '<path vector-effect="non-scaling-stroke" d="M11 5V2H2V11H5M5 5H14V14H5V5Z"/>',
  // 898:2286
  'download': '<path vector-effect="non-scaling-stroke" d="M8 1.79545V10.0682M4.4 7.70455L8 11.25L11.6 7.70455M2 14.2045H14"/>',
  // 854:2420
  'filter': '<path vector-effect="non-scaling-stroke" d="M2.5 4.5H13.5M4.5 8H11.5M7 11.5H9"/>',
  // 1061:4839
  'filter-off': '<path vector-effect="non-scaling-stroke" d="M2 4H14M4 8H12M6 12H10M3 2L13 14"/>',
  // 788:2901
  'instagram': '<path vector-effect="non-scaling-stroke" d="M11.667 4.33304H11.6736M4.6664 1.3328H11.3336C13.1747 1.3328 14.6672 2.8253 14.6672 4.6664V11.3336C14.6672 13.1747 13.1747 14.6672 11.3336 14.6672H4.6664C2.8253 14.6672 1.3328 13.1747 1.3328 11.3336V4.6664C1.3328 2.8253 2.8253 1.3328 4.6664 1.3328ZM10.6667 7.58017C10.749 8.13504 10.6542 8.70173 10.3958 9.19964C10.1375 9.69755 9.72871 10.1013 9.22765 10.3535C8.7266 10.6057 8.15878 10.6935 7.60496 10.6044C7.05115 10.5152 6.53953 10.2538 6.14288 9.85712C5.74624 9.46048 5.48476 8.94886 5.39564 8.39504C5.30652 7.84122 5.39431 7.27341 5.6465 6.77235C5.8987 6.2713 6.30246 5.86252 6.80037 5.60417C7.29827 5.34582 7.86496 5.25104 8.41984 5.33332C8.98583 5.41725 9.50983 5.68099 9.91442 6.08559C10.319 6.49018 10.5828 7.01417 10.6667 7.58017Z" stroke-linecap="round"/>',
  // 751:4287
  'menu': '<path vector-effect="non-scaling-stroke" d="M0 14H15.75M0 8H15.75M0 2H15.75" stroke-linejoin="round"/>',
  // 1036:2415
  'minus': '<path vector-effect="non-scaling-stroke" d="M3 8H13"/>',
  // 1036:2412
  'plus': '<path vector-effect="non-scaling-stroke" d="M8 3V13M3 8H13"/>',
  // 751:4285
  'search': '<path vector-effect="non-scaling-stroke" d="M13.6667 13.6667L10.676 10.6707M12.3333 6.66667C12.3333 8.16956 11.7363 9.6109 10.6736 10.6736C9.6109 11.7363 8.16956 12.3333 6.66667 12.3333C5.16377 12.3333 3.72243 11.7363 2.65973 10.6736C1.59702 9.6109 1 8.16956 1 6.66667C1 5.16377 1.59702 3.72243 2.65973 2.65973C3.72243 1.59702 5.16377 1 6.66667 1C8.16956 1 9.6109 1.59702 10.6736 2.65973C11.7363 3.72243 12.3333 5.16377 12.3333 6.66667Z"/>',
  // 788:2903
  // TODO: el SVG que exporta Figma trae solo el contorno; el triángulo de play
  // que se ve en el render no sale (probablemente una región con relleno del
  // vector). Revisar el vector en Figma (Flatten / Outline stroke) y re-exportar.
  'youtube': '<path vector-effect="non-scaling-stroke" d="M1.66688 4.66703C1.20117 6.86458 1.20117 9.13533 1.66688 11.3329C1.72807 11.556 1.8463 11.7594 2.00994 11.9231C2.17358 12.0867 2.37699 12.2049 2.60018 12.2661C6.17568 12.8585 9.82432 12.8585 13.3998 12.2661C13.623 12.2049 13.8264 12.0867 13.9901 11.9231C14.1537 11.7594 14.2719 11.556 14.3331 11.3329C14.7988 9.13533 14.7988 6.86458 14.3331 4.66703C14.2719 4.44387 14.1537 4.24047 13.9901 4.07684C13.8264 3.91322 13.623 3.795 13.3998 3.73382C9.82431 3.14153 6.17569 3.14153 2.60018 3.73382C2.37699 3.795 2.17358 3.91322 2.00994 4.07684C1.8463 4.24047 1.72807 4.44387 1.66688 4.66703Z" stroke-linecap="round"/>',
};

/** Nombres disponibles, iguales a Figma sin el prefijo icon/ */
export const iconNames = Object.freeze(Object.keys(paths));

/**
 * Devuelve el SVG del ícono como string, para usar dentro de un template:
 *   `<button type="button">${icon('plus')}</button>`
 * Un nombre desconocido devuelve '' (y avisa en desarrollo).
 */
export function icon(name) {
  const path = paths[name];
  if (!path) {
    if (import.meta.env.DEV) console.warn(`[arq] icon: no existe "${name}". Disponibles: ${iconNames.join(', ')}`);
    return '';
  }
  return (
    `<svg class="icon" data-icon="${name}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" ` +
    `aria-hidden="true" focusable="false">${path}</svg>`
  );
}
