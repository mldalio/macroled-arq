// Inspector de la demo (no entra al build). Alt + clic sobre cualquier texto
// o elemento: muestra qué elemento lo dibuja de verdad, aunque esté dentro de
// un Shadow DOM o llegue por slot, con su estilo role/* y de qué regla y token
// sale cada valor de texto. Esc o clic afuera lo cierra.
//
// Por qué existe: DevTools muestra los estilos del host (<arq-button>), que
// hereda de la página (p. ej. 16 px del body), y no los del elemento interno
// que dibuja el texto. El texto por slot hereda del contenedor del <slot>.
//
// El origen de cada valor es aproximado: toma la última regla que coincide
// (no calcula especificidad). El valor calculado sí es el real.

const PROPS = ['font-size', 'line-height', 'font-weight', 'letter-spacing', 'color'];

// ── Árbol aplanado (flat tree) ──────────────────────────────────────────

// Padre en el árbol que se dibuja: el slot si el nodo está asignado a uno; el
// host si el nodo está en la raíz de un Shadow DOM.
function flatParent(node) {
  if (node.assignedSlot) return node.assignedSlot;
  const parent = node.parentNode;
  if (parent instanceof ShadowRoot) return parent.host;
  return parent instanceof Element ? parent : null;
}

function* flatAncestors(el) {
  for (let node = el; node; node = flatParent(node)) yield node;
}

// Texto o elemento bajo el cursor, entrando en los Shadow DOM abiertos.
function hitTarget(event) {
  const path = event.composedPath();
  const shadowRoots = path.filter((n) => n instanceof Element && n.shadowRoot).map((n) => n.shadowRoot);
  let node = null;
  if (document.caretPositionFromPoint) {
    node = document.caretPositionFromPoint(event.clientX, event.clientY, { shadowRoots })?.offsetNode;
  } else if (document.caretRangeFromPoint) {
    node = document.caretRangeFromPoint(event.clientX, event.clientY)?.startContainer;
  }
  // El caret devuelve el texto más cercano: solo vale si está bajo el cursor
  if (node?.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const hit = [...range.getClientRects()].some(
      (r) => event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom,
    );
    if (hit) return { text: node, el: flatParent(node), rect: range.getBoundingClientRect() };
  }
  const el = path.find((n) => n instanceof Element);
  return { text: null, el, rect: el.getBoundingClientRect() };
}

// ── Reglas que coinciden ────────────────────────────────────────────────

function sheetsOf(root) {
  const own = root === document ? [...document.styleSheets] : [...root.styleSheets];
  return [...root.adoptedStyleSheets, ...own];
}

function* styleRules(rules) {
  for (const rule of rules) {
    if (rule instanceof CSSStyleRule) yield rule;
    else if (rule instanceof CSSMediaRule) {
      if (matchMedia(rule.conditionText).matches) yield* styleRules(rule.cssRules);
    } else if (rule.cssRules) yield* styleRules(rule.cssRules);
  }
}

function rulesOf(root) {
  const out = [];
  for (const sheet of sheetsOf(root)) {
    try {
      out.push(...styleRules(sheet.cssRules));
    } catch {
      // Hoja de otro origen (Google Fonts): no se puede leer
    }
  }
  return out;
}

// Separa "a, b" respetando paréntesis (:is(a, b), ::slotted(a, b) no aplica)
function splitSelectors(text) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') depth--;
    else if (text[i] === ',' && depth === 0) {
      out.push(text.slice(start, i));
      start = i + 1;
    }
  }
  out.push(text.slice(start));
  return out.map((s) => s.trim());
}

function safeMatches(el, selector) {
  try {
    return el.matches(selector);
  } catch {
    return false;
  }
}

