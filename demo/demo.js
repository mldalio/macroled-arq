// Demo: registra la librería, adopta roles.css y arma la sección de tokens
// leyendo tokens/tokens.json. Así se actualiza sola cuando crece el JSON.

import '/src/main.js';
import { getRolesSheet } from '/src/styles/roles.js';
import { icon, iconNames } from '/src/base/icons.js';
import './demo-disclosure.js';
import './demo-dark-local.js';
import './demo-groups.js';
import './demo-configurator.js';
import './demo-gallery.js';
import './demo-filters.js';
import './demo-glosario.js';
import './demo-compare.js';
import './demo-navbar.js';
import './demo-nav.js';
import './demo-inspect.js';
import tokens from '/tokens/tokens.json';

document.adoptedStyleSheets = [...document.adoptedStyleSheets, getRolesSheet()];

// ── Íconos ─────────────────────────────────────────────────────────
for (const list of document.querySelectorAll('[data-demo-list^="icons"]')) {
  list.innerHTML = iconNames
    .map((name) => `<figure class="demo-icon">${icon(name)}<figcaption class="role-caption">${name}</figcaption></figure>`)
    .join('');
}

// ── Eventos arq:toggle ─────────────────────────────────────────────
const log = document.querySelector('[data-demo-log]');
document.addEventListener('arq:toggle', (event) => {
  const label = event.target.querySelector('[slot="label"], [slot="question"]')?.textContent.trim();
  log.textContent = `arq:toggle → open: ${event.detail.open} · «${label}»`;
});

// ── Switch Light/Dark ──────────────────────────────────────────────
const THEME_KEY = 'arq:demo-theme';
const themeInput = document.getElementById('demo-theme');

function setTheme(dark) {
  if (dark) document.documentElement.dataset.arqTheme = 'dark';
  else delete document.documentElement.dataset.arqTheme;
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  } catch {}
  refreshValues();
}

themeInput.addEventListener('change', () => setTheme(themeInput.checked));

