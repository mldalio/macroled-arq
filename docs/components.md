# Componentes — Macroled Arq

Descripción de cada componente, copiada de Figma (página Componentes, campo *description* del set). Se lee junto con la ficha `doc/<nombre>` de la página Documentación y con DESIGN.md.

- Si este archivo no coincide con Figma, manda Figma y se actualiza este archivo.
- Al crear o modificar un componente en código, actualizar su **Estado en código** y su marca.

**71 de 74 en código.** ✅ en código (en `main`, con README y en la demo) · ⬜ pendiente · ⏸️ en espera de diseño.

| Componente | Etiqueta | Estado en código |
| --- | --- | --- |
| ✅ [accordion-item](#accordion-item) | `<arq-accordion-item>` | En código ([README](../src/components/accordion-item/README.md)) |
| ✅ [breadcrumb](#breadcrumb) | `<arq-breadcrumb>` | En código ([README](../src/components/breadcrumb/README.md)) |
| ✅ [breadcrumb-item](#breadcrumb-item) | `<arq-breadcrumb-item>` | En código ([README](../src/components/breadcrumb-item/README.md)) |
| ✅ [button](#button) | `<arq-button>` | En código ([README](../src/components/button/README.md)) |
| ✅ [carousel-controls](#carousel-controls) | `<arq-carousel-controls>` | En código ([README](../src/components/carousel-controls/README.md)) |
| ✅ [catalog-nav](#catalog-nav) | `<arq-catalog-nav>` | En código ([README](../src/components/catalog-nav/README.md)) |
| ✅ [catalog-nav-group](#catalog-nav-group) | `<arq-catalog-nav-group>` | En código ([README](../src/components/catalog-nav-group/README.md)) |
| ✅ [catalog-nav-item](#catalog-nav-item) | `<arq-catalog-nav-item>` | En código ([README](../src/components/catalog-nav-item/README.md)) |
| ✅ [catalog-nav-mobile](#catalog-nav-mobile) | — | Dentro de catalog-nav ([README](../src/components/catalog-nav/README.md)) |
| ✅ [catalog-nav-trigger](#catalog-nav-trigger) | — | Dentro de catalog-nav ([README](../src/components/catalog-nav/README.md)) |
| ✅ [catalog-toolbar](#catalog-toolbar) | `<arq-catalog-toolbar>` | En código ([README](../src/components/catalog-toolbar/README.md)) |
| ✅ [category-card](#category-card) | `<arq-category-card>` | En código ([README](../src/components/category-card/README.md)) |
| ✅ [checkbox](#checkbox) | `<arq-checkbox>` | En código ([README](../src/components/checkbox/README.md)) |
| ✅ [choice-chip](#choice-chip) | `<arq-choice-chip>` | En código ([README](../src/components/choice-chip/README.md)) |
| ✅ [compare-bar](#compare-bar) | `<arq-compare-bar>` | En código ([README](../src/components/compare-bar/README.md)) |
| ✅ [compare-group](#compare-group) | dentro de `<arq-compare-table>` | En código, como parte de compare-table ([README](../src/components/compare-table/README.md)) |
| ⬜ [compare-header](#compare-header) | `<arq-compare-header>` | Pendiente |
| ⬜ [compare-product](#compare-product) | `<arq-compare-product>` | Pendiente |
| ✅ [compare-row](#compare-row) | dentro de `<arq-compare-table>` | En código, como parte de compare-table ([README](../src/components/compare-table/README.md)) |
| ✅ [compare-slot](#compare-slot) | `<arq-compare-slot>` | En código ([README](../src/components/compare-slot/README.md)) |
| ✅ [contact-item](#contact-item) | `<arq-contact-item>` | En código ([README](../src/components/contact-item/README.md)) |
| ✅ [count-badge](#count-badge) | `<arq-count-badge>` | En código ([README](../src/components/count-badge/README.md)) |
| ✅ [cta-block](#cta-block) | `<arq-cta-block>` | En código ([README](../src/components/cta-block/README.md)) |
| ✅ [divider](#divider) | `<arq-divider>` | En código ([README](../src/components/divider/README.md)) |
| ✅ [download-item](#download-item) | `<arq-download-item>` | En código ([README](../src/components/download-item/README.md)) |
| ✅ [download-modal](#download-modal) | `<arq-download-modal>` | En código ([README](../src/components/download-modal/README.md)) |
| ✅ [family-card](#family-card) | `<arq-family-card>` | En código ([README](../src/components/family-card/README.md)) |
| ✅ [faq-item](#faq-item) | `<arq-faq-item>` | En código ([README](../src/components/faq-item/README.md)) |
| ✅ [feature-block](#feature-block) | `<arq-feature-block>` | En código ([README](../src/components/feature-block/README.md)) |
| ✅ [file-upload](#file-upload) | `<arq-file-upload>` | En código ([README](../src/components/file-upload/README.md)) |
| ✅ [filter-bar](#filter-bar) | `<arq-filter-bar>` | En código ([README](../src/components/filter-bar/README.md)) |
| ✅ [filter-chip](#filter-chip) | `<arq-filter-chip>` | En código ([README](../src/components/filter-chip/README.md)) |
| ✅ [filter-panel](#filter-panel) | `<arq-filter-panel>` | En código ([README](../src/components/filter-panel/README.md)) |
| ✅ [filter-row](#filter-row) | `<arq-filter-row>` | En código ([README](../src/components/filter-row/README.md)) |
| ✅ [footer](#footer) | `<arq-footer>` | En código ([README](../src/components/footer/README.md)) |
| ✅ [footer-link](#footer-link) | `<arq-footer-link>` | En código ([README](../src/components/footer-link/README.md)) |
| ✅ [form-message](#form-message) | `<arq-form-message>` | En código ([README](../src/components/form-message/README.md)) |
| ✅ [form-section-header](#form-section-header) | `<arq-form-section-header>` | En código ([README](../src/components/form-section-header/README.md)) |
| ✅ [gallery-thumb](#gallery-thumb) | `<arq-gallery-thumb>` | En código ([README](../src/components/gallery-thumb/README.md)) |
| ✅ [hero](#hero) | `<arq-hero>` | En código ([README](../src/components/hero/README.md)) |
| ✅ [icon-button](#icon-button) | `<arq-icon-button>` | En código ([README](../src/components/icon-button/README.md)) |
| ✅ [input](#input) | `<arq-input>` | En código ([README](../src/components/input/README.md)) |
| ✅ [line-card](#line-card) | `<arq-line-card>` | En código ([README](../src/components/line-card/README.md)) |
| ✅ [link-list](#link-list) | `<arq-link-list>` | En código ([README](../src/components/link-list/README.md)) |
| ✅ [logo](#logo) | `<arq-logo>` | En código ([README](../src/components/logo/README.md)) |
| ✅ [mega-link](#mega-link) | `<arq-mega-link>` | En código ([README](../src/components/mega-link/README.md)) |
| ✅ [mega-menu](#mega-menu) | `<arq-mega-menu>` | En código ([README](../src/components/mega-menu/README.md)) |
| ✅ [nav-link](#nav-link) | `<arq-nav-link>` | En código ([README](../src/components/nav-link/README.md)) |
| ✅ [navbar](#navbar) | `<arq-navbar>` | En código ([README](../src/components/navbar/README.md)) |
| ✅ [option-group](#option-group) | `<arq-option-group>` | En código ([README](../src/components/option-group/README.md)) |
| ✅ [option-tile](#option-tile) | `<arq-option-tile>` | En código ([README](../src/components/option-tile/README.md)) |
| ✅ [page-header](#page-header) | `<arq-page-header>` | En código ([README](../src/components/page-header/README.md)) |
| ✅ [product-card](#product-card) | `<arq-product-card>` | En código ([README](../src/components/product-card/README.md)); imágenes reales con TODO |
| ✅ [product-gallery](#product-gallery) | `<arq-product-gallery>` | En código ([README](../src/components/product-gallery/README.md)) |
| ✅ [search-dropdown](#search-dropdown) | `<arq-search-dropdown>` | En código ([README](../src/components/search-dropdown/README.md)) |
| ✅ [search-field](#search-field) | `<arq-search-field>` | En código ([README](../src/components/search-field/README.md)) |
| ✅ [search-result](#search-result) | `<arq-search-result>` | En código ([README](../src/components/search-result/README.md)) |
| ✅ [search-screen](#search-screen) | `<arq-search-screen>` | En código ([README](../src/components/search-screen/README.md)) |
| ✅ [search-see-all](#search-see-all) | `<arq-search-see-all>` | En código ([README](../src/components/search-see-all/README.md)) |
| ✅ [section-header](#section-header) | `<arq-section-header>` | En código ([README](../src/components/section-header/README.md)) |
| ✅ [select](#select) | `<arq-select>` | En código ([README](../src/components/select/README.md)) |
| ✅ [select-menu](#select-menu) | `<arq-select-menu>` | En código ([README](../src/components/select-menu/README.md)) |
| ✅ [select-option](#select-option) | `<arq-select-option>` | En código ([README](../src/components/select-option/README.md)) |
| ✅ [sku](#sku) | `<arq-sku>` | En código ([README](../src/components/sku/README.md)) |
| ✅ [spec-list](#spec-list) | `<arq-spec-list>` | En código ([README](../src/components/spec-list/README.md)) |
| ✅ [spec-row](#spec-row) | `<arq-spec-row>` | En código ([README](../src/components/spec-row/README.md)) |
| ✅ [swatch](#swatch) | `<arq-swatch>` | En código ([README](../src/components/swatch/README.md)) |
| ✅ [swatch-picker](#swatch-picker) | `<arq-swatch-picker>` | En código ([README](../src/components/swatch-picker/README.md)) |
| ✅ [tab](#tab) | `<arq-tab>` | En código ([README](../src/components/tab/README.md)) |
| ⏸️ [tag](#tag) | `<arq-tag>` | En espera de diseño |
| ✅ [toggle](#toggle) | `<arq-toggle>` | En código ([README](../src/components/toggle/README.md)) |
| ✅ [toggle-switch](#toggle-switch) | — | Dentro de toggle ([README](../src/components/toggle/README.md)) |
| ✅ [variants-table](#variants-table) | `<arq-variants-table>` | En código ([README](../src/components/variants-table/README.md)) |
| ✅ [variants-table-row](#variants-table-row) | — | Dentro de variants-table ([README](../src/components/variants-table/README.md)) |

### Componentes de layout de página (sin set en Figma)

Salen de las pantallas de Final, no de la página Componentes, y no cuentan en el total de arriba. Decisión: `docs/decisiones.md`, 2026-10-02 · Layout de página.

| Componente | Etiqueta | Para qué |
| --- | --- | --- |
| ✅ section | `<arq-section>` | Bloque de página: gutter, padding de sección y encabezado → contenido → acción ([README](../src/components/section/README.md)) |
| ✅ grid | `<arq-grid>` | Grilla de tarjetas; en Mobile apila, dos columnas o carrusel ([README](../src/components/grid/README.md)) |
| ✅ project-mosaic | `<arq-project-mosaic>` | Mosaico de fotos de proyectos del Home (DESIGN.md §12) ([README](../src/components/project-mosaic/README.md)) |
| ✅ featured-products | `<arq-featured-products>` | Productos destacados del Home, por grupo, con datos del catálogo ([README](../src/components/featured-products/README.md)) |

### Páginas

| Página | Embed | Demo |
| --- | --- | --- |
| ✅ Home | [src/pages/home.html](../src/pages/home.html) | `demo/home.html` |

## accordion-item

- Figma: [922-2645](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2645)
- Propiedades: Title; Open: False · True; State: Default · Hover · Focus; Breakpoint: Desktop · Mobile

Uso: bloques de especificaciones de la ficha (características lumínicas, eléctricas, materiales), con spec-list adentro. No confundir con faq-item.

Ítem de acordeón de la ficha (botón con aria-expanded). Título role/heading-2. Open=False: sin fondo, línea inferior border/default, ícono plus en icon-button Size=Large, Background=None (48 × 48, ícono 24). Open=True: fondo surface/faint, ícono minus en icon-button Size=Large, Background=Surface (48 × 48, ícono 24), divisor border/default y contenido libre (en la ficha, spec-list). Padding space/padding/xl-2xl arriba (y abajo cerrado), space/padding/2xl a los lados (y abajo abierto); gap space/gap/xl. State: Default, Hover (solo Open=False: surface/faint), Focus (anillo border/focus).

## breadcrumb

- Figma: [1244-12667](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-12667)
- Propiedades: Levels: 3 · 2

Levels=3: Inicio / Sección / Página. Levels=2: Inicio / Página. El separador vive en breadcrumb-item (Show separator); el ítem actual lo trae apagado.

Textos largos: los ítems intermedios se cortan con "…" (el texto completo queda en el link); el ítem actual se parte en varias líneas.

## breadcrumb-item

- Figma: [1053-4430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1053-4430)
- Propiedades: Label; Show separator; State: Default · Hover · Current

Un nivel del breadcrumb: Label (link) y separador opcional (Show separator). State=Current para la página actual: sin link ni separador. No se usa suelto, siempre dentro de breadcrumb.

Textos largos: si no es Current, se corta con "…"; Current se parte en varias líneas.

## button

- Figma: [907-2375](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=907-2375)
- Propiedades: Label; Show icon; Icon; Show underline; Show count; Show leading icon; Leading icon; Type: Filled · Outline · Underline; State: Default · Hover · Pressed · Focus · Disabled · Loading

Botón. Type: Filled (acción principal), Outline (borde) y Underline (texto subrayado). State: Default, Hover, Pressed, Focus y Disabled. Props: Label, Show icon, Icon y Show underline (solo Underline: en false queda como texto simple y el subrayado aparece en hover). Sobre fotos o fondos oscuros, poner el contenedor en modo Dark: Filled pasa a fondo claro.

Subrayado (Underline): 1 px en reposo y 2 px en hover y pressed. Focus: anillo separado del botón (capa focus-ring, 2 px, color/border/focus, 2 px de separación).

Show count: muestra un count-badge después del label (p. ej. "Filtrar 3" con filtros activos). En Filled usa Tone=Inverse. En código, el lector de pantalla dice "Filtrar, 3 filtros activos" (atributo count-label).

Show leading icon + Leading icon: ícono a la izquierda del label (p. ej. "Volver a productos" = Underline, sin subrayado, icon/chevron-left). State=Loading (solo Filled): envío en curso. En código, el label pasa a "Enviando…", el botón lleva aria-busy="true" y queda deshabilitado; no hay ícono de carga en la librería.

## carousel-controls

- Figma: [1410-17825](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1410-17825)
- Propiedades: Position: Start · Middle · End

Flechas anterior / siguiente para carruseles con scroll horizontal (mosaico de Colección, proyectos de Home). icon-button Size=Large con icon/arrow-left y icon/arrow-right. Position: Start (anterior deshabilitada) · Middle · End (siguiente deshabilitada); deshabilitada = icon-button State=Disabled (atributo disabled). En mobile no se muestran: el carrusel se desliza y la imagen siguiente asoma como indicador. El scroll (snap) se resuelve en código.

## catalog-nav

- Figma: [1035-2411](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2411)
- Propiedades: —

Sidebar de filtros del catálogo (Interior abierto, resto cerrado). Compuesto por instancias de catalog-nav-group.

## catalog-nav-group

- Figma: [1035-2410](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2410)
- Propiedades: Label; Open: True · False

Grupo acordeón de filtros. Open=True muestra la lista de catalog-nav-item y el signo –; Open=False muestra +.

## catalog-nav-item

- Figma: [1035-2382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2382)
- Propiedades: Label; Size: Large · Default; State: Default · Hover · Selected · Focus

Ítem de filtro del sidebar de catálogo. Selected muestra el indicador y peso Regular; Default usa text/tertiary.

Size: Default (role/body, 14) o Large (role/body-lg, 16) — en lugar de sobrescribir el estilo en cada instancia.

## catalog-nav-mobile

- Figma: [1207-3314](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1207-3314)
- Propiedades: Open: False · True

Navegación de categorías para Productos y Colecciones en mobile (equivalente de catalog-nav en desktop). Encabezado = catalog-nav-trigger (expuesto: editar Label con la selección actual). Tocar el encabezado alterna Open. Va como primer elemento de main.

## catalog-nav-trigger

- Figma: [1215-3337](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1215-3337)
- Propiedades: Label; Open: False · True; State: Default · Hover · Focus

Encabezado desplegable de catalog-nav-mobile. Mismo patrón que accordion-item: Open (False/True) × State (Default/Hover/Focus), hover con color/surface/faint, focus con color/border/focus e icon-button con icon/plus / icon/minus. Label = selección actual.

## catalog-toolbar

- Figma: [1244-4058](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4058)
- Propiedades: Count; Show iluminar; Breakpoint: Desktop · Mobile

Barra sobre la grilla de Productos y Colecciones: cantidad, toggle Iluminar, divider vertical y botón Filtrar (button Outline expuesto: con filtros activos, Show count + icon/filter-off). Mismo contenido en Desktop y Mobile.

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

## choice-chip

- Figma: [1113-2485](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2485)
- Propiedades: Label; State: Default · Hover · Selected · Focus · Disabled

Uso: elegir una opción en formularios (p. ej. motivo de consulta en Contacto). No confundir con option-tile, que configura el producto en la ficha.

Opción seleccionable en forma de chip para elegir entre pocas opciones visibles (p. ej. motivo de consulta en Contacto). Default, Hover (borde color/border/strong), Selected (fondo color/surface/selected), Focus (anillo color/border/focus) y Disabled. Se comporta como radio: una selección por grupo. En código: <input type="radio"> dentro de <label>.

## compare-bar

- Figma: [1233-3963](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3963)
- Propiedades: Title; Breakpoint: Desktop · Mobile

Barra fija inferior para comparar productos (hasta 3). Título + count-badge con la cantidad seleccionada, compare-slot (Filled/Empty) y acciones: button Underline "Borrar todo" y Filled "Comparar". Usa el tema oscuro (modo Dark de Color) fijado en cada variante. Desktop: slots Size=Default separados por divider; Mobile: slots Size=Compact.

## compare-group

- Figma: [1263-4320](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4320)
- Propiedades: Label

Título de grupo de la tabla comparativa (role/label en mayúsculas, borde inferior color/border/strong). Ancho FILL; en mobile queda fijo a la izquierda al hacer scroll horizontal.

## compare-header

- Figma: [1265-4330](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4330)
- Propiedades: Type: Default · Compact; Breakpoint: Desktop · Mobile

Cabecera de la comparativa. Type=Default: columna de controles (toggle "Solo diferencias") + compare-product por columna; es estática. Type=Compact: versión mini que aparece fija arriba (position: fixed/sticky bajo el navbar) cuando la cabecera Default sale de pantalla; usa compare-slot (Default en desktop con nombre, SKU y quitar; Compact en mobile con miniatura + nombre). En mobile las columnas (144 + gap 16) se alinean con compare-row Mobile y el scroll horizontal se sincroniza con la tabla; la columna de controles (120) queda fija.

## compare-product

- Figma: [1057-2522](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1057-2522)
- Propiedades: Name; SKU; State: Filled · Empty

Columna de producto en compare-header. State=Filled (foto, nombre, SKU, link, selects de familia y variante, quitar) / Empty (agregar luminaria, cuando hay menos de 3). Toma el ancho de la columna (FILL). La imagen mantiene proporción 1:1 (aspect ratio bloqueado): al cambiar el ancho de la columna, el alto de la media acompaña. La media tiene un tope de layout/compare-media-max.

## compare-row

- Figma: [1263-4317](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4317)
- Propiedades: Label; Value 1–3; Show value 1–3; Breakpoint: Desktop · Mobile

Fila de la tabla comparativa: etiqueta + un valor por producto (hasta 3; Show value 1–3 oculta las columnas sin producto). Valores en role/body-lg-regular. Breakpoint=Mobile: etiqueta de 120 fija (sticky left, fondo color/bg/default) y columnas de 160 dentro de un scroll horizontal. "Solo diferencias" activo: las filas con valores iguales se ocultan (y el compare-group si queda vacío). No confundir con spec-row (ficha).

## compare-slot

- Figma: [1233-3656](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3656)
- Propiedades: Name; Meta; Size: Default · Compact; State: Filled · Empty

Lugar de producto en compare-bar. State=Filled (foto en "thumb": reemplazá el relleno por la imagen del producto, nombre, meta e icon-button para quitar) / Empty (agregar producto). Size=Default para desktop, Compact (solo miniatura) para mobile. Size=Default tiene ancho máximo 400 para que no se estire en pantallas anchas.

## contact-item

- Figma: [1303-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4340)
- Propiedades: Label; Value; State: Default · Hover · Focus

Canal de contacto: etiqueta (role/label, color/text/tertiary) + valor (role/body-lg-regular). El valor es un link: mailto: para email, tel: para teléfono. Borde inferior color/border/subtle. Estados Default · Hover (subrayado) · Focus.

## count-badge

- Figma: [1231-3557](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1231-3557)
- Propiedades: Count; Tone: Primary · Inverse

Contador (productos seleccionados, filtros activos). Tone=Primary sobre superficies claras; Tone=Inverse dentro de elementos con color/action/primary (p. ej. button Filled). Crece con el número (mín. 20).

## cta-block

- Figma: [1265-4464](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4464)
- Propiedades: Title; Description; Type: Button · Newsletter; Breakpoint: Desktop · Mobile

Bloque de cierre de página con fondo color/bg/subtle y space/section/md. Type=Button (p. ej. "¿Necesitás ayuda para elegir?" en Comparativa) o Newsletter (input + button, Home). Props: Title, Description; button e input expuestos.

## divider

- Figma: [1244-3990](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-3990)
- Propiedades: Orientation: Horizontal · Vertical; Emphasis: Subtle · Default

Línea divisoria. Horizontal: ancho FILL en el contenedor. Vertical: alto fijo 20 (toolbar) o FILL (compare-bar). Emphasis: Subtle = color/border/subtle, Default = color/border/default.

## download-item

- Figma: [1101-5542](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1101-5542)
- Propiedades: Label; Emphasis: Default · Featured; State: Default · Hover · Focus

Opción del modal de descargas, con texto role/body-xl (más grande que un button) + icon/download; cada opción descarga su archivo directamente. Emphasis: Default (línea inferior border/subtle, Hover subraya el texto) o Featured (caja con border/strong y padding space/padding/lg; para el archivo principal, la ficha técnica; Hover surface/faint). State: Default, Hover, Focus.

## download-modal

- Figma: [1375-4948](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1375-4948)
- Propiedades: Title; Breakpoint: Desktop · Mobile

Modal de descargas con opciones download-item. Desktop: esquina inferior derecha, separado layout/gutter del borde, ancho layout/filter-panel (560). Mobile: abajo, a layout/gutter de los bordes y ocupando el ancho (alto según el contenido). Siempre con color/overlay/scrim detrás.

## family-card

- Figma: [1094-5766](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1094-5766)
- Propiedades: Name; Size: Default · Large; State: Default · Hover · Focus

Uso: otras familias de la misma colección en la ficha ("Explora la colección" y "Otras familias"); lleva a la ficha de esa familia. No confundir con category-card ni line-card (Home).

Card de otra familia de la colección (link a su ficha): imagen recortada (en el fill de la instancia; placeholder surface/subtle) + nombre, gap space/gap/md. Size: Default (200 × 200, ratio/square, nombre role/body-lg-medium; sección "Otras familias de la colección") y Large (328 × 469, ratio/portrait, nombre role/heading-3; sección "Explora la colección", que va sobre fondo oscuro: aplicar modo Dark a la sección para que el texto quede claro). State: Default, Hover (border/hover en la imagen), Focus (border/focus). Cuando hay más cards de las que entran, se ubican en un carrusel horizontal (patrón, no componente): contenedor con overflow-x: auto y scroll-snap-type: x mandatory, cards de ancho fijo con scroll-snap-align: start, gap space/gap/sm; sin flechas por ahora; en mobile el scroll puede llegar al borde de la pantalla.

## faq-item

- Figma: [1036-2430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2430)
- Propiedades: Question; Answer; Open: False · True; State: Default · Hover · Focus

Uso: preguntas frecuentes (Home): pregunta y respuesta en texto. No confundir con accordion-item, que agrupa especificaciones en la ficha.

Pregunta frecuente desplegable. Open=False (icon/plus) / Open=True (icon/minus + respuesta). State: Default, Hover (surface/faint), Focus (anillo color/border/focus). Pregunta en role/body-lg-regular, respuesta role/body color/text/secondary, borde inferior color/border/subtle. En código: <details>/<summary> o button con aria-expanded.

> **No coincide con el set:** el set y el Home usan línea arriba en `color/border/default`, y en código se sigue el set (`docs/decisiones.md`, 2026-10-01 · faq-item). Falta corregir esta descripción y la ficha en Figma.

## feature-block

- Figma: [1036-2535](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2535)
- Propiedades: Label; Title; Description; Show secondary image; Layout: Image left · Image right; Breakpoint: Desktop · Mobile

Bloque editorial destacado: imagen grande (y secundaria opcional) + eyebrow, título role/display-sm, bajada y button. Layout: Image left e Image right (se alternan); Breakpoint=Mobile apila. Props: Label, Title, Description, Show secondary image.

## file-upload

- Figma: [1113-2499](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1113-2499)
- Propiedades: Label; Helper; State: Empty · Attached · Drag over · Error · Disabled

Zona para adjuntar un archivo al formulario (planos, planillas). Empty: zona con icon/plus y ayuda; Attached: nombre del archivo + quitar. Props: Label y Helper (formatos y tamaño máximo). En código: <input type="file"> real con drag & drop.

Un solo archivo. State: Empty, Attached, Drag over (archivo arrastrado encima: borde color/border/strong y fondo color/surface/hover), Error (borde color/border/error; el mensaje reemplaza a la ayuda, en color/text/error: "El archivo supera los 10 MB. Formatos: …" o "El formato no está admitido. Formatos: …") y Disabled. Formatos: PDF, DWG, JPG o PNG, hasta 10 MB.

## filter-bar

- Figma: [1068-5165](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5165)
- Propiedades: State: Default · Applied; Breakpoint: Desktop · Mobile

Barra de filtros de la tabla de variantes (visible con Filtros activos). Fondo surface/faint, líneas border/subtle arriba y abajo, padding vertical space/padding/md y lateral layout/gutter (componente de borde a borde: el fondo llega al borde y el contenido se alinea con la grilla). Celdas select Type=Filter separadas por divisores border/subtle, gap space/gap/lg. State: Default (todos en "Todos") y Applied (al menos un filtro elegido: la celda en Filled y link "Limpiar filtros" con button Underline a la derecha).

## filter-chip

- Figma: [1238-3693](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1238-3693)
- Propiedades: Label; State: Default · Hover · Focus

Filtro aplicado que se puede quitar (todo el chip es el botón; en código: button con aria-label "Quitar filtro <Label>"). Misma base que tag Outline (padding xs/sm, radius/control, role/body-sm) y los estados de choice-chip (Hover: borde color/text/primary; Focus: anillo separado, DESIGN.md §7). Se usa en filter-panel.

## filter-panel

- Figma: [1225-13576](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-13576)
- Propiedades: Title; Summary; Show summary; Show applied; Breakpoint: Desktop · Mobile

Panel de filtros que se abre desde el botón Filtrar del catalog-toolbar. Desktop: panel lateral de 560 sobre scrim (color/overlay/scrim). Mobile: pantalla completa (modos Mobile de Dimension y Type). Contenido: filter-row (checkbox) + footer con button Underline "Borrar todo" y Filled "Ver N productos". Filtros aplicados: fila "applied" con filter-chip (8 lugares, 3 visibles) que se quitan uno por uno; Show applied la oculta cuando no hay filtros. "Borrar todo" los quita todos.

## filter-row

- Figma: [1225-3405](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-3405)
- Propiedades: Label; Open: True · False; State: Default · Hover · Focus

Fila desplegable del panel de filtros (filter-panel). Mismo patrón que catalog-nav-group: encabezado con icon-button icon/plus / icon/minus y borde inferior color/border/subtle. Opciones = checkbox; trae 8 lugares (6 visibles): ocultá o mostrá los que necesites y editá Label/Checked en cada uno. Estados: Hover (borde color/border/default + icon-button Hover), Focus (borde color/border/focus). Tocar el encabezado alterna Open.

## footer

- Figma: [788-3104](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-3104)
- Propiedades: Breakpoint: Desktop · Mobile

Footer de Macroled Arq. Desktop: marca a la izquierda y tres columnas (Productos, Información, Redes). Mobile: marca, columnas y legal apilados. Los links son instancias de footer-link.

## footer-link

- Figma: [788-2930](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-2930)
- Propiedades: Label; Show icon; Icon; State: Default · Hover · Pressed · Focus

Link del footer. Estados: Default, Hover, Pressed y Focus. Propiedades: Label, Show icon (para redes) e Icon.

## form-message

- Figma: [1311-4871](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4871)
- Propiedades: Message; Tone: Success · Error

Mensaje de resultado debajo del botón de envío. Tone=Success (color/text/success) / Error (color/text/error) y role/body (sin ícono: no hay icon/check ni icon/alert en la librería). En código: role="status" (éxito) o role="alert" (error). Contacto: después de enviar solo se muestra el mensaje de confirmación.

## form-section-header

- Figma: [1303-4382](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4382)
- Propiedades: Number; Show number; Label

Título de sección de un formulario: número opcional (color/text/tertiary) + label (color/text/primary), ambos role/label en mayúsculas, con borde inferior color/border/strong. Mismo patrón que compare-group. Ancho FILL.

## gallery-thumb

- Figma: [920-2474](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2474)
- Propiedades: State: Default · Hover · Selected · Focus

Miniatura de la galería de producto, proporción 5:4 (105 × 84). La imagen se reemplaza en el fill de la instancia (placeholder surface/subtle). Default, Hover (border/hover), Selected (border/strong, imagen mostrada), Focus (anillo separado, DESIGN.md §7).

## hero

- Figma: [1311-4340](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1311-4340)
- Propiedades: Eyebrow; Show eyebrow; Title; Description; Show description; Show button; Breakpoint: Desktop · Mobile

Hero de página compartido por Home y Contacto: media (imagen o video; reemplazá el relleno de "media" en la instancia), scrim, eyebrow (role/label), título role/display, bajada opcional y button Outline opcional. Textos claros sobre la foto (el scrim hero/scrim asegura el contraste). El navbar no es parte del hero: va aparte, con Theme=Transparent, superpuesto arriba (la instancia del set es referencia). Props: Eyebrow, Title, Description, Show eyebrow, Show description, Show button.

## icon-button

- Figma: [752-2882](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2882)
- Propiedades: Icon; Size: Default · Large; Background: None · Surface · Subtle; State: Default · Hover · Pressed · Focus · Disabled

Botón de ícono. Size: Default (24 × 24, ícono icon/md; navbar, tablas y controles chicos) o Large (48 × 48 = padding space/padding/sm-md + ícono icon/xl de 24; acciones de bloques, como el acordeón). Background: None (sin fondo, sobre surface/default), Surface (fondo surface/default, para cuando va sobre otro surface: faint, subtle…) y Subtle (fondo surface/subtle; para que la acción se note entre mucha información, como la descarga de cada fila de la tabla de variantes). State: Default, Hover (None: surface/hover; Surface: surface/subtle; Subtle: surface/selected), Pressed (Subtle: surface/strong; el resto surface/selected), Focus (anillo border/focus). Prototipo: Default pasa a Hover al pasar el mouse y Hover a Pressed al presionar. Cambiar el ícono con la propiedad Icon.

State=Disabled: ícono en color/icon/disabled, sin interacción (atributo disabled nativo).

## input

- Figma: [930-2364](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=930-2364)
- Propiedades: Label; Show label; Helper; Show helper; Type: Text · Select · Textarea; State: Empty · Filled · Focus · Error · Disabled; Open: False · True

Campo de formulario con línea inferior. Type: Text, Select (flecha; en Focus la lista está abierta) y Textarea. State: Empty (placeholder), Filled, Focus (línea color/border/focus), Error (línea color/border/error y mensaje) y Disabled. Props: Label, Show label (false para campos sin etiqueta, como el email del Home), Helper y Show helper. En Error el mensaje siempre se ve. Sobre fondos oscuros: modo Dark.

Textarea: 4 filas visibles; solo se agranda hacia abajo (resize: vertical).

## line-card

- Figma: [1036-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2490)
- Propiedades: Label; Name; Description; Breakpoint: Desktop · Mobile; State: Default · Hover · Focus

Uso: líneas destacadas en el Home, en formato editorial (eyebrow, bajada y botón). No confundir con category-card ni family-card.

Tarjeta editorial de línea del Home: imagen, eyebrow, nombre role/heading-1, bajada y button Underline.

La imagen tiene la proporción bloqueada: al crecer la columna crece en alto sin deformarse.

## link-list

- Figma: [1303-4377](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1303-4377)
- Propiedades: Title; Show link 3

Lista de links con título (role/label). Cada link es button Underline con ícono (expuesto para editar label y destino). Hasta 3 links (Show link 3). Uso: "Recursos técnicos" en Contacto.

## logo

- Figma: [751-4307](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=751-4307)
- Propiedades: Size: Default · Small · Compact

Logo de Macroled Arq. Default en desktop, Small en mobile.

## mega-link

- Figma: [840-2070](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=840-2070)
- Propiedades: Name; Meta; Show meta; Show image; Show arrow; Type: Link · Group; State: Default · Hover · Focus; Open: False · True; Size: Default · Large

Link del mega menú y del submenú mobile: nombre, bajada opcional (Show meta, para colecciones) y flecha. Type: Link (link simple; Size Default o Large) · Group (grupo desplegable con icon/plus / icon/minus, Open False · True). State: Default, Hover y Focus.

## mega-menu

- Figma: [841-2282](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=841-2282)
- Propiedades: Tab: Aplicación · Lámparas y artefactos · Colecciones

Mega menú de Productos (desktop). Se abre desde nav-link "Productos" (Open=True) y se muestra debajo del navbar. Tres pestañas: Aplicación (Exterior / Interior), Lámparas y artefactos, y Colecciones. La imagen de la derecha se puede cambiar según la pestaña. Es un solo componente: categorías, links y el texto de "Ver todo…" salen de los datos.

## nav-link

- Figma: [752-2866](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2866)
- Propiedades: Label; Has dropdown; Breakpoint: Desktop · Mobile; State: Default · Hover · Pressed · Focus · Current; Open: False · True; Theme: Default · Inverse

Link del navbar. State: Default, Hover, Pressed, Current (página actual) y Focus. Open=True: desplegable abierto (aria-expanded="true"). Has dropdown muestra la flecha: hacia abajo en desktop (gira al abrir) y hacia la derecha en mobile (entra al submenú).

State=Current: sección activa (indicador de 8 × 2: space/gap/sm × border/strong). En código: aria-current="page".

Theme=Inverse: para navbar Theme=Transparent sobre foto (label color/text/inverse, indicador, subrayado y chevron en color/icon/inverse).

## navbar

- Figma: [753-2907](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=753-2907)
- Propiedades: Breakpoint: Desktop · Mobile; Mode: Default · Menu · Search · Products; Theme: Default · Transparent

Barra de navegación de Macroled Arq. Breakpoint: Desktop · Mobile. Mode: Default, Search (buscador abierto), Menu (menú mobile abierto) y Products (submenú de Productos en mobile, con "volver"). En desktop, Productos abierto = nav-link Open=True con mega-menu debajo. Theme: Default · Transparent (sobre la foto del hero; pasa a Default al hacer scroll). Theme=Transparent: fondo translúcido color/overlay/translucent + background blur blur/backdrop. El link de la página actual va en State=Current; el que despliega un menú usa Has dropdown.

## option-group

- Figma: [921-2560](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2560)
- Propiedades: Label; Type: Tiles · Select · Swatches

Grupo de configuración con etiqueta. Type: Tiles (fila de option-tile en Fill, role=radiogroup), Swatches (swatch-picker; es el que se usa para elegir el acabado en la ficha) y Select (select Field con menú; queda disponible para otros usos).

## option-tile

- Figma: [921-2487](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2487)
- Propiedades: Label; State: Default · Hover · Selected · Focus · Disabled

Uso: configurar el producto en la ficha (altura, potencia, temperatura), dentro de option-group Type=Tiles. No confundir con choice-chip, que es para formularios.

Opción seleccionable de configuración (altura, potencia, temperatura…), funciona como radio (role=radio). Sin caja: solo línea inferior. Default: sin fondo, border/default abajo, text/tertiary. Hover: surface/faint, border/hover, text/primary. Selected: surface/soft, border/strong abajo, text/primary. Focus: anillo border/focus. Disabled: border/disabled y text/disabled. Padding space/padding/sm-md × space/padding/md, texto role/body-regular. En un grupo va en Fill.

## page-header

- Figma: [1244-4016](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4016)
- Propiedades: Title; Description; Show breadcrumb; Show description; Show back; Show action; Breakpoint: Desktop · Mobile; Type: List · Detail

Encabezado de páginas de listado (Productos, Colecciones, Descargas, Contacto). Título único role/display. Desktop: título a la izquierda y bajada a la derecha; Mobile: todo apilado (modos Mobile de Dimension y Type). Props: Title, Description, Show breadcrumb, Show description; breadcrumb expuesto. Type=List (breadcrumb + título, bajada a la derecha en desktop) · Type=Detail (volver + título con bajada debajo + acción a la derecha, p. ej. Comparativa). Props Detail: Show back, Show action (button expuesto).

Anchos: bajada de List hasta layout/measure; columna de título y bajada de Detail hasta layout/measure-wide. El componente aplica su propio layout/gutter (como navbar y footer). El breadcrumb muestra los niveles que correspondan a la página.
## product-card

- Figma: [990-2372](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=990-2372)
- Propiedades: Name; Meta; Show meta; Show finishes; Show compare; Size: Large · Small; State: Default · Hover · Focus

Tarjeta de producto o familia, siempre vertical (imagen 7:10). Size: Large (listados de Productos, Colecciones y página de colección) y Small (ficha → "Otras familias de la colección"). State: Default, Hover y Focus. Hover y Focus cambian la imagen (no hay borde): Light muestra estudio con luz apagada y en hover contexto con luz apagada; con Iluminar (Dark) muestra estudio con luz encendida y en hover contexto con luz encendida. La variante Hover de Figma es una referencia estática; las reglas completas están en DESIGN.md §8 · Imágenes de product-card. Props: Name, Meta (tipo de producto o datos técnicos, admite dos líneas), Show meta, Show finishes (acabados con swatch; se reemplaza el color de cada uno) y Show compare (checkbox "Comparar"). En código la tarjeta es un link al producto y el checkbox va fuera de ese link. El ancho lo define la grilla; la imagen mantiene la proporción.

En grillas de listado: ancho mínimo layout/card-min (280); la grilla suma columnas sola (auto-fill), así la imagen 7:10 no crece de más en pantallas grandes.

## product-gallery

- Figma: [920-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2490)
- Propiedades: Breakpoint: Desktop · Mobile

Galería de la ficha: imagen principal + fila de gallery-thumb (la primera en Selected). Con Iluminar en On, la imagen principal cambia por la luminaria encendida. Desktop 5 miniaturas, Mobile 4 con scroll horizontal.

## search-dropdown

- Figma: [796-2271](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=796-2271)
- Propiedades: State: Results · No results

Desplegable de resultados en desktop. State: Results · No results. Aparece debajo del campo cuando hay texto escrito, con el mismo ancho que el campo. Muestra hasta 4-5 productos y "Ver todos los resultados". Con el campo vacío no se muestra.

## search-field

- Figma: [795-2179](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=795-2179)
- Propiedades: Show close; State: Empty · Focus · Filled

Campo de búsqueda. En desktop reemplaza a la lupa dentro del navbar y la cruz cierra la búsqueda. En mobile va sin cruz (Show close = false), junto a la flecha de volver. Estados: Empty, Focus (borde color/border/focus de border/focus) y Filled.

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
- Propiedades: Name; Label; Value; Type: Field · Filter; State: Default · Hover · Focus · Disabled · Filled; Open: False · True

Selector con menú desplegable (arq-select). Type=Field: campo del configurador (muestra swatch/lg + nombre role/body-regular + chevron-down, hacia arriba en Open; Default surface/soft con línea inferior border/strong; Hover y Open surface/subtle; menú select-menu Finishes a todo el ancho). Type=Filter: celda de la filter-bar (etiqueta role/label-sm text/tertiary (caso extremo: 10 px) + valor + chevron icon/sm; Default "Todos" en text/secondary; Hover text/primary; Filled = filtro elegido: valor role/body-medium text/primary, muestra swatch/sm si es acabado y línea inferior border/strong; Open con select-menu Filter). Focus: anillo border/focus. Disabled: text/disabled. Props: Name (valor del Field), Label y Value (Filter; en Filled el valor elegido va como override).

## select-menu

- Figma: [1061-4867](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1061-4867)
- Propiedades: Type: Finishes · Filter · Text

Lista desplegable de select (hasta 7 opciones). Fondo surface/default, borde border/default, sin sombra. Type: Finishes (ancho del campo, todas con muestra) y Filter (ancho propio; primera opción "Todos" sin muestra). Hereda el modo Dark.

## select-option

- Figma: [921-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=921-2500)
- Propiedades: Name; Show swatch; State: Default · Hover · Selected · Focus · Disabled

Opción de select-menu. Muestra opcional (Show swatch; swatch/sm con border/default) + nombre role/body. Default sin fondo, Hover surface/faint, Selected nombre en role/body-medium, Focus anillo border/focus. Separador inferior border/subtle. Padding space/padding/md, gap space/gap/sm. Sirve para acabados y para "Todos" o valores sin muestra. Disabled: opción no disponible (texto color/text/disabled).

## sku

- Figma: [920-2539](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2539)
- Propiedades: Code; Size: Default · Compact; State: Default · Hover · Copied

Código de producto con botón de copiar. Size: Default (bloque del configurador, con etiqueta SKU) y Compact (fila de la tabla de variantes). State: Default (ícono icon/secondary), Hover (ícono icon/primary), Copied (confirmación "Copiado", text/success).

Textos largos: el código se parte en varias líneas, nunca se corta. Si falla el portapapeles: el código queda seleccionado y se anuncia "Copialo con Ctrl+C" ("⌘C" en Mac) en lugar de "Copiado", en color/text/secondary.

## spec-list

- Figma: [922-2500](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2500)
- Propiedades: Title

Lista de spec-row. En la ficha va en dos columnas dentro de accordion-item (una por versión o grupo de datos). Las filas se agregan o quitan según los datos de Typesense.

## spec-row

- Figma: [922-2497](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2497)
- Propiedades: Label; Value

Fila de especificación técnica: etiqueta role/body-regular (text/tertiary) y valor role/body-regular (text/primary), separador inferior border/subtle. Padding space/padding/md arriba y abajo, gap space/gap/lg. Se usa dentro de spec-list.

Textos largos: etiqueta y valor se parten en varias líneas; nunca se cortan.

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

Pestaña (role="tab"). Default, Hover, Selected (aria-selected="true", subrayado de 1 px border/default en color/border/strong), Focus y Disabled. Se agrupan en un contenedor role="tablist" con separación space/gap/xl y una línea color/border/subtle debajo. Lo usa el mega menú de Productos.

## tag

- Figma: [981-2305](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=981-2305)
- Propiedades: Label; Type: Plain · Outline

Etiqueta informativa (no interactiva). Type: Plain (tipo de producto en tarjetas: "Embutir", "Jardín · Pared") y Outline (especificaciones: "IP 65", "CE", "2700 K"). Prop: Label. Si tiene que ser clickeable, se usa button o checkbox, no tag.

> **En espera de diseño:** hoy no hay instancias de tag en las pantallas (product-card resuelve el tipo con Meta). No se construye hasta que diseño defina si se usa en la ficha o se da de baja. Si se hace, Outline lleva fondo `color/surface/default`.

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
- Propiedades: Filters: Off · On; Breakpoint: Desktop · Mobile

Tabla de variantes de la ficha (Glosario; el título va aparte como título de sección). Filters=Off: botón Filtros en button Filled con icon/filter. Filters=On: button Outline con icon/filter-off y debajo filter-bar. A la derecha, descargas con button Outline + icon/download. Filas: variants-table-row Header + una Row por SKU. Componente de borde a borde: ocupa todo el ancho de la página para que la filter-bar llegue al borde; toolbar y filas llevan padding lateral layout/gutter. En mobile el scroll de las columnas llega al borde de la pantalla. Scroll: en Figma cada fila tiene su propio frame scroll porque Figma no puede sincronizar el desplazamiento entre instancias; es solo una especificación de qué columnas se mueven. En código la tabla usa un único contenedor con overflow-x: auto que envuelve header y filas, así los títulos se desplazan junto con los datos; las celdas de inicio (miniatura + SKU) y de fin (descarga) van con position: sticky (left: 0 / right: 0) y fondo propio (bg/default, surface/faint en Hover) para tapar lo que pasa por debajo.

## variants-table-row

- Figma: [923-2708](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=923-2708)
- Propiedades: Type: Header · Row; State: Default · Hover

Fila de la tabla de variantes (Glosario). Tres zonas: fixed-start (miniatura 56 + sku Compact) y fixed-end (icon-button Background=Subtle de descarga, para que se note entre tanta información; abre el modal con todo lo asociado al producto; en el Header va sin título) quedan fijas; scroll contiene las columnas de datos y es lo único que se desplaza en horizontal, junto con sus títulos del Header. En Figma el scroll de cada fila es solo especificación; en código hay un único scroll compartido por header y filas (ver la descripción de variants-table). Type: Header (role/label text/tertiary) y Row (valores role/body). Separador inferior border/subtle, gap space/gap/sm. Row State: Default y Hover (surface/faint).

## Íconos

20 íconos de trazo de 1 px (`icon/<nombre>`): arrow-down, arrow-left, arrow-right, arrow-up, arrow-up-right, chevron-down, chevron-left, chevron-right, chevron-up, close, copy, download, filter, filter-off, instagram, menu, minus, plus, search, youtube. Theme=Default: color/icon/primary · Theme=Inverse: color/icon/inverse (sobre foto o fondos oscuros). En código: SVG inline con `stroke="currentColor"`.
