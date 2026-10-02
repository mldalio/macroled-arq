// Navegación de la demo (no entra al build):
// - Índice: se arma solo con las secciones .demo-section de la página,
//   agrupadas según GROUPS. Una sección que no está en GROUPS aparece en
//   "Otros", así nunca queda afuera. Buscador y sección actual marcada.
// - Lugar: la sección actual va en la URL (#demo-…) y el scroll se guarda en
//   sessionStorage: al recargar (Vite recarga al guardar) se vuelve ahí.
// - Ancho: botón 390 que muestra la demo en un iframe de 390 px, para revisar
//   Mobile sin las herramientas del navegador.

const GROUPS = [
  ['Fundamentos', ['colors', 'roles', 'spaces', 'icons', 'base']],
  ['Acciones y navegación', ['button', 'icon-button', 'count-badge', 'divider', 'logo', 'breadcrumb', 'nav-link', 'tab', 'footer-link', 'carousel-controls']],
  ['Formularios', ['input', 'checkbox', 'toggle', 'choice-chip', 'file-upload', 'form-message', 'form-section-header']],
  ['Producto y filtros', ['option-tile', 'swatch', 'swatch-picker', 'option-group', 'select-option', 'sku', 'gallery-thumb', 'product-gallery', 'spec-row', 'spec-list', 'accordion-item', 'filter-chip']],
  ['Listados', ['catalog-nav-item', 'catalog-nav', 'catalog-toolbar', 'product-card', 'filter-row', 'filter-panel']],
  ['Bloques y tarjetas', ['section-header', 'page-header', 'hero', 'feature-block', 'category-card', 'line-card', 'faq-item', 'cta-block', 'footer']],
];

const SCROLL_KEY = 'arq:demo-scroll';
const embedded = new URLSearchParams(location.search).has('embed');
const header = document.querySelector('.demo-header');
const sections = [...document.querySelectorAll('.demo-section')].map((section) => {
  const id = section.getAttribute('aria-labelledby');
  const title = document.getElementById(id)?.textContent.split('·')[0].trim() ?? id;
  return { section, id, key: id.replace(/^demo-/, ''), title };
});

if (embedded) {
  document.documentElement.classList.add('demo-embedded');
  // El switch Dark de la página de afuera: llega por localStorage
  addEventListener('storage', (event) => {
    const input = document.getElementById('demo-theme');
    if (event.key !== 'arq:demo-theme' || !input) return;
    const dark = event.newValue === 'dark';
    if (input.checked !== dark) {
      input.checked = dark;
      input.dispatchEvent(new Event('change'));
    }
  });
} else buildNav();
keepBelowHeader();
restorePlace();
trackPlace();

// ── Índice, sección actual y ancho ─────────────────────────────────
function buildNav() {
  const controls = document.createElement('div');
  controls.className = 'demo-controls';
  controls.innerHTML =
    `<button type="button" class="demo-tool" data-demo-index-toggle aria-expanded="false" aria-controls="demo-index">Índice</button>` +
    `<span class="demo-current role-body-sm" data-demo-current></span>` +
    `<button type="button" class="demo-tool" data-demo-width aria-pressed="false">Ver a 390</button>`;
  header.prepend(controls);

  const known = new Set(GROUPS.flatMap(([, keys]) => keys));
  const others = sections.filter((s) => !known.has(s.key)).map((s) => s.key);
  const groups = others.length ? [...GROUPS, ['Otros', others]] : GROUPS;
  const byKey = new Map(sections.map((s) => [s.key, s]));

  const nav = document.createElement('nav');
  nav.className = 'demo-index';
  nav.id = 'demo-index';
  nav.setAttribute('aria-label', 'Índice de la demo');
  nav.hidden = true;
  nav.innerHTML =
    `<label class="demo-index-search role-body-sm">Buscar<input type="search" data-demo-search placeholder="nombre del componente"></label>` +
    groups
      .map(([title, keys]) => {
        const items = keys
          .filter((key) => byKey.has(key))
          .map((key) => `<li><a href="#${byKey.get(key).id}" data-demo-link="${key}">${byKey.get(key).title}</a></li>`)
          .join('');
        return items ? `<section class="demo-index-group"><h2 class="role-label">${title}</h2><ul>${items}</ul></section>` : '';
      })
      .join('');
  document.body.append(nav);

  const toggle = controls.querySelector('[data-demo-index-toggle]');
  const search = nav.querySelector('[data-demo-search]');
  const open = (value) => {
    nav.style.top = `${header.getBoundingClientRect().bottom}px`;
    nav.hidden = !value;
    toggle.setAttribute('aria-expanded', String(value));
    if (value) search.focus();
  };
  toggle.addEventListener('click', () => open(nav.hidden));
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      open(false);
      toggle.focus();
    }
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) open(false);
  });

  // Buscador: filtra los links; Enter va al primero que queda
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    for (const link of nav.querySelectorAll('[data-demo-link]')) {
      link.closest('li').hidden = Boolean(q) && !link.textContent.toLowerCase().includes(q);
    }
    for (const group of nav.querySelectorAll('.demo-index-group')) {
      group.hidden = ![...group.querySelectorAll('li')].some((li) => !li.hidden);
    }
  });
  search.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const first = [...nav.querySelectorAll('li:not([hidden]) a')][0];
    if (first) {
      first.click();
      location.hash = first.getAttribute('href');
    }
  });

  controls.querySelector('[data-demo-width]').addEventListener('click', toggleFrame);
}