// Iluminar de catalog-toolbar también cambia <html>: el switch lo sigue.
new MutationObserver(() => {
  themeInput.checked = document.documentElement.dataset.arqTheme === 'dark';
  try {
    localStorage.setItem(THEME_KEY, themeInput.checked ? 'dark' : 'light');
  } catch {}
  refreshValues();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-arq-theme'] });

// ── Tokens ─────────────────────────────────────────────────────────
function flatten(node, path = []) {
  if (node && typeof node === 'object' && '$value' in node) return [{ path, ...node }];
  return Object.entries(node ?? {})
    .filter(([key]) => !key.startsWith('$'))
    .flatMap(([key, child]) => flatten(child, [...path, key]));
}

const all = flatten(tokens);
const cssVar = (path) => `--arq-${path.join('-')}`;
const figmaName = (path) => path.join('/');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Los role/* no son variables: se muestra la clase que genera roles.css.
const roleClass = (path) => `role-${path.slice(1).join('-')}`;

function caption(token, withValue = true) {
  const cap = el('figcaption');
  cap.append(el('span', null, figmaName(token.path)));
  cap.append(el('span', 'demo-meta', withValue ? cssVar(token.path) : `.${roleClass(token.path)}`));
  if (withValue) {
    const value = el('span', 'demo-meta');
    value.dataset.demoValue = cssVar(token.path);
    cap.append(value);
  }
  if (token.$description) cap.append(el('span', 'demo-meta', token.$description));
  return cap;
}

function renderColors(target) {
  for (const token of all.filter((t) => t.$type === 'color')) {
    const fig = el('figure', 'demo-token');
    const swatch = el('div', 'demo-swatch');
    swatch.style.background = `var(${cssVar(token.path)})`;
    fig.append(swatch, caption(token));
    target.append(fig);
  }
}

function renderRoles(target) {
  for (const token of all.filter((t) => t.$type === 'typography')) {
    const fig = el('figure', 'demo-token');
    const sample = el('p', `demo-sample ${roleClass(token.path)}`,
      'Iluminación arquitectónica para espacios que se habitan.');
    fig.append(sample, caption(token, false));
    target.append(fig);
  }
}

function renderDimensions(target) {
  const spaces = all.filter((t) => t.$type === 'dimension' && ['space', 'layout'].includes(t.path[0]));
  for (const token of spaces) {
    const fig = el('figure', 'demo-token');
    const bar = el('div', 'demo-bar');
    bar.style.width = `var(${cssVar(token.path)})`;
    fig.append(bar, caption(token));
    target.append(fig);
  }
}

// Valor resuelto de cada variable (cambia con el tema y el breakpoint).
function refreshValues() {
  const styles = getComputedStyle(document.documentElement);
  for (const node of document.querySelectorAll('[data-demo-value]')) {
    node.textContent = styles.getPropertyValue(node.dataset.demoValue).trim() || 'sin valor';
  }
}

renderColors(document.querySelector('[data-demo-list="color"]'));
renderRoles(document.querySelector('[data-demo-list="role"]'));
renderDimensions(document.querySelector('[data-demo-list="dimension"]'));

let saved = null;
try {
  saved = localStorage.getItem(THEME_KEY);
} catch {}
// Sin preferencia de la demo, se respeta lo que ya puso Iluminar (arq:theme).
themeInput.checked = saved ? saved === 'dark' : document.documentElement.dataset.arqTheme === 'dark';
setTheme(themeInput.checked);

matchMedia('(max-width: 767px)').addEventListener('change', refreshValues);

// ── button: clics ──────────────────────────────────────────────────
const buttonLog = document.querySelector('[data-demo-button-log]');
document.addEventListener('click', (event) => {
  const button = event.target.closest?.('arq-button');
  if (!button) return;
  if (button.getAttribute('href')?.startsWith('#')) event.preventDefault();
  buttonLog.textContent = `Clic → «${button.textContent.trim()}»`;
});

// ── filter-chip: al tocarlo se quita y el foco pasa al siguiente ──
document.addEventListener('click', (event) => {
  const chip = event.target.closest?.('[data-demo-chips] arq-filter-chip');
  if (!chip) return;
  const next = chip.nextElementSibling ?? chip.previousElementSibling;
  chip.remove();
  next?.focus();
});

// ── select-option y gallery-thumb: elegir una (como lo harán select-menu y product-gallery)
document.addEventListener('arq:change', (event) => {
  const option = event.target.closest?.('arq-select-option');
  if (!option) return;
  for (const o of option.parentElement.querySelectorAll('arq-select-option')) o.selected = o === option;
});
document.addEventListener('click', (event) => {
  const thumb = event.target.closest?.('[data-demo-thumbs] arq-gallery-thumb');
  if (!thumb) return;
  for (const t of thumb.parentElement.querySelectorAll('arq-gallery-thumb')) t.selected = t === thumb;
});

// ── Formulario de prueba: muestra lo que manda (FormData) y restablece ──
for (const form of document.querySelectorAll('[data-demo-form]')) {
  const output = form.querySelector('[data-demo-output]');
  form.addEventListener('submit', (event) => event.preventDefault());
  form.querySelector('[data-demo-show]')?.addEventListener('click', () => {
    const data = [...new FormData(form)].map(([k, v]) => `${k}=${v instanceof File ? v.name : v}`);
    output.textContent = data.length ? data.join(' · ') : '(vacío)';
  });
  form.querySelector('[data-demo-reset]')?.addEventListener('click', () => {
    form.reset();
    output.textContent = 'Restablecido';
  });
}

// ── input: validación nativa del formulario de prueba ──
for (const button of document.querySelectorAll('[data-demo-validate]')) {
  button.addEventListener('click', () => {
    const form = button.closest('form');
    const output = form.querySelector('[data-demo-output]');
    const invalid = [...form.querySelectorAll('arq-input')].filter((i) => !i.checkValidity());
    output.textContent = invalid.length ? `Inválidos: ${invalid.map((i) => i.getAttribute('name')).join(', ')}` : 'Todo válido';
  });
}

// ── file-upload: adjuntar un archivo de ejemplo (como si se soltara en la zona) ──
const demoDrop = (upload, file) => {
  const data = new DataTransfer();
  data.items.add(file);
  upload.shadowRoot.querySelector('.zone').dispatchEvent(new DragEvent('drop', { dataTransfer: data, bubbles: true }));
};
document.querySelector('[data-demo-attach]')?.addEventListener('click', () => {
  demoDrop(document.querySelector('[data-demo-upload]'), new File(['%PDF'], 'planta-arquitectura.pdf', { type: 'application/pdf' }));
});
document.querySelector('[data-demo-bad]')?.addEventListener('click', () => {
  demoDrop(document.querySelector('[data-demo-upload]'), new File(['x'], 'presupuesto.xlsx'));
});
document.querySelector('[data-demo-heavy]')?.addEventListener('click', () => {
  // 11 MB: supera max-size (10).
  demoDrop(document.querySelector('[data-demo-upload]'), new File([new Uint8Array(11 * 1024 * 1024)], 'render-alta.png'));
});
// Drag over: se simula entrar con un archivo y se sale a los 2 s.
document.querySelector('[data-demo-dragover]')?.addEventListener('click', () => {
  const zone = document.querySelector('[data-demo-upload]').shadowRoot.querySelector('.zone');
  zone.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true }));
  setTimeout(() => zone.dispatchEvent(new DragEvent('dragleave', { bubbles: true })), 2000);
});
const darkUpload = document.querySelector('[data-demo-upload-dark]');
const darkUploadError = document.querySelector('[data-demo-upload-dark-error]');
customElements.whenDefined('arq-file-upload').then(() => {
  if (darkUpload) demoDrop(darkUpload, new File(['%PDF'], 'plano-con-un-nombre-de-archivo-muy-largo-para-ver-como-se-corta.pdf'));
  if (darkUploadError) demoDrop(darkUploadError, new File(['x'], 'presupuesto.xlsx'));
});

// ── sku: falla del portapapeles (solo la próxima copia de ese sku) ──
document.querySelector('[data-demo-clipboard-fail]')?.addEventListener('click', () => {
  const sku = document.querySelector('[data-demo-sku-fail]');
  const clipboard = navigator.clipboard;
  const original = clipboard?.writeText;
  if (!clipboard || !original) return sku.copy();
  clipboard.writeText = () => Promise.reject(new Error('Falla simulada (demo)'));
  sku.copy().finally(() => {
    clipboard.writeText = original;
  });
});

// ── nav-link: el navbar de prueba abre y cierra el dropdown ──
document.addEventListener('arq:toggle', (event) => {
  const link = event.target.closest?.('[data-demo-dropdown]');
  if (link) link.open = event.detail.open;
});

// ── cta-block: arq:submit de la newsletter ──
document.addEventListener('arq:submit', (event) => {
  const log = document.querySelector('[data-demo-cta-log]');
  if (log && event.target.localName === 'arq-cta-block') log.textContent = `arq:submit → email: ${event.detail.email}`;
});
