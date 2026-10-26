// Scroll de la página detrás de un diálogo modal (decisiones.md, 2026-10-06 ·
// Descargas).
//
//   containScroll(dialog);  // una vez, en setup()
//   containScroll(header, { when: () => abierto });  // sin <dialog>: solo mientras when() dé true (mega-menu)
//
// Con el diálogo abierto, la rueda, el touch y las teclas de scroll no mueven
// la página: solo lo que se pueda desplazar adentro del diálogo (por ejemplo,
// el diálogo mismo si no entra en la pantalla). No toca <html> ni <body>
// (AGENTS.md · Integración con Webflow): se cancela el evento en el diálogo.
// El ::backdrop es parte del <dialog>, así que el scrim también queda cubierto.

const KEYS = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1, End: 1, Home: -1, ' ': 1 };

// ¿Algún elemento entre el destino y el diálogo puede desplazarse hacia ese lado?
function canScroll(event, container, dy) {
  for (const el of event.composedPath()) {
    if (!(el instanceof Element)) continue;
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      if (dy < 0 ? el.scrollTop > 0 : Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight) return true;
    }
    if (el === container) break;
  }
  return false;
}

// Campos donde las teclas escriben o eligen (no desplazan)
const isEditable = (event) =>
  event.composedPath().some((el) => el instanceof Element && (el.matches('input, textarea, select, [contenteditable=""], [contenteditable="true"]') || el.getAttribute('role') === 'combobox'));

/** Frena el scroll de la página mientras `dialog` (un <dialog> modal, o un contenedor con `when`) está abierto. */
export function containScroll(dialog, { when = () => true } = {}) {
  dialog.addEventListener(
    'wheel',
    (event) => {
      if (when() && event.deltaY && !canScroll(event, dialog, event.deltaY)) event.preventDefault();
    },
    { passive: false },
  );
  let startX = 0;
  let startY = 0;
  dialog.addEventListener(
    'touchstart',
    (event) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    },
    { passive: true },
  );
  dialog.addEventListener(
    'touchmove',
    (event) => {
      // Dos dedos: es un zoom (visor de fotos), no un scroll. Cancelarlo
      // cancelaría también el zoom.
      if (event.touches.length > 1) return;
      const dx = startX - event.touches[0].clientX;
      const dy = startY - event.touches[0].clientY;
      // Gesto de costado (un riel horizontal adentro): un touchmove cancelado
      // anula todo el gesto. La página no se mueve de costado y los rieles ya
      // tienen overscroll-behavior-x: contain.
      if (Math.abs(dx) > Math.abs(dy)) return;
      if (when() && dy && !canScroll(event, dialog, dy)) event.preventDefault();
    },
    { passive: false },
  );
  dialog.addEventListener('keydown', (event) => {
    const dy = KEYS[event.key];
    if (!when() || !dy || event.altKey || event.ctrlKey || event.metaKey || isEditable(event)) return;
    // Espacio sobre un botón o un link lo activa: no se toca
    if (event.key === ' ' && event.composedPath().some((el) => el instanceof Element && el.matches('button, a[href], [role="button"]'))) return;
    if (!canScroll(event, dialog, dy)) event.preventDefault();
  });
}
