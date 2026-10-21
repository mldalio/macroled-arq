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

/**
 * true si el elemento está dentro de un bloque en modo Dark.
 * `pageDark` (opcional) reemplaza el modo de <html>: el que va a tener la
 * página cuando switchTheme aplique el cambio.
 */
export function isDark(element, pageDark) {
  for (let node = element; node; node = nextUp(node)) {
    if (pageDark !== undefined && node === document.documentElement) return pageDark;
    if (node.hasAttribute?.('data-arq-theme')) return node.getAttribute('data-arq-theme') === 'dark';
  }
  return pageDark ?? false;
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

function checkAll(pageDark) {
  if (typeof pageDark !== 'boolean') pageDark = undefined; // el MutationObserver pasa sus registros
  for (const watch of watchers) {
    const host = watch.ref.deref();
    if (!host) {
      watchers.delete(watch);
      continue;
    }
    if (!host.isConnected) continue;
    const dark = isDark(host, pageDark);
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
// Los fondos de los elementos (botón Filled, option-tile, select) funden con la
// misma duración y curva que el fondo del bloque (--arq-theme-surface-*): con
// motion/duration/fast cambiaban de golpe mientras el bloque seguía claro.
const TEXT_VARS = ['--arq-theme-text-delay', '--arq-theme-text-duration', '--arq-theme-text-easing', '--arq-theme-bg-duration', '--arq-theme-bg-easing', '--arq-theme-surface-duration', '--arq-theme-surface-easing'];
let themeTimer = 0;

// Aplicar el tema sin ninguna transición (al llegar a la ficha ya iluminada): por
// esos cuadros todas las duraciones valen 0, así no se ve el salto de claro a
// oscuro. Se quitan dos cuadros después, cuando el cambio ya se pintó.
const INSTANT_VARS = ['--arq-illumination-bg-duration', '--arq-illumination-image-duration', '--arq-theme-bg-duration', '--arq-theme-text-duration', '--arq-theme-text-delay', '--arq-theme-surface-duration'];

/** Ejecuta `apply` (que cambia data-arq-theme) sin transiciones. */
export function withoutThemeTransition(apply) {
  const style = document.documentElement.style;
  for (const name of INSTANT_VARS) style.setProperty(name, '0s');
  apply();
  requestAnimationFrame(() => requestAnimationFrame(() => INSTANT_VARS.forEach((name) => style.removeProperty(name))));
}

// Barra del navegador con Iluminar (meta theme-color): en el teléfono, la barra
// de la dirección y la zona de arriba toman el color de la etiqueta que pone
// Webflow en el <head>, compartida con el e-commerce de Macroled. Con Iluminar
// la página pasa a oscuro y la barra quedaba clara. Mientras Iluminar está
// prendido, la etiqueta toma color/surface/default del bloque en Dark; al
// apagarlo vuelve exactamente a lo que tenía (o se quita, si no había). Solo lo
// llama Iluminar, que existe solo en las páginas de Arq (decisión 2026-10-19).
const BAR_ORIGINAL = 'data-arq-theme-color';
const BAR_ADDED = 'data-arq-theme-color-added';

/** Iluminar: pasa la barra del navegador a oscuro (o la devuelve a Webflow). */
export function setBrowserBar(dark, source = document.documentElement) {
  const metas = [...document.head.querySelectorAll('meta[name="theme-color"]')];
  if (!dark) {
    for (const meta of metas) {
      if (meta.hasAttribute(BAR_ADDED)) meta.remove();
      else if (meta.hasAttribute(BAR_ORIGINAL)) {
        meta.content = meta.getAttribute(BAR_ORIGINAL);
        meta.removeAttribute(BAR_ORIGINAL);
      }
    }
    return;
  }
  const color = getComputedStyle(source).getPropertyValue('--arq-color-surface-default').trim();
  if (!color) return;
  if (!metas.length) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.setAttribute(BAR_ADDED, '');
    document.head.append(meta);
    metas.push(meta);
  }
  for (const meta of metas) {
    if (!meta.hasAttribute(BAR_ADDED) && !meta.hasAttribute(BAR_ORIGINAL)) meta.setAttribute(BAR_ORIGINAL, meta.content);
    meta.content = color;
  }
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
  const style = document.documentElement.style;
  // Reduced motion (DESIGN.md §6): todo funde junto y corto, con
  // motion/duration/fade, como el fondo (global.css). Sin retraso.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fade = 'var(--arq-motion-duration-fade)';
    style.setProperty(TEXT_VARS[0], '0s');
    style.setProperty(TEXT_VARS[1], fade);
    style.setProperty(TEXT_VARS[2], 'var(--arq-motion-easing-standard)');
    style.setProperty(TEXT_VARS[3], fade);
    style.setProperty(TEXT_VARS[4], 'var(--arq-motion-easing-standard)');
    style.setProperty(TEXT_VARS[5], fade);
    style.setProperty(TEXT_VARS[6], 'var(--arq-motion-easing-standard)');
    clearTimeout(themeTimer);
    themeTimer = setTimeout(() => TEXT_VARS.forEach((name) => style.removeProperty(name)), 1000);
    return;
  }
  style.setProperty(TEXT_VARS[0], `${Math.round(bgMs * 0.25)}ms`);
  style.setProperty(TEXT_VARS[1], `${Math.round(bgMs * 0.5)}ms`);
  style.setProperty(TEXT_VARS[2], 'cubic-bezier(0.4, 0, 0.2, 1)');
  // Fondo del navbar: solo funde lento al iluminar; el resto del tiempo (scroll, cambio de página) usa la duración rápida.
  // Con la misma duración y curva que el fondo de la página y del hero de la ficha
  // (--arq-illumination-bg-*): con una propia, la barra se apagaba a destiempo (2026-10-21).
  style.setProperty(TEXT_VARS[3], 'var(--arq-illumination-bg-duration)');
  style.setProperty(TEXT_VARS[4], 'var(--arq-illumination-bg-easing)');
  style.setProperty(TEXT_VARS[5], 'var(--arq-illumination-bg-duration)');
  style.setProperty(TEXT_VARS[6], 'var(--arq-illumination-bg-easing)');
  clearTimeout(themeTimer);
  themeTimer = setTimeout(() => TEXT_VARS.forEach((name) => style.removeProperty(name)), bgMs + 100);
}

// Iluminar de toda la página (Productos y Colecciones) con View Transitions:
// el navegador fotografía la página, aplica el cambio de una vez (sin
// transiciones) y funde la foto vieja sobre la página nueva en la GPU. Con
// animateThemeChange cada elemento de cada componente animaba su propio color
// (más de 400 transiciones a la vez): recalcular estilos se llevaba casi todo
// el cuadro y la pantalla avanzaba a saltos (decisión 2026-10-16 · Iluminar
// sin saltos). No necesita CSS global: la duración y la curva se ponen en las
// animaciones del navegador. Sin View Transitions, queda animateThemeChange.
//
// Duración y curva: --arq-illumination-bg-duration y -easing (global.css; con
// reduced motion, motion/duration/fade). La página nueva es «en vivo»: lo que
// termina de cargar durante el fundido aparece ahí.

// Imágenes que cambian por Iluminar (product-card): la foto nueva se toma
// cuando ya cargaron, con un tope de IMAGE_WAIT_MS.
const IMAGE_WAIT_MS = 400;
// Iluminar espera menos a las fotos que no cargaron: con 400 ms (dos veces) el
// fondo arrancaba entre 0,4 y 0,75 s después del clic según la caché, y la
// velocidad se sentía distinta cada vez. La página nueva es «en vivo»: la foto
// que llega tarde aparece igual, con su fundido.
const THEME_WAIT_MS = 150;
// Las fotos se adelantan al fondo: las product-card empiezan su fundido
// (--arq-illumination-image-duration) y el fondo arranca
// motion/duration/illumination-lead después, para que se vea que la luz se
// prende. Desde ahí los dos funden a la vez: la foto vieja de la View
// Transition la toma a mitad de camino y la página nueva la termina.
const pendingImages = new Set();
let themeSwitch = 0;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Se resuelve cuando la <img> está lista para pintarse, o a los IMAGE_WAIT_MS. */
export function whenImageReady(img) {
  if (!img.getAttribute('src') || img.complete) return Promise.resolve();
  return Promise.race([img.decode().catch(() => {}), wait(IMAGE_WAIT_MS)]);
}

/** product-card: avisa que una <img> visible cambió de src por Iluminar. */
export function trackThemeImage(img) {
  if (!img.getAttribute('src') || img.complete) return;
  // Una lazy fuera de la pantalla no carga: no se espera
  const box = img.getBoundingClientRect();
  if (box.bottom < 0 || box.top > innerHeight) return;
  const done = whenImageReady(img).finally(() => pendingImages.delete(done));
  pendingImages.add(done);
}

// Cómo pasa el fondo de un modo al otro (--arq-illumination-style, en prueba):
//   fade    la página entera funde de un modo al otro.
//   spread  el modo nuevo se abre desde el interruptor en un círculo de borde
//           muy difuso, como una luz que se prende en ese lugar. La foto vieja
//           queda quieta debajo (sin fundido) y la nueva se descubre con una
//           máscara radial que crece hasta cubrir la pantalla.
// Feather: parte del radio de la máscara que es borde difuso (0 a 1).
const SPREAD_FEATHER = 0.6;

function spreadFrom(origin, duration, easing) {
  const html = document.documentElement;
  for (const animation of document.getAnimations()) {
    if (animation.effect?.pseudoElement?.startsWith('::view-transition')) animation.cancel();
  }
  // Distancia a la esquina más lejana: el centro sólido de la máscara tiene que llegar ahí
  const far = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
  const size = (2 * far) / (1 - SPREAD_FEATHER);
  const at = (s) => `${origin.x - s / 2}px ${origin.y - s / 2}px`;
  const mask = `radial-gradient(closest-side, #000 ${(1 - SPREAD_FEATHER) * 100}%, transparent 100%)`;
  const timing = { duration, easing, fill: 'both' };
  html.animate(
    {
      maskImage: [mask, mask],
      maskRepeat: ['no-repeat', 'no-repeat'],
      maskSize: ['0px 0px', `${size}px ${size}px`],
      maskPosition: [at(0), at(size)],
      mixBlendMode: ['normal', 'normal'],
    },
    { ...timing, pseudoElement: '::view-transition-new(root)' },
  );
  html.animate({ mixBlendMode: ['normal', 'normal'] }, { ...timing, pseudoElement: '::view-transition-old(root)' });
}

/**
 * Cambia el tema de la página con un fundido de toda la pantalla. `dark` es el
 * modo que deja `apply`: las product-card pasan antes a sus fotos encendidas
 * (o apagadas) y el fondo las sigue. `origin` ({ x, y } en la pantalla) es el
 * interruptor, para --arq-illumination-style: spread.
 */
export async function switchTheme(dark, apply, origin) {
  const html = document.documentElement;
  const styles = getComputedStyle(html);
  const duration = Number.parseFloat(styles.getPropertyValue('--arq-illumination-bg-duration')) || 0;
  if (!document.startViewTransition || !duration) {
    animateThemeChange();
    apply();
    return;
  }
  const easing = styles.getPropertyValue('--arq-illumination-bg-easing').trim() || 'ease';
  const style = html.style;
  const id = ++themeSwitch;
  let fadeMs = duration;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Reduced motion: siempre fundido, sin el círculo que crece
  const spread = !reduced && origin && styles.getPropertyValue('--arq-illumination-style').trim() === 'spread';
  // Reduced motion: todo funde junto (DESIGN.md §6), sin adelantar las fotos
  if (!reduced) {
    const lead = Number.parseFloat(styles.getPropertyValue('--arq-motion-duration-illumination-lead')) || 0;
    checkAll(dark); // las cards cambian de foto ya, con su propio fundido
    await Promise.race([Promise.all(pendingImages), wait(THEME_WAIT_MS)]);
    await wait(lead);
    if (id !== themeSwitch) return; // otro clic en Iluminar mientras tanto
    fadeMs = Math.max(duration - lead, 0); // el fondo termina en el mismo momento que sin el adelanto
  }
  const transition = document.startViewTransition(async () => {
    for (const name of INSTANT_VARS) style.setProperty(name, '0s');
    apply();
    await Promise.resolve(); // los componentes reciben el aviso (watchTheme)
    await Promise.race([Promise.all(pendingImages), wait(THEME_WAIT_MS)]);
  });
  transition.ready
    .then(() => {
      if (spread) return spreadFrom(origin, fadeMs, easing);
      for (const animation of document.getAnimations()) {
        if (animation.effect?.pseudoElement?.startsWith('::view-transition')) animation.effect.updateTiming({ duration: fadeMs, easing });
      }
    })
    .catch(() => {});
  transition.finished.finally(() => {
    if (id === themeSwitch) INSTANT_VARS.forEach((name) => style.removeProperty(name));
  });
}
