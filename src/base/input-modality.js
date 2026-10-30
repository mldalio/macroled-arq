// Regla global del foco (DESIGN.md §7): el anillo de foco se ve solo cuando la
// persona navega con el teclado. Con toque o mouse nunca.
//
// Un foco que mueve un script (abrir un menú, volver de un nivel, showModal())
// matchea :focus-visible en iOS y Android aunque se haya tocado, y deja el
// anillo pegado. En vez de corregirlo componente por componente, una hoja
// compartida (adoptada por todos los Shadow DOM desde ArqElement) apaga el
// anillo mientras la última interacción fue con puntero. Una sola hoja:
// encenderla o apagarla (`disabled`) alcanza a todos los componentes a la vez.
//
// El foco sí se mueve (lectores de pantalla y teclado dependen de eso); solo
// no se dibuja. Los campos de texto quedan fuera: el cursor y su borde de foco
// son parte de escribir.

const css = `
:host(:focus-visible),
:focus-visible:not(input, textarea, select),
:has(:focus-visible:not(input, textarea, select)) {
  outline: none !important;
}
`;

let sheet;

// Arranca como puntero: con un teclado, la primera tecla (Tab) lo cambia antes
// de que el foco se mueva.
function setKeyboard(on) {
  if (sheet) sheet.disabled = on;
}

let started = false;
function start() {
  if (started) return;
  started = true;
  // En captura y a nivel documento: los eventos salen del Shadow DOM (composed)
  addEventListener('keydown', (event) => {
    if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) setKeyboard(true);
  }, true);
  addEventListener('pointerdown', () => setKeyboard(false), true);
}

/** Hoja única que apaga el anillo de foco mientras no se usa el teclado */
export function getFocusModalitySheet() {
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    start();
  }
  return sheet;
}
