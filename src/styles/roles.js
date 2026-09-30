// Estilos de texto role/* compartidos por todos los componentes.
// roles.css se genera con npm run tokens. Se crea una sola CSSStyleSheet y
// cada Shadow DOM la adopta: el navegador la parsea una vez para toda la página.

import rolesCss from './roles.css?inline';

let rolesSheet;
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

/**
 * Adopta en un shadowRoot los roles y, en orden, cada CSS que se le pase
 * (el texto que llega de `import css from './x.css?inline'`). Cada hoja se crea
 * una sola vez y la comparten todas las instancias.
 *
 *   const root = this.attachShadow({ mode: 'open' });
 *   adoptStyles(root, css);
 */
export function adoptStyles(root, ...cssTexts) {
  const sheets = [getRolesSheet()];
  for (const cssText of cssTexts) {
    if (!cssText) continue;
    if (!componentSheets.has(cssText)) componentSheets.set(cssText, toSheet(cssText));
    sheets.push(componentSheets.get(cssText));
  }
  root.adoptedStyleSheets = [...sheets, ...root.adoptedStyleSheets.filter((s) => !sheets.includes(s))];
}
