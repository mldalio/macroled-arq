// mega-menu · Figma 841:2282 · frames 2295:23636 · 2295:23691 · 2295:23730 ·
// ficha doc/mega-menu (1446:7723)
//
// Mega menú de Productos (desktop). Lo abre el nav-link "Productos" del
// navbar y va debajo de la barra, a todo el ancho.
//
//   <arq-mega-menu></arq-mega-menu>
//   menu.navigation = await getNavigation();   // src/data/catalog.js
//
// - Un solo componente: pestañas, columnas, links y "Ver todo…" salen de los
//   datos. Tres pestañas: Por espacio (Interior · Exterior), Lámparas y
//   artefactos (Lámparas · Artefactos), y Colecciones (cuatro columnas de
//   mega-link con bajada). Una pestaña sin columnas no se muestra.
// - Tab es la prop tab (por-espacio · lamparas-y-artefactos · colecciones).
//   Tablist con tab + SingleSelect: ← → cambian de pestaña, Inicio / Fin.
// - Preview a la derecha (frame "imagen · preview hover"): la foto del link
//   con el mouse encima o con el foco, con eyebrow (role/label) y nombre
//   (role/heading-2) sobre la foto. Al cambiar de pestaña muestra el primer
//   link. Ancho layout/mega-menu-image, ratio/portrait-soft como mínimo; si
//   el contenido es más alto, la foto se estira. Sin foto, color/surface/subtle.
//   Si la foto del link no carga, prueba sus fallbacks en orden (fotos de
//   productos de la categoría); si ninguna carga, color/surface/subtle.
//   La prop images ({ pestaña: url }) pisa la foto inicial de cada pestaña.
// - El panel no se abre ni se cierra solo: lo muestra el navbar (atributo
//   hidden en el host). Al abrirlo, el navbar llama a reset(): vuelve a la
//   primera pestaña y al preview de su primer link.
// - La línea inferior va solo debajo de las columnas: la foto llega al borde.

import { ArqElement } from '../../base/arq-element.js';
import { SingleSelect } from '../../base/single-select.js';
import '../tab/tab.js';
import '../mega-link/mega-link.js';
import '../button/button.js';
import css from './mega-menu.css?inline';

const esc = (text) => String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const TABS = [
  { id: 'por-espacio', label: 'Por espacio' },
  { id: 'lamparas-y-artefactos', label: 'Lámparas y artefactos' },
  { id: 'colecciones', label: 'Colecciones' },
];
const COLLECTION_COLUMNS = 4;
let uid = 0;

class ArqMegaMenu extends ArqElement {
  static tag = 'arq-mega-menu';
  static styles = css;
  static properties = {
    tab: { type: String, values: TABS.map((t) => t.id), default: 'por-espacio' }, // Tab
    label: { type: String, default: 'Productos' }, // nombre del tablist
  };
  static template =
    `<div class="menu">` +
    `<div class="tabs" role="tablist"></div>` +
    `<div class="body">` +
    `<div class="panels"></div>` +
    `<div class="preview" aria-hidden="true">` +
    `<img alt="" hidden>` +
    `<div class="caption">` +
    `<p class="eyebrow role-label"></p>` +
    `<p class="preview-title role-heading-2"></p>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>`;

  #navigation = null;
  #images = {};
  #fallbacks = []; // fotos de respaldo que le quedan al preview actual
  #id = ++uid;

  /** Árbol de navegación de src/data/catalog.js (getNavigation). */
  get navigation() {
    return this.#navigation;
  }

  set navigation(value) {
    this.#navigation = value;
    if (this.shadowRoot.querySelector('.tabs')) this.#render();
  }

  /** Foto inicial por pestaña: { 'por-espacio': url, 'lamparas-y-artefactos': url, colecciones: url }. */
  get images() {
    return this.#images;
  }

  set images(value) {
    this.#images = value ?? {};
    if (this.shadowRoot.querySelector('.tabs')) this.#resetPreview();
  }

  /** Al abrir: primera pestaña y preview de su primer link (Por espacio → Embutir). */
  reset() {
    const first = this.shadowRoot.querySelector('arq-tab')?.value;
    if (first && first !== this.tab) this.tab = first; // update() reinicia el preview
    else if (this.shadowRoot.querySelector('.tabs')) this.#resetPreview();
  }

  setup() {
    const root = this.shadowRoot;
    const tabs = root.querySelector('.tabs');
    this.select = new SingleSelect(tabs, { items: 'arq-tab' });
    tabs.addEventListener('arq:change', (event) => {
      event.stopPropagation();
      this.tab = event.detail.value;
    });
    const img = root.querySelector('.preview img');
    img.addEventListener('load', () => (img.hidden = false));
    img.addEventListener('error', () => {
      const next = this.#fallbacks.shift();
      if (next) img.src = next;
      else img.hidden = true;
    });
    // Preview: el link con el mouse encima o con el foco
    const panels = root.querySelector('.panels');
    const onLink = (event) => {
      const link = event.target.closest?.('arq-mega-link');
      if (link) this.#showPreview(link);
    };
    panels.addEventListener('pointerover', onLink);
    panels.addEventListener('focusin', onLink);
    this.#render();
  }

  update(changed) {
    const root = this.shadowRoot;
    if (changed.has('label')) root.querySelector('.tabs').setAttribute('aria-label', this.label ?? '');
    if (changed.has('tab')) {
      for (const tab of root.querySelectorAll('arq-tab')) tab.selected = tab.value === this.tab;
      for (const panel of root.querySelectorAll('[role="tabpanel"]')) panel.hidden = panel.dataset.tab !== this.tab;
      this.#resetPreview();
    }
  }

