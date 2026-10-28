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
//   artefactos (la macrofamilia, con sus subfamilias), y Colecciones (cuatro columnas de
//   mega-link con bajada). Una pestaña sin columnas no se muestra.
// - Tab es la prop tab (por-espacio · lamparas-y-artefactos · colecciones).
//   Tablist con tab + SingleSelect: ← → cambian de pestaña, Inicio / Fin.
// - Preview a la derecha (frame "imagen · preview hover"): la foto del link
//   con el mouse encima o con el foco, con eyebrow (role/label) y nombre
//   (role/heading-2) sobre la foto. Al abrir o cambiar de pestaña muestra el
//   link de OPENING (Por espacio: Colgante) o, si no está, el primero. Ancho layout/mega-menu-image, ratio/portrait-soft como mínimo; si
//   el contenido es más alto, la foto se estira. Sin foto, color/surface/subtle.
//   Si la foto del link no carga, prueba sus fallbacks en orden (fotos de
//   productos de la categoría); si ninguna carga, color/surface/subtle.
//   Al cambiar de link, la foto nueva se carga aparte y se funde sobre la
//   anterior (dos capas con fondo propio), con el texto.
//   La prop images ({ pestaña: url }) pisa la foto inicial de cada pestaña.
// - El panel no se abre ni se cierra solo: lo muestra el navbar (atributo
//   hidden en el host). Al abrirlo, el navbar llama a reset(): vuelve a la
//   primera pestaña y a su preview inicial; con reset('colecciones') abre
//   directo en esa pestaña.
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
// Link cuya foto se ve al abrir cada pestaña; si no está, el primero.
// Por espacio: Interior > Embutir; Colecciones: Koen; Lámparas y artefactos: el
// primero que sea una lámpara (pedido de Lau, 2026-10-28; antes Colgante, 2026-10-21).
const OPENING = {
  'por-espacio': (l) => l.dataset.eyebrow === 'Interior' && l.dataset.title === 'Embutir',
  colecciones: (l) => l.dataset.title === 'Koen',
  'lamparas-y-artefactos': (l) => /l[aá]mpara/i.test(l.dataset.title),
};
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
    `<div class="photos"><img class="photo" alt=""><img class="photo" alt=""></div>` +
    `<div class="caption">` +
    `<p class="eyebrow role-label"></p>` +
    `<p class="preview-title role-heading-2"></p>` +
    `</div>` +
    `</div>` +
    `</div>` +
    `</div>`;

  #navigation = null;
  #images = {};
  #photoUrl = null; // la foto que se ve en el preview
  #previewId = 0; // la última foto pedida al preview (#setPreview)
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

  /** Al abrir: primera pestaña y su preview inicial (Por espacio → Colgante). */
  reset(tab) {
    // tab: abrir directo en esa pestaña (un link de la página con data-arq-menu). Si el menú
    // todavía no tiene datos queda pedida y se respeta cuando llegan; si ya los tiene y esa
    // pestaña no existe, se ignora.
    const tabs = [...this.shadowRoot.querySelectorAll('arq-tab')].map((t) => t.value);
    const wanted = tab && TABS.some((t) => t.id === tab) && (!tabs.length || tabs.includes(tab)) ? tab : null;
    const first = wanted ?? tabs[0];
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
    if (tab === 'lamparas-y-artefactos') return [s['lamparas-y-artefactos']].filter(Boolean);
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
        // Por espacio: «Ver todos los productos» abajo a la izquierda
        const content =
          t.id === 'colecciones'
            ? this.#collections(nav)
            : this.#sectionColumns(this.#columns(t.id), t.id === 'por-espacio' || t.id === 'lamparas-y-artefactos') +
              (t.id === 'por-espacio' ? `<arq-button class="all-products" type="underline" show-underline show-icon icon="arrow-up-right" href="/arq/productos">Ver todos los productos</arq-button>` : '');
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
  // (role/heading-1) y links. En Por espacio el título es el link (la línea
  // del button Underline al pasar el mouse) y no hay «Ver todo…».
  #sectionColumns(sections, titleLink = false) {
    const title = (section) =>
      titleLink
        ? `<a class="title title-link role-heading-1" href="${esc(section.href)}"><span class="title-text">${esc(section.label)}</span></a>`
        : `<p class="title role-heading-1">${esc(section.label)}</p>`;
    return (
      `<div class="columns">` +
      sections
        .map(
          (section) =>
            `<div class="column">` +
            `<div class="top">${title(section)}` +
            `<div class="links">${section.links.map((l) => this.#link(l, section.label)).join('')}</div></div>` +
            (titleLink ? '' : `<arq-button class="all" type="underline" show-underline show-icon icon="arrow-up-right" href="${esc(section.all.href)}">${esc(section.all.label)}</arq-button>`) +
            `</div>`,
        )
        .join('') +
      `</div>`
    );
  }

  // Colecciones: el título no es un link (no hay página de todas las colecciones)
  // y los links van en cuatro columnas (con la bajada de aplicaciones; las
  // primeras llevan uno más si no da justo).
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
      `</div>`
    );
  }

  // Al cambiar de pestaña: la foto de images[pestaña] o la del link de OPENING
  // (si no, el primero)
  #resetPreview() {
    const links = [...this.shadowRoot.querySelectorAll(`[role="tabpanel"][data-tab="${this.tab}"] arq-mega-link`)];
    const first = links.find(OPENING[this.tab] ?? (() => false)) ?? links[0];
    if (first) this.#showPreview(first, this.#images[this.tab]);
    else this.#setPreview(this.#images[this.tab], '', '');
  }

  #showPreview(link, image) {
    this.#setPreview(image || link.dataset.image, link.dataset.eyebrow, link.dataset.title, image ? [] : JSON.parse(link.dataset.fallbacks || '[]'));
  }

  // La foto y el texto cambian juntos: la foto nueva se carga aparte (la
  // primera de [src, ...fallbacks] que carga) y recién entonces se funde sobre
  // la anterior, con el texto. Si el mouse pasa a otro link antes, la pedida
  // anterior se descarta.
  async #setPreview(src, eyebrow, title, fallbacks = []) {
    const id = ++this.#previewId;
    const candidates = [src, ...fallbacks].filter(Boolean);
    const url = candidates[0] && candidates[0] === this.#photoUrl ? this.#photoUrl : await this.#firstLoaded(candidates);
    if (id !== this.#previewId) return;
    if (url !== this.#photoUrl) await this.#showPhoto(url, id);
    if (id !== this.#previewId) return;
    this.#setCaption(eyebrow, title);
  }

  #firstLoaded(urls) {
    const attempt = (i) => {
      if (i >= urls.length) return Promise.resolve(null);
      return new Promise((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve(urls[i]);
        probe.onerror = () => resolve(attempt(i + 1));
        probe.src = urls[i];
      });
    };
    return attempt(0);
  }

  // Dos capas, cada una con su fondo: la nueva (is-front) se funde por encima de
  // la anterior (is-leaving). Al terminar queda opaca y tapa la anterior, aunque
  // sea un PNG sin fondo; durante el fundido nunca se ve solo el gris.
  async #showPhoto(url, id) {
    const root = this.shadowRoot;
    const photos = [...root.querySelectorAll('.photo')];
    const front = photos.find((p) => p.classList.contains('is-front'));
    const back = photos.find((p) => p !== front);
    if (url) {
      // La capa que se reutiliza se cierra de golpe antes de cargar la foto nueva
      back.classList.remove('is-leaving');
      void back.offsetWidth;
      back.src = url;
      await back.decode().catch(() => {});
      if (id !== this.#previewId) return;
    }
    this.#photoUrl = url;
    root.querySelector('.preview').classList.toggle('has-photo', !!url);
    if (front) {
      front.classList.remove('is-front');
      if (url) front.classList.add('is-leaving');
    }
    if (url) back.classList.add('is-front');
  }

  #setCaption(eyebrow, title) {
    const root = this.shadowRoot;
    const caption = root.querySelector('.caption');
    if (root.querySelector('.preview-title').textContent === (title ?? '') && root.querySelector('.eyebrow').textContent === (eyebrow ?? '')) return;
    root.querySelector('.eyebrow').textContent = eyebrow ?? '';
    root.querySelector('.eyebrow').hidden = !eyebrow;
    root.querySelector('.preview-title').textContent = title ?? '';
    caption.hidden = !title;
    // Reinicia el fundido de entrada del texto
    caption.classList.remove('is-in');
    void caption.offsetWidth;
    caption.classList.add('is-in');
  }
}

ArqMegaMenu.define();

export { ArqMegaMenu };