// ¿El selector, escrito en la hoja de `root`, alcanza a `el`?
function selectorMatches(el, selector, root) {
  const slotted = selector.match(/^(.*?)::slotted\((.*)\)$/);
  if (slotted) {
    const slot = el.assignedSlot;
    if (!slot || slot.getRootNode() !== root) return false;
    const [, prefix, inner] = slotted;
    const slotSelector = !prefix ? 'slot' : /\s$/.test(prefix) ? `${prefix}slot` : `slot${prefix}`;
    return safeMatches(el, inner) && safeMatches(slot, slotSelector);
  }
  const host = selector.match(/^:host(?:\((.*)\))?$/);
  if (host) return el.shadowRoot === root && safeMatches(el, host[1] || '*');
  return el.getRootNode() === root && safeMatches(el, selector);
}

// Raíces cuyas hojas pueden aplicarle reglas a `el`
function rootsFor(el) {
  const roots = new Set([el.getRootNode()]);
  if (el.shadowRoot) roots.add(el.shadowRoot);
  if (el.assignedSlot) roots.add(el.assignedSlot.getRootNode());
  return roots;
}

// Última declaración de `prop` que alcanza a `el` (con !important primero)
function declarationFor(el, prop) {
  if (el.style?.getPropertyValue(prop)) return { value: el.style.getPropertyValue(prop), selector: 'style=""' };
  let found = null;
  for (const root of rootsFor(el)) {
    for (const rule of rulesOf(root)) {
      const value = rule.style.getPropertyValue(prop);
      if (!value) continue;
      const important = rule.style.getPropertyPriority(prop) === 'important';
      if (found?.important && !important) continue;
      const selector = splitSelectors(rule.selectorText).find((s) => selectorMatches(el, s, root));
      if (selector) found = { value, selector, important };
    }
  }
  return found;
}

// Sube por el árbol aplanado hasta la primera regla que declara `prop`.
// `inherit` (p. ej. ::slotted(h2) { font-size: inherit }) sigue subiendo.
function originOf(el, prop) {
  const via = [];
  for (const node of flatAncestors(el)) {
    const decl = declarationFor(node, prop);
    if (decl?.value.trim() === 'inherit') {
      via.push(decl.selector);
      continue;
    }
    if (decl) return { ...decl, el: node, inherited: node !== el, via };
  }
  return via.length ? { value: 'inherit', selector: via[0], el, inherited: false, via: [], open: true } : null;
}

// ── Panel ───────────────────────────────────────────────────────────────

function label(el) {
  const classes = [...el.classList].slice(0, 3).map((c) => `.${c}`).join('');
  return `${el.localName}${el.id ? `#${el.id}` : ''}${classes}`;
}

// Hosts desde afuera hacia adentro: arq-feature-block › arq-button › a.control
function pathOf(el) {
  const chain = [];
  for (const node of flatAncestors(el)) {
    if (node === el || node.shadowRoot) chain.unshift(label(node));
  }
  return chain.join(' › ');
}

function roleOf(el) {
  for (const node of flatAncestors(el)) {
    const role = [...node.classList].find((c) => c.startsWith('role-'));
    if (role) return { role, el: node };
  }
  return null;
}

function resolveVars(value, el) {
  const style = getComputedStyle(el);
  return value.replace(/var\((--[\w-]+)[^)]*\)/g, (match, name) => {
    const resolved = style.getPropertyValue(name).trim();
    return resolved ? `${match} = ${resolved}` : `${match} = (sin valor)`;
  });
}

const escape = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const PANEL_CSS = `
  :host { all: initial; }
  .box {
    position: fixed;
    pointer-events: none;
    outline: var(--arq-border-strong) dashed var(--arq-color-border-focus);
  }
  .panel {
    position: fixed;
    box-sizing: border-box;
    width: min(var(--arq-layout-filter-panel), calc(100vw - 2 * var(--arq-layout-gutter)));
    max-height: calc(100vh - 2 * var(--arq-space-padding-md));
    overflow: auto;
    padding: var(--arq-space-padding-md);
    border: var(--arq-border-default) solid var(--arq-color-border-strong);
    background: var(--arq-color-surface-default);
    color: var(--arq-color-text-primary);
    font-family: var(--arq-font-family-sans);
    font-size: var(--arq-type-body-sm-size);
    line-height: var(--arq-type-body-sm-leading);
  }
  .path { margin: 0 0 var(--arq-space-gap-sm); font-weight: var(--arq-font-weight-semibold); overflow-wrap: anywhere; }
  .meta { margin: 0 0 var(--arq-space-gap-md); color: var(--arq-color-text-tertiary); }
  dl { display: grid; grid-template-columns: auto 1fr; gap: var(--arq-space-gap-xs) var(--arq-space-gap-md); margin: 0; }
  dt { color: var(--arq-color-text-tertiary); }
  dd { margin: 0; overflow-wrap: anywhere; }
  .value { font-weight: var(--arq-font-weight-semibold); }
  .from { display: block; color: var(--arq-color-text-secondary); }
  .warn { color: var(--arq-color-text-warning); }
`;

