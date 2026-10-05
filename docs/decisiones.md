# Decisiones

Decisiones técnicas que no están en AGENTS.md ni en DESIGN.md. Si una decisión no está escrita acá, las IAs no la conocen.

- Formato: `## fecha · tema` y viñetas cortas (qué y, si no es obvio, por qué). El código cita las secciones por ese título: no renombrarlas.
- Lo que ya dice DESIGN.md o AGENTS.md no se repite: se enlaza.
- Una decisión que cambia otra **reemplaza** el texto viejo; no se acumula historial.
- Los pendientes van **solo** en [Pendientes](#pendientes), al final, agrupados por quién los resuelve. En el código siguen como `TODO (<grupo>)`.

---

## 2026-09-30 · Base del repo

### Albert Sans se carga a nivel página

- En Webflow, la fuente la carga la página, no `dist/arq.css` ni el Shadow DOM. La demo usa Google Fonts (300–700, `display=swap`).
- Por qué: el sitio de Macroled puede tenerla cargada; no se descarga dos veces ni se pisa su configuración.

### Salida del build

- Vite en modo librería: solo `dist/arq.js` (ES module) y `dist/arq.css` (solo `tokens.css`), sin hash. La demo no entra. `dist/` se commitea.

### CSS de componentes y estilos role/*

- Cada componente importa su CSS con `?inline`. Los `role/*` se generan en `src/styles/roles.css` (clases `.role-<nombre>`) y se comparten como una sola `CSSStyleSheet` (`adoptStyles` de `src/styles/roles.js`). La hoja de cada componente se crea una vez por clase.
- `roles.css` usa primitivos de tipografía (`--arq-font-*`) porque así están en Figma; los componentes usan las clases, no los primitivos.

### Formato de tokens/tokens.json

- DTCG (`$type`, `$value`, `$description`). Ruta = nombre de Figma sin la colección: `color/text/primary` → `--arq-color-text-primary`.
- `$value` es el primer modo (Light o Desktop). Los demás van en `$extensions["arq.modes"]` (`dark`, `mobile`, `tablet`, `large`, `wide`, `reducedMotion`) **solo si cambian**. Se pueden combinar modos de breakpoint en un token, no con `dark` ni `reducedMotion`. `reducedMotion` solo en duraciones.
- Tipos: `color`, `dimension` (`px`), `fontWeight`, `fontFamily`, `duration` (`ms`), `cubicBezier`, `typography` (solo `role/*`). Colores con alpha como `rgba()` (2 decimales); opacos en hex. Alias `{ruta}` → `var(--arq-…)`.
- `role/*`: rama `role`, solo alias. `fontSize` y `lineHeight` apuntan a `type/*` (así el cambio de modo llega desde `tokens.css`). `$extensions["arq.textTransform"]` → `text-transform`. Sin modos.
- `npm run tokens` valida todo antes de escribir (alias, tipos, valores, modos). Genera `:root`, `[data-arq-theme="dark"]`, `[data-arq-theme="light"]`, las media queries de breakpoint y `prefers-reduced-motion`. Nunca `prefers-color-scheme`.
- La rama `role` no viene de variables: `npm run tokens:import` la conserva.

## 2026-09-30 · Base de componentes (src/base/)

### ArqElement

```js
import css from './accordion-item.css?inline';

class ArqAccordionItem extends ArqElement {
  static tag = 'arq-accordion-item';
  static styles = css;
  static properties = {
    open: { type: Boolean },
    type: { type: String, values: ['plain', 'outline'], default: 'plain' },
    count: { type: Number },
  };
  static template = `<button type="button">…</button><div class="panel"><slot></slot></div>`;
  setup() { … }          // una vez, al conectarse por primera vez
  update(changed) { … }  // al conectarse y cuando cambian props (Set con los nombres)
}
ArqAccordionItem.define();
```

- Props = propiedades de Figma: `Show icon` → atributo `show-icon` → prop `showIcon`. Valores en kebab-case: `layout="image-left"`.
- Tipos: `Boolean` (presencia), `String` (con `values` y `default`; un valor inválido vuelve al default y avisa en dev) y `Number`. Reflejo atributo ↔ prop; las props asignadas antes del registro se recuperan.
- Estilos adoptados, en orden: roles, dark, light, base (`[hidden]`, encabezados por slot, transiciones) y la del componente.
- Eventos: `this.emit('change', detail)` → `arq:change` con `bubbles` y `composed`. `arq:change` para valores, `arq:toggle` para abrir / cerrar.
- `addController(obj)`: llama a `obj.hostUpdate(changed)` después de `update()`.
- `define()` no hace nada si el tag existe (Webflow puede cargar el script dos veces). Cada componente se importa en `src/main.js`.

### Íconos (src/base/icons.js)

- Los 20 de Figma (sección `1075:4571`, `Theme=Default`), con el node id anotado. `icon('plus')` devuelve el `<svg>` como string; no hay `<arq-icon>`.
- `stroke="currentColor"` (`Theme=Inverse` es `color/icon/inverse`, no otro SVG), `vector-effect="non-scaling-stroke"` (1 px a cualquier tamaño, el tamaño lo da `--arq-icon-*`), `aria-hidden="true"` y `data-icon="<nombre>"` para elegir con CSS.

### Desplegables (src/base/disclosure.js)

- `new Disclosure(this, { trigger, panel })`. Encabezado `<button type="button">` con `aria-expanded` y `aria-controls`; panel con el atributo `hidden`, contenido por slot (queda en el HTML aunque esté cerrado). Siempre `<button>`, nunca `<details>`.
- Independientes: pueden quedar varios abiertos. El estado es `open`; el abierto inicial lo decide el HTML o los datos, no el default de Figma.
- Cambiar `open` por código no emite; la acción del usuario y `show()` / `hide()` / `toggle()` emiten `arq:toggle` con `{ open }`. `closeOnEscape` apagado por defecto.
- Movimiento: al abrir, fundido de `opacity` en `motion/duration/base` (`@starting-style`); el alto cambia de golpe y al cerrar no hay fundido.

### Finales de línea (LF)

- `.gitattributes`: `* text=auto eol=lf`; PNG, JPG, WebP y WOFF2 binarios. Un binario nuevo (`.gif`, `.avif`, `.pdf`) se suma ahí.

### Variables de entorno

- `src/config.js` lee `import.meta.env.VITE_*` y Vite los deja dentro de `dist/arq.js`: solo la search-only key de Typesense.

## 2026-10-01 · button

- Sin `href` dibuja `<button type="button">`; con `href`, `<a>`. Un link deshabilitado pierde el `href` y lleva `aria-disabled="true"`.
- Subrayado de Underline: pseudo-elemento anclado arriba; pasar de 1 a 2 px no cambia el alto. Outline descuenta el borde del padding para medir igual que Filled.
- `count-label`: texto para lectores (", 3 filtros activos"); el número visible lleva `aria-hidden`.
- **`submit`:** `type` es la prop de Figma, así que el envío es el atributo `submit` (`<arq-button submit>`). Es form-associated y el clic hace `requestSubmit()` del formulario; el `<button>` interno sigue `type="button"`. Enter en un campo no envía (no es el botón predeterminado del navegador).

## 2026-10-01 · logo

- Anchos 181 · 158 · 117 en px dentro de `logo.css`, sin tokens: son medidas del archivo del logo. Única excepción a "sin px" junto con el `outline-offset: 2px` del foco y el scrim del hero.
- Un solo SVG (`fill="currentColor"`) escalado para los tres tamaños. Siempre es link (`href="/arq"`, `aria-label="Macroled Arq, inicio"`).

## 2026-10-01 · Textos en mayúsculas (role/label)

- Chrome arma el nombre accesible con el `text-transform` ("COLECCIONES") y algunos lectores lo leen como sigla. En links con `role/label` (breadcrumb-item, tab) el link lleva `aria-label` con el texto en caja normal. En un `<span>` no se puede (ARIA no lo permite).

## 2026-10-01 · Fase 1 (controles y formularios)

- **Foco en input Text y Textarea (excepción a DESIGN.md §7):** solo cambia el color de la línea a `color/border/focus`, sin anillo y sin cambiar el grosor.
- **Form-associated:** checkbox, toggle, choice-chip, input, file-upload y `arq-button submit` usan `ElementInternals`; mandan `name` / `value` con el `<form>` y responden a `form.reset()`.
- **Selección única (`src/base/single-select.js`):** choice-chip, option-tile, swatch y tab; una elegida, flechas con roving tabindex, Inicio / Fin. Lo arma el contenedor.
- **input disabled:** la ayuda queda en `color/text/disabled` (sin contraste AA, a propósito: WCAG 1.4.3 no lo exige en controles inactivos). axe lo marca; se ignora.
- **nav-link Mobile:** 56 de alto (padding `space/gap/md` + `role/body-xl`).

## 2026-10-01 · Publicación

- Repo público [mldalio/macroled-arq](https://github.com/mldalio/macroled-arq); jsDelivr sirve `dist/` desde los tags: `https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.js` (y `arq.css`). Nunca `@main` ni `@latest` en Webflow.
- Un tag publicado no se mueve ni se borra (jsDelivr lo cachea): se publica una versión nueva. `package.json` lleva la versión del tag.

## 2026-10-01 · Tokens desde Figma

- Claude Code lee las variables por MCP (`use_figma`, solo lectura) con `scripts/figma/export-variables.figma.js`, una colección por llamada (la respuesta se corta a los 20 KB: 1 · Primitive · Color va en dos partes).
- `scripts/figma/rows-to-dtcg.js` escribe `tokens/figma/<colección>.<modo>.json` (minúsculas, sin "·"). Se commitean.
- `npm run tokens:import` arma `tokens/tokens.json`: tipos por ruta, modos solo si cambian, orden del archivo anterior, mismas validaciones que `npm run tokens`, lista de diferencias. Las descripciones también vienen de Figma.
- No se importan bronze, cacao, olive, terracotta ni offwhite.

## 2026-10-01 · Movimiento

- `reducedMotion` no es un modo de Figma: el import pone `0ms` en fast, base y slow (feedback no cambia).
- Una sola regla de transición en la hoja base: colores (`color`, `background-color`, `border-color`, `outline-color`, `text-decoration-color`, `fill`, `stroke`) en fast + standard para todo el Shadow DOM. No llega al contenido por slot. Lo que además anima `transform` u `opacity` redeclara la lista completa (no se suma).
- Al cambiar Iluminar, los componentes funden en 120 ms y el fondo de la página cambia de golpe.
- Los tiempos en JS se leen de las variables (`getComputedStyle`), nunca en ms escritos.

## 2026-10-01 · Casos definidos por diseño

- **file-upload:** Drag over y Error son estados internos (`:state(drag-over)`, `:state(error)`). Mensaje: "<problema>. Formatos: <lista>." armado desde `accept` (JPEG como JPG).
- **input Textarea:** `rows="4"` y `resize: vertical`.
- **breadcrumb:** una fila; el ítem actual se parte en líneas antes de que los intermedios se corten con "…" (`flex-shrink` mayor).
- **sku:** si falla el portapapeles, se selecciona el código y se anuncia "Copialo con Ctrl+C" (⌘C en Mac / iOS) durante feedback (`:state(copy-failed)`).
- **spec-row y sku:** `overflow-wrap: anywhere`.

## 2026-10-01 · hero y navbar

- Hero no contiene al navbar: un solo `<arq-navbar>` por página, antes del hero, `theme="transparent"` encima de la media. La instancia de navbar dentro del hero en Figma es solo referencia de composición.

## 2026-10-01 · faq-item

- Separador **arriba** de cada ítem en `border/default` + `color/border/default` (manda el set sobre la descripción y la ficha, que dicen inferior y subtle).
- Respuesta hasta `layout/measure-wide` en Desktop (el set mide 560 sin token).
- Hover solo cerrado. Foco alrededor de todo el ítem, también abierto. El padding va en el botón (todo el encabezado es clickeable).

## 2026-10-01 · footer

- Bajada (`slot="tagline"`) y links (`<arq-footer-link slot="productos|informacion|redes">`) por HTML; logo, títulos y legal en el componente; año con `new Date().getFullYear()`. Tres columnas fijas.
- Logo Compact, como el set. Información: Contacto, Descargas y Glosario. Columnas con el ancho de su contenido.
- footer-link: `role="listitem"`, prop `label` (aria-label) y el texto se parte en líneas en vez de cortarse.

## 2026-10-01 · Tokens de navbar Transparent

- `blur/12` (1 · Primitive · Blur, sin scope), `blur/backdrop` y `color/overlay/translucent`.
- El blur de Figma es el doble que el de CSS: `backdrop-filter: blur(calc(var(--arq-blur-backdrop) / 2))`. El token guarda el valor de Figma.

## 2026-10-01 · Dark dentro del Shadow DOM

- `tokens.css` no alcanza elementos dentro de un Shadow DOM. `npm run tokens` genera también `src/styles/dark.css` (y `light.css`) y `ArqElement` las adopta en cada Shadow DOM. No se editan a mano.
- Así `data-arq-theme` funciona en un ancestro de la página, en el host y en un contenedor interno; el contenido por slot hereda el modo del contenedor donde se muestra. Reglas de uso: DESIGN.md §2 · Modo Dark.

## 2026-10-01 · Modo Dark: Iluminar y Dark local

- Detalle en DESIGN.md §2 · Modo Dark. En hero, solo el CTA (slot `action`) va envuelto en Dark; los textos usan `color/text/inverse`.
- explora-coleccion es Dark local, no Iluminar (Dark en las cuatro pantallas de la ficha).

## 2026-10-01 · Páginas en Webflow

- Todo el contenido de Arq va en Code Embed; nada en el Designer.
- Estáticas (Home, Contacto, Comparativa): un embed con el HTML de los componentes. Templates del CMS (ficha, colección): embed con campos dinámicos (grupo o colección, `<h1>`, textos indexables); el resto sale de Typesense.
- `src/pages/` tiene el HTML exacto de cada embed: se edita en el repo y se pega en Webflow.
- Límite de 50.000 caracteres por embed. Si una página se acerca, se parte por sección (comentario `<!-- embed N -->` en cada corte); nunca un componente entre dos embeds.

## 2026-10-01 · hero

- Slots: media, eyebrow, title, description y action. Cada parte se muestra si su slot tiene contenido (Show… no son atributos). La media va en el HTML: es el LCP.
- Título `<h1 slot="title">` en el embed. Media slotteada con `!important` (los estilos del sitio para `img` ganan sobre `::slotted`).
- **scrim:** `hero/scrim` es un estilo de relleno (no variable): el degradado va copiado en `hero.css`. Si cambia en Figma, se copia a mano.
- `<div>`, no `<header>`: el navbar ya es el banner (dos banners es error de axe).
- Con `prefers-reduced-motion`, un video con `autoplay` se pausa y vuelve al poster; se reanuda si cambia la preferencia.
- Gap texto–CTA Desktop `space/gap/xl`. Fondo de reserva `color/surface/inverse`.

## 2026-10-01 · cta-block

- Slots: title (`<h2>`), description, action y, en Newsletter, email (`<arq-input>`). Aplica su propio gutter (fondo a sangre).
- Gaps del set: título–bajada `space/gap/sm-md`, email–button `space/gap/md`. Email hasta `layout/measure`.
- Newsletter sin envío: un `<form>` del Shadow DOM no es dueño de un input por slot. Valida con `reportValidity()` y emite `arq:submit` con `{ email }`.

## 2026-10-01 · Encabezados en el HTML de la página

- Regla en AGENTS.md. La hoja base tiene una sola regla `::slotted(h1…h6)` (sin margen, `font`, `letter-spacing`, `text-transform` y `color` heredados, con `!important` contra los estilos de Webflow); cada componente pone la clase `role/*` y el color en el contenedor del slot.
- footer: cada `<nav>` toma su `aria-label` del texto de su `<h2>` (`aria-labelledby` no cruza el Shadow DOM).

## 2026-10-01 · Datos sin Typesense

- Cada componente que recibe datos define su forma (inglés, camelCase) en su README; las fixtures usan esa forma. `src/data/` es el único que traduce desde Typesense o el CMS.

## 2026-10-01 · URLs

- `docs/urls.md`: Home `/arq`; templates en singular (`/arq/producto/{slug}`, `/arq/coleccion/{slug}`); `/arq/comparativa` y `/arq/glosario` estáticas. La búsqueda va al listado de Productos (2026-10-05 · Búsqueda en Productos).

## 2026-10-01 · carousel-controls

- Con `for="<id>"` maneja el contenedor con scroll (`scrollBy` de un ancho visible, Position por `scrollLeft`) y observa el tamaño de cada hijo (una foto que carga agranda el contenido sin avisar). Sin `for`, Position es fija y emite `arq:prev` / `arq:next`.
- Si la flecha con foco se deshabilita, el foco pasa a la otra. `aria-controls` con `ariaControlsElements`.

## 2026-10-01 · Tarjetas con link estirado

- category-card (y family-card, product-card) usan `src/base/card-link.css`: el `<a>` envuelve solo el slot del nombre y su `::after` cubre la tarjeta. Hover y foco con `:has(.card-link:hover)` / `:has(.card-link:focus-visible)`; hover solo con `hover: hover`.
- Textos tipo "Ver colección" dentro de una tarjeta-link son decorativos (`aria-hidden`). Lo interactivo de adentro (checkbox Comparar) va por encima del `::after` (`z-index: var(--card-above)`).
- line-card no usa este patrón: ver 2026-10-05 · line-card: el link es el botón.

## 2026-10-01 · Proporciones de category-card, line-card y feature-block

- Mandan los ratios de DESIGN.md §5, no las medidas de los sets (ya corregidos en Figma). Gaps de los sets, no de las fichas. category-card sin borde en reposo.
- feature-block: imagen principal 4:5; texto desfasado como el set (`space/padding/xl-2xl` arriba en Image left, `space/padding/6xl` en Image right). Secundaria en `ratio/wide`.

## 2026-10-02 · Base de datos (estructura v5)

- Fuente: `docs/estructura-base-de-datos.md` (v5, tentativa). Campos: `docs/typesense-schema.md`.
- Un documento por SKU. Mismo `PRODUCT_GROUP_ID` = un producto (card y ficha); mismo `COLLECTION_ID` = una colección.
- Nombres de campo: los define el índice. `src/data/attributes.js` traduce `variant_attributes` y guarda etiquetas, secciones del acordeón, filtros, filas de la comparativa y columnas del glosario.

### Ficha de producto por grupo

- CMS Productos: un ítem por grupo, slug = `PRODUCT_GROUP_ID`. Campos: nombre, SKU predeterminado, meta title / description, imagen principal, descripción corta y textos editoriales.
- `?sku=<SKU>` (con `encodeURIComponent`) elige la variante si es del grupo; si no, el predeterminado (`IS_GROUP_DEFAULT`). Se actualiza con `history.replaceState`. Canonical sin parámetro.
- Cambian con la variante: galería superior, sku, descripción técnica, acordeón, descargas y ficha técnica. El resto de la ficha (y el glosario, que lista todos los SKU) no.

### Selectores de variante

- Un selector por campo de `VARIANT_ATTRIBUTES`, en ese orden; opciones = valores únicos del grupo, números de menor a mayor y el resto alfabético (`variantValues`).
- Una opción que no forma un SKU con lo elegido va Disabled. Acabado → option-group Swatches; el resto → Tiles (cada atributo declara su control en `attributes.js`).
- Un solo módulo de combinaciones (`src/data/variants.js`) para ficha, glosario y comparativa.

### Listados

- Productos, Colecciones y Colección salen de Typesense, sin Collection List. Una consulta trae todo (hasta 250 SKU; si se pasa, `group_by` o paginado) y `src/data/` agrupa, filtra y cuenta.
- Una card por grupo (por colección en Colecciones). SKU de la card: el predeterminado; con filtros, si no cumple, el primero que cumple por `sheet_order`, con `?sku=`.
- Conteo: grupos o colecciones, no SKU. Orden: el de la hoja.
- Las cards no están en el HTML inicial: fichas y colecciones se indexan por sus páginas del CMS.

### Cards

- Colecciones: mismo criterio que Productos (cuatro imágenes, filtros técnicos: aparece si algún SKU cumple), sin Comparar.
- family-card: misma imagen que la product-card del grupo (estudio, luz apagada); en Explora la colección no pasa a la encendida.
- Meta: rango de cada atributo de variante (no acabado), p. ej. «35 cm – 50 cm», más una o dos características fijas.

### Navegación

- Un solo árbol en `src/data/` (`getNavigation`) para mega-menu, catalog-nav y menú mobile; cada opción filtra `environment`, `application` y `product_type`. Opciones sin productos se ocultan.
- Lámparas: categoría propia y también dentro de Interior y Exterior (`environment` admite lista).
- Nombres: **Colgante** (no Suspensión). MR16 PRO y AR111 PRO son productos distintos.
- catalog-nav-mobile: la sección actual abierta con su opción marcada; las demás visibles y cerradas.

### Comparativa

- Cada columna es un grupo, hasta 3. Selects: colección → producto → uno por atributo de variante (misma disponibilidad que la ficha). Un cambio actualiza la imagen y todas las filas.
- compare-bar lleva a `/arq/comparativa?sku=SKU1,SKU2,SKU3`; la selección se guarda en `localStorage` (`arq:compare`).
- `<arq-compare-table>` (solo código) arma cabecera, grupos y filas con un único scroll.

### Galerías

- Solo las imágenes que existen (sin vacíos ni repetidas). Si no entran, se desliza (scroll-snap). En product-gallery se desliza la fila de miniaturas (5 Desktop, 4 Mobile), que se recorren con Tab; Iluminar cambia la grande y las miniaturas con versión encendida.

### Componentes del catálogo

- **catalog-nav:** un solo componente; catalog-nav-mobile y catalog-nav-trigger viven adentro. Sidebar desde 1024; hasta 1023, encabezado con la selección que abre los mismos grupos (cada link una sola vez en el HTML). Panel mobile `color/surface/default`, gap `space/gap/sm-md`.
- **filter-panel:** `<dialog>` modal. Con el panel abierto el listado no cambia; solo "Ver N productos" (la página lo calcula con `arq:filters`). "Ver N" emite `arq:apply` y cierra; X, scrim o Esc descartan. Summary y chips se arman solos.
- **catalog-toolbar:** Iluminar pone `data-arq-theme="dark"` en `<html>` y lo guarda en `localStorage` (`arq:theme`) para Productos y Colecciones (la ficha no lo usa). Filtrar se conecta al panel con `for`.
- **product-card:** Large pasa sola a Small hasta 767 px; `size="small"` fija Small. Imágenes en `image`, `image-hover`, `image-lit`, `image-hover-lit`. Acabados Default (20) en Large, sin borde en la imagen.
- **family-card:** `ratio/square` (Default) y `ratio/portrait` (Large); toma el ancho de su columna.
- **download-modal · download-item:** modal de ancho `layout/filter-panel`; en Mobile abajo, a `layout/gutter` de los bordes. Hover de Default subraya el texto. Sin `href` emite `arq:download`.
- **glosario (variants-table):** `<table>` real con variants-table-row adentro; columnas a su contenido, miniatura `layout/table-thumb`. Filtros con un select por atributo y opciones sin filas deshabilitadas (`filterOptions`, `filterVariants`).
- **select:** arma sus opciones con `options` (combobox + listbox en el mismo Shadow DOM, `aria-activedescendant`, el foco queda en el campo). select-option suma `active`. Hover del Field `color/surface/faint`; valor del Filter `role/body-medium`.
- **accordion-item:** contiene una spec-list por bloque de especificaciones; las secciones salen de `attributes.js`.
- **Iluminar en componentes:** `src/base/theme.js` avisa a un componente cuando cambia el `data-arq-theme` de un ancestro (un MutationObserver en el documento). No ve cambios dentro de un Shadow DOM: quien los hace llama a `refreshTheme()`.

### Textos editoriales

- `PRODUCT_STORY_TEXT`, `PRODUCT_INSPIRATION_TEXT`, `COLLECTION_INTRO_TEXT` y `COLLECTION_DESCRIPTION_TEXT` van también en el CMS (texto plano) y llegan por slot (indexables). La hoja manda si no coinciden. Home y Contacto: en su embed.
- Markdown de STORY (`##` título, `-` lista, el resto párrafo): se arma con `createElement` / `textContent`, nunca `innerHTML`.

### Ficha técnica en PDF

- Se genera en el navegador con los datos del SKU elegido. La librería se carga de jsDelivr con versión fija **al primer clic** (no entra en `dist/arq.js`): única excepción, documentada en el README. Igual para "Descargar comparación".

### Sincronización Sheets → Typesense

- Hoy carga la base quien arma Typesense (sin acceso a n8n). Propuesta: Apps Script en la hoja con menú "Publicar en Typesense", admin key en las propiedades del script, código en el repo, validaciones antes de publicar. El CMS se carga a mano.

### Acabados

- Sin imágenes: el swatch muestra el neutro con el nombre (DESIGN.md §8).

## 2026-10-02 · Datos de ejemplo mientras se completa la base

- `src/data/source.js` carga el catálogo desde Typesense o desde `demo/fixtures/catalogo.json`, con la misma forma (`src/data/catalog.js`). Se elige con `VITE_DATA_SOURCE` (`mock` o `mixto`) solo en `npm run dev`; el build usa siempre Typesense y no incluye el ejemplo.
- Cuando la base esté completa: se ajusta solo `src/data/typesense-adapter.js` y `.env` pasa a `typesense`. Mientras falte `product_group_id`, cada SKU es su propio grupo.
- El catálogo se carga una vez por página y `catalog.js` resuelve listados, filtros, ficha, comparativa, búsqueda y navegación.

## 2026-10-02 · navbar, mega-menu y búsqueda

- El navbar es un contenedor que consulta `src/data/` (`getNavigation` al abrir Productos, `searchProducts` al escribir); mega-menu, mega-link y search-* reciben datos.
- Árbol: Exterior e Interior (aplicaciones + Artefactos y Lámparas de ese entorno), Lámparas y Artefactos (un link por producto), Colecciones (con sus aplicaciones como bajada).
- Mode (Default · Search · Menu · Products) es estado, reflejado en `mode`.
- Menú y búsqueda mobile: `<dialog>` modales a pantalla completa (así no hay que bloquear el scroll de `body`).
- Transparent pasa a Default con un menú o la búsqueda abiertos y al dejar atrás el hero (2026-10-05 · Contacto: ajustes). Sticky en Default, fixed en Transparent.
- `aria-activedescendant` no cruza el Shadow DOM: el campo anuncia el resultado activo con `aria-live`.

## 2026-10-02 · Layout de página

- El layout va en componentes con Shadow DOM (`<arq-section>`, `<arq-grid>`, `<arq-project-mosaic>`), no en clases globales: AGENTS.md prohíbe estilar selectores globales.
- **arq-section:** gutter a los lados, `space/section/xl` abajo, `padding-top` para el primer bloque tras el hero. Slots `header`, contenido, `action` y `mobile-action` (solo hasta 767). `layout="split"` para el FAQ. Gap `space/gap/2xl` (Desktop) y `space/gap/xl` (Mobile).
- **arq-grid:** `columns` y `mobile="stack | two-columns | carousel"`; sin `columns`, la grilla de catálogo de DESIGN.md §2. Filas `space/gap/2xl` y columnas `space/gap/lg` (Mobile `xl` y `md`).
- **project-mosaic:** 4 columnas × 2 filas en Desktop; en Mobile una a todo el ancho y dos debajo.

## 2026-10-02 · Home

- Embed `src/pages/home.html` (uno solo); `demo/home.html` lo carga tal cual.
- Productos destacados: el embed lista `<a href data-group>` y `<arq-featured-products>` completa nombre, meta e imágenes (`getProductCards`). Los links quedan indexables y sirven de reserva.
- Proyectos: mosaico fijo, sin carousel-controls.

## 2026-10-02 · Productos

- Embed `src/pages/productos.html`: page-header List, `<arq-catalog-listing>` y footer. En las demos, los links a `/arq…` apuntan a la demo.
- `<arq-catalog-listing>` consulta `src/data/` y arma toolbar, grilla, filter-panel y compare-bar; la navegación y el título del panel llegan por slot (indexables). Sirve también para Colecciones (`unit="colecciones"`).
- Categoría por parámetros (`?environment=`, `?application=`, `?product_type=`). El ítem actual del catalog-nav se marca solo y el `<h1>` pasa al nombre de su grupo; sin ítem, "Productos".
- `listProducts` suma `finishes` (campos con control `swatches`). Nombre de la card en `<h2>` en el listado (axe: heading-order); `<h3>` en la Home.

## 2026-10-05 · Ficha de producto

- Embed `src/pages/ficha.html`: navbar, `<arq-ficha-producto data-group>` y footer. El CMS imprime grupo, `<h1>`, descripción corta, imagen principal y textos editoriales; el resto sale de `getProduct()` y `variantDetails()`. En la demo, `?group=<id>`.
- Contenedor que consulta y arma en su Shadow DOM los bloques de Final (`1218:10487` · `1220:11334`). Títulos fijos como `<h2>` por slot.
- **Iluminar:** pone `data-arq-theme="dark"` en el contenedor interno del hero y en `<arq-navbar>`, y llama a `refreshTheme()`. Igual para el Dark local de Explora la colección (DESIGN.md §2).
- **STORY:** el texto del slot se reemplaza por nodos en el DOM de la página (`<h2>`, `<p>`, `<ul>` con la etiqueta "Características del producto").
- **Descargas:** botones Outline con `icon/download`; "Ficha técnica" primero y después el orden de Final. El download-modal es para el ícono de cada fila del glosario.
- "Generar ficha técnica" y "Ficha técnica" emiten `arq:datasheet { sku }`.
- **Glosario:** columnas en `GLOSSARY_COLUMNS`; las vacías en todos los SKU no se muestran. La barra lleva CAD 2D/3D y Manual del SKU predeterminado.
- **Galerías:** ambiente, descripción e inspiración desde `getProduct().images`. Ambiente con scroll hasta el borde derecho; inspiración, mitad de columna cada foto.

## 2026-10-05 · Ficha 60/40, scroll de la galería de ambiente y datos mixtos

- **Hero de la ficha:** galería y configurador 60/40 (`minmax(0, 3fr) minmax(layout/measure, 2fr)`), gap `space/gap/5xl`; apilado hasta 1023. Igual en Final (`1218:10539`, Iluminar `1218:11785`); product-gallery Desktop con 5:4 fija.
- **Galería de ambiente:** snap `x proximity` (`mandatory` peleaba con el trackpad y el scroll vertical), `overscroll-behavior-x: contain` y `aspect-ratio: auto 4 / 5` en las fotos.
- **`VITE_DATA_SOURCE=mixto`** (solo dev): usa Typesense y completa lo vacío con `demo/fixtures/completar.js` (primero el catálogo de ejemplo por SKU o grupo; si no, datos inventados a partir del SKU y la familia). No pisa lo que el índice ya trae.

## 2026-10-05 · Colecciones

- Colecciones es una vista del embed `src/pages/productos.html`: `/arq/productos?view=colecciones`. No es una página aparte; el page-header oculta la bajada en esa vista.
- Cards con acabados de todos sus grupos y meta con sus aplicaciones; sin Comparar.
- El grupo Colecciones del catalog-nav empieza con "Todas las colecciones" (`/arq/productos?view=colecciones`), marcado solo en esa vista.

## 2026-10-05 · Colección

- Embed `src/pages/coleccion.html`: navbar (Productos Current), page-header List con breadcrumb, `<h1>` y `COLLECTION_INTRO_TEXT`; `<arq-coleccion data-collection>` con `COLLECTION_DESCRIPTION_TEXT` por slot; footer. En la demo, `?collection=<id>`.
- `<arq-coleccion>` consulta `getCollection()` y arma grilla, galería, texto + imagen y mosaico (Final `1234:13201` · `1234:13448`). Sin filtros, Comparar ni Iluminar.
- Imágenes: galería `images.gallery`, texto + imagen `images.description`, mosaico `images.inspiration`.

## 2026-10-05 · Contacto

- Embed `src/pages/contacto.html`: navbar Transparent (Contacto Current), hero sin botón, `<arq-form-contacto>` con la información por slot y footer.
- `<arq-form-contacto>`: `<form>` y campos en su Shadow DOM (dueño de los campos form-associated, manda `FormData` con el adjunto). Validación propia (`novalidate`), honeypot `website`, `fetch` multipart a `VITE_N8N_WEBHOOK_URL` (sin URL: simulado en dev, error en el build). Estados: enviando, enviado (Success y formulario vacío), error (los datos quedan). Obligatorios: nombre, email y detalles.
- **input Type=Select:** botón `role="combobox"` con select-menu Type=Text flotante del ancho del campo (lista propia, no `<select>` nativo).
- **`src/base/combobox.js`:** teclado, resaltado y clics compartidos por `arq-select` y `arq-input type="select"`. El scroll a la opción resaltada espera al próximo cuadro.
- **select-menu:** el scroll está en el host con `tabindex="-1"` (axe: scrollable-region-focusable).

## 2026-10-05 · Breakpoints Tablet y Large, y ancho máximo

- Modos y valores en DESIGN.md §2 · Breakpoints y grilla y · Ancho máximo.
- Por qué: en 1440 el margen de 40 quedaba corto y en tablet era mucho. Tablet coincide con el tramo de `catalog-nav-mobile`.
- `--page-gutter` usa `100vw` (no `100%`) para que valga lo mismo en celdas sticky y carruseles; con barra de scroll clásica de Windows el contenido queda unos px por debajo de 1792.

## 2026-10-05 · Ficha en Tablet

- Entre 768 y 1023 la ficha apila los bloques de dos columnas como Mobile (galería y configurador, descargas y especificaciones, Inspiración, Explora la colección); el resto queda como Desktop.
- Por qué: a 900 px la galería quedaba en ≈ 340 y el acordeón en ≈ 310, con títulos cortados.
- Apilado, `.details` estira sus hijos (`align-items: stretch`).

## 2026-10-05 · Texto y espaciado en rem

- Regla en DESIGN.md §2 · Nombres en código (Unidades). Por qué: si el usuario agranda la fuente, crecen juntos texto y aire. Con base 16 las capturas son idénticas a las de px.

## 2026-10-05 · variants-table dentro del contenido

- Regla en DESIGN.md §2 · Ancho máximo. La barra de filtros lleva `space/padding/md`; el scroll horizontal no muestra barra y la región tiene foco. Desde 1440 entra sin scroll.
- visually-hidden suma `margin: -1px` (sin gutter, la última columna desbordaba 1 px).

## 2026-10-05 · Tipografía Wide y texto base en 16

- `role/body` (y regular, medium, strong) es 16/24 en todos los modos: base de lectura y controles (button, select, option-tile miden 40). En Mobile además evita el zoom de iOS.
- Modo **Wide** de Type (`min-width: 1920px`): `body-sm` y `body-sm-medium` a 14/20; `body-lg` (y regular, medium) a 18/28, con el primitivo `font/size/18`. Se llama Wide porque Large es de Dimension.

## 2026-10-05 · Detalles de la ficha y select Filter

- **accordion-item abiertos:** separados `space/gap/sm` entre sí (`ficha-producto.css`).
- **variants-table-row:** padding lateral `space/padding/sm`, vertical `space/padding/xs` en Row (64 de alto). También en Figma (`923:2708`).
- **select Type=Filter:** mínimo `layout/select-filter`; select-menu Filter mínimo `layout/select-menu-filter`. Todos los estados con la línea `color/border/strong` (Disabled `color/border/disabled`), gap `space/gap/sm`, padding inferior `space/padding/sm`. También en el set (`921:2544`).
- **Filtros de acabado del glosario:** opciones con muestra; «Todos» sin muestra.
- **option-tile:** Default en `color/text/secondary`, Disabled tachado. También en el set (`921:2487`).
- **Título de la ficha:** título y «Ver colección» por `last baseline` (Final `1218:10530`).
- **Explora la colección:** misma grilla que Inspiración (un tercio + dos tercios).
- **Imágenes de prueba:** Kanu Jardín (`demo/ficha.html`) usa las de Final en WebP (`demo/fixtures/img/ficha/`); el resto, SVG de ejemplo.

## 2026-10-05 · filter-panel siempre en Light

- El panel Filtrar queda en Light aunque Iluminar ponga la página en Dark: es un formulario. Su `<dialog>` lleva `data-arq-theme="light"` (bloque generado por `npm run tokens` en `tokens.css` y `src/styles/light.css`). Única excepción de Light local (DESIGN.md §2).

## 2026-10-05 · Home: alturas y meta

- `<arq-hero full-height>`: 100svh, solo en la Home (atributo solo de código).
- Meta de Productos destacados: luminaria → su aplicación («Jardín»); otro tipo → el tipo («Lámpara»). Solo en `getProductCards`.
- Una sección por pantalla en Desktop: regla en DESIGN.md §5. Resultado: 1440×900 → ~900; 1920×1080 → ~1080.

## 2026-10-05 · Contacto: ajustes

- **Hero sin `full-height`:** 70svh en Desktop y Mobile.
- **navbar Transparent:** transparente mientras está sobre el primer `<arq-hero>`; pasa a Default cuando el borde inferior del hero sube por encima del suyo. Sin hero, al empezar el scroll.
- **Motivos de consulta en una fila desde 1440:** choice-chip con padding lateral `space/padding/md`; en form-contacto chips a `space/gap/sm` y columnas 2:3. Si entran en una fila crecen (`flex: 1 1 auto`); si hacen wrap, quedan con su ancho (`ResizeObserver`).
- **nav-link Current Desktop** en `role/body-regular` (un peso más, como catalog-nav-item Selected). No salta el layout: Current es fijo por página.

## 2026-10-05 · line-card: el link es el botón

- Solo "Ver colección" es link: `arq-button` Underline (Show underline, `icon/arrow-right`) con el `href` de la tarjeta; hover, pressed y foco son los del button. Imagen y nombre no son clickeables; sin borde de hover. category-card sigue siendo toda link.

---

## 2026-10-05 · Comparativa

- **Actualiza 2026-10-02 · Comparativa:** el rediseño de compare-product ya está en Figma. Cada columna lleva **un select por campo de `VARIANT_ATTRIBUTES`** (Color, Altura…) y ninguno de familia: para cambiar de producto se quita la columna y se agrega otra. Mismas opciones, etiquetas y disponibilidad que el configurador de la ficha (`variantOptions`, `choose` y `findVariant` de `variants.js`, desde `getCompare()` y `skuForAttribute()`); la muestra de color, solo en los atributos de acabado.
- **compare-product State=Empty:** caja punteada sin fondo, del alto de la columna, con el `+` sobre `color/surface/subtle` y «Agregar producto» en `role/body`. Es un `<button>` que emite `arq:add`; en Hover el fondo `color/surface/faint` va en toda la columna, el punteado pasa a `color/border/strong` y el ícono pierde su fondo.
- **`<arq-compare-header>`:** toggle «Solo diferencias» + 3 columnas siempre (las que sobran, en Empty), estiradas a la misma altura. El paso a Compact (fijo bajo el navbar) lo decide un `IntersectionObserver`, no es una prop. En Mobile el Default no lleva columna de controles.
- **`<arq-comparativa>`:** contenedor de página (como catalog-listing y la ficha): lee `?sku=`, pide `getCompare()` y sincroniza cabecera y tabla. Cada cambio actualiza `?sku=` (`history.replaceState`) y `localStorage` `arq:compare` (la clave de compare-bar). En Mobile las dos comparten un solo scroll horizontal (compare-table con `embedded`) y el toggle va en una fila aparte, fuera del scroll.
- **compare-table:** se le sacó la cabecera provisoria (ahora la muestra compare-header; el `<thead>` queda solo para la semántica). Siempre arma 3 columnas de valor: con menos productos quedan en blanco, así las líneas no se estiran al ancho que haya. En Mobile la etiqueta pasa arriba y los valores abajo (se sacó la columna sticky, que dejaba un espacio raro a la izquierda), agrupados como compare-section-group; `<table>`, `<thead>` y `<tbody>` pasan a `display: block` y se suman `role=` explícitos para no perder la semántica de tabla.
- **`space/section/xl`** entre el final de la tabla y el cta-block: vive en el padding inferior del scroll de compare-table, como en Final.
- **`page-header` Type=Detail:** `layout/measure-wide` aplica solo a la bajada, no a todo el bloque del título (si no, «Comparar luminarias» se baja de línea).
- **select Type=Field:** etiqueta siempre visible arriba (gap `space/gap/sm`); Default **sin fondo** — hay que ponerle `color/surface/transparent` explícito o queda el gris que el navegador le da a todo `<button>` —, Hover `surface/faint`, Focus y Open `surface/soft`. La muestra sigue siendo condicional (`showSwatch`): solo en acabados.
## 2026-10-05 · Búsqueda en Productos

- "Ver todos los resultados" y Enter en el buscador llevan a `/arq/productos?q=…`: el listado de Productos filtrado por el término (no hay página `/arq/buscar`). Se combina con la categoría y los filtros, y el filter-panel muestra los filtros de los resultados.
- El buscador del navbar y el listado usan el mismo criterio (`src/data/catalog.js`): cada palabra tiene que aparecer en el nombre, la colección, la aplicación, el entorno, el tipo o el SKU, sin importar tildes, mayúsculas ni plural ("jardines" encuentra "Jardín"). Si coincide un SKU, la card abre esa variante.
- Se filtra en memoria sobre el catálogo ya cargado, sin otra consulta a Typesense.
- Solo demo: `vite.config.js` redirige `/arq/productos` a `demo/productos.html` en `npm run dev`, porque Enter navega con `location.assign` y `demo-page.js` solo cambia links.

## 2026-10-05 · Glosario

- Pantalla nueva en Final › Glosario (`1795:18552`): navbar, page-header List con breadcrumb y bajada, variants-table y footer. Solo instancias de componentes existentes.
- **Todos los SKU del catálogo** en una sola variants-table, en el orden de los grupos (`getGlossary()` en `src/data/catalog.js`). Las columnas son las de la ficha (`GLOSSARY_COLUMNS`); las vacías en todos los SKU no se muestran.
- **Filtros:** los selectores de variante de todos los grupos más los filtros de los listados (`FILTER_FIELDS`), solo los que tienen al menos dos valores.
- **Sin descargas en la barra:** CAD 2D/3D y Manual son del grupo en la ficha y acá no hay grupo. Cada fila abre el download-modal con "Ficha técnica" y los archivos de ese SKU.
- `<arq-glosario>`: contenedor de página, como coleccion. El page-header va en el embed.

## Pendientes

Lo que está esperando a alguien. Al resolver uno, se borra de acá y se escribe la decisión en su sección. El grupo entre paréntesis es el del `TODO` en el código.

### Diseño: actualizar Figma (el código ya está hecho)

| Dónde | Qué falta |
| --- | --- |
| faq-item | Descripción del set y ficha `doc/faq-item`: separador arriba en `color/border/default` (dicen inferior y subtle) |
| footer | Ficha `doc/logo`: Compact en el footer. Set Desktop: sumar Descargas en Información |
| cta-block | Ficha: gaps `sm-md` (título–bajada) y `md` (email–button) |
| choice-chip | Set `1113:2485`, descripción y Final › Contacto: padding `md`, ancho completo en una fila |
| nav-link | Set `752:2866`: Current en `role/body-regular` |
| hero | Final › Contacto y ficha `doc/hero`: 70svh |
| line-card | Set `1036:2490`: Hover / Focus en el botón, sin borde ni `focus-ring` en la tarjeta. Descripción, ficha `doc/line-card` y copia de DESIGN.md en Plan del proyecto |
| navbar | Variantes Transparent de Menu, Search y Products (desactualizadas) |
| Ficha | Pantalla Tablet |
| select | Descripción del set `921:2544`: Field Default ya no lleva fondo (sigue diciendo `surface/soft`) |
| Productos | Título de categoría en Final (sigue "Productos"); Productos Current sin flecha (en código queda `has-dropdown`) |

### Diseño: definir

- **Tokens que faltan:** `layout/navbar-height` (56; lo usan hero, ficha y compare-header Compact); ancho de tarjeta del carrusel mobile (280); sidebar de Productos (240, hoy `layout/card-min`); ratios de las fotos del mosaico; respuesta de faq-item (560, hoy `measure-wide`); columnas del footer (200 / 240); email de cta-block (380, hoy `measure`); medidas sin token de la ficha y la colección (detalle en sus README).
- **Confirmar lo elegido en código:** posición del navbar (sticky / fixed); foco sobre foto en navbar Transparent; feature-block secundaria en `ratio/wide`; split del FAQ con `space/section/md` dentro de un bloque.
- **Faltan diseños:** PDF de ficha técnica y de "Descargar comparación"; modal para elegir producto desde compare-product Empty (hoy el botón emite `arq:add` y no abre nada); pantallas de carga, vacío y error de los listados; filter-panel abierto con Iluminar; textos de error y marca de obligatorio del formulario.
- **Glosario:** columna o filtro de colección / producto (el SKU solo puede no alcanzar para ubicar un producto); cómo se muestran muchos SKU (paginación, «Ver más» o agrupado por colección); filtros para todo el catálogo; bajada del page-header.
- **Contenido de diseño:** secciones del acordeón y reparto de campos, y columnas del glosario (`attributes.js`); características fijas de la meta de las cards y segunda línea en Colección; cantidad de imágenes de cada galería.

### Base de datos (datos / base)

- Confirmar nombres de campo con quien arma la base; faltan `product_group_id` y `collection_id` (`typesense-adapter.js`).
- Qué foto es cada una: las cuatro de product-card (estudio y contexto, apagada y encendida), las de una card de colección y las del mega-menu.
- Acabados: imágenes y tabla de códigos (N, V, R, B, BN, P).
- Orden de las cards (hoy, el de la hoja).
- Archivos de descarga por grupo (hoy CAD y Manual del SKU predeterminado).
- Regla de Artefactos: ¿también dentro de Interior y Exterior, como Lámparas?
- Revisar con la base real los links del catalog-nav y los grupos destacados de la Home.
- Sincronización Sheets → Typesense (Apps Script), cuando la base esté armada.

### Búsqueda

- **Sinónimos** ("jardín" → parque, patio…): falta decidir con el equipo si van en el front (una lista en `src/data/`, búsqueda en memoria como hoy) o en Typesense (los carga la sincronización con la admin key y el buscador pasa a consultar Typesense con el texto; suma tolerancia a errores de tipeo).

### URLs

- URLs de categoría (hoy parámetros; incluye el link de "Lámparas y artefactos" en la Home) y filtros en la URL (`docs/urls.md`).

### Contenido

- Respuestas de dos preguntas del FAQ de la Home.
- Email y teléfono reales de Contacto.
- Imágenes de Home y Contacto: pasar a URLs de Webflow Assets antes de pegar los embeds.

### Integraciones

- **n8n:** URL y formato del webhook de Contacto; webhook de la newsletter (cta-block) y su envío con `form-message`.
- **Webflow:** ver si un campo Rich Text se puede insertar en un Code Embed (reemplazaría el Markdown de STORY).
- **Código:** elegir la librería de PDF (tiene que poder incrustar Albert Sans); sincronizar el `scrollLeft` del compare-header Compact con la tabla en Mobile.
