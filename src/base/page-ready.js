// Qué falta para mostrar una página: imágenes, videos y textos.
// Lo usa arq-preloader con page. Recorre también el Shadow DOM.
//
// - Imagen: tiene src y todavía no disparó load o error (complete).
//   Las lazy se piden ya (loading=eager): si no, las de abajo no cargan
//   mientras la pantalla las tapa y la espera no termina.
// - Video: tiene src (o <source>) y todavía no hay un frame (readyState < 2).
//   Un error no traba la página.
// - Textos: la fuente (document.fonts) y cualquier componente con
//   aria-busy="true" (el listado, la ficha, los destacados). El propio
//   preloader no cuenta.

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

function pendingMedia(el) {
  if (el.localName === 'img') {
    if (!el.getAttribute('src') && !el.currentSrc) return false;
    if (!primed.has(el)) {
      primed.add(el);
      if (el.getAttribute('loading') === 'lazy') el.loading = 'eager';
    }
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
  const busy = [...root.querySelectorAll('[aria-busy="true"]')].filter((el) => el.localName !== 'arq-preloader').length;
  const font = fontsReady ? 0 : 1;
  const total = media.length + 1;
  const done = media.length - pending + (fontsReady ? 1 : 0);
  return { done, total, waiting: pending > 0 || busy > 0 || font > 0 };
}
