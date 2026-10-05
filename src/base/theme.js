// Modo del bloque donde está un componente: Iluminar cambia imágenes
// (DESIGN.md §2 · Modo Dark y §8 · Imágenes de product-card). Lo usan
// product-gallery y product-card, que muestran la versión encendida de una
// foto cuando quedan dentro de un bloque con data-arq-theme="dark".
//
//   setup() {
//     watchTheme(this, 'themeChanged');   // llama a this.themeChanged(dark)
//   }
//
// - El modo sale del ancestro más cercano con data-arq-theme, en el mismo
//   árbol que siguen las variables CSS: si el componente llega por slot, cuenta
//   el contenedor donde se muestra, no su padre en el HTML.
// - Un solo MutationObserver en el documento avisa a todos los componentes
//   cuando cambia data-arq-theme en cualquier elemento del DOM de la página
//   (Iluminar lo pone en <html> o en una sección). No ve cambios dentro de un
//   Shadow DOM: el Dark local de un componente es fijo y no cambia imágenes.
//   Un componente que cambia el modo de un contenedor interno (el hero de la
//   ficha) avisa con refreshTheme().
// - Cada componente queda registrado con una referencia débil (y el método
//   por su nombre, para no guardar una función que lo retenga): si sale de la
//   página y se descarta, deja de recibir avisos sin tener que desregistrarlo.

const watchers = new Set();
let observer = null;

function nextUp(node) {
  if (node.assignedSlot) return node.assignedSlot;
  if (node.parentElement) return node.parentElement;
  const root = node.parentNode;
  return root instanceof ShadowRoot ? root.host : null;
}

/** true si el elemento está dentro de un bloque en modo Dark. */
export function isDark(element) {
  for (let node = element; node; node = nextUp(node)) {
    if (node.hasAttribute?.('data-arq-theme')) return node.getAttribute('data-arq-theme') === 'dark';
  }
  return false;
}

/**
 * Avisa ya a los componentes registrados. Para un data-arq-theme que cambia
 * dentro de un Shadow DOM, que el observer no ve: la ficha de producto, cuyo
 * hero es un contenedor interno de <arq-ficha-producto>, lo llama al cambiar
 * Iluminar.
 */
export function refreshTheme() {
  checkAll();
}

function checkAll() {
  for (const watch of watchers) {
    const host = watch.ref.deref();
    if (!host) {
      watchers.delete(watch);
      continue;
    }
    if (!host.isConnected) continue;
    const dark = isDark(host);
    if (dark !== watch.dark) {
      watch.dark = dark;
      host[watch.method](dark);
    }
  }
}

/**
 * Llama a host[method](dark) ahora y cada vez que cambia el modo del bloque
 * donde está el componente. Se usa una vez, en setup().
 * @param {HTMLElement} host
 * @param {string} method nombre de un método público del componente
 */
export function watchTheme(host, method) {
  const watch = { ref: new WeakRef(host), dark: isDark(host), method };
  watchers.add(watch);
  if (!observer) {
    observer = new MutationObserver(checkAll);
    observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-arq-theme'] });
  }
  host[method](watch.dark);
}