// Al saltar a una sección (índice, #hash), su título no queda debajo del
// encabezado fijo: margen de scroll igual al alto del encabezado.
function keepBelowHeader() {
  const sync = () => {
    const offset = embedded ? '0px' : `${header.getBoundingClientRect().height}px`;
    for (const { section, id } of sections) {
      section.style.scrollMarginTop = offset;
      const title = document.getElementById(id);
      if (title) title.style.scrollMarginTop = offset;
    }
  };
  sync();
  new ResizeObserver(sync).observe(header);
}

// ── Ver a 390: la misma demo en un iframe angosto ─────────────────
function toggleFrame(event) {
  const button = event.currentTarget;
  const existing = document.querySelector('.demo-frame');
  if (existing) {
    existing.remove();
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Ver a 390';
    document.documentElement.classList.remove('demo-framed');
    return;
  }
  const frame = document.createElement('div');
  frame.className = 'demo-frame';
  frame.style.top = `${header.getBoundingClientRect().bottom}px`;
  const iframe = document.createElement('iframe');
  iframe.title = 'Demo a 390 px';
  iframe.width = '390';
  iframe.src = `${location.pathname}?embed${location.hash}`;
  frame.append(iframe);
  document.body.append(frame);
  button.setAttribute('aria-pressed', 'true');
  button.textContent = 'Volver al ancho completo';
  document.documentElement.classList.add('demo-framed');
}

// ── Sección actual y lugar al recargar ────────────────────────────
function trackPlace() {
  const current = document.querySelector('[data-demo-current]');
  const visible = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
      const active = sections.find((s) => visible.get(s.section));
      if (!active) return;
      if (current) current.textContent = active.title;
      for (const link of document.querySelectorAll('[data-demo-link]')) {
        if (link.dataset.demoLink === active.key) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
      if (location.hash !== `#${active.id}`) history.replaceState(null, '', `${location.search}#${active.id}`);
    },
    // Cuenta como actual la sección que cruza la franja de arriba de la
    // pantalla, justo debajo del encabezado fijo
    { rootMargin: `-${embedded ? 0 : Math.round(header.getBoundingClientRect().height) + 1}px 0px -75% 0px` },
  );
  for (const { section } of sections) observer.observe(section);

  let queued = false;
  addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        try {
          sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ path: location.pathname + location.search, y: scrollY }));
        } catch {}
      });
    },
    { passive: true },
  );
}

// Al recargar: vuelve al scroll guardado, o a la sección de la URL. Espera a
// que los componentes y la fuente estén listos (cambian los altos).
async function restorePlace() {
  history.scrollRestoration = 'manual';
  let saved = null;
  try {
    saved = JSON.parse(sessionStorage.getItem(SCROLL_KEY));
  } catch {}
  await document.fonts.ready;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (saved && saved.path === location.pathname + location.search) scrollTo(0, saved.y);
  else if (location.hash) document.querySelector(location.hash)?.closest('.demo-section')?.scrollIntoView();
}
