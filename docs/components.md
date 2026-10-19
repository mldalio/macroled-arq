# Componentes — Macroled Arq

Descripción de cada componente, copiada de Figma (página Componentes, campo *description* del set). Se lee junto con la ficha `doc/<nombre>` de la página Documentación y con DESIGN.md.

- Si este archivo no coincide con Figma, manda Figma y se actualiza este archivo.
- Al crear o modificar un componente en código, actualizar su **Estado en código** y su marca.

**84 de 86 en código.** ✅ en código (en `main`, con README y en la demo) · ⬜ pendiente · ⏸️ en espera de diseño.

| Componente | Etiqueta | Estado en código |
| --- | --- | --- |
| ✅ [accordion-item](#accordion-item) | `<arq-accordion-item>` | En código ([README](../src/components/accordion-item/README.md)) |
| ✅ [announcement-bar](#announcement-bar) | `<arq-announcement-bar>` | En código ([README](../src/components/announcement-bar/README.md)). Solo en la Home, antes del navbar |
| ✅ [breadcrumb](#breadcrumb) | `<arq-breadcrumb>` | En código ([README](../src/components/breadcrumb/README.md)) |
| ✅ [breadcrumb-item](#breadcrumb-item) | `<arq-breadcrumb-item>` | En código ([README](../src/components/breadcrumb-item/README.md)) |
| ✅ [button](#button) | `<arq-button>` | En código ([README](../src/components/button/README.md)) |
| ✅ [carousel-button](#carousel-button) | `<arq-carousel-button>` | En código ([README](../src/components/carousel-button/README.md)). Lo usan los sliders de la Home (`buttons="carousel"`) |
| ✅ [carousel-controls](#carousel-controls) | `<arq-carousel-controls>` | En código ([README](../src/components/carousel-controls/README.md)) |
| ✅ [catalog-nav](#catalog-nav) | `<arq-catalog-nav>` | En código ([README](../src/components/catalog-nav/README.md)) |
| ✅ [catalog-nav-group](#catalog-nav-group) | `<arq-catalog-nav-group>` | En código ([README](../src/components/catalog-nav-group/README.md)) |
| ✅ [catalog-nav-item](#catalog-nav-item) | `<arq-catalog-nav-item>` | En código ([README](../src/components/catalog-nav-item/README.md)) |
| ✅ [catalog-nav-mobile](#catalog-nav-mobile) | — | Dentro de catalog-nav ([README](../src/components/catalog-nav/README.md)) |
| ✅ [catalog-nav-trigger](#catalog-nav-trigger) | — | Dentro de catalog-nav ([README](../src/components/catalog-nav/README.md)) |
| ✅ [catalog-toolbar](#catalog-toolbar) | `<arq-catalog-toolbar>` | En código ([README](../src/components/catalog-toolbar/README.md)) · sin State=Scroll |
| ✅ [category-card](#category-card) | `<arq-category-card>` | En código ([README](../src/components/category-card/README.md)) |
| ✅ [checkbox](#checkbox) | `<arq-checkbox>` | En código ([README](../src/components/checkbox/README.md)) |
| ✅ [choice-chip](#choice-chip) | `<arq-choice-chip>` | En código ([README](../src/components/choice-chip/README.md)) · Selected en `color/surface/inverse` |
| ✅ [compare-bar](#compare-bar) | `<arq-compare-bar>` | En código ([README](../src/components/compare-bar/README.md)) |
| ✅ [compare-group](#compare-group) | dentro de `<arq-compare-table>` | En código, como parte de compare-table ([README](../src/components/compare-table/README.md)) |
| ✅ [compare-header](#compare-header) | `<arq-compare-header>` | En código ([README](../src/components/compare-header/README.md)) |
| ✅ [compare-picker](#compare-picker) | `<arq-compare-picker>` | En código ([README](../src/components/compare-picker/README.md)) · Productos (compare-bar, también Mobile) y Comparativa · sin los chips de categoría del set y con «Ver todos los productos» (Underline) en lugar de «Comparar» |
| ✅ [compare-picker-item](#compare-picker-item) | `<arq-compare-picker-item>` | En código ([README](../src/components/compare-picker-item/README.md)) |
| ✅ [compare-product](#compare-product) | `<arq-compare-product>` | En código ([README](../src/components/compare-product/README.md)) |
| ✅ [compare-row](#compare-row) | dentro de `<arq-compare-table>` | En código, como parte de compare-table ([README](../src/components/compare-table/README.md)) |
| ✅ [compare-slot](#compare-slot) | `<arq-compare-slot>` | En código ([README](../src/components/compare-slot/README.md)) |
| ✅ [contact-item](#contact-item) | `<arq-contact-item>` | En código ([README](../src/components/contact-item/README.md)) |
| ✅ [count-badge](#count-badge) | `<arq-count-badge>` | En código ([README](../src/components/count-badge/README.md)) |
| ✅ [cta-block](#cta-block) | `<arq-cta-block>` | En código ([README](../src/components/cta-block/README.md)) |
| ✅ [divider](#divider) | `<arq-divider>` | En código ([README](../src/components/divider/README.md)) |
| ✅ [download-card](#download-card) | `<arq-download-card>` | En código ([README](../src/components/download-card/README.md)) · nuevo (Descargas) |
| ✅ [download-file-row](#download-file-row) | `<arq-download-file-row>` | En código ([README](../src/components/download-file-row/README.md)) · Descargas · propuesta final |
| ✅ [download-item](#download-item) | `<arq-download-item>` | En código ([README](../src/components/download-item/README.md)) |
| ✅ [download-modal](#download-modal) | `<arq-download-modal>` | En código ([README](../src/components/download-modal/README.md)) |
| ✅ [family-card](#family-card) | `<arq-family-card>` | En código ([README](../src/components/family-card/README.md)) |
| ✅ [faq-item](#faq-item) | `<arq-faq-item>` | En código ([README](../src/components/faq-item/README.md)) |
| ✅ [feature-block](#feature-block) | `<arq-feature-block>` | En código ([README](../src/components/feature-block/README.md)) |
| ✅ [file-upload](#file-upload) | `<arq-file-upload>` | En código ([README](../src/components/file-upload/README.md)) |
| ✅ [filter-bar](#filter-bar) | `<arq-filter-bar>` | En código ([README](../src/components/filter-bar/README.md)) · Ficha v2 |
| ✅ [filter-chip](#filter-chip) | `<arq-filter-chip>` | En código ([README](../src/components/filter-chip/README.md)) |
| ✅ [filter-panel](#filter-panel) | `<arq-filter-panel>` | En código ([README](../src/components/filter-panel/README.md)) |
| ✅ [filter-row](#filter-row) | `<arq-filter-row>` | En código ([README](../src/components/filter-row/README.md)) |
| ✅ [footer](#footer) | `<arq-footer>` | En código ([README](../src/components/footer/README.md)) |
| ✅ [footer-link](#footer-link) | `<arq-footer-link>` | En código ([README](../src/components/footer-link/README.md)) |
| ✅ [form-message](#form-message) | `<arq-form-message>` | En código ([README](../src/components/form-message/README.md)) |
| ⬜ [form-section-header](#form-section-header) | — | Sin componente: Contacto aplica su dibujo al `<legend>` de cada bloque (role/heading-3, línea border/default; decisiones.md, 2026-10-14 · Contacto v3) |
| ✅ [gallery-thumb](#gallery-thumb) | `<arq-gallery-thumb>` | En código ([README](../src/components/gallery-thumb/README.md)) |
| ✅ [hero](#hero) | `<arq-hero>` | En código ([README](../src/components/hero/README.md)) · Size=Compact (`size="compact"`) con alto mínimo de 41svh / 47svh |
| ✅ [icon-button](#icon-button) | `<arq-icon-button>` | En código ([README](../src/components/icon-button/README.md)) |
| ✅ [input](#input) | `<arq-input>` | En código ([README](../src/components/input/README.md)) |
| ✅ [line-card](#line-card) | `<arq-line-card>` | En código ([README](../src/components/line-card/README.md)) |
| ✅ [link-list](#link-list) | `<arq-link-list>` | En código ([README](../src/components/link-list/README.md)) |
| ✅ [logo](#logo) | `<arq-logo>` | En código ([README](../src/components/logo/README.md)) |
| ✅ [mega-link](#mega-link) | `<arq-mega-link>` | En código ([README](../src/components/mega-link/README.md)) |
| ✅ [mega-menu](#mega-menu) | `<arq-mega-menu>` | En código ([README](../src/components/mega-menu/README.md)) |
| ✅ [nav-link](#nav-link) | `<arq-nav-link>` | En código ([README](../src/components/nav-link/README.md)) |
| ✅ [navbar](#navbar) | `<arq-navbar>` | En código ([README](../src/components/navbar/README.md)); submenús Mobile Interior · Exterior · Lámparas y artefactos · Colecciones |
| ✅ [option-group](#option-group) | `<arq-option-group>` | En código ([README](../src/components/option-group/README.md)) |
| ✅ [option-tile](#option-tile) | `<arq-option-tile>` | En código ([README](../src/components/option-tile/README.md)) |
| ✅ [page-header](#page-header) | `<arq-page-header>` | En código ([README](../src/components/page-header/README.md)) |
| ✅ [pdf-cover-title](#pdf-cover-title) | — | En `src/pdf/` con pdfmake: no es Web Component ([README](../src/pdf/README.md)) |
| ✅ [pdf-footer](#pdf-footer) | — | En `src/pdf/` con pdfmake: no es Web Component ([README](../src/pdf/README.md)) |
| ✅ [pdf-header](#pdf-header) | — | En `src/pdf/` con pdfmake: no es Web Component ([README](../src/pdf/README.md)) |
| ✅ [pdf-page](#pdf-page) | — | En `src/pdf/` con pdfmake: no es Web Component ([README](../src/pdf/README.md)) |
| ✅ [pdf-spec-group](#pdf-spec-group) | — | En `src/pdf/` con pdfmake: no es Web Component ([README](../src/pdf/README.md)) |
| ✅ [pdf-spec-row](#pdf-spec-row) | — | En `src/pdf/` con pdfmake: no es Web Component ([README](../src/pdf/README.md)) |
| ✅ [product-card](#product-card) | `<arq-product-card>` | En código ([README](../src/components/product-card/README.md)); imágenes reales con TODO |
| ✅ [product-gallery](#product-gallery) | `<arq-product-gallery>` | En código ([README](../src/components/product-gallery/README.md)) |
| ✅ [search-dropdown](#search-dropdown) | `<arq-search-dropdown>` | En código ([README](../src/components/search-dropdown/README.md)) |
| ✅ [search-field](#search-field) | `<arq-search-field>` | En código ([README](../src/components/search-field/README.md)) |
| ✅ [search-result](#search-result) | `<arq-search-result>` | En código ([README](../src/components/search-result/README.md)) |
| 🧪 [search-card](#search-card) | `<arq-search-card>` | Prueba, documentado en Figma desde el código ([README](../src/components/search-card/README.md)) |
| 🧪 [search-collection](#search-collection) | `<arq-search-collection>` | Prueba, documentado en Figma desde el código ([README](../src/components/search-collection/README.md)) |
| 🧪 [search-sheet](#search-sheet) | `<arq-search-sheet>` | Prueba, documentado en Figma desde el código ([README](../src/components/search-sheet/README.md)) |
| ✅ [search-screen](#search-screen) | `<arq-search-screen>` | En código ([README](../src/components/search-screen/README.md)) |
| ✅ [search-see-all](#search-see-all) | `<arq-search-see-all>` | En código ([README](../src/components/search-see-all/README.md)) |
| ✅ [section-header](#section-header) | `<arq-section-header>` | En código ([README](../src/components/section-header/README.md)) |
| ✅ [select](#select) | `<arq-select>` | En código ([README](../src/components/select/README.md)) · Size (Default 14 · Small 12, solo Filter); Filter sin línea y con gap sm |
| ✅ [select-menu](#select-menu) | `<arq-select-menu>` | En código ([README](../src/components/select-menu/README.md)) |
| ✅ [select-option](#select-option) | `<arq-select-option>` | En código ([README](../src/components/select-option/README.md)) |
| ✅ [sku](#sku) | `<arq-sku>` | En código ([README](../src/components/sku/README.md)) · Size=Underline |
| ✅ [spec-list](#spec-list) | `<arq-spec-list>` | En código ([README](../src/components/spec-list/README.md)) |
| ✅ [spec-row](#spec-row) | `<arq-spec-row>` | En código ([README](../src/components/spec-row/README.md)) |
| ✅ [swatch](#swatch) | `<arq-swatch>` | En código ([README](../src/components/swatch/README.md)) |
| ✅ [swatch-picker](#swatch-picker) | `<arq-swatch-picker>` | En código ([README](../src/components/swatch-picker/README.md)) |
| ✅ [tab](#tab) | `<arq-tab>` | En código ([README](../src/components/tab/README.md)) |
| ✅ [toggle](#toggle) | `<arq-toggle>` | En código ([README](../src/components/toggle/README.md)) |
| ✅ [toggle-switch](#toggle-switch) | — | Dentro de toggle ([README](../src/components/toggle/README.md)) |
| ✅ [variants-table](#variants-table) | `<arq-variants-table>` | En código ([README](../src/components/variants-table/README.md)) · Ficha v2 y Descargas (buscador a la derecha). Descargas usa `<arq-downloads-table>` ([README](../src/components/downloads-table/README.md)), sin set: frames «variants-table» de la propuesta 2575:22875 |
| ✅ [variants-table-card](#variants-table-card) | dentro de `<arq-variants-table>` | En código, como parte de variants-table (Mobile) ([README](../src/components/variants-table/README.md)) |
| ✅ [variants-table-row](#variants-table-row) | — | Dentro de variants-table ([README](../src/components/variants-table/README.md)) · Ficha v2 |

### Componentes de layout de página (sin set en Figma)

Salen de las pantallas de Final, no de la página Componentes, y no cuentan en el total de arriba. Decisión: `docs/decisiones.md`, 2026-10-02 · Layout de página.

| Componente | Etiqueta | Para qué |
| --- | --- | --- |
| ✅ section | `<arq-section>` | Bloque de página: gutter, padding de sección y encabezado → contenido → acción. Con `reveal`, el bloque entero aparece al entrar en pantalla. El margen lateral es de títulos y textos; Explorar, el mosaico y el carrusel de proyectos llegan al borde ([README](../src/components/section/README.md)) |
| ✅ grid | `<arq-grid>` | Grilla de tarjetas; en Mobile apila, dos columnas o carrusel ([README](../src/components/grid/README.md)) |
| ✅ project-mosaic | `<arq-project-mosaic>` | Mosaico de fotos de proyectos del Home (DESIGN.md §12) ([README](../src/components/project-mosaic/README.md)) |
| ✅ featured-products | `<arq-featured-products>` | Productos destacados del Home, por grupo, con datos del catálogo. La fila se desliza con el dedo o el mouse ([README](../src/components/featured-products/README.md)) |
| ✅ text-block | `<arq-text-block>` | Kicker, título y bajada de una escena del Home ([README](../src/components/text-block/README.md)) |
| ✅ collection-tile | `<arq-collection-tile>` | Tarjeta del mosaico de colecciones del Home ([README](../src/components/collection-tile/README.md)) |
| ✅ collection-mosaic | `<arq-collection-mosaic>` | Mosaico de colecciones del Home ([README](../src/components/collection-mosaic/README.md)) |
| ✅ tool-card | `<arq-tool-card>` | Recurso de «Herramientas para proyectar» ([README](../src/components/tool-card/README.md)) |
| ✅ project-slide | `<arq-project-slide>` | Slide del carrusel de proyectos del Home ([README](../src/components/project-slide/README.md)) |
| ✅ project-slider | `<arq-project-slider>` | Carrusel de proyectos del Home, en bucle. Con `autoplay` avanza solo; se arrastra con el mouse y el clic abre la foto en un lightbox ([README](../src/components/project-slider/README.md)) |
| ✅ catalog-listing | `<arq-catalog-listing>` | Listado de Productos (y Colecciones): nav, toolbar, grilla, filtros y comparar ([README](../src/components/catalog-listing/README.md)) |
| ✅ coleccion | `<arq-coleccion>` | Página de colección: cards de sus productos, galería, texto + imagen y mosaico con flechas ([README](../src/components/coleccion/README.md)) |
| ✅ form-contacto | `<arq-form-contacto>` | Contacto (v3): información por slot (fija al desplazar en Desktop), formulario con validación, honeypot y envío a n8n, y preguntas frecuentes opcionales por slot ([README](../src/components/form-contacto/README.md)) |
| ✅ ficha-producto | `<arq-ficha-producto>` | Ficha de producto: hero con galería y configurador, descargas, especificaciones, descripción, glosario, inspiración y colección ([README](../src/components/ficha-producto/README.md)) |
| ✅ descargas | `<arq-descargas>` | Página Descargas: título, bajada y download-card del catálogo arriba; «Buscar producto» con variants-table (todos los SKU, buscador) y el modal de descargas de cada fila ([README](../src/components/descargas/README.md)) |
| ✅ comparativa | `<arq-comparativa>` | Página Comparativa: combina compare-header y compare-table con los SKU de `?sku=`, con datos del catálogo ([README](../src/components/comparativa/README.md)) |

### Páginas

| Página | Embed | Demo |
| --- | --- | --- |
| ✅ Home | [src/pages/home.html](../src/pages/home.html) | `demo/home.html` |
| ✅ Productos | [src/pages/productos.html](../src/pages/productos.html) | `demo/productos.html` |
| ✅ Colección | [src/pages/coleccion.html](../src/pages/coleccion.html) | `demo/coleccion.html` (`?collection=`) |
| ✅ Contacto | [src/pages/contacto.html](../src/pages/contacto.html) | `demo/contacto.html` |
| ✅ Ficha de producto | [src/pages/ficha.html](../src/pages/ficha.html) | `demo/ficha.html` (`?group=` y `?sku=`) |
| ✅ Comparativa | [src/pages/comparativa.html](../src/pages/comparativa.html) | `demo/comparativa.html` (`?sku=`) |
| ✅ Descargas | [src/pages/descargas.html](../src/pages/descargas.html) | `demo/descargas.html` |

## accordion-item

- Figma: [922-2645](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2645)
- Propiedades: Title; Open: False · True; State: Default · Hover · Focus; Breakpoint: Desktop · Mobile

Uso: bloques de especificaciones de la ficha (características lumínicas, eléctricas, materiales), con spec-list adentro. No confundir con faq-item. Ítem de acordeón de la ficha (botón con aria-expanded). Título role/body-xl. Open=False y Open=True: sin fondo, línea inferior border/default; ícono plus / minus en icon-button Size=Large, Background=Outline con borde border/default (48 × 48, ícono 24). Open=True: contenido libre (en la ficha, dos spec-list en columnas separadas por space/gap/4xl). Padding space/padding/xl-2xl arriba y abajo cerrado, space/padding/lg abierto, space/padding/xl a los lados; gap título–contenido space/gap/xs. State: Default, Hover (solo Open=False: surface/faint), Focus (anillo border/focus).

## announcement-bar

- Figma: [2780-8595](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2780-8595) · ficha `doc/announcement-bar` (`2781:13825`)
- Propiedades: Breakpoint: Desktop · Mobile

Línea fina arriba del navbar, solo en la Home, con un aviso y su link (hoy «Suscribite al newsletter», a la sección Newsletter de la Home). Siempre en modo Dark (fijado en cada variante): fondo color/surface/default y no cambia con Iluminar. Padding space/padding/xs × layout/gutter; el link va centrado: button Type=Underline, Show underline=false (el subrayado aparece en hover), Show icon con icon/arrow-up-right y el label en role/body-compact-regular (14/24). En hover el subrayado es de 1 px (border/default) y va más pegado al texto que en el resto de los button. Alto 40. Breakpoint: Desktop · Mobile (en Mobile, si el texto no entra, baja de línea). Al hacer scroll se va con la página y el navbar queda pegado arriba. En código: <arq-announcement-bar> con el button por slot (atributo compact del button para el texto de 14).

## breadcrumb

- Figma: [1244-12667](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-12667)
- Propiedades: Levels: 3 · 2

Levels=3: Inicio / Sección / Página. Levels=2: Inicio / Página. El separador vive en breadcrumb-item (Show separator); el ítem actual lo trae apagado.

Textos largos: los ítems intermedios se cortan con "…" (el texto completo queda en el link); el ítem actual se parte en varias líneas.

En Productos: Levels=2 sin categoría; con categoría, Levels=3 siguiendo al título (Inicio / Productos / Interior, Inicio / Exterior / Jardín, Inicio / Colecciones / Kanu).

## breadcrumb-item

- Figma: [1053-4430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1053-4430)
- Propiedades: Label; Show separator; State: Default · Hover · Current

Un nivel del breadcrumb: Label (link) y separador opcional (Show separator). State=Current para la página actual: sin link ni separador. No se usa suelto, siempre dentro de breadcrumb.

Textos largos: si no es Current, se corta con "…"; Current se parte en varias líneas.

## button

- Figma: [907-2375](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=907-2375)
- Propiedades: Label; Show icon; Icon; Show underline; Show count; Show leading icon; Leading icon; Type: Filled · Outline · Underline; State: Default · Hover · Pressed · Focus · Disabled · Loading. El ícono es opcional (Show icon).

Botón. Type: Filled (acción principal), Outline (borde) y Underline (texto subrayado). State: Default, Hover, Pressed, Focus y Disabled. Props: Label, Show icon, Icon y Show underline (solo Underline: en false queda como texto simple y el subrayado aparece en hover). Sobre fotos o fondos oscuros, poner el contenedor en modo Dark: Filled pasa a fondo claro.

Show count: muestra un count-badge después del label (p. ej. "Filtrar 3" con filtros activos). En Filled usa Tone=Inverse. En código, el lector de pantalla dice "Filtrar, 3 filtros activos" (atributo count-label).

Subrayado (Underline): 1 px en reposo y 2 px en hover y pressed. Focus: anillo separado del botón (capa focus-ring, 2 px, color/border/focus, 2 px de separación).

Show leading icon + Leading icon: ícono a la izquierda del label (p. ej. "Volver a productos" = Underline, sin subrayado, icon/chevron-left). State=Loading (Filled y Outline): acción en curso, sin íconos ni badge y con el fondo de Hover. En código, el label pasa a un texto de carga (atributo loading-label): "Enviando…" al enviar un formulario (por defecto) o "Generando…" mientras se arma la ficha técnica en PDF. Lleva aria-busy="true" y queda deshabilitado; no hay ícono de carga en la librería.

Flechas: → (icon/arrow-right) para navegación interna dentro del sitio y acciones (Enviar consulta, Ver todo…). ↗ (icon/arrow-up-right) para recursos externos o que abren en otra pestaña o descargan (Centro de descargas, Escribinos por mail, PDF, redes).

Pressed (Filled y Outline): además del fondo, el botón se achica a motion/scale/pressed (0,97) con motion/duration/fast y motion/easing/out. La variante State=Pressed no muestra la escala (es movimiento); manda este texto. Underline no se achica. Con movimiento reducido no cambia de tamaño.

## carousel-button

- Figma: [2387-8532](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2387-8532)
- Propiedades: Direction: Previous · Next; State: Default · Disabled

Botón anterior / siguiente de los carruseles (Destacados, Proyectos). Cuadrado de 44 px (layout/carousel-button), borde color/border/disabled, chevron icon/md. Direction: Previous o Next. State: Default o Disabled (fondo color/surface/subtle; se usa en Previous cuando el carrusel está en la primera slide).

## carousel-controls

- Figma: [1410-17825](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1410-17825)
- Propiedades: Position: Start · Middle · End

Flechas anterior / siguiente para carruseles con scroll horizontal (mosaico de Colección, proyectos de Home). icon-button Size=Large con icon/arrow-left y icon/arrow-right. Position: Start (anterior deshabilitada) · Middle · End (siguiente deshabilitada); deshabilitada = icon-button State=Disabled (atributo disabled). En mobile no se muestran: el carrusel se desliza y la imagen siguiente asoma como indicador. El scroll (snap) se resuelve en código.

## catalog-nav

- Figma: [1035-2411](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2411)
- Propiedades: —

Sidebar de filtros del catálogo (Interior abierto, resto cerrado). Compuesto por instancias de catalog-nav-group. Al cargar se abre solo el grupo de la categoría actual; abrir otro grupo no cierra los demás ni cambia el listado. El listado cambia al elegir una subcategoría, sin recargar la página ni volver arriba. Cada colección del grupo Colecciones muestra sus cards de producto en el mismo listado.

## catalog-nav-group

- Figma: [1035-2410](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2410)
- Propiedades: Label; Open: True · False; Selected: False · True

Grupo desplegable del sidebar de catálogo (catalog-nav). Encabezado: label role/body-xl (color/text/primary abierto, color/text/secondary cerrado) e icon-button Size=Default, Background=None con icon/chevron-up (Open=True) o icon/chevron-down (Open=False). Open=True muestra la lista de catalog-nav-item con sangría space/padding/lg y un riel (línea izquierda border/default en color/border/subtle); los ítems van pegados, sin gap, y la lista lleva space/padding/xs abajo. Padding vertical space/padding/md, gap encabezado–lista space/gap/md y línea inferior border/default en color/border/subtle. Selected marca el grupo de la categoría actual (sin diferencia visual); en código lo maneja el grupo, no el ítem.

Movimiento (código): como el pliegue de compare-bar. La lista cambia de golpe y la línea del grupo y los grupos de abajo vuelven con transform desde donde estaban (motion/duration/expand, motion/easing/standard); al abrir, la lista se descubre con clip-path al mismo ritmo. No se anima el alto. El chevron gira media vuelta con el mismo tiempo y la misma curva. Con reduced motion, cambia de golpe y queda el fundido (motion/duration/fade).

## catalog-nav-item

- Figma: [1035-2382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2382)
- Propiedades: Label; Size: Large · Default; State: Default · Hover · Selected · Focus

Ítem de filtro del sidebar de catálogo. Size: Default (role/body-compact, 14/24) o Large (role/body-lg, 16/24), en lugar de sobrescribir el estilo en cada instancia. State: Default (Size=Default en color/text/secondary; Size=Large en color/text/tertiary), Hover (color/text/primary), Selected (indicador de 12 × border/default en color/text/primary y peso Regular: role/body-compact-regular o role/body-lg-regular) y Focus (anillo color/border/focus). Alto 32: padding space/padding/xs arriba y abajo y space/padding/sm-md a la izquierda; gap indicador–texto space/gap/sm.

## catalog-nav-mobile

- Figma: [1207-3314](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1207-3314)
- Propiedades: Open: False · True

Navegación de categorías para Productos y Colecciones en mobile (equivalente de catalog-nav en desktop). Encabezado = catalog-nav-trigger (expuesto: editar Label con la selección actual). Tocar el encabezado alterna Open. Va como primer elemento de main. Al elegir un ítem, el panel queda abierto y se actualizan el Label y el listado.

## catalog-nav-trigger

- Figma: [1215-3337](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1215-3337)
- Propiedades: Label; Open: False · True; State: Default · Hover · Focus

Encabezado desplegable de catalog-nav-mobile. Mismo patrón que accordion-item: Open (False/True) × State (Default/Hover/Focus), hover con color/surface/faint, focus con color/border/focus e icon-button con icon/plus / icon/minus. Label = selección actual.

## catalog-toolbar

- Figma: [1244-4058](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4058)
- Propiedades: Count; Show iluminar; Breakpoint: Desktop · Mobile (sin State: `docs/decisiones.md`, 2026-10-19 · catalog-toolbar sin State=Scroll). Solo en código, `stuck`: pegada debajo del navbar, sin línea superior (2026-10-19 · Navbar fijo en los listados)

Barra sobre la grilla de Productos y Colecciones: cantidad (role/body, color/text/secondary), toggle Iluminar, divider vertical y botón Filtrar (button Outline expuesto: con filtros activos, Show count + icon/filter-off). Mismo contenido en Desktop y Mobile. No cambia al desplazarse la página: mantiene el padding vertical space/padding/md.

## category-card

- Figma: [1036-2461](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2461)
- Propiedades: Name; Breakpoint: Desktop · Mobile; State: Default · Hover · Focus

Uso: categorías en el Home (Interior, Exterior…); lleva al listado filtrado. No confundir con line-card (editorial) ni family-card (ficha).

Tarjeta de categoría del Home: imagen + nombre + flecha; toda la tarjeta es link al listado filtrado.

La imagen tiene la proporción bloqueada: al crecer la columna crece en alto sin deformarse.

## checkbox

- Figma: [975-2322](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=975-2322)
- Propiedades: Label; Show label; Size: Large · Default; Checked: False · True; State: Default · Hover · Focus · Disabled

Checkbox. Checked: False / True. State: Default, Hover, Focus (anillo separado alrededor de todo el checkbox, DESIGN.md §7) y Disabled. Props: Label y Show label. Se usa en los filtros de Productos y en "Comparar" de las tarjetas. En código es un <input type="checkbox"> real con su <label>; toda la fila es clickeable. Dentro de una tarjeta, el checkbox va fuera del link de la tarjeta.

Size: Default (role/body, 14) o Large (role/body-lg, 16) — en lugar de sobrescribir el estilo en cada instancia.

Marcado: caja llena en color/action/primary, sin tilde. Label en color/text/secondary (primary en hover).

Hover sin marcar: borde de la caja border/strong (2 px) en color/border/strong; el tamaño no cambia. La caja sin marcar no tiene fondo (color/surface/transparent): solo el borde.

## choice-chip

- Figma: [1113-2485](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2485)
- Propiedades: Label; State: Default · Hover · Selected · Focus · Disabled

Uso: elegir una opción en formularios (p. ej. motivo de consulta en Contacto). No confundir con option-tile, que configura el producto en la ficha.

Opción seleccionable en forma de chip para elegir entre pocas opciones visibles (p. ej. motivo de consulta en Contacto). Default (borde color/border/default, sin fondo), Hover (borde color/border/strong), Selected (fondo color/surface/inverse, borde color/border/strong y texto color/text/inverse), Focus (anillo color/border/focus) y Disabled. Label role/body-regular; padding space/padding/sm × space/padding/md. Cada chip con su ancho, a space/gap/sm-md. Se comporta como radio: una selección por grupo. En código: <arq-choice-chip> (role="radio").

## compare-bar

- Figma: [1233-3963](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3963)
- Propiedades: Title; Breakpoint: Desktop · Mobile; Open: True · False

Barra fija inferior para comparar productos (hasta 3). Título + count-badge con la cantidad seleccionada, compare-slot (Filled/Empty) y acciones: button Underline «Borrar todo» y Filled «Comparar». Usa el tema oscuro (modo Dark de Color) fijado en cada variante. Desktop: slots Size=Default separados por divider Vertical. Mobile (como macroled.com.ar): los productos elegidos, uno arriba de otro (compare-slot Default con divider Horizontal Subtle), más un solo lugar vacío (compare-slot Empty) para agregar mientras haya menos de 3, y «Comparar» debajo a todo el ancho. El lugar vacío abre compare-picker. Se ve también en «Todas las colecciones». Open (Desktop y Mobile): el título lleva un chevron que pliega la lista (chevron-down abierta, chevron-up plegada); plegada quedan el título, «Borrar todo» y «Comparar» (en Desktop, en una sola línea y con el chevron en la punta derecha). Arranca abierta y se vuelve a abrir al agregar un producto.
Movimiento (código): entra desde el borde de abajo al elegir el primer producto y sale por el mismo borde, como un panel: motion/duration/panel con motion/easing/standard, como filter-panel. El espacio que el listado reserva abajo se quita recién cuando la barra terminó de salir. Al plegar y desplegar con el chevron (Open), la barra se desliza igual: el borde de arriba baja o sube a su lugar nuevo con motion/duration/panel y motion/easing/standard. Con reduced motion, solo el fundido (motion/duration/fade).

Movimiento (código): entra desde el borde de abajo al elegir el primer producto y sale por el mismo borde, como un panel: motion/duration/panel con motion/easing/standard, como filter-panel. El espacio que el listado reserva abajo se quita recién cuando la barra terminó de salir. Al plegar y desplegar con el chevron (Open), la barra se desliza igual: el borde de arriba baja o sube a su lugar nuevo con motion/duration/panel y motion/easing/standard. Con reduced motion, solo el fundido (motion/duration/fade).

## compare-group

- Figma: [1263-4320](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4320)
- Propiedades: Label

Título de grupo de la tabla comparativa (role/body-xl en caja normal, color/text/primary; borde inferior color/border/strong). Ancho FILL; en mobile queda fijo a la izquierda al hacer scroll horizontal.

## compare-header

- Figma: [1265-4330](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4330)
- Propiedades: Type: Default · Compact; Breakpoint: Desktop · Mobile

Cabecera de la comparativa. Type=Default: columna de controles (toggle "Solo diferencias") + compare-product por columna; es estática. Type=Compact: versión mini que aparece fija arriba (position: fixed/sticky bajo el navbar) cuando la cabecera Default sale de pantalla; usa compare-product Size=Compact (miniatura + nombre + quitar; el SKU solo en Desktop; un lugar libre es la caja «Agregar producto»). compare-slot queda solo para compare-bar. En mobile las columnas (144 + gap 16) se alinean con compare-row Mobile y el scroll horizontal se sincroniza con la tabla; la columna de controles (120) queda fija.

> **En código (2026-10-19):** en Mobile, el Compact funciona como macroled.com.ar/comparativa: cada producto ocupa una columna de compare-table (layout/compare-column, mismas líneas verticales color/border/subtle) con la miniatura, el nombre y el SKU apilados y centrados, sin recortar; quitar en la esquina y «Agregar producto» del alto de la columna. Se desplaza junto con la tabla. Desktop no cambia. `TODO` (Figma): el set Compact/Mobile (1265:4329) sigue en una fila con el nombre solo.

## compare-picker

- Figma: [2724-8761](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2724-8761)
- Propiedades: Breakpoint: Desktop · Mobile; State: Results · No results

Modal «Agregar producto» de la comparativa. Se abre desde el lugar vacío (+) del compare-bar en Productos y Colecciones (en Mobile, el lugar vacío debajo de los elegidos) y desde el compare-product vacío / «+ Agregar producto» en Comparativa. Buscador (search-field Type=Line) por nombre, SKU o familia; sin chips de categoría (se sacaron: se busca solo con el buscador). Lista de compare-picker-item (Added si ya está; Disabled con 3 elegidos). Al pie, «Ver todos los productos»: button Underline con subrayado e icon/arrow-right, lleva al listado de Productos. Desktop: modal centrado sobre scrim, ancho layout/filter-panel, la lista mide layout/compare-picker-list (400: 5 filas; las demás se desplazan adentro) y el panel abraza el contenido. Mobile: pantalla completa. Sin resultados: solo mensaje, sin CTA; se sigue buscando en el mismo modal. Siempre en Light. En código: <arq-compare-picker>.

## compare-picker-item

- Figma: [2723-8420](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2723-8420)
- Propiedades: State: Default · Hover · Added · Disabled

Fila del modal «Agregar producto» de la comparativa. Default/Hover: botón Agregar (Hover: fondo color/surface/hover). Added: el producto ya está en la comparativa («Agregado»). Disabled: se alcanzó el máximo de 3 productos; textos en color/text/disabled y la miniatura con opacity/disabled (50 %). Miniatura layout/search-thumb. En código: <arq-compare-picker-item>.

## compare-product

- Figma: [1057-2522](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1057-2522)
- Propiedades: Name; SKU; Show SKU; Size: Default · Compact; State: Filled · Empty · empty-hover

Columna de producto en compare-header. Size=Default: State=Filled (foto, nombre, SKU, link, selects de familia y variante, quitar) / Empty (agregar luminaria, cuando hay menos de 3). Size=Compact: versión mini para el compare-header Compact. Filled: miniatura (layout/compare-thumb), nombre en role/label, SKU en role/body-sm (Show SKU; en Mobile se oculta) y quitar. Empty: caja punteada border/default del alto de la miniatura con «+» y «Agregar producto» en role/body-sm; empty-hover: fondo surface/faint y borde border/strong. Toma el ancho de la columna (FILL). La imagen mantiene proporción 1:1 (aspect ratio bloqueado): al cambiar el ancho de la columna, el alto de la media acompaña. La media tiene un tope de layout/compare-media-max.

## compare-row

- Figma: [1263-4317](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4317)
- Propiedades: Label; Value 1–3; Show value 1–3; Breakpoint: Desktop · Mobile

Fila de la tabla comparativa: etiqueta + un valor por producto (hasta 3; Show value 1–3 oculta las columnas sin producto). Valores en role/body-lg-regular. Breakpoint=Mobile: etiqueta de 120 fija (sticky left, fondo color/surface/default) y columnas de 160 dentro de un scroll horizontal. "Solo diferencias" activo: las filas con valores iguales se ocultan (y el compare-group si queda vacío). No confundir con spec-row (ficha).

## compare-slot

- Figma: [1233-3656](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3656)
- Propiedades: Name; Meta; State: Filled · Empty · empty-hover

Lugar de producto en compare-bar (compare-header Compact usa compare-product Size=Compact). State=Filled (foto en "thumb": reemplazá el relleno por la imagen del producto, nombre, meta e icon-button para quitar) / Empty (agregar producto): la foto en color/surface/subtle con el «+» resaltado y «Agregar producto», dentro de una caja punteada (border/default dashed en color/border/default, padding derecho space/padding/md), como el lugar vacío de compare-product Compact. Todo el lugar es un botón (cursor pointer) que abre compare-picker. State=empty-hover (como empty-hover de compare-product): fondo color/surface/faint y borde punteado color/border/strong; en código es :hover. Un solo tamaño, en Desktop y en la lista apilada de Mobile (Size=Compact se quitó: ya no se usaba). Ancho máximo 400 para que no se estire en pantallas anchas.

## contact-item

- Figma: [1303-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4340)
- Propiedades: Label; Value; State: Default · Hover · Focus

Canal de contacto: etiqueta (role/body-sm, color/text/tertiary) + valor (role/body-lg-regular). El valor es un link: mailto: para email, tel: para teléfono. Sin línea: la lista los separa. Estados Default · Hover (subrayado) · Focus.

## count-badge

- Figma: [1231-3557](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1231-3557)
- Propiedades: Count; Tone: Primary · Inverse

Contador (productos seleccionados, filtros activos). Tone=Primary sobre superficies claras; Tone=Inverse dentro de elementos con color/action/primary (p. ej. button Filled). Crece con el número (mín. 20).

## cta-block

- Figma: [1265-4464](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4464)
- Propiedades: Title; Description; Type: Button · Newsletter; Breakpoint: Desktop · Mobile

Bloque de cierre de página con fondo color/surface/subtle y space/section/md. Type=Button (p. ej. "¿Necesitás ayuda para elegir?" en Comparativa) o Newsletter (input + button, Home). Props: Title, Description; button e input expuestos.

## divider

- Figma: [1244-3990](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-3990)
- Propiedades: Orientation: Horizontal · Vertical; Emphasis: Subtle · Default

Línea divisoria. Horizontal: ancho FILL en el contenedor. Vertical: alto fijo 20 (toolbar) o FILL (compare-bar). Emphasis: Subtle = color/border/subtle, Default = color/border/default.

## download-card

- Figma: [2496-8095](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2496-8095)
- Propiedades: Title; Description; Show description; State: Default · Hover · Focus

Tarjeta de descarga de un archivo general (Descargas: «Catálogo Macroled ARQ 2026»). Toda la tarjeta es un link que descarga el archivo. Imagen ratio/landscape (5:4) con fondo color/surface/subtle (la portada va contenida, en el fill de la instancia) + título role/heading-3 (text/primary) con icon/download a la derecha (gap space/gap/sm-md) y bajada role/body (text/secondary) a space/gap/xs; imagen y textos a space/gap/md. Ancho layout/measure-wide (520); en Mobile toma el ancho de su columna. State: Default, Hover (border/default en color/border/hover sobre la imagen, como family-card) y Focus (anillo border/strong en color/border/focus, separado 2 px). Props: Title, Description y Show description. No confundir con download-item (fila del modal de descargas) ni con family-card (link a otra ficha).

## download-file-row

- Figma: [2554-20047](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2554-20047) (en «Descargas · propuesta final», 2575:22875)
- Propiedades: Availability: Available (Label y Meta como texto)

Fila de archivo del modal de descargas: nombre, formato y peso. "Unavailable" cuando la variante no tiene ese archivo (por ejemplo, sin IES).

Código: download-modal `show-product`. En Descargas · propuesta los archivos del modal son download-file-row en lugar de download-item.

Loading (solo en código, la ficha técnica que se genera): el nombre pasa a «Generando…» con aria-busy mientras se arma el PDF. TODO (diseño): State=Loading.

## download-item

- Figma: [1101-5542](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1101-5542)
- Propiedades: Label; Emphasis: Default · Featured; State: Default · Hover · Focus

Opción del modal de descargas, con texto role/body-xl (más grande que un button) + icon/download; cada opción descarga su archivo directamente. Emphasis: Default (línea inferior border/subtle, Hover subraya el texto) o Featured (caja con border/strong y padding space/padding/lg; para el archivo principal, la ficha técnica; Hover surface/faint). State: Default, Hover, Focus.

## download-modal

- Figma: [1375-4948](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1375-4948)
- Propiedades: Title; Breakpoint: Desktop · Mobile

Modal de descargas con opciones download-item. Desktop: esquina inferior derecha, separado layout/gutter del borde, ancho layout/filter-panel (560). Mobile: abajo, a layout/gutter de los bordes y ocupando el ancho (alto según el contenido). Siempre con color/overlay/scrim detrás; mientras está abierto, la página de atrás no se desplaza. Página Descargas: sku Compact debajo del título (código: atributo sku), opciones Emphasis=Default.

Descargas · propuesta final (2554:20048 · Mobile 2554:20133): título role/heading-1, el producto (miniatura, sku y variante en role/body-compact-regular) y los archivos como download-file-row, a space/gap/xl; en Mobile, hoja pegada abajo a todo el ancho. Código: atributo `show-product`.

## family-card

- Figma: [1094-5766](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1094-5766)
- Propiedades: Name; Size: Default · Large; State: Default · Hover · Focus

Uso: otras familias de la misma colección en la ficha ("Explora la colección" y "Otras familias"); lleva a la ficha de esa familia. No confundir con category-card ni line-card (Home).

Card de otra familia de la colección (link a su ficha): imagen recortada (en el fill de la instancia; placeholder surface/subtle) + nombre, gap space/gap/md. Size: Default (200 × 200, ratio/square, nombre role/body-lg-medium; sección "Otras familias de la colección") y Large (328 × 469, ratio/portrait, nombre role/heading-3; sección "Explora la colección", que va sobre fondo oscuro: aplicar modo Dark a la sección para que el texto quede claro). State: Default, Hover (border/hover en la imagen), Focus (border/focus). Cuando hay más cards de las que entran, se ubican en un carrusel horizontal (patrón, no componente): contenedor con overflow-x: auto y scroll-snap-type: x mandatory, cards de ancho fijo con scroll-snap-align: start, gap space/gap/sm; sin flechas por ahora; en mobile el scroll puede llegar al borde de la pantalla.

## faq-item

- Figma: [1036-2430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2430)
- Propiedades: Question; Answer; Open: False · True; State: Default · Hover · Focus

Uso: preguntas frecuentes (Home y Contacto): pregunta y respuesta en texto. No confundir con accordion-item, que agrupa especificaciones en la ficha.

Pregunta frecuente desplegable. Open=False (icon/plus) / Open=True (icon/minus + respuesta). State: Default, Hover (surface/faint), Focus (anillo color/border/focus). Pregunta en role/heading-3-light, respuesta role/body color/text/secondary, línea superior border/default en color/border/default. Ícono icon/plus / icon/minus de icon/md. En código: <details>/<summary> o button con aria-expanded.

Movimiento: al abrir y al cerrar, la respuesta anima el alto (motion/duration/expand) y la opacidad (motion/duration/base) con motion/easing/out. Con reduced motion, el alto cambia de golpe y queda el fundido (motion/duration/fade).

Sin respuesta, la pregunta no se muestra (en código: si falta un dato, esa parte no se muestra).

## feature-block

- Figma: [1036-2535](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2535)
- Propiedades: Label; Title; Description; Show secondary image; Layout: Image left · Image right; Breakpoint: Desktop · Mobile

Bloque editorial destacado: imagen grande (y secundaria opcional) + eyebrow, título role/display-sm, bajada y button. Layout: Image left e Image right (se alternan); Breakpoint=Mobile apila. Props: Label, Title, Description, Show secondary image.

## file-upload

- Figma: [1113-2499](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2499)
- Propiedades: Label; Helper; State: Empty · Attached · Drag over · Error · Disabled

Zona para adjuntar un archivo al formulario (planos, planillas). Empty: zona con icon/plus y ayuda; Attached: nombre del archivo + quitar. Props: Label y Helper (formatos y tamaño máximo). En código: <input type="file"> real con drag & drop.

Un solo archivo. State: Empty, Attached, Drag over (archivo arrastrado encima: borde color/border/strong y fondo color/surface/hover), Error (borde color/border/error; el mensaje reemplaza a la ayuda, en color/text/error: "El archivo supera los 25 MB. Formatos: …" o "El formato no está admitido. Formatos: …") y Disabled. Formatos: PDF, DWG, JPG o PNG. Tamaño máximo según el formulario: en Contacto, 25 MB (en código, max-size; 10 por defecto).

Con prefers-contrast: more, el borde pasa a color/border/strong, como input.

## filter-bar

- Figma: [1068-5165](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5165)
- Propiedades: State: Default · Applied; Breakpoint: Desktop · Mobile

Barra de filtros de la tabla de variantes (visible con Filtros activos). Ficha v2: fondo surface/soft, sin líneas, padding vertical space/padding/2xl y lateral layout/gutter, con «Limpiar filtros» debajo de los filtros (el fondo ocupa el ancho de su contenedor: dentro de variants-table, el ancho del contenido; adentro lleva layout/gutter). Celdas select Type=Filter separadas por divisores border/subtle, gap space/gap/lg. State: Default (todos en "Todos") y Applied (al menos un filtro elegido: la celda en Filled y link "Limpiar filtros" con button Underline a la derecha).

## filter-chip

- Figma: [1238-3693](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1238-3693)
- Propiedades: Label; State: Default · Hover · Focus

Filtro aplicado que se puede quitar (todo el chip es el botón; en código: button con aria-label "Quitar filtro <Label>"). Padding xs/sm, radius/control, role/body-sm y los estados de choice-chip (Hover: borde color/text/primary; Focus: anillo separado, DESIGN.md §7). Se usa en filter-panel.

## filter-panel

- Figma: [1225-13576](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-13576)
- Propiedades: Title; Summary; Show summary; Show applied; Show categories; Show category list; Breakpoint: Desktop · Mobile

Panel de filtros que se abre desde el botón Filtrar del catalog-toolbar. Desktop: panel lateral de 560 sobre scrim (color/overlay/scrim). Mobile: pantalla completa (modos Mobile de Dimension y Type). Contenido: filter-row (checkbox) + footer con button Underline "Borrar todo" y Filled "Ver N productos". Filtros aplicados: fila "applied" con filter-chip (8 lugares, 3 visibles) que se quitan uno por uno; Show applied la oculta cuando no hay filtros. "Borrar todo" los quita todos.

Show categories (solo Mobile, en Productos; en código el atributo show-categories): tabs Características · Categorías debajo del encabezado, gap space/gap/xl y línea inferior border/default en color/border/subtle. Categorías muestra los grupos de catalog-nav (el de la categoría actual abierto) y oculta filtros, resumen, chips y footer; sus links cambian el listado y cierran el panel. Show category list representa la tab Categorías activa: en código no es una prop, es el estado de la tab.

## filter-row

- Figma: [1225-3405](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-3405)
- Propiedades: Label; Open: True · False; State: Default · Hover · Focus

Fila desplegable del panel de filtros (filter-panel). Mismo patrón que catalog-nav-group: encabezado con icon-button icon/plus / icon/minus y borde inferior color/border/subtle. Opciones = checkbox; trae 8 lugares (6 visibles): ocultá o mostrá los que necesites y editá Label/Checked en cada uno. Estados: Hover (borde color/border/default + icon-button Hover), Focus (borde color/border/focus). Tocar el encabezado alterna Open.

## footer

- Figma: [788-3104](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-3104)
- Propiedades: Breakpoint: Desktop · Mobile

Footer de Macroled Arq, último bloque de todas las páginas. Sigue el modo de la página (fondo color/surface/default, línea superior color/border/subtle): blanco; con Iluminar (Productos y Colecciones) pasa a Dark junto con el resto. Desktop: marca a la izquierda y tres columnas (Productos, Información, Redes). Mobile: marca, columnas y legal apilados. Los links son instancias de footer-link.

## footer-link

- Figma: [788-2930](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-2930)
- Propiedades: Label; Show icon; Icon; State: Default · Hover · Pressed · Focus

Link del footer. Estados: Default, Hover, Pressed y Focus. Propiedades: Label, Show icon (para redes) e Icon.

## form-message

- Figma: [1311-4871](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4871)
- Propiedades: Message; Tone: Success · Error

Mensaje de resultado debajo del botón de envío. Tone=Success (color/text/success) / Error (color/text/error) y role/body (sin ícono: no hay icon/check ni icon/alert en la librería). En código: role="status" (éxito) o role="alert" (error). Contacto: después de enviar solo se muestra el mensaje de confirmación.

Movimiento: al aparecer, el mensaje funde y sube space/gap/sm (motion/duration/slow, motion/easing/out); al ocultarse, sin animación. Con reduced motion, solo el fundido (motion/duration/fade).

## form-section-header

- Figma: [1303-4382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4382)
- Propiedades: Number; Show number; Label

Título de sección de un formulario: label en role/heading-3 (color/text/primary) y número opcional en role/label (color/text/tertiary), alineados por baseline a space/gap/md, con borde inferior border/default en color/border/default y padding inferior space/padding/sm. Ancho FILL. En código no es un componente: es el estilo del <legend> de cada <fieldset> de arq-form-contacto.

## gallery-thumb

- Figma: [920-2474](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2474)
- Propiedades: State: Default · Hover · Selected · Focus

Miniatura de la galería de producto, proporción 5:4 (105 × 84). La imagen se reemplaza en el fill de la instancia (placeholder surface/subtle). Default, Hover (border/hover), Selected (border/strong, imagen mostrada), Focus (anillo separado, DESIGN.md §7).

## hero

- Figma: [1311-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4340)
- Propiedades: Eyebrow; Show eyebrow; Title; Description; Show description; Show button; Breakpoint: Desktop · Mobile; Size: Default · Compact

Hero de página compartido por Home y Contacto: media (imagen o video; reemplazá el relleno de "media" en la instancia), scrim, eyebrow (role/label), título role/display (Size=Default) o role/display-lg (Size=Compact), bajada opcional y button Outline opcional. Textos claros sobre la foto (el scrim hero/scrim asegura el contraste). El navbar no es parte del hero: va aparte, con Theme=Transparent, superpuesto arriba (la instancia del set es referencia). Size: Default · Compact. Compact es el hero más bajo de Contacto y de las páginas internas, con el título en role/display-lg. Alto en código: Default 70svh (Home: 100svh); Compact con un mínimo de 41svh en Desktop y 47svh en Mobile (la proporción del set: 520 y 480 contra 880 y 720), y crece si el texto no entra. Props: Eyebrow, Title, Description, Show eyebrow, Show description, Show button, Size.

## icon-button

- Figma: [752-2882](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2882)
- Propiedades: Icon; Size: Default · Large; Background: None · Surface · Subtle · Outline; State: Default · Hover · Pressed · Focus · Disabled

Botón de ícono. Size: Default (24 × 24, ícono icon/md; navbar, tablas y controles chicos) o Large (48 × 48 = padding space/padding/sm-md + ícono icon/xl de 24; acciones de bloques, como el acordeón). Background: None (sin fondo, sobre surface/default), Surface (fondo surface/default, para cuando va sobre otro surface: faint, subtle…) y Subtle (fondo surface/subtle; para que la acción se note entre mucha información, como la descarga de cada fila de la tabla de variantes). State: Default, Hover (None: surface/hover; Surface: surface/subtle; Subtle: surface/selected), Pressed (Subtle: surface/strong; el resto surface/selected), Focus (anillo border/focus). Prototipo: Default pasa a Hover al pasar el mouse y Hover a Pressed al presionar. Cambiar el ícono con la propiedad Icon.

State=Disabled: ícono en color/icon/disabled, sin interacción (atributo disabled nativo). Outline (borde de border/default, sin fondo; Size=Default en color/border/strong, Size=Large en color/border/default; Hover surface/hover, Pressed surface/selected, Disabled border/disabled): acción con ícono solo que acompaña a un button Outline, como la descarga de cada fila de variants-table y de la tabla de Descargas (Size=Large, Desktop y Mobile). En Size=Large el ícono de 24 lleva el trazo escalado (1,5 px).

Pressed: además del fondo, se achica a motion/scale/pressed (0,97) con motion/duration/fast y motion/easing/out, como button. La variante State=Pressed no muestra la escala (es movimiento); manda este texto. Con movimiento reducido no cambia de tamaño.

## input

- Figma: [930-2364](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=930-2364)
- Propiedades: Label; Show label; Helper; Show helper; Type: Text · Select · Textarea; State: Empty · Filled · Focus · Error · Disabled; Open: False · True

Campo de formulario: label role/body-regular en color/text/primary y caja de 40 con borde border/default en color/border/default y fondo color/surface/default. Type: Text, Select (flecha; en Focus la lista está abierta) y Textarea. State: Empty (placeholder), Filled, Focus (anillo separado de border/strong en color/border/focus), Error (borde color/border/error y mensaje) y Disabled. Props: Label, Show label (false para campos sin etiqueta, como el email del Home), Helper y Show helper. En Error el mensaje siempre se ve. Sobre fondos oscuros: modo Dark.

Textarea: 4 filas visibles (campo de 97: 4 × 20 + padding 16 + línea 1); solo se agranda hacia abajo (resize: vertical).

Movimiento (motion/easing/out): el menú de Type=Select crece desde el campo (escala 0.97 → 1, motion/duration/base) y funde (motion/duration/fade); al cerrar, sin animación. El mensaje de Error crece (alto en motion/duration/base) y funde (motion/duration/fade): los campos de abajo se deslizan. Con reduced motion, solo los fundidos.

Con prefers-contrast: more, la caja pasa a color/border/strong (color/border/default no llega al 3:1 de WCAG para el borde de un control).

## line-card

- Figma: [1036-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2490)
- Propiedades: Label; Name; Description; Breakpoint: Desktop · Mobile; State: Default · Hover · Focus

Uso: líneas destacadas en el Home, en formato editorial (eyebrow, bajada y botón). No confundir con category-card ni family-card.

Tarjeta editorial de línea del Home: imagen, eyebrow, nombre role/heading-1, bajada y button Underline.

La imagen tiene la proporción bloqueada: al crecer la columna crece en alto sin deformarse.

## link-list

- Figma: [1303-4377](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4377)
- Propiedades: Title; Show link 3

Lista de links con título (role/body-lg-regular, color/text/secondary); título y links a space/gap/sm. Cada link es button Underline con ícono (expuesto para editar label y destino): icon/arrow-up-right para descargas o destinos externos, icon/arrow-right para navegación interna. Hasta 3 links (Show link 3). Uso: "Recursos técnicos" en Contacto.

## logo

- Figma: [751-4307](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=751-4307)
- Propiedades: Size: Default · Small · Compact

Logo de Macroled Arq. Default en desktop, Small en mobile.

## mega-link

- Figma: [840-2070](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=840-2070)
- Propiedades: Name; Meta; Show meta; Show image; Show arrow; Type: Link · Group; State: Default · Hover · Focus; Open: False · True; Size: Default · Large (2026-10-13: se quitaron XL y Small)

Link del mega menú y del submenú mobile: nombre, bajada opcional (Show meta, para colecciones) y flecha. Type: Link (link simple; Size Default o Large) · Group (grupo desplegable con icon/plus / icon/minus, Open False · True). State: Default, Hover y Focus. Size: solo Default y Large. Show image: miniatura de 60 × 60 al final de la fila (submenús mobile de Lámparas y artefactos y Colecciones). La flecha es arrow-right en el mega menú y chevron-right en la lista de Productos mobile (entra a un submenú).

## mega-menu

- Figma: [841-2282](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=841-2282)
- Propiedades: Tab: Por espacio · Lámparas y artefactos · Colecciones

Mega menú de Productos (desktop). Se abre desde nav-link "Productos" (Open=True) y se muestra debajo del navbar. Tres pestañas: Por espacio (Exterior / Interior), Lámparas y artefactos, y Colecciones. La imagen de la derecha se puede cambiar según la pestaña. Es un solo componente: categorías, links y el texto de "Ver todo…" salen de los datos.

## nav-link

- Figma: [752-2866](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2866)
- Propiedades: Label; Has dropdown; Breakpoint: Desktop · Mobile; State: Default · Hover · Pressed · Focus · Current; Open: False · True; Theme: Default · Inverse

Link del navbar. State: Default, Hover, Pressed, Current (página actual) y Focus. Open=True: desplegable abierto (aria-expanded="true"). Has dropdown muestra la flecha: hacia abajo en desktop (gira al abrir) y hacia la derecha en mobile (entra al submenú).

State=Current: sección activa (indicador visible); en Desktop el label pasa a role/body-medium. En código: aria-current="page".

Theme=Inverse: para navbar Theme=Transparent sobre foto (label color/text/inverse, indicador, subrayado y chevron en color/icon/inverse).

## navbar

- Figma: [753-2907](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=753-2907)
- Propiedades: Breakpoint: Desktop · Mobile; Mode: Default · Menu · Search · Products · Colecciones · Interior · Exterior · Lámparas y artefactos; Theme: Default · Transparent

Barra de navegación de Macroled Arq. Breakpoint: Desktop · Mobile. Mode: Default, Search (buscador abierto), Menu (menú mobile abierto), Products (submenú de Productos en mobile, con "volver") y los cuatro submenús que abre Products en mobile: Interior, Exterior, Lámparas y artefactos y Colecciones (volver con el nombre del nivel, links en mega-link Size=Large y "Ver todo…" al pie; Lámparas y artefactos y Colecciones llevan miniatura). En desktop, Productos abierto = nav-link Open=True con mega-menu debajo. Theme: Default · Transparent (sobre la foto del hero; pasa a Default al hacer scroll). Theme=Transparent: fondo translúcido color/overlay/translucent + background blur blur/backdrop. El link de la página actual va en State=Current; el que despliega un menú usa Has dropdown. Theme=Transparent con Mode=Search (desktop): la barra sigue translúcida y search-field queda igual que en Default (fondo color/surface/default, texto y cruz en color/text/primary). Sobre la foto, la lupa y el menú (icon-button) van en modo Dark local (en código, data-arq-theme="dark"): ícono claro, hover y foco del modo Dark. Con Mode=Menu y Products (mobile) la barra pasa a Default: las variantes Transparent son iguales a las Default.

Con prefers-reduced-transparency: reduce o prefers-contrast: more, Theme=Transparent se ve como Default también sobre la foto.

## option-group

- Figma: [921-2560](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2560)
- Propiedades: Label; Type: Tiles · Select · Swatches

Grupo de configuración con etiqueta. Type: Tiles (fila de option-tile en Fill, role=radiogroup), Swatches (swatch-picker; es el que se usa para elegir el acabado en la ficha) y Select (select Field con menú; queda disponible para otros usos).

## option-tile

- Figma: [921-2487](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2487)
- Propiedades: Label; State: Default · Hover · Selected · Focus · Disabled

Uso: configurar el producto en la ficha (altura, potencia, temperatura), dentro de option-group Type=Tiles. No confundir con choice-chip, que es para formularios.

Opción seleccionable de configuración (altura, potencia, temperatura…), funciona como radio (role=radio). Sin caja: solo línea inferior. Default: sin fondo, border/default abajo, text/secondary. Hover: surface/faint, border/hover, text/primary. Selected: surface/soft, border/strong abajo, text/primary. Focus: anillo border/focus. Disabled: border/disabled y text/disabled, tachado (combinación no disponible). Padding space/padding/sm-md × space/padding/md, texto role/body-regular. En un grupo va en Fill.

## page-header

- Figma: [1244-4016](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4016)
- Propiedades: Title; Description; Show breadcrumb; Show description; Show back; Show action; Breakpoint: Desktop · Mobile; Type: List · Detail

Encabezado de páginas de listado (Productos, Colecciones, Descargas, Contacto). Título role/display-lg en Desktop Type=List y role/display en Mobile y en Type=Detail. Bajada role/body en Desktop Type=List y role/body-lg en el resto. Desktop: título a la izquierda y bajada a la derecha; Mobile: todo apilado (modos Mobile de Dimension y Type). Props: Title, Description, Show breadcrumb, Show description; breadcrumb expuesto. Type=List (breadcrumb + título, bajada a la derecha en desktop) · Type=Detail (volver + título con bajada debajo + acción a la derecha, p. ej. Comparativa). Props Detail: Show back, Show action (button expuesto).

Anchos: bajada de List hasta layout/measure; columna de título y bajada de Detail hasta layout/measure-wide. El componente aplica su propio layout/gutter (como navbar y footer). El breadcrumb muestra los niveles que correspondan a la página.

## pdf-cover-title

- Figma: [1907-27095](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-27095)
- Propiedades: Eyebrow; Name; SKU

Bloque de título de la portada PDF: eyebrow role/label (color/text/tertiary), nombre role/display (color/text/primary) y SKU role/body-lg (color/text/secondary). Gap space/gap/sm-md, padding inferior space/padding/xl-2xl. Escala Type en modo Mobile (display = 40).

## pdf-footer

- Figma: [1907-27023](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-27023)
- Propiedades: Note; Page

Pie de página de la ficha PDF: nota (role/body-sm) a la izquierda y paginado (role/label) a la derecha, ambos color/text/tertiary. Borde superior border/default + color/border/subtle, padding superior space/padding/md.

## pdf-header

- Figma: [1907-27058](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-27058)
- Propiedades: Meta; Meta 2; Show meta 2

Encabezado de la ficha PDF: logo (Size=Small) y metadatos role/label en mayúsculas (color/text/tertiary), separados por space/gap/md. Portada: Meta="Ficha técnica" y Show meta 2 apagado. Páginas internas: nombre + SKU. Borde inferior border/default + color/border/subtle, padding inferior space/padding/md.

## pdf-page

- Figma: [1907-27212](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-27212)
- Propiedades: Type: Portada · Especificaciones

Página A4 (794×1123) de la ficha técnica PDF. Type=Portada: pdf-header (Meta="Ficha técnica"), imagen de producto (fill color/surface/subtle + imagen), pdf-cover-title y pdf-footer. Type=Especificaciones: pdf-header (nombre + SKU), tres pdf-spec-group y pdf-footer con aviso legal. Fondo color/surface/default; padding space/padding/xl-2xl arriba, space/padding/2xl a los lados, space/padding/xl abajo. Escala Type en modo Mobile. Todo el contenido sale de Typesense.

## pdf-spec-group

- Figma: [1907-27070](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-27070)
- Propiedades: Title

Grupo de especificaciones de la ficha PDF: título role/label en mayúsculas (color/text/primary) con borde inferior border/default + color/border/strong y padding inferior space/padding/sm-md, seguido de instancias de pdf-spec-row. Trae 6 filas: ocultá las que sobren en la instancia (las filas salen de los datos de Typesense).

## pdf-spec-row

- Figma: [1907-8279](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1907-8279)
- Propiedades: Label; Value

Fila de especificación de la ficha PDF. Etiqueta role/body (color/text/secondary, ancho fijo 260) y valor role/body-lg-regular (color/text/primary, FILL). Padding vertical space/padding/sm-md, gap space/gap/lg, borde inferior border/default + color/border/subtle. Escala Type en modo Mobile. Versión densa de spec-row para impresión.

## product-card

- Figma: [990-2372](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=990-2372)
- Propiedades: Name; Meta; Show meta; Show finishes; Show compare; Size: Large · Small; State: Default · Hover · Focus

Tarjeta de producto o familia, siempre vertical (imagen 7:10). Size: Large (listados de Productos, Colecciones y página de colección) y Small (ficha → "Otras familias de la colección"). State: Default, Hover y Focus. Hover y Focus cambian la imagen (no hay borde): Light muestra estudio con luz apagada y en hover contexto con luz apagada; con Iluminar (Dark) muestra estudio con luz encendida y en hover contexto con luz encendida. La variante Hover de Figma es una referencia estática; las reglas completas están en DESIGN.md §8 · Imágenes de product-card. Props: Name, Meta (tipo de producto o datos técnicos, admite dos líneas), Show meta, Show finishes (acabados con swatch Size=Small, 16 × 16, en Large y en Small; se reemplaza el color de cada uno; con más de un acabado se eligen: el elegido, por defecto el negro, lleva State=Selected y todos el Hover del swatch, sin crecer, y al elegir otro la imagen de la card pasa a la de ese acabado; con uno solo no se ve elegido). Size=Small (y Large hasta 767 px) apila el nombre y los acabados en columna (gap space/gap/sm), con el nombre a 20/28 (role/body-xl; en Mobile role/heading-3), la info a space/gap/md y los acabados a space/gap/sm y Show compare (checkbox "Comparar"). En código la tarjeta es un link al producto y el checkbox va fuera de ese link. El ancho lo define la grilla; la imagen mantiene la proporción.

En grillas de listado: ancho mínimo layout/card-min (280); la grilla suma columnas sola (auto-fill), así la imagen 7:10 no crece de más en pantallas grandes.

## product-gallery

- Figma: [920-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2490)
- Propiedades: Breakpoint: Desktop · Mobile

Galería de la ficha: imagen principal + fila de gallery-thumb (la primera en Selected). Con Iluminar en On, la imagen principal cambia por la luminaria encendida. Desktop 5 miniaturas, Mobile 4 con scroll horizontal.

## search-dropdown

- Figma: [796-2271](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=796-2271)
- Propiedades: State: Results · No results

Desplegable de resultados en desktop. State: Results · No results. Aparece debajo del campo cuando hay texto escrito, con el mismo ancho que el campo. Muestra hasta 4-5 productos y "Ver todos los resultados". Con el campo vacío no se muestra.

## search-card

- Figma: set `2555:8441` (documentado desde el código, sin revisión de diseño)

Tarjeta de producto recomendado del search-sheet: solo la imagen en `ratio/square` y el nombre en `role/body-regular`. No lleva tipo de producto, acabados ni comparar: no es una product-card. Toda la tarjeta es un link; Hover y Focus: zoom mínimo de la imagen (escala 1.05, recortada por el recuadro); Focus suma el anillo separado.

## search-collection

- Figma: set `2547:8168` (documentado desde el código, sin revisión de diseño)

Resultado de búsqueda de una colección, discreto: miniatura chica (layout/search-thumb) y nombre, con lo que coincide con la búsqueda en color/text/primary y el resto en tertiary. Va a la derecha del search-sheet en Desktop.

## search-sheet

- Figma: set `2549:8722` (página Componentes › 2 · Navegación › Búsqueda · top sheet) y ficha `doc/search-sheet` (`2551:32422`). Documentado a partir del código (2026-10-15): falta la revisión de diseño. Sus piezas están como sets aparte: `search-field-line` (`2547:8166`, = `type="line"`), `search-result-simple` (`2547:8167`, = `type="simple"`) `search-collection` (`2547:8168`), `search-card` (`2555:8441`) y `search-see-all-simple` (`2574:8361`)
- Código: es la búsqueda del navbar (`search="sheet"`, por defecto); `type="line"` en search-field; demo en Desktop, Tablet y Mobile en demo/index.html

Búsqueda del sitio como top sheet que baja desde arriba con scrim: barra (logo + cerrar), search-field Type=Line y, con el campo vacío, productos recomendados (search-card, imagen cuadrada y nombre, en una fila con scroll) y un button Underline «Ver todos los productos»; al escribir, los productos y colecciones que coinciden. Los resultados van en dos grupos: Productos (search-result Type=Simple: miniatura de 100 y nombre en gris con lo que coincide en negro; hover en negro) y, discretas, Colecciones (search-collection) a la derecha en Desktop. Desktop, Tablet y Mobile (el navbar con search="inline" conserva search-dropdown y search-screen). TODO: revisión de diseño; decidir si las variantes Line y Simple pasan a ser Type de search-field y search-result (hoy son sets aparte en Figma).

## search-field

- Figma: [795-2179](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2179)
- Propiedades: Show close; State: Empty · Focus · Filled

Campo de búsqueda. En desktop reemplaza a la lupa dentro del navbar y la cruz cierra la búsqueda. En mobile va sin cruz (Show close = false), junto a la flecha de volver. Estados: Empty, Focus (borde color/border/focus de border/focus) y Filled. En código suma `type="line"` (solo línea inferior y lupa a la izquierda, para el search-sheet): variante de prueba, no está en Figma.

## search-result

- Figma: [789-3045](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=789-3045)
- Propiedades: Name; Meta; Show image; State: Default · Hover · Active · Focus

Resultado de búsqueda: miniatura, nombre, SKU y flecha. Default, Hover, Active (resaltado al navegar con flechas; el foco sigue en el campo) y Focus. Propiedades: Name, Meta (SKU) y Show image.

## search-screen

- Figma: [796-2351](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=796-2351)
- Propiedades: State: Empty · Results · No results

Búsqueda en mobile, a pantalla completa. La flecha vuelve a la página (cierra la búsqueda). State: Empty (campo en foco, sin contenido), Results y No results.

## search-see-all

- Figma: [795-2206](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2206)
- Propiedades: State: Default · Hover · Focus

Última fila de los resultados: lleva a la página de resultados completos. Default, Hover y Focus. El término buscado va en SemiBold con color/text/primary.

## section-header

- Figma: [1036-2448](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2448)
- Propiedades: Title; Description; Breakpoint: Desktop · Mobile; Type: Link · Description · Title · Stacked

Encabezado de bloque dentro de una página (no de la página: eso es page-header). Título role/heading-2. Type: Link (+ Ver todo), Description (bajada al costado, ancho máximo layout/measure), Title (mobile) y Stacked (bajada debajo). Sin separador. Gap título–bajada space/gap/sm-md; textos–link space/gap/lg. En Mobile, Link pasa a Title: el link no se muestra en el encabezado y la página pone un button al final del bloque. En código: un <h2> por bloque.

## select

- Figma: [921-2544](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2544)
- Propiedades: Name; Label; Value; Show swatch; Type: Field · Filter; State: Default · Hover · Focus · Disabled · Filled; Open: False · True

Selector con menú desplegable (arq-select). Dos tipos: etiqueta arriba (Type=Field: role/label de 12 px; Type=Filter: role/label-lg de 14 px con Size=Default o role/label de 12 px con Size=Small; text/tertiary) y un trigger con padding vertical space/padding/sm-md. Type=Field: línea inferior border/strong y gap 0 entre etiqueta y trigger. Type=Filter: gap space/gap/sm entre etiqueta y trigger y sin línea (solo Disabled muestra la línea border/disabled). En los dos, gap space/gap/sm-md entre swatch, texto y chevron, texto role/body-regular y chevron. Type=Field: campo del configurador; ancho del contenedor; swatch/md y chevron icon/md. Type=Filter: celda de la filter-bar y del glosario, y selects de compare-product (Size=Small, sin opción «Todos»); mide al menos layout/select-filter; swatch/sm y chevron icon/sm; Filled = filtro elegido, valor en role/body-medium. Hover (los dos): fondo color/surface/faint en el trigger; el texto no cambia. Open: mismo fondo que Hover, chevron hacia arriba y select-menu debajo (Field: Finishes o Text; Filter: Filter). Focus: anillo border/focus de border/strong alrededor del trigger. Disabled: text/disabled y línea border/disabled. Props: Name (valor del Field), Label y Value (Filter; en Filled el valor elegido va como override) y Show swatch (muestra u oculta la muestra de acabado; en código, show-swatch). Size (solo cambia en Type=Filter): Default = etiqueta role/label-lg de 14 px (filter-bar, Descargas); Small = etiqueta role/label de 12 px (compare-product). Type=Field es siempre Size=Default. Size=Small (compare-product): sin la opción «Todos» y el menú abre del ancho del campo, para no salirse de las columnas angostas de la comparativa Mobile.

## select-menu

- Figma: [1061-4867](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1061-4867)
- Propiedades: Type: Finishes · Filter · Text

Lista desplegable de select (hasta 7 opciones). Fondo surface/default, borde border/default, sin sombra. Type: Finishes (ancho del campo, todas con muestra) y Filter (ancho propio; primera opción "Todos" sin muestra). Hereda el modo Dark.

## select-option

- Figma: [921-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2500)
- Propiedades: Name; Show swatch; State: Default · Hover · Selected · Focus · Disabled

Opción de select-menu. Muestra opcional (Show swatch; swatch/sm con border/default) + nombre role/body. Default sin fondo, Hover surface/faint, Selected nombre en role/body-medium, Focus (resaltada con las flechas): mismo fondo que Hover (surface/faint), sin anillo; la elegida se distingue por role/body-medium. Separador inferior border/subtle. Padding space/padding/md, gap space/gap/sm. Sirve para acabados y para "Todos" o valores sin muestra. Disabled: opción no disponible (texto color/text/disabled).

## sku

- Figma: [920-2539](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2539)
- Propiedades: Code; Size: Default · Compact · Underline; State: Default · Hover · Copied

Código de producto con botón de copiar. Size: Default (bloque del configurador, con etiqueta SKU) y Compact (fila de la tabla de variantes). State: Default (ícono icon/secondary), Hover (ícono icon/primary), Copied (confirmación "Copiado", text/success).

Textos largos: el código se parte en varias líneas, nunca se corta. Si falla el portapapeles: el código queda seleccionado y se anuncia "Copialo con Ctrl+C" ("⌘C" en Mac) en lugar de "Copiado", en color/text/secondary.

Size=Underline: para columnas angostas y SKUs largos (glosario de la ficha). El código va en role/caption-medium subrayado, sin ícono ni etiqueta. Al hacer clic, State=Copied: «Copiado» (text/success) reemplaza al código en el mismo lugar, no al lado.

Movimiento: «Copiado» entra con un fundido (motion/duration/fade, motion/easing/out); vuelve al ícono sin animación.

## spec-list

- Figma: [922-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2500)
- Propiedades: Title

Lista de spec-row. En la ficha va en dos columnas dentro de accordion-item (una por versión o grupo de datos). Las filas se agregan o quitan según los datos de Typesense.

## spec-row

- Figma: [922-2497](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2497)
- Propiedades: Label; Value

Fila de especificación técnica (Ficha v2): etiqueta role/body-regular y valor role/body (Light), los dos en text/primary, uno al lado del otro. La etiqueta ocupa hasta 300 (max width) y el valor el resto. Separador inferior border/subtle. Padding space/padding/sm arriba y abajo, gap space/gap/md. Se usa dentro de spec-list. Textos largos: etiqueta y valor se parten en varias líneas; nunca se cortan.

## swatch

- Figma: [1063-4880](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1063-4880)
- Propiedades: Size: Small · Default · Large; State: Default · Hover · Selected · Focus · Disabled

Muestra de acabado (único swatch del sistema). Size: Small (16, menú, filtro y cards), Default (20, swatch-picker), Large (24, select Field y muestra elegida). State: Default (borde color/border/subtle para que se vea el acabado blanco), Hover (border/strong 2 px, color/border/strong), Selected (border/strong), Focus (anillo color/border/focus por fuera, no cambia el tamaño), Disabled (acabado sin combinación con las otras opciones elegidas: borde color/border/disabled y línea diagonal border/default en color/icon/tertiary; no se puede elegir). Siempre cuadrado (radius/control = 0). El relleno es la imagen del acabado del servidor de la empresa, en el fill de la instancia; fallback color/surface/subtle. En swatch-picker la elegida va en Size=Large, State=Selected. Cuando es solo visual (product-card, filtro) se usa State=Default. Interactivo: role=radio con aria-label del acabado.

## swatch-picker

- Figma: [1063-4881](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1063-4881)
- Propiedades: —

Selector de acabado por muestras (role=radiogroup): fila de swatch con gap space/gap/sm-md; la elegida en Selected. Alternativa a select Field cuando hay pocas opciones y se quieren ver todas.

## tab

- Figma: [929-2287](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=929-2287)
- Propiedades: Label; State: Default · Hover · Selected · Focus · Disabled

Pestaña (role="tab"). Label role/body-regular en color/text/secondary; Selected (aria-selected="true") en role/body-medium y color/text/primary, con subrayado de 1 px (border/default) en color/border/strong. Padding inferior space/padding/sm-md. State: Default, Hover, Selected, Focus y Disabled. Se agrupan en un contenedor role="tablist" con separación space/gap/xl y una línea color/border/subtle debajo. Lo usa el mega menú de Productos.

## toggle

- Figma: [926-3102](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=926-3102)
- Propiedades: Label; Show label; Checked: False · True; State: Default · Hover · Focus · Disabled

Interruptor con texto. El switch es siempre una instancia de toggle-switch, a la izquierda; el texto va a la derecha (gap space/gap/sm) en role/body-regular, en caja normal (p. ej. "Iluminar", "Solo diferencias"). Checked: False · True. State: Default · Hover · Focus · Disabled (texto color/text/disabled). Props: Label, Show label. role=switch con aria-checked.

## toggle-switch

- Figma: [1131-6383](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1131-6383)
- Propiedades: Checked: False · True; State: Default · Hover · Focus · Disabled

Switch del toggle (pista + círculo), compartido por todas las variantes de toggle. Checked: False · True. State: Default · Hover · Focus · Disabled. Pista 38 × 18, radius/pill, padding space/padding/2xs, borde border/default. Off: borde color/border/strong, círculo color/icon/primary; On: fondo y borde color/action/primary, círculo color/action/on-primary. Hover: surface/hover (Off) o action/primary-hover (On). Focus: anillo separado (DESIGN.md §7). Disabled: border/disabled, icon/disabled; On + Disabled: pista surface/strong. No se usa suelto: va dentro de toggle.

## variants-table

- Figma: [1068-5582](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5582)
- Propiedades: Show search; Filters: Off · On; Breakpoint: Desktop · Mobile

Tabla de variantes: Glosario de la ficha (el título va aparte como título de sección) y página Descargas (todos los SKU del catálogo). Botón Filtros en button Filled con icon/filter; en código abre filter-panel (panel lateral, como Descargas) en lugar de desplegar filter-bar (2026-10-15; Figma conserva Filters=On con filter-bar: TODO actualizar el set). A la derecha, descargas con button Outline + icon/download. Filas: variants-table-row Header + una Row por SKU. Ocupa el ancho del contenido: controles (toolbar y filter-bar) y filas llevan padding lateral layout/gutter, así la filter-bar queda dentro de los márgenes, alineada con la tabla (decisión 2026-10-05 · variants-table dentro del contenido). En mobile el scroll de las columnas llega al borde de la pantalla. Scroll: en Figma cada fila tiene su propio frame scroll porque Figma no puede sincronizar el desplazamiento entre instancias; es solo una especificación de qué columnas se mueven. En código la tabla usa un único contenedor con overflow-x: auto que envuelve header y filas, así los títulos se desplazan junto con los datos; las celdas de inicio (miniatura + SKU; hasta 1023 px solo la miniatura) y de fin (descarga) van con position: sticky (left: 0 / right: 0) y fondo propio (surface/default, surface/faint en Hover) para tapar lo que pasa por debajo.

Página Descargas: prop Show search (en código, show-search; apagada por defecto: la ficha no la usa): search-field «Buscar por SKU o nombre…» a la derecha, de layout/search-field (360), y Filtros a la izquierda como en la ficha (Filled; abierto con icon/close). En Descargas la instancia oculta las descargas de la barra y la cantidad, y la descarga de cada fila va sin borde (icon-button Background=None). Busca en el SKU, el producto y la colección. Sin filas que coincidan, un aviso. En código, las columnas fijas miden su contenido y el ancho que sobra se reparte entre las de datos.

Ficha v2: botón Filtros siempre Filled (abierto, con icon/close) y, al lado, la cantidad («4 variantes», role/body, text/secondary). La barra de filtros (filter-bar) va con fondo surface/soft. Encabezado en role/body-regular (text/tertiary); valores en role/body-lg-regular. Miniatura de 100 × 100 (layout/table-thumb = 100), filas de 116. Breakpoint=Mobile (hasta 767 px): en lugar de la tabla, una variants-table-card por variante (imagen, sku con descarga y datos en dos columnas), separadas space/gap/6xl.

## variants-table-card

- Figma: [2399-31269](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2399-31269)
- Propiedades: —

Tarjeta de variante de la tabla de variantes en Mobile (hasta 767 px), en lugar de la tabla. Imagen (16:10), sku subrayado con el botón de descarga (icon-button Size=Large, Background=Outline) y los datos en dos columnas: etiqueta role/body-sm (text/secondary) y valor role/body-sm-medium (text/primary), separador inferior border/subtle, padding vertical space/padding/sm. Entre tarjetas, space/gap/6xl. Cantidad de datos libre en código. No confundir con variants-table-row (Desktop).

## variants-table-row

- Figma: [923-2708](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=923-2708)
- Propiedades: Type: Header · Row; State: Default · Hover; Breakpoint: Mobile · Desktop

Fila de la tabla de variantes (Glosario de la ficha y página Descargas). Tres zonas: fixed-start (miniatura layout/table-thumb + sku Size=Underline) y fixed-end (descarga: icon-button Size=Large Background=Outline con icon/download, centrado en la columna; abre el modal con los archivos del SKU. El Header lleva «Descargas» en role/body-regular, centrado; en Mobile, sin título) quedan fijas; scroll contiene las columnas de datos y es lo único que se desplaza en horizontal, junto con sus títulos del Header. En Figma el scroll de cada fila es solo especificación; en código hay un único scroll compartido por header y filas (ver la descripción de variants-table). Type: Header (role/body-regular, text/tertiary) y Row (valores role/body-lg-regular, text/primary). Separador inferior border/subtle, gap space/gap/sm y padding lateral space/padding/sm y, en Row, vertical space/padding/sm (la miniatura y el botón de descarga no quedan pegados al borde de la línea). Row State: Default y Hover (surface/faint). Breakpoint: Desktop · Mobile (en Mobile el Header de la descarga va sin título).

Ficha v2: encabezado en role/body-regular (text/tertiary); valores en role/body-lg-regular (text/primary); miniatura layout/table-thumb (100) y fila de 116. En Mobile la tabla se reemplaza por variants-table-card.

## Íconos

20 íconos de trazo de 1 px (`icon/<nombre>`): arrow-down, arrow-left, arrow-right, arrow-up, arrow-up-right, chevron-down, chevron-left, chevron-right, chevron-up, close, copy, download, filter, filter-off, instagram, menu, minus, plus, search, youtube. Theme=Default: color/icon/primary · Theme=Inverse: color/icon/inverse (sobre foto o fondos oscuros). En código: SVG inline con `stroke="currentColor"`.
