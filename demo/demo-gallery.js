// product-gallery de prueba (solo demo, no entra al build): carga las imágenes
// por JS, como lo va a hacer src/data/ en la ficha, y un toggle "Iluminar" que
// pone data-arq-theme="dark" en su bloque (como el hero de la ficha).
//
//   <arq-product-gallery data-demo-images="5">…</arq-product-gallery>
//   <div data-demo-iluminar> <arq-toggle>Iluminar</arq-toggle> … </div>

const IMG = '/demo/fixtures/img/';
const BASE = [
  { src: `${IMG}producto-1.svg`, srcOn: `${IMG}producto-1-on.svg`, alt: 'Kanu Jardín, estudio' },
  { src: `${IMG}producto-2.svg`, srcOn: `${IMG}producto-2-on.svg`, alt: 'Kanu Jardín en un jardín' },
  { src: `${IMG}producto-3.svg`, alt: 'Kanu Jardín, perspectiva' },
];

function images(count) {
  return Array.from({ length: count }, (_, i) => {
    const image = BASE[i % BASE.length];
    return { ...image, alt: i < BASE.length ? image.alt : `${image.alt} (${i + 1})` };
  });
}

for (const gallery of document.querySelectorAll('arq-product-gallery[data-demo-images]')) {
  gallery.images = images(Number(gallery.dataset.demoImages));
}

// product-card: registro de Comparar
const compareLog = document.querySelector('[data-demo-compare-log]');
document.addEventListener('arq:compare', (event) => {
  if (compareLog) compareLog.textContent = `arq:compare → ${event.detail.checked ? 'agregar' : 'quitar'} «${event.target.querySelector('[slot=name]')?.textContent}»`;
});

for (const block of document.querySelectorAll('[data-demo-iluminar]')) {
  block.querySelector('arq-toggle')?.addEventListener('arq:change', (event) => {
    if (event.detail.checked) block.setAttribute('data-arq-theme', 'dark');
    else block.removeAttribute('data-arq-theme');
  });
}
