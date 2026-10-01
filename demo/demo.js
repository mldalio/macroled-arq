// Demo: registra la librería, adopta roles.css y arma la sección de tokens
// leyendo tokens/tokens.json. Así se actualiza sola cuando crece el JSON.

import '/src/main.js';
import { getRolesSheet } from '/src/styles/roles.js';
import { icon, iconNames } from '/src/base/icons.js';
import './demo-disclosure.js';
import './demo-groups.js';
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
  const label = event.target.querySelector('[slot="label"]')?.textContent.trim();
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
themeInput.checked = saved === 'dark';
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
