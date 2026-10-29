// Qué falta para mostrar una página: lo que se ve al abrir.
// Lo usa arq-preloader con page. Recorre también el Shadow DOM.
//
// - Imagen con src que no es loading="lazy" y todavía no disparó load o error.
//   Las lazy no traban: son las de más abajo y cargan al acercarse.
// - Video con src que todavía no tiene un frame (readyState < 2). Uno
//   decorativo (aria-hidden, el banner de la Home o una foto de un menú
//   cerrado) no traba. Un error no traba.
// - Textos: la fuente (document.fonts) y un componente con aria-busy="true"
//   (listado, ficha, colección, comparativa, descargas). Los destacados de la
//   Home no: tienen cards de carga y el catálogo puede tardar. El preloader
//   no cuenta.

const primed = new WeakSet();

let fontsReady = !document.fonts;
document.fonts?.ready.then(
  () => {
    fontsReady = true;
  },
  () => {
    fontsReady = true;
  },
);

function walk(node, found) {
  if (node.nodeType !== Node.ELEMENT_NODE || node.localName === 'arq-preloader') return;
  if (node.localName === 'img' || node.localName === 'video') found.push(node);
  if (node.shadowRoot) {
    for (const child of node.shadowRoot.children) walk(child, found);
  }
  for (const child of node.children) walk(child, found);
}

function concealed(el) {
  for (let node = el; node && node.nodeType === Node.ELEMENT_NODE && node !== document.body; node = node.parentElement || node.getRootNode()?.host) {
    if (node.getAttribute('aria-hidden') === 'true') return true;
  }
  return false;
}

function pendingMedia(el) {
  if (concealed(el)) return false;
  if (el.localName === 'img') {
    if (!el.getAttribute('src') && !el.currentSrc) return false;
    if (el.getAttribute('loading') === 'lazy') return false;
    return !el.complete;
  }
  const src = el.getAttribute('src') || el.querySelector('source[src]')?.getAttribute('src');
  if (!src && !el.currentSrc) return false;
  if (el.error) return false;
  if (!primed.has(el)) {
    primed.add(el);
    if (el.preload !== 'auto') el.preload = 'auto';
    if (el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) el.load();
  }
  return el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA;
}

/** { done, total, waiting } de la página. waiting: todavía no se puede mostrar. */
export function pageProgress(root = document.body) {
  const media = [];
  for (const child of root.children) walk(child, media);
  const pending = media.filter(pendingMedia).length;
  const busy = [...root.querySelectorAll('[aria-busy="true"]')].filter(
    (el) => el.localName !== 'arq-preloader' && el.localName !== 'arq-featured-products',
  ).length;
  const font = fontsReady ? 0 : 1;
  const total = media.length + 1;
  const done = media.length - pending + (fontsReady ? 1 : 0);
  return { done, total, waiting: pending > 0 || busy > 0 || font > 0 };
}
