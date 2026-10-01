// Hojas compartidas por todos los componentes, generadas con npm run tokens:
// - roles.css: estilos de texto role/* (clases .role-*).
// - dark.css: el bloque [data-arq-theme="dark"] de tokens.css. tokens.css vive
//   en el documento y no alcanza un elemento dentro de un Shadow DOM; con esta
//   hoja, un contenedor interno con data-arq-theme="dark" (Dark local) también
//   pasa a Dark, y el contenido por slot que muestra lo hereda.
// Cada hoja se crea una sola vez y cada Shadow DOM la adopta: el navegador la
// parsea una vez para toda la página.

import rolesCss from './roles.css?inline';
import darkCss from './dark.css?inline';

let rolesSheet;
let darkSheet;
const componentSheets = new Map();

function toSheet(cssText) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  return sheet;
}

/** Hoja única con las clases .role-* */
export function getRolesSheet() {
  rolesSheet ??= toSheet(rolesCss);
  return rolesSheet;
}

/** Hoja única con las variables del modo Dark ([data-arq-theme="dark"]) */
export function getDarkSheet() {
  darkSheet ??= toSheet(darkCss);
  return darkSheet;
}

/**
 * Adopta en un shadowRoot los roles, el modo Dark y, en orden, cada CSS que se
 * le pase (el texto que llega de `import css from './x.css?inline'`). Cada hoja
 * se crea una sola vez y la comparten todas las instancias.
 *
 *   const root = this.attachShadow({ mode: 'open' });
 *   adoptStyles(root, css);
 */
export function adoptStyles(root, ...cssTexts) {
  const sheets = [getRolesSheet(), getDarkSheet()];
  for (const cssText of cssTexts) {
    if (!cssText) continue;
    if (!componentSheets.has(cssText)) componentSheets.set(cssText, toSheet(cssText));
    sheets.push(componentSheets.get(cssText));
  }
  root.adoptedStyleSheets = [...sheets, ...root.adoptedStyleSheets.filter((s) => !sheets.includes(s))];
}
