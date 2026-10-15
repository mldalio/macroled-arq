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

// Iluminar: el texto, los íconos y los bordes no funden a la par del fondo:
// arrancan después del fondo (25 %) y funden despacio y parejo (50 % de su
// duración), para no quedar claro sobre claro y sin un corte duro. Las variables van en <html> (atraviesan
// los Shadow DOM) y se quitan al terminar, así hover y foco no se retrasan.
// Debe coincidir con --arq-illumination-bg-duration (global.css).
const TEXT_VARS = ['--arq-theme-text-delay', '--arq-theme-text-duration', '--arq-theme-text-easing', '--arq-theme-bg-duration', '--arq-theme-bg-easing'];
let themeTimer = 0;

// Aplicar el tema sin ninguna transición (al llegar a la ficha ya iluminada): por
// esos cuadros todas las duraciones valen 0, así no se ve el salto de claro a
// oscuro. Se quitan dos cuadros después, cuando el cambio ya se pintó.
const INSTANT_VARS = ['--arq-illumination-bg-duration', '--arq-illumination-image-duration', '--arq-theme-bg-duration', '--arq-theme-text-duration', '--arq-theme-text-delay'];

/** Ejecuta `apply` (que cambia data-arq-theme) sin transiciones. */
export function withoutThemeTransition(apply) {
  const style = document.documentElement.style;
  for (const name of INSTANT_VARS) style.setProperty(name, '0s');
  apply();
  requestAnimationFrame(() => requestAnimationFrame(() => INSTANT_VARS.forEach((name) => style.removeProperty(name))));
}

// Iluminar no se recuerda: recargar o volver a una página la deja en su estado
// normal. La única excepción es Productos → ficha: si el listado está iluminado
// y se entra a un producto, la ficha llega iluminada. El traspaso vive en
// sessionStorage unos segundos y la ficha lo consume al cargar (una sola vez);
// cualquier listado que se abre lo borra.
const HANDOFF_KEY = 'arq:iluminar-handoff';
const HANDOFF_MS = 10000;

/** El listado avisa, al hacer clic en un producto, si está iluminado. */
export function handOffTheme(dark) {
  try {
    if (dark) sessionStorage.setItem(HANDOFF_KEY, String(Date.now()));
    else sessionStorage.removeItem(HANDOFF_KEY);
  } catch {}
}

/** La ficha: ¿llegó desde un listado iluminado? Lo consume (queda borrado). */
export function takeThemeHandoff() {
  try {
    const at = Number(sessionStorage.getItem(HANDOFF_KEY));
    sessionStorage.removeItem(HANDOFF_KEY);
    return Boolean(at) && Date.now() - at < HANDOFF_MS;
  } catch {
    return false;
  }
}

/** Llamar justo antes de cambiar data-arq-theme por Iluminar. */
export function animateThemeChange(bgMs = 1200) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const style = document.documentElement.style;
  style.setProperty(TEXT_VARS[0], `${Math.round(bgMs * 0.25)}ms`);
  style.setProperty(TEXT_VARS[1], `${Math.round(bgMs * 0.5)}ms`);
  style.setProperty(TEXT_VARS[2], 'cubic-bezier(0.4, 0, 0.2, 1)');
  // Fondo del navbar: solo funde lento al iluminar; el resto del tiempo (scroll, cambio de página) usa la duración rápida
  style.setProperty(TEXT_VARS[3], `${bgMs}ms`);
  style.setProperty(TEXT_VARS[4], 'cubic-bezier(0.45, 0, 0.2, 1)');
  clearTimeout(themeTimer);
  themeTimer = setTimeout(() => TEXT_VARS.forEach((name) => style.removeProperty(name)), bgMs + 100);
}