let panelHost = null;

function close() {
  panelHost?.remove();
  panelHost = null;
}

function show(event) {
  const { text, el, rect } = hitTarget(event);
  // El <slot> no se dibuja (display: contents): se muestra su contenedor
  const styleEl = [...flatAncestors(el)].find((node) => node.localName !== 'slot') ?? el;
  const computed = getComputedStyle(styleEl);
  const role = roleOf(styleEl);

  const rows = PROPS.map((prop) => {
    const origin = originOf(styleEl, prop);
    let from;
    if (!origin || origin.open) {
      const pageNote = 'Sin regla: hereda de la página (valor del navegador)';
      from = `<span class="warn">${origin ? `${escape(origin.selector)} → inherit · ` : ''}${pageNote}</span>`;
    } else {
      const where = origin.inherited ? `heredado de ${escape(label(origin.el))}` : 'propio';
      const via = origin.via.length ? ` (vía ${escape(origin.via.join(', '))} → inherit)` : '';
      from = `${escape(origin.selector)} · ${where}${via}<br>${escape(resolveVars(origin.value, origin.el))}`;
    }
    return `<dt>${prop}</dt><dd><span class="value">${escape(computed.getPropertyValue(prop))}</span><span class="from">${from}</span></dd>`;
  }).join('');

  const roleRow = role
    ? `<dt>role</dt><dd><span class="value">${role.role}</span><span class="from">en ${escape(label(role.el))}</span></dd>`
    : '<dt>role</dt><dd><span class="warn">Sin estilo role/*</span></dd>';

  close();
  panelHost = document.createElement('div');
  panelHost.dataset.arqDemoInspect = '';
  const root = panelHost.attachShadow({ mode: 'open' });
  root.innerHTML =
    `<style>${PANEL_CSS}</style>` +
    `<div class="box" style="left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px"></div>` +
    `<div class="panel" role="dialog" aria-label="Inspector">` +
    `<p class="path">${escape(pathOf(styleEl))}</p>` +
    `<p class="meta">${text ? `Texto «${escape(text.textContent.trim().slice(0, 40))}» · ` : ''}` +
    `${Math.round(rect.width * 100) / 100} × ${Math.round(rect.height * 100) / 100}</p>` +
    `<dl>${roleRow}${rows}</dl></div>`;
  document.body.append(panelHost);

  // Al lado del clic, sin salirse de la pantalla
  const panel = root.querySelector('.panel');
  const { width, height } = panel.getBoundingClientRect();
  const gap = 12;
  const x = Math.min(event.clientX + gap, innerWidth - width - gap);
  const y = event.clientY + gap + height > innerHeight ? Math.max(gap, event.clientY - gap - height) : event.clientY + gap;
  panel.style.left = `${Math.max(gap, x)}px`;
  panel.style.top = `${y}px`;

  console.log('[inspector]', { elemento: styleEl, texto: text, role: role?.role });
}

// Captura: se adelanta a los componentes y evita que el link navegue o que
// Chrome descargue el destino (Alt + clic en un link).
document.addEventListener(
  'click',
  (event) => {
    if (event.altKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
      show(event);
    } else if (panelHost && !event.composedPath().includes(panelHost)) {
      close();
    }
  },
  true,
);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') close();
});
addEventListener('scroll', close, { passive: true });