  #columns(tab) {
    const s = this.#navigation?.sections ?? {};
    if (tab === 'por-espacio') return [s.interior, s.exterior].filter(Boolean);
    if (tab === 'lamparas-y-artefactos') return [s.lamparas, s.artefactos].filter(Boolean);
    return [];
  }

  #render() {
    const root = this.shadowRoot;
    const nav = this.#navigation;
    const available = TABS.filter((t) => (t.id === 'colecciones' ? nav?.collections?.length : this.#columns(t.id).length));
    if (available.length && !available.some((t) => t.id === this.tab)) this.tab = available[0].id;
    const ids = (t) => ({ tab: `mega-tab-${this.#id}-${t.id}`, panel: `mega-panel-${this.#id}-${t.id}` });
    root.querySelector('.tabs').innerHTML = available
      .map((t) => `<arq-tab id="${ids(t).tab}" value="${t.id}" aria-controls="${ids(t).panel}"${t.id === this.tab ? ' selected' : ''}>${esc(t.label)}</arq-tab>`)
      .join('');
    root.querySelector('.panels').innerHTML = available
      .map((t) => {
        const content = t.id === 'colecciones' ? this.#collections(nav) : this.#sectionColumns(this.#columns(t.id));
        return `<div class="panel panel--${t.id}" role="tabpanel" id="${ids(t).panel}" aria-labelledby="${ids(t).tab}" data-tab="${t.id}"${t.id === this.tab ? '' : ' hidden'}>${content}</div>`;
      })
      .join('');
    this.select.refresh();
    this.#resetPreview();
  }

  // Datos del preview en el link: foto, eyebrow y nombre
  #link(link, eyebrow, meta = '') {
    return (
      `<arq-mega-link href="${esc(link.href)}" show-arrow data-image="${esc(link.image ?? '')}" data-fallbacks="${esc(JSON.stringify(link.fallbacks ?? []))}" data-eyebrow="${esc(eyebrow)}" data-title="${esc(link.label)}">` +
      `${esc(link.label)}${meta ? `<span slot="meta">${esc(meta)}</span>` : ''}</arq-mega-link>`
    );
  }

  // Por espacio y Lámparas y artefactos: una columna por sección, con título
  // (role/heading-1), links y "Ver todo…" (↗) al pie.
  #sectionColumns(sections) {
    return (
      `<div class="columns">` +
      sections
        .map(
          (section) =>
            `<div class="column">` +
            `<div class="top"><p class="title role-heading-1">${esc(section.label)}</p>` +
            `<div class="links">${section.links.map((l) => this.#link(l, `${section.label} · ${l.label}`)).join('')}</div></div>` +
            `<arq-button class="all" type="underline" show-underline show-icon icon="arrow-up-right" href="${esc(section.all.href)}">${esc(section.all.label)}</arq-button>` +
            `</div>`,
        )
        .join('') +
      `</div>`
    );
  }

  // Colecciones: un título, los links repartidos en cuatro columnas (con la
  // bajada de aplicaciones; las primeras columnas llevan uno más si no da
  // justo) y un solo "Ver todas las colecciones" (↗, como el frame).
  #collections(nav) {
    const list = nav?.collections ?? [];
    const base = Math.floor(list.length / COLLECTION_COLUMNS);
    const extra = list.length % COLLECTION_COLUMNS;
    let start = 0;
    const columns = Array.from({ length: COLLECTION_COLUMNS }, (_, i) => {
      const size = base + (i < extra ? 1 : 0);
      const items = list.slice(start, start + size);
      start += size;
      return items;
    });
    return (
      `<p class="title role-heading-1">Colecciones</p>` +
      `<div class="columns columns--collections">` +
      columns.map((items) => `<div class="links column">${items.map((c) => this.#link(c, c.eyebrow, c.meta)).join('')}</div>`).join('') +
      `</div>` +
      `<arq-button class="all" type="underline" show-underline show-icon icon="arrow-up-right" href="${esc(nav?.allCollections?.href)}">${esc(nav?.allCollections?.label)}</arq-button>`
    );
  }

  // Al cambiar de pestaña: la foto de images[pestaña] o la del primer link
  #resetPreview() {
    const first = this.shadowRoot.querySelector(`[role="tabpanel"][data-tab="${this.tab}"] arq-mega-link`);
    if (first) this.#showPreview(first, this.#images[this.tab]);
    else this.#setPreview(this.#images[this.tab], '', '');
  }

  #showPreview(link, image) {
    this.#setPreview(image || link.dataset.image, link.dataset.eyebrow, link.dataset.title, image ? [] : JSON.parse(link.dataset.fallbacks || '[]'));
  }

  #setPreview(src, eyebrow, title, fallbacks = []) {
    // Sin foto propia, la primera de respaldo
    if (!src) src = fallbacks.shift();
    this.#fallbacks = fallbacks;
    const root = this.shadowRoot;
    const img = root.querySelector('.preview img');
    // La foto anterior queda hasta que carga la nueva (sin parpadeo)
    if (src) {
      if (img.getAttribute('src') !== src) img.src = src;
      else if (img.hidden && img.complete && this.#fallbacks.length) img.src = this.#fallbacks.shift(); // esa ya falló
    } else {
      img.removeAttribute('src');
      img.hidden = true;
    }
    root.querySelector('.eyebrow').textContent = eyebrow ?? '';
    root.querySelector('.eyebrow').hidden = !eyebrow;
    root.querySelector('.preview-title').textContent = title ?? '';
    root.querySelector('.caption').hidden = !title;
  }
}

ArqMegaMenu.define();

export { ArqMegaMenu };
