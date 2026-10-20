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
- Movimiento: al abrir, fundido de `opacity` en `motion/duration/base` (`@starting-style`); el alto cambia de golpe y al cerrar no hay fundido. Excepción: con `animateHeight` (solo faq-item) el panel anima el alto al abrir y al cerrar (2026-10-15 · Contacto: animaciones).

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

- ~~**Foco en input Text y Textarea (excepción a DESIGN.md §7):** solo cambia el color de la línea a `color/border/focus`, sin anillo y sin cambiar el grosor.~~ Reemplazado: 2026-10-06 · Contacto: títulos e inputs.
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
- Logo Compact, como el set. Información: Contacto, Descargas y Glosario. Columnas de `layout/footer-column` y bajada hasta `layout/footer-tagline` (2026-10-06 · Anchos del footer).
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
- **product-card:** Large pasa sola a Small hasta 767 px; `size="small"` fija Small. Imágenes en `image`, `image-hover`, `image-lit`, `image-hover-lit`. Acabados siempre Small (16), sin borde en la imagen. El cambio de imagen en hover es solo con el mouse sobre la imagen (toda la tarjeta sigue siendo link): sobre el nombre o «Comparar» no cambia. El foco de teclado sí la cambia.
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

- Se genera en el navegador con los datos del SKU elegido. La librería se carga de jsDelivr con versión fija **al primer clic** (no entra en `dist/arq.js`): única excepción, documentada en el README.

### Sincronización Sheets → Typesense

- Hoy carga la base quien arma Typesense (sin acceso a n8n). Propuesta: Apps Script en la hoja con menú "Publicar en Typesense", admin key en las propiedades del script, código en el repo, validaciones antes de publicar. El CMS se carga a mano.

### Acabados

- Las imágenes salen de `src/data/finishes.js` (2026-10-19 · Imágenes de acabados). Un acabado sin imagen muestra el neutro con el nombre (DESIGN.md §8).

## 2026-10-02 · Datos de ejemplo mientras se completa la base

- Reemplazada por 2026-10-13 · Datos solo desde Typesense: no hay más catálogo de ejemplo ni mixto.
- El catálogo se carga una vez por página y `catalog.js` resuelve listados, filtros, ficha, comparativa, búsqueda y navegación.

## 2026-10-02 · navbar, mega-menu y búsqueda

- El navbar es un contenedor que consulta `src/data/` (`getNavigation` al abrir Productos, `searchProducts` al escribir); mega-menu, mega-link y search-* reciben datos.
- Árbol: Exterior e Interior (aplicaciones + Artefactos y Lámparas de ese entorno), Lámparas y Artefactos (un link por producto), Colecciones (con sus aplicaciones como bajada).
- Mode (Default · Search · Menu · Products) es estado, reflejado en `mode`.
- Menú y búsqueda mobile: `<dialog>` modales a pantalla completa (así no hay que bloquear el scroll de `body`).
- Transparent pasa a Default con el menú mobile o el mega-menu abiertos y al dejar atrás el hero (2026-10-05 · Contacto: ajustes). La búsqueda desktop sigue sobre la foto (2026-10-07 · navbar: búsqueda sobre la foto). Sticky en Default, fixed en Transparent.
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

## 2026-10-06 · Descargas

- **La página Glosario pasa a llamarse Descargas** en todo el sitio: URL `/arq/descargas` (la que ya tenía el footer), navbar, footer (Información: Contacto y Descargas) y link-list de Contacto (queda «Centro de descargas»). En Webflow, redirección 301 de `/arq/glosario`. La sección «Glosario» dentro de la ficha de producto no cambia.
- Pantalla: «Descargas (antes Glosario)» (`1801:19315`; Desktop `1808:20165`, Mobile `1808:20882`, modal `1802:30817` / `1802:30903`).
- **page-header Type=Detail:** Volver a productos, título, bajada y «Descargar catálogo general» (button Filled con `icon/download`).
- **variants-table** suma `show-search` (en Figma, prop Show search del set; search-field «Buscar por SKU o nombre…», busca en el SKU, el producto y la colección con el criterio de la búsqueda de Productos, `src/data/text.js`) y `show-sort` (select Filter «Ordenar por»: SKU A–Z por defecto, Z–A). Se combinan con los filtros; sin filas, un aviso. **Ordenar por queda afuera por ahora:** la página no usa `show-sort` y las filas van en el orden de los grupos.
- **Barra de la tabla con buscador:** buscador a todo el ancho y Filtros al lado (buscar y filtrar son la misma tarea), igual en Mobile. Filtros va siempre en button Outline, también cerrado: Filled competía con «Descargar catálogo general» del page-header. Toma el alto del buscador (42; el button Outline mide 40). En la ficha, sin buscador, no cambia.
- **Descarga de cada fila:** icon-button Background=Outline (nuevo en el set) Size=Large y encabezado «Descargas» (Mobile sin título), también en la ficha.
- **download-modal:** `sku` muestra el sku Compact debajo del título. «Descargar todo (.zip)» de la pantalla queda afuera por ahora. En Descargas las opciones van todas en Emphasis=Default, como la pantalla, con los nombres de siempre (Ficha técnica, CAD 2D/3D, Manual, IES, Fotometría): los formatos de la pantalla («· DWG + STEP») son de ejemplo.
- **Scroll con el modal abierto:** la página de atrás no se mueve. `src/base/scroll-lock.js` cancela rueda, touch y teclas de scroll en el `<dialog>` (incluido el scrim) salvo que algo de adentro se pueda desplazar; no se toca `<html>` ni `<body>`. Por ahora solo en download-modal.
- **Columnas y filas de la tabla:** las fijas (sku y Descargas) miden su contenido y el ancho que sobra se reparte entre las de datos; del sku a los datos, `space/gap/sm-md`; Descargas, centrada. Hasta 1023 px solo la miniatura queda fija y el sku se desplaza con los datos (la ficha de Figma ya lo pedía para Mobile; en Tablet deja ver más columnas). Padding vertical de las filas `space/padding/sm` (en Figma, xs), así el botón de descarga no queda pegado a la línea. Vale también para la ficha.
- **Figma (06/10):** descripciones de variants-table, variants-table-row, download-modal e icon-button; fichas `doc/` de esos cuatro; copias de DESIGN.md y COMPONENTS.md del Plan; notas de Dev Mode en la pantalla y el modal. Dibujo: pantalla Descargas y modal como el código; variants-table con prop Show search (buscador + Filtros del mismo alto); variants-table-row con icon-button Outline en Desktop, columna centrada y filas de 72 (padding sm); navbar y footer con «Descargas»; «Glosario técnico» oculto en Contacto. La pantalla vieja quedó como «Glosario (anterior · reemplazada por Descargas)».
- `<arq-descargas>` reemplaza a `<arq-glosario>`; `getDownloadsTable()` a `getGlossary()` y suma `search` a cada fila.

## 2026-10-06 · Contacto: títulos e inputs

- **Títulos de bloque del formulario** (Tipo de consulta, Tus datos, Tu proyecto): el `<legend>` de cada `<fieldset>` en `role/heading-3`, sin número ni línea inferior. Ya no usa form-section-header (el componente queda en el repo, sin uso). No es un `<h3>`: el formulario vive en el Shadow DOM y los componentes no crean encabezados; el legend ya nombra el grupo para lectores de pantalla.
- **input en caja:** borde `color/border/default` en los cuatro lados y fondo `color/surface/default`, 40 de alto (como button), padding `space/padding/sm` × `space/padding/sm-md`. Hover `color/border/hover`; Focus con el anillo de §7 (se deja la excepción de solo cambiar el color de la línea); Error `color/border/error`; Open `color/border/strong`. Vale en todo el sitio (también el newsletter del cta-block). Por qué: la línea sola no se parecía a choice-chip, file-upload ni button.
- Se probó el formulario sobre un fondo leve (cada bloque en caja y después todo en una sola caja) y se descartó: queda sin fondo. El `<legend>` va con `float` para ser un ítem flex (separado por el gap).
- **Sin líneas en la columna de información:** contact-item sin línea superior ni padding vertical; los canales van a `space/gap/lg`, sin línea de cierre.
- **Figma:** los sets de input (`930:2364`) y contact-item (`1303:4340`) y la pantalla Contacto siguen como antes: falta actualizarlos.
- **form-section-header, de baja:** sin uso desde este cambio; se sacó del repo (componente, demo y docs/components.md). En Figma el set queda marcado como en desuso.

## 2026-10-06 · Anchos del footer

- Tokens nuevos en 2 · Semantic · Dimension: `layout/footer-column` (200) y `layout/footer-tagline` (240), enlazados al ancho de las columnas Desktop y de la bajada en el set `788:3104`. Por qué: con el ancho de su contenido las columnas quedaban amontonadas y no repartidas como en Figma.
- En Tablet (768–1023) las columnas se angostan por igual si no entran (`flex: 0 1`). En Mobile siguen repartiéndose el ancho.
- **Footer en Dark local** (`data-arq-theme="dark"` en el `<footer>` interno) y **logo Size=Default**, del mismo tamaño que el de la navbar, en Desktop y Mobile. Pedido de diseño. **Figma:** falta pasar el set `788:3104` a modo Dark y su logo a Size=Default.

## 2026-10-06 · Ficha técnica en PDF

- Diseño: `ficha_pdf · componentes` (Figma `1907:27213`): pdf-page, pdf-header, pdf-cover-title, pdf-spec-group, pdf-spec-row y pdf-footer. Código en `src/pdf/`; lo dispara `arq:datasheet { sku }` (ficha y Descargas) desde `main.js`.
- **Se abre, no se descarga:** el PDF se muestra en una pestaña nueva, en el visor del navegador. La pestaña se abre vacía en el clic (para que no la bloqueen) y carga el PDF cuando está listo. Si el navegador la bloquea, se descarga.
- **Librería:** pdfmake 0.3.11, de jsDelivr por `/+esm` (módulo ES, sin globales) al primer clic, con Albert Sans de `@fontsource/albert-sans`. Versiones fijas en `src/config.js`. Pagina sola y repite encabezado y pie.
- **Hojas:** la portada es la hoja 1; las especificaciones arrancan en la 2 y suman hojas si no entran. Una sección no se parte: si no entra en lo que queda, pasa entera a la hoja siguiente. Solo una sección más alta que una hoja se corta y repite su título. El pie de la hoja 2 en adelante es el aviso legal.
- **Secciones:** las mismas del acordeón de la ficha (`specSections` de `attributes.js`), con todas las que tienen datos: con los datos reales son tres hojas.
- **Imagen:** la principal del SKU (`img_main` → `images.main`); si falta, la de estudio. Se lee con CORS y se pasa a JPEG en un canvas (pdfmake no acepta WebP). Sin CORS, la portada sale con el fondo `color/bg/subtle` sin imagen. Requisito para el servidor de imágenes (S3): `Access-Control-Allow-Origin` para macroled.com.ar.
- **Tokens (excepción):** pdfmake no lee variables CSS. `npm run tokens` genera también `src/styles/print-tokens.js` con los valores resueltos de Semantic y `role/*`: Color Light, Dimension Desktop y Type Mobile, como los frames de Figma («Escala Type en modo Mobile»). Se convierten px → pt (× 0,75). Nada se escribe a mano.
- El logo pasó a `src/base/logo-paths.js` para usarlo en arq-logo y en el PDF.
- **Mientras se genera:** el botón que se tocó pasa a State=Loading con "Generando…". Se agregó en Figma `Type=Outline, State=Loading` (fondo de Hover, sin íconos), y en código `loading-label`. La promesa llega al componente en `event.detail.pending`.
- **Token nuevo:** `layout/pdf-spec-label` (260), ancho de la etiqueta de pdf-spec-row.
- **Nombre al guardar desde el visor:** Chrome lo toma solo de la última parte de la URL; con un blob es un código al azar. No usa el título del PDF, el nombre de un `File` ni `Content-Disposition` (probado). Para que se llame `ficha-tecnica-<sku>.pdf` hace falta servir el PDF desde una URL que termine así (ver Pendientes).

## 2026-10-06 · Comparativa: imprimir

- Funciona como macroled.com.ar/comparativa: «Imprimir comparación» llama a `window.print()` y cada componente trae su `@media print`. No se genera un PDF aparte: desde el diálogo del navegador se imprime o se guarda como PDF. La ficha técnica sigue con su PDF en pestaña nueva.
- El botón lleva `data-arq-print` y lo engancha `main.js` (sirve para cualquier página). Sin ícono: no hay ícono de impresora en la librería.
- La tabla se imprime siempre como en Desktop (etiqueta a la izquierda, valores al lado, líneas verticales de todo el alto de la fila), también en una hoja A4, que mide menos de 768 px y llega con las reglas Mobile: con la etiqueta arriba las divisiones no se entendían. Sin las columnas vacías; los productos de arriba quedan alineados con sus columnas. Tokens en modo Mobile, como el PDF de la ficha.
- Al imprimir no aparecen navbar (queda el logo), volver, bajada y acción de page-header, toggle «Solo diferencias», selects, quitar, cta-block, compare-bar ni footer. Las reglas valen para cualquier página que se imprima.
- Mientras se imprime, `document.title` es «Comparativa · <productos> · Macroled Arq»: Chrome lo propone como nombre del PDF.
- Sin `@page`: tamaño y márgenes quedan los del navegador (no se toca la impresión del resto del sitio de Macroled).

## 2026-10-06 · select unificado y compare-product Compact

- **select:** Field y Filter se construyen igual (etiqueta sin gap + trigger con línea inferior y padding vertical `space/padding/sm-md`). Reposo en `role/body-regular`; Hover y Open en `color/surface/faint` en los dos; solo Filter Filled va en `role/body-medium`. Nueva prop `show-swatch` (Figma: Show swatch, activada en Figma; en código, atributo de presencia desactivado por defecto).
- **Focus del select:** anillo `border/strong` en `color/border/focus` separado 2 px (DESIGN.md §7). Figma lo dibuja pegado al trigger porque no tiene offset.
- **compare-product Size=Compact** reemplaza a compare-slot en el compare-header Compact. compare-slot queda solo para compare-bar. `show-sku` solo aplica a Compact (en Default el SKU siempre se ve); el compare-header lo enciende en Desktop y lo apaga en Mobile.
- **filter-bar:** con la nueva construcción, la celda de Filter mide 70 (antes 55) y la barra crece.

## 2026-10-07 · navbar: búsqueda sobre la foto

- Con Theme=Transparent, abrir la búsqueda en Desktop ya no pasa la barra a Default: la barra sigue translúcida y `arq-search-field` queda en blanco, como en Default (set `1009:2333` y descripción del set actualizados).
- Sobre la foto, la lupa y el menú (icon-button) van en Dark local (`data-arq-theme="dark"`, lo pone el navbar), como el button sobre fotos: en Light su hover `color/surface/hover` era un cuadrado claro que tapaba el ícono inverso.
- El menú mobile y el mega-menu siguen pasando la barra a Default. En Figma, las variantes Transparent de Menu y Products quedaron iguales a las Default, y la ficha `doc/navbar` está actualizada.

## 2026-10-07 · Base de datos sin IDs

Reemplaza a 2026-10-02 · Base de datos (estructura v5) en cómo se identifican productos y colecciones. Detalle de campos e imágenes: `docs/typesense-schema.md`.

- **Sin `PRODUCT_GROUP_ID` ni `COLLECTION_ID`** (pedido del equipo: no sumar columnas a la hoja si otra sirve). Un producto son las filas con el mismo `product_name`; su id sale del nombre (`kanu-jardin`) y es el slug de la ficha y del ítem del CMS. Si cambia el nombre, cambia la URL: para renombrar sin perderla habría que sumar un id.
- **Colecciones:** una fila propia (`product_type` «Colección», SKU `col-<id>`) con sus textos e imágenes; su `familia` lista las familias que reúne. COLLECTION_ID, COLLECTION_NAME, IS_COLLECTION_DEFAULT, COLLECTION_APPLICATIONS y las columnas `_REFS` ya no se usan.
- **Accesorios** (frame `ficha-accesorios/productos`, `1498:19001`, que ahora sí entra en el alcance): productos con `product_type` «Accesorio» y ficha propia; `compatible_with` dice con qué producto se usan. No entran en las colecciones. Las secciones de la ficha (requeridos, compatibles) y su componente se definen más adelante.
- **Encabezados de la hoja = nombres de campo** de Typesense. La sincronización (n8n) pasa cada columna con su nombre y arma las listas `multimagen_*` con posición fija: una foto que falta queda como `""` en su lugar.
- **Galería de la ficha:** main, ambient_1, front, back, left, right, pers_1, pers_2, detail_1, detail_2; con Iluminar, cada una a su `_on`. Una variante sin fotos propias muestra el fondo neutro, no las del predeterminado. Lo mismo la miniatura de su fila en el glosario y en Descargas: así se ve qué falta cargar.
- **CMS de Webflow:** solo el ítem de cada producto y colección (nombre y slug), para que exista su URL. Todo el resto, textos incluidos, viene de Typesense: la ficha toma la descripción corta, el story y la inspiración de los datos, y la colección su intro y su descripción. Si un dato falta, esa parte no se muestra: no hay texto de respaldo en el HTML, para ver qué falta en la base. Story: la primera línea es el título (`role/heading-2`) y las características van con `- ` (la etiqueta «Características del producto» la pone el componente). Reemplaza a 2026-10-02 en que esos textos van en el CMS.
- **Navegación:** ambiente = `macrofamilia`, aplicación = `subfamilia`.

## 2026-10-13 · Iluminar: fondo de página y transición

- **Fondo:** Productos y Colecciones llevan `<main class="arq-page">` en su embed. `.arq-page` (`src/styles/global.css`, parte de `dist/arq.css`) pinta `color/bg/default` y funde con el tema. No se estila `html` ni `body`: el sitio de Webflow no necesita configuración extra. Por qué: lo que queda transparente (page-header) deja ver esa capa, que funde en el mismo cuadro que `catalog-listing` y el navbar; el fondo del lienzo se actualiza uno o dos cuadros después y dejaba una franja.
- **Duraciones y curvas** (variables `--arq-illumination-*` en `global.css`, provisorias, sin token en Figma): fondo 1200 ms e imagen 700 ms (2026-10-14: el fondo era 2100 ms y la imagen 1200 ms; se sentía lento y se bajaron en la misma proporción), con la imagen en una curva que termina antes. Con `prefers-reduced-motion` valen 0.
- **Texto, íconos y bordes:** no funden a la par del fondo. `animateThemeChange()` (`src/base/theme.js`) pone en `<html>`, solo durante el cambio, la espera (25 %), la duración (50 %) y la curva del texto; hover y foco no se afectan. Si cambia la duración del fondo, se cambia también el valor por defecto de esa función.
- **Herencia de color:** un elemento que hereda el color de otro no lleva transición propia (logo, íconos SVG, etiqueta del breadcrumb, icon-button); si no, la espera se suma y cambia tarde.
- **Imágenes:** la card y la galería precargan la versión del otro modo para que el fundido arranque junto con el fondo. TODO (diseño): DESIGN.md §8 pide cargarla al activar Iluminar.

## 2026-10-13 · Datos solo desde Typesense

- **Una sola fuente:** `src/data/source.js` consulta Typesense, en desarrollo y en el build. Se eliminaron los modos `mock` y `mixto` (`VITE_DATA_SOURCE`) y los archivos `demo/fixtures/catalogo.json` y `completar.js`; quedan en el historial de Git. Lo que la base no trae se ve vacío (o con el fallback de cada componente): se completa en la base, no en el código.
- **Configuración en el repo:** `.env` se commitea con host, colección y **search-only key**; Vite lo lee con `npm run dev` y con `npm run build`. Cada persona puede pisar valores en `.env.local` (ignorado por Git). La clave es pública por diseño: Webflow carga `dist/arq.js`, que la lleva dentro (AGENTS.md · Datos). Requisitos de la clave: acción `documents:search` y colección `macroled_arq` únicamente. La admin key nunca va en el repo.
- **Cambiar o rotar la clave:** se edita en `.env`, se compila (`npm run build`) y se commitea `dist/`; hasta publicar el release, el sitio de Webflow sigue con la clave anterior. Revocar la vieja en Typesense recién después.
- **Errores:** si falta una variable, la consola de `npm run dev` dice cuál (`missingConfig()` en `typesense.js`).

## 2026-10-13 · Navbar mobile por niveles, mega-link Default/Large y tokens de tipo

- **Auditoría Figma ↔ código** (página Componentes): se revisaron descripciones y propiedades de los 79 sets contra `docs/components.md`, DESIGN.md y los READMEs.
- **navbar:** Mode suma Colecciones, Interior, Exterior y Lámparas y artefactos (`colecciones`, `interior`, `exterior`, `lamparas-y-artefactos`). En Mobile, Productos lista los cuatro como `arq-mega-link button` (chevron-right) y cada uno abre su submenú con "volver" (con el nombre del nivel), links Size=Large y "Ver todo…". Reemplaza a los grupos desplegables (Type=Group) del submenú anterior. Volver y Esc suben un nivel.
- **mega-link:** solo Size Default y Large. Se quitaron XL y Small de Figma (las 28 instancias del mega-menu pasaron a Large y Default). Suma `show-image` + `image` (miniatura), `icon` (ícono de la flecha) y `button` (fila que abre un submenú). El padding vertical de Link pasó a `space/gap/md` como el set.
- **mega-menu:** la pestaña Aplicación se llama **Por espacio** (`por-espacio`, antes `aplicacion`). Las columnas Por espacio y Lámparas y artefactos usan mega-link Large; Colecciones, Default.
- **catalog-nav-group:** Selected lo guarda el grupo (`selected`); se marca solo si contiene un ítem `selected`. catalog-nav y catalog-listing leen el grupo, no el ítem.
- **Tokens (Figma → `tokens/figma/`):** `type/body-compact`, `type/display-lg`, `space/5`, `font/size/80`, `font/leading/100` nuevos y `layout/mega-menu-image` 438 → 420. Estilos `role/body-compact` (+ regular, medium, strong), `role/display-lg` y `role/heading-3-light` agregados a `tokens.json` (no son variables: no los trae el import).
- **Sin tocar (lo pidió diseño):** variants-table-row, compare-product, hero Size Compact y la columna extra del mega-menu de Figma (títulos `role/heading-1`, Colecciones en 4 columnas, panel «imagen · preview hover»). Quedan anotados como `TODO` en los READMEs.

## 2026-10-14 · Baja de tag

- El componente tag (Figma `981:2305`) no se va a usar: se quitó de DESIGN.md, `docs/components.md` y `docs/setup.md`. No había código. product-card resuelve el tipo de producto con Meta.

## 2026-10-14 · Tipografía y catalog-nav (Productos v2)

- Figma sumó `role/display-lg`, `role/heading-3-light` y `role/body-compact` (con regular, medium y strong), y cambió el estilo de varios sets (page-header, accordion-item, faq-item, tab, input, file-upload, contact-item, nav-link Mobile). El código sigue a los sets.
- **catalog-nav:** grupo con label role/body-xl, chevron, línea inferior y lista con riel; ítem en role/body-compact. Nuevo `layout/catalog-nav` (240) para el ancho del sidebar; entre sidebar y contenido, `space/section/xs`, como la pantalla.
- **carousel-button:** el chevron medía 14 sin token; se enlazó a `icon/md` (16), el de icon-button.
- **Meta de product-card:** solo en Colecciones, no en Productos (aunque la pantalla v2 de Figma la muestre).
- **color/bg/\*** se quitó de Figma: los fondos de sección usan color/surface/\* (mismo valor). Se reemplazó en código, en el PDF y en la documentación.
- **role/label-lg** (Regular 14/16, mayúsculas, tracking 1 px): nuevo estilo para la etiqueta de select Type=Filter. Field sigue en role/label.
- **nav-link Current (Desktop):** role/body-medium, como la pantalla de Figma (antes role/body-regular).
- La página «Final-final» de Figma es de prueba: junta los frames con cambios hasta que se pasen a «Final». No es fuente de pantallas.

## 2026-10-14 · Contacto v3

- **Pantalla:** Contacto v3 (`2295:23055`; venía de «Final-final» como «Contacto v3 · propuesta») reemplaza a Final › Contacto. Solo tenía Desktop: en código, Mobile apila las columnas. En Figma se sumaron, en la sección Contacto de Final, «Contacto v3 · enviado» (`2473:30758`), «Contacto v3 · mobile» (`2473:30918`) y «Contacto v3 · mobile · enviado» (`2473:31283`), armados desde el Desktop con los modos Mobile de Dimension y Type, como el código (`TODO` diseño: revisarlos). Los frames anteriores quedaron debajo como «Contacto (anterior · reemplazada por v3)».
- **Manda el dibujo de los sets** (sus descripciones y fichas `doc/` estaban viejas; se actualizaron el mismo día): choice-chip Selected en `color/surface/inverse` con texto `color/text/inverse` y padding `space/padding/sm` × `md`; form-section-header en `role/heading-3` con línea `border/default` en `color/border/default`; link-list con título `role/body-lg-regular` en `color/text/secondary` y todo a `space/gap/sm`.
- **Títulos de bloque del formulario:** el `<legend>` de cada `<fieldset>` toma el dibujo de form-section-header (reemplaza 2026-10-06 · Contacto: títulos e inputs, que lo dejaba sin línea). No vuelve el componente: el legend tiene que ser hijo directo del fieldset.
- **hero Size=Compact** (`size="compact"`): título en `role/display-lg`. Alto mínimo proporcional al Default (520/880 y 480/720 del set sobre 70svh): `41svh` en Desktop y `47svh` en Mobile; si el texto no entra, crece. Padding superior `space/section/md` para no quedar bajo el navbar.
- **form-contacto:** columna de información fija al desplazar (sticky a `space/section/md`) en Desktop; intro en `role/display-sm` y `role/body`, con línea inferior; título «Contacto» sobre los canales (slot `channels-title`); campos opcionales con «(opcional)» en la etiqueta; textarea de 6 filas; chips con su ancho (se quita el estirado a una fila de 2026-10-05 · Contacto: ajustes); checkbox arriba y botón debajo, a la izquierda.
- **Adjunto hasta 25 MB** (el set file-upload dice 10), con la ayuda «¿Pesa más? Pegá un link de Drive o WeTransfer en el detalle.» `TODO` (n8n): que el webhook acepte 25 MB.
- **Preguntas frecuentes en Contacto:** van dentro de `<arq-form-contacto>` por slots (`faq-title`, `faq-description`, `faq-action`, `faq`), en la misma grilla que la consulta, para que las preguntas queden alineadas con el formulario. Fondo `color/surface/faint`, `space/section/lg` arriba y abajo. «Escribinos» lleva al formulario de la misma página (`href="#formulario"`, el `id` de `<arq-form-contacto>`) con `icon/arrow-right`, como la instancia de v3 y la descripción de button (→ es navegación interna).
- **Figma (14/10):** descripciones de choice-chip, form-section-header, link-list, hero y file-upload; fichas `doc/` de esos cinco (con la fila Size en `doc/hero`); anotación de form-section-header (es el estilo del `<legend>`, no un Web Component); copia de COMPONENTS.md del Plan.

## 2026-10-14 · Navbar y mega-menu v2

- **Fuente:** los frames de «Final-final» `2295:23636`, `2295:23691` y `2295:23730` (mega-menu) y `2295:23568` y `2295:23605` (menú mobile) son el diseño final y mandan sobre los sets mega-menu y navbar.
- **mega-menu:** pestaña «Por espacio» (Interior · Exterior), títulos `role/heading-1`, Colecciones en cuatro columnas, «Ver todo…» con → al pie y «Ver todas las colecciones» con ↗ (como el frame), todos a la misma altura. Preview a la derecha: la foto del link con el mouse o el foco, con eyebrow y nombre sobre un degradado. `TODO` (datos): qué foto muestra una categoría (hoy, la del primer producto de la categoría con foto).
- **Menú mobile:** Productos es una lista Interior · Exterior · Colecciones que entra a cada nivel (Mode Interior · Exterior · Colecciones del set navbar), con «volver» y «Ver todo…» al pie; Colecciones con miniatura y «Ver todo» fijo abajo. Lámparas y artefactos no está en la lista del frame (en Desktop sí, como pestaña).
- **Textos del menú mobile:** todas las filas en `role/heading-3` (20/28), como los nav-link del Menú; bajada en `role/caption`. Se probaron en Figma tres opciones (actual, todo `role/body-xl`, todo `role/heading-3`) y se eligió la última: tres tamaños claros (20 navegar, 16 acciones, 12 bajada).
- **mega-link (set `840:2070` actualizado):** Default en `role/body-xl` con padding `space/gap/sm-md` y gap `space/gap/md`, bajada `role/body-compact-regular`; Large en `role/heading-3`; la flecha solo en Hover y Focus. Show image (miniatura de 60) implementado; el 60 no tiene token. En código, `submenu` (fila con chevron-right que abre un nivel del menú mobile).

## Pendientes

Lo que está esperando a alguien. Al resolver uno, se borra de acá y se escribe la decisión en su sección. El grupo entre paréntesis es el del `TODO` en el código.

### Diseño: actualizar Figma (el código ya está hecho)

| Dónde | Qué falta |
| --- | --- |
| faq-item | Descripción del set y ficha `doc/faq-item`: separador arriba en `color/border/default` (dicen inferior y subtle) |
| footer | Ficha `doc/logo`: Compact en el footer |
| cta-block | Ficha: gaps `sm-md` (título–bajada) y `md` (email–button) |
| choice-chip | Set `1113:2485`, descripción y Final › Contacto: padding `md`, ancho completo en una fila |
| nav-link | Set `752:2866`: Current en `role/body-regular` |
| hero | Final › Contacto y ficha `doc/hero`: 70svh |
| line-card | Set `1036:2490`: Hover / Focus en el botón, sin borde ni `focus-ring` en la tarjeta. Descripción, ficha `doc/line-card` y copia de DESIGN.md en Plan del proyecto |
| Ficha | Pantalla Tablet |
| select | Descripción del set `921:2544`: Field Default ya no lleva fondo (sigue diciendo `surface/soft`) |
| layout/featured-thumb | Variable de Dimension (160 / 120 Mobile) sin descripción ni nombre CSS en Figma; entró al repo con la exportación de `layout/pdf-spec-label` |
| Productos | Título de categoría en Final (sigue "Productos"); Productos Current sin flecha (en código queda `has-dropdown`) |

### Diseño: definir

- **Hover de select Filter en filter-bar:** el hover `color/surface/faint` coincide con el fondo de la barra (`color/surface/faint`) y no se ve. Decidir otro color de hover (p. ej. `color/surface/hover`) o el fondo de la barra. `TODO (diseño)`
- **Tokens que faltan:** `layout/navbar-height` (56; lo usan hero, ficha y compare-header Compact); ancho de tarjeta del carrusel mobile (280); sidebar de Productos (240, hoy `layout/card-min`); ratios de las fotos del mosaico; respuesta de faq-item (560, hoy `measure-wide`); columnas del footer (200 / 240); email de cta-block (380, hoy `measure`); medidas sin token de la ficha y la colección (detalle en sus README).
- **Confirmar lo elegido en código:** posición del navbar (sticky / fixed); foco sobre foto en navbar Transparent; feature-block secundaria en `ratio/wide`; split del FAQ con `space/section/md` dentro de un bloque.
- **Faltan diseños:** versión impresa de la comparativa y botón «Imprimir comparación» en Final (hoy armados como en Macroled); mensaje de error si no se puede generar la ficha técnica en PDF; modal para elegir producto desde compare-product Empty (hoy el botón emite `arq:add` y no abre nada); pantallas de carga, vacío y error de los listados; filter-panel abierto con Iluminar; textos de error y marca de obligatorio del formulario.
- **Descargas (antes Glosario):** URL del catálogo general (no está en la base); columna o filtro de colección / producto (el SKU solo puede no alcanzar para ubicar un producto); cómo se muestran muchos SKU (paginación, «Ver más» o agrupado por colección); filtros para todo el catálogo; bajada del page-header.
- **Contenido de diseño:** secciones del acordeón y reparto de campos, y columnas del glosario (`attributes.js`); características fijas de la meta de las cards y segunda línea en Colección; cantidad de imágenes de cada galería.

### Base de datos (datos / base)

- Confirmar nombres de campo con quien arma la base; faltan `product_group_id` y `collection_id` (`typesense-adapter.js`).
- Qué foto es cada una: las cuatro de product-card (estudio y contexto, apagada y encendida), las de una card de colección y las del mega-menu.
- Acabados: regla del blanco mate y del acero para los productos Skyline, cuando se organice su estructura en la base (`docs/acabados.md`, Pendientes).
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
- **Nombre del PDF en el visor:** decidir si se sirve la ficha técnica desde una URL propia (`…/ficha-tecnica-<sku>.pdf`) para que Chrome la guarde con ese nombre. Opciones: función en un servidor (Cloudflare Worker, Vercel, n8n) que genere o devuelva el PDF. Hoy se guarda con un código al azar.
- **S3:** confirmar que el servidor de imágenes responde con CORS (`Access-Control-Allow-Origin`); si no, la ficha técnica en PDF sale sin foto. Hoy Typesense no tiene imágenes cargadas y no se pudo probar.
- **Código:** sincronizar el `scrollLeft` del compare-header Compact con la tabla en Mobile.

## 2026-10-13 · Ficha v2 (accordion-item, variants-table, select, spec-row)

La pantalla de la ficha pasa de Final › Ficha (1218:10487) a **Ficha v2** (2085:26124, solo Desktop) y la tabla del glosario suma su vista Mobile (2180:11245). Cambios en código:

- **Hero:** galería a sangre a la izquierda (14 de 24 columnas, 4:3) con las miniaturas en columna y Iluminar sobre la foto; configurador a la derecha con breadcrumb, título, sku (compact), descripción, opciones, «Comparar» y dos botones («Generar ficha técnica» · «Ver descargas»). Se quita el bloque Descargas de la ficha: los archivos están en el glosario (CAD / Manual y el ícono de cada fila). «Comparar» usa una compare-bar propia de la ficha con la variante elegida.
- **accordion-item:** título `role/body-xl`, sin fondo al abrir, borde en el ícono, padding abierto `space/padding/lg`. spec-row: etiqueta y valor en la misma fila (padding `space/padding/sm`, valor en `role/body`). spec-list suma `columns` (dos columnas desde 1024 px).
- **variants-table:** botón Filtros siempre Filled (icon/close abierto) con la cantidad al lado; filter-bar `stacked` (fondo `surface/soft`); encabezado `role/body-regular`; valores `role/body-lg-regular`; sku `size="underline"` (código subrayado en `role/caption-medium`, «Copiado» en su lugar). En Mobile, tarjetas por variante en lugar de tabla.
- **select:** la etiqueta depende del Type, como en Figma: Field, `role/label` (12 px; compare-product); Filter, 14 px (glosario), compuesta con variables porque no existe un estilo `role/*` de 14 px en mayúsculas. `role/label-sm` (10 px) se dejó de usar en select.
- **Figma (hecho el 2026-10-13):** se actualizaron los sets accordion-item, spec-row, select (etiquetas), filter-bar (fondo soft, columna), variants-table y variants-table-row; se creó variants-table-card (Mobile); `layout/table-thumb` pasó de 56 a 100 (tokens reimportados). La pantalla mobile está en PRUEBA como «Ficha v2 · Mobile 390» y la desktop como «Ficha v2 1920» / «Ficha v2 1440». Pendiente: pasar el accordion y spec-row de las pantallas desktop (hoy son frames, no instancias) a instancias.

## 2026-10-13 · Búsqueda como top sheet (prueba)

Prueba de una búsqueda de Desktop que baja desde arriba (referencia: occhio.com). No cambia lo que hay: se activa con `<arq-navbar search="sheet">`; por defecto sigue el campo en la barra con su dropdown.

- **Nuevo:** `arq-search-sheet` (diálogo modal, scrim, `arq-search-sheet-in`), `search-field type="line"` y `getRecommendedProducts()` en `src/data/catalog.js`. Ninguno está en Figma.
- **Recomendados:** hoy son los primeros grupos del catálogo con foto. El criterio real (destacados a mano, novedades, más vistos) está sin definir.
- **Mobile:** sin cambios (search-screen).
- **Pendiente si se adopta:** diseñar sheet y Type=Line en Figma, Mobile, animación de cierre, y decidir si reemplaza al campo en la barra y a search-dropdown.
- **Resultados del sheet:** Productos como fila de miniatura + nombre (`search-result type="simple"`) y Colecciones como card propia (`arq-search-collection`). `searchProducts()` devuelve `kind: 'product' | 'collection'` en cada resultado. Nada de esto está en Figma.
- **Dato a revisar:** con la base actual, buscar "kanu" no devuelve colecciones (la fila «Colección» entra como producto, sku `col-kanu`), así que el grupo Colecciones no aparece hasta que el adaptador las reconozca.

## 2026-10-14 · Campos por consulta (Typesense)

El servidor de Typesense es lento (4–5 s al primer byte y ~5 KB/s, sin gzip) y cada documento trae unos 100 campos, casi todos vacíos: la consulta única de todo el catálogo pesaba 306 KB y tardaba 52–66 s. Ahora se piden solo los campos que usa cada pantalla.

- **Catálogo (todas las páginas):** una consulta con todos los documentos y `LIGHT_FIELDS` (`typesense-adapter.js`): identificación, colecciones, fotos de card y de ambiente, y los campos técnicos de `attributes.js`. Pasó a 131 KB y ~25 s.
- **Ficha:** además, una consulta por grupo (`filter_by: product_name:=<nombre>`) con `DETAIL_FIELDS`: descripción, descargas, resto de las fotos y textos. Se pide al abrir la ficha, o el modal de descargas de la página Descargas, y se guarda en memoria. Lo que cambia con la variante (`?sku=`) sale de ese grupo, sin nuevas consultas.
- **Sin cambios:** las URLs (`/arq/producto/<grupo>?sku=`), la forma del catálogo de `catalog.js` y los componentes. Verificado: la salida de listados, navegación, Descargas, Comparativa, PDF, Colección y las 17 fichas es idéntica a la de la consulta completa.
- **Regla:** un campo nuevo que use una pantalla se agrega a `LIGHT_FIELDS` o `DETAIL_FIELDS`; si no, llega vacío sin error.
- **Pendiente (servidor):** activar gzip en nginx (el JSON con claves repetidas baja ~90 %) y revisar por qué un documento tarda 4 s. Si hace falta más: pedir los campos técnicos que solo usan la Comparativa y el PDF por SKU, o generar un `catalogo.json` estático en la sincronización Sheets → Typesense.
- **Siguiente paso (pendiente):** una consulta por pantalla, con el listado de Productos pidiendo solo los SKU predeterminados de Luminaria. Diseño en `docs/consultas-typesense.md`, a retomar cuando n8n sincronice el schema nuevo.

## 2026-10-14 · El search-sheet pasa a ser la búsqueda del navbar

El top sheet deja de ser opt-in: `<arq-navbar>` usa `search="sheet"` por defecto, en Desktop, Tablet y Mobile y en todas las páginas. `search="inline"` conserva la versión anterior (campo en la barra + search-dropdown, y search-screen en Mobile), que queda como respaldo mientras el sheet no esté en Figma.

- **El sheet dibuja su contenido:** se alimenta con `sheet.recommended` y `sheet.results` (ya no por slots), así se muestra igual en el navbar y en la demo. `inline` es solo para la demo.
- **Demo:** sección «search-sheet» de `demo/index.html` con iframes de `demo/search-sheet.html` a 1440, 900 y 390 px (datos de ejemplo).
- **Rendimiento:** el catálogo tarda varios segundos en cargar la primera vez. El navbar pide los recomendados al acercarse a la lupa para que el sheet ya los tenga al abrirse.
- **Pendiente:** diseño en Figma (sheet, Type=Line, Type=Simple, search-collection) y Mobile definitivo.

## 2026-10-14 · search-sheet: jerarquía de resultados

- **Productos primero:** miniatura de 100 (`layout/table-thumb`; en Mobile `layout/gallery-thumb`, 76), 24 px entre filas (`space/gap/lg`) y el nombre en gris (`color/text/tertiary`) con lo que coincide con la búsqueda en `color/text/primary` y más peso. Si nada coincide, todo en gris. Hover, Focus y Active: todo el nombre en primary, sin fondo ni cambio de peso. Resaltado en `src/base/highlight.js` (sin tildes ni mayúsculas).
- **Colecciones discretas:** miniatura de 48 y nombre con el mismo tratamiento, a la derecha en Desktop; debajo de los productos en Tablet y Mobile. Se reemplaza la card grande anterior.
- **Cruz** del sheet: icon-button `size="large" background="none"`. Campo con padding superior `space/gap/md`.
- **Sin Dark:** el sheet deja de mostrarse en Dark en la demo. Pendiente de limpieza: revisar qué otros componentes tienen versión Dark sin necesitarla.
- **Pendiente de Figma:** token propio para la miniatura de 100 (hoy se reusa `layout/table-thumb` y `layout/gallery-thumb`).

## 2026-10-14 · search-sheet: transición en capas

El sheet se abre y se cierra con una transición suave (referencia: occhio.com), menos de medio segundo en total y con `transition` (no keyframes), así el cierre es la misma animación al revés:

- **Velo:** la página de atrás se aclara a medias (`color/surface/faint` al 50 %) en lugar del scrim oscuro.
- **Barra:** de transparente a sólida. Con la barra transparente sobre el hero (Home al cargar) el sheet arranca igual (logo y cruz en inverso) y se vuelve sólido; con la barra blanca parte de ella. El navbar no cambia al abrir la búsqueda en ningún ancho, para que no haya saltos de color debajo.
- **Panel:** persiana con `grid-template-rows` 0fr → 1fr. Campo y contenido bajan mientras se hacen visibles; productos y resultados llegan un instante después con fundido y un movimiento corto hacia abajo.
- **Tiempos:** se usan los tokens de movimiento (fast 120, slow 320 ms, easing standard) y `--sheet-slow` (slow × 1.25 = 400 ms, la del panel y los movimientos largos) en lugar de los valores de la referencia (400/200/375/500/250 ms). Tras probarla se alargó un poco y se unió el movimiento del contenido con el del panel, para que no quede un movimiento suelto al final. TODO: si hace falta clavar esos tiempos, proponer tokens de movimiento nuevos.
- **Excepción a DESIGN.md §6:** la persiana anima `grid-template-rows` (alto), que §6 prohíbe; se hizo a pedido. Revisar si se adopta o se cambia a transform.
- Cierre: `close()` espera la transición (`motion/duration/slow`; 0 con reduced motion) y recién ahí cierra el diálogo. Los resultados no se redibujan mientras cierra.

## 2026-10-14 · Comparativa: select Filter Small y cambios de Figma

- **select Size** (Figma 921:2544): Default (etiqueta `role/label-lg`, 14 px; filter-bar y Descargas) y Small (`role/label`, 12 px; compare-product). Solo cambia en Type=Filter; Field es siempre Default.
- **Filter sin línea:** como las variantes del set, el trigger de Filter no lleva línea inferior (solo Disabled), con `space/gap/sm` entre etiqueta y campo. También en filter-bar y Descargas.
- **compare-product:** selects Filter Small Filled, sin «Todos» (`hide-all`, solo de código: siempre hay una variante elegida) y con una línea `border/default` en `color/border/default` pegada abajo de cada select.
- **select-option:** la opción resaltada con las flechas (State=Focus) lleva el fondo de Hover (`color/surface/faint`) y no el anillo: la elegida ya se distingue por `role/body-medium`.
- **Comparativa:** «Descargar comparación» con `icon/download` (sigue abriendo el diálogo de impresión: el PDF no tiene diseño), bajada con la cantidad («3 luminarias seleccionadas.»), toggle al pie de la columna de controles y título de grupo en `role/body-xl`.

## 2026-10-14 · Footer siempre en Light

El footer deja de ser Dark local: todas las páginas lo muestran blanco, también con Iluminar. En código el `<footer>` interno lleva `data-arq-theme="light"` (como filter-panel); en Figma el set 788:3104 fija el modo Light.

## 2026-10-14 · Footer con Iluminar

Reemplaza a «Footer siempre en Light» (mismo día): el footer sigue el modo de la página. Es blanco en todas las páginas y, con Iluminar en Productos y Colecciones, pasa a Dark junto con el resto, con la misma duración y curva que el fondo de la página. Se quita `data-arq-theme="light"` del `<footer>` interno; en Figma, el set 788:3104 deja de fijar el modo Light. filter-panel sigue siempre en Light.

## 2026-10-14 · Descargas v2

Pantalla nueva (Final › Descargas: Desktop 2496:31316 · Mobile 2496:31862; las anteriores quedan de respaldo en PRUEBA).

- **Sin page-header:** arriba, título `role/display` y bajada `role/body-lg` a la izquierda y la **download-card** del catálogo general a la derecha (componente nuevo, 2496:8095). Debajo, «Buscar producto» (`role/display-sm`) con variants-table.
- **variants-table en Descargas:** Filtros Filled a la izquierda (como la ficha) y el buscador a la derecha, de `layout/search-field`; sin la cantidad ni descargas en la barra. Reemplaza «buscador a todo el ancho con Filtros en Outline» (2026-10-06).
- **Ficha v2 en código:** variants-table (encabezado `role/body-regular`, valores `role/body-lg-regular`, sku Underline, variants-table-card en Mobile), filter-bar (`color/surface/soft`, sin líneas, «Limpiar filtros» debajo) y sku Size=Underline. Se juntó con lo que había hecho la rama del search-sheet: queda su sku y el atributo `stacked` de filter-bar, que ya no hace falta porque la versión v2 es la de por defecto.
- **Resuelto con diseño:** entre tarjetas Mobile va `space/gap/6xl` (se corrigió la descripción de variants-table-card); el padding lateral de filter-bar queda en `layout/gutter`; en Descargas la descarga de cada fila va sin borde (icon-button Large, Background=None), como el borrador de PRUEBA; en la ficha sigue Outline. En la página, la columna del título mide 300 sin token (se usa `layout/measure`).
- **Pendiente (datos):** URL del PDF del catálogo general y su portada.

## 2026-10-14 · Comparativa Mobile como macroled.com.ar

En Mobile la comparativa funciona como macroled.com.ar/comparativa: un solo desplazamiento horizontal para los productos y los valores, y lo que identifica cada fila queda quieto.

- **Etiquetas fijas:** la etiqueta de cada fila (arriba de los valores) queda a la vista al deslizar (sticky left, como pide la descripción de compare-row); antes se iba con los valores.
- **Títulos de grupo:** quedan quietos y su línea va del gutter al borde derecho de la pantalla (antes quedaba cortada).
- **Columnas de `layout/compare-column` (160):** entran dos y asoma la tercera. Reemplaza el 60 % del ancho de pantalla, que no tenía token. compare-header (Default y Compact) usa el mismo ancho para que los productos queden alineados con sus valores.
- **Un solo scroll:** productos (compare-header) y valores (compare-table) se desplazan dentro de un único contenedor (`embedded` en los dos), en lugar de una tira por fila sincronizada por JS: así el desplazamiento horizontal y el vertical no se traban. Las etiquetas y los títulos de grupo quedan fijos con sticky respecto de ese contenedor. La cabecera compacta (fija arriba, oculta el navbar) lo sigue.
- **Menú del select en la comparativa:** Size=Small abre el menú del ancho del campo; antes, en Mobile, se salía de la columna, lo recortaba la tira y desplazaba toda la página.
- **No incluido (no está en Figma):** el aviso «Deslizá hacia la derecha para ver los demás productos» de macroled.

## 2026-10-14 · compare-bar Mobile apilada

En Mobile, compare-bar muestra los productos elegidos uno arriba de otro, como la barra de macroled.com.ar: cada uno con foto, nombre, meta y quitar (compare-slot Default), separados por divider Horizontal Subtle, y «Comparar» debajo a todo el ancho. Reemplaza la fila de miniaturas Compact con «Comparar» al lado: con miniaturas no se leía qué producto era cada una.

- Solo se muestran los elegidos (sin lugares vacíos), para que la barra no tape más pantalla de la necesaria.
- «Borrar todo» sigue arriba, junto al título.
- **Plegar (Open), en Desktop y Mobile:** como en macroled, el título es un botón con chevron que pliega la lista; plegada quedan el título, «Borrar todo» y «Comparar» (en Desktop, en una sola línea y con el chevron en la punta derecha). Arranca abierta y se vuelve a abrir al agregar un producto. Usa el disclosure base.

## 2026-10-15 · Iluminar no se recuerda

- **Antes:** el toggle de Productos y Colecciones guardaba la preferencia en `localStorage` (`arq:theme`) y la página arrancaba como se había dejado, aun después de visitar otras páginas.
- **Ahora:** no se guarda nada entre cargas. Recargar Productos, Colecciones o la ficha, o volver a ellas desde otra página, las deja apagadas. Se elimina `arq:theme` y el script en línea del embed de Productos (ya no hace falta).
- **Única excepción, Productos → ficha:** si el listado está iluminado y se hace clic en un producto, la ficha llega iluminada (navbar, hero y fotos), sin fundido. El traspaso vive en `sessionStorage` (`arq:iluminar-handoff`) 10 segundos y la ficha lo consume una sola vez; cualquier listado que se abre lo borra. Helpers en `src/base/theme.js` (`handOffTheme`, `takeThemeHandoff`).

## 2026-10-15 · Paneles y menús siempre en Light

Con Iluminar (listados y ficha) solo se oscurecen la página, el navbar (barra) y, en la ficha, el hero. Todo lo que se abre encima queda en **Light local**, como filter-panel (2026-10-05):

- **Navbar:** mega-menu (Desktop), menú Mobile (`<dialog class="menu">`), search-sheet y search-screen. Mientras el mega-menú está abierto, la barra también pasa a Light (`data-arq-theme="light"` en el `.navbar` interno), con la misma transición del search-sheet, y detrás va el scrim de `color/overlay/scrim`.
- **download-modal:** su `<dialog>` lleva `data-arq-theme="light"`.
- **filter-panel:** sin cambios (ya era Light).
- **Cómo:** `data-arq-theme="light"` en el `<dialog>` (o en el host del componente), el bloque que `ArqElement` adopta en cada Shadow DOM (`src/styles/light.css`).
- **DESIGN.md §2** · Modo Dark ampliado con esta lista (rama `docs/light-local-paneles`) y su copia en el frame DESIGN.md de la página Plan del proyecto de Figma.

## 2026-10-15 · search-sheet: ajustes tras la revisión

- **search-card** (nuevo, `<arq-search-card>`): la tarjeta de recomendados es solo la imagen cuadrada y el nombre; deja de usar product-card y ya no muestra el tipo de producto. Hover y Focus: zoom mínimo de la imagen (escala 1.05, `motion/duration/slow`). TODO: la escala no tiene token.
- **Hover de search-result `type="simple"` y search-collection:** todo el nombre en `color/text/primary` y Medium (`role/body-medium`). Se acepta el cambio de peso en hover (DESIGN.md §6 lo desaconseja) por pedido de diseño.
- **search-see-all `type="simple"`:** sin lupa y con la flecha a `space/gap/sm` (antes `space/gap/md`).
- **Orden de los resultados:** «Ver todos» va al final. Desktop: Productos y debajo «Ver todos» a la izquierda, Colecciones a la derecha. Tablet y Mobile: Productos, Colecciones y «Ver todos» al pie. Filas separadas por `space/gap/lg`.
- **Figma:** documentado en la sección «Búsqueda · top sheet» (sets `search-sheet`, `search-field-line`, `search-result-simple`, `search-collection`, `search-card` y `search-see-all-simple`) y en la ficha `doc/search-sheet`. Los Type de código son sets aparte en Figma; falta decidir si pasan a ser Type de search-field, search-result y search-see-all.

## 2026-10-15 · Recomendados del buscador

- **Criterio:** los productos recomendados del search-sheet (campo vacío) son los grupos que tienen marcada la columna `new` de Sheets (campo `new`, bool, de Typesense). Cada SKU marcado es un recomendado, con **sus** fotos (no las del predeterminado del grupo, así se ven las diferencias de color) y enlazando a él (`?sku=`). Reemplaza el criterio provisorio (los primeros grupos con foto, en el orden de la base).
- **Sin novedades marcadas** el bloque de recomendados no se muestra (ni el título ni «Ver todos los productos»). Hoy ningún documento tiene `new: true`.
- **Sin límite:** salen todas las novedades; la fila de tarjetas se desliza.
- En código: `isNew` en cada variante (`typesense-adapter.js`, `new` entra en `LIGHT_FIELDS`) y `getRecommendedProducts()` (`catalog.js`).

## 2026-10-15 · Descargas · propuesta final

Pantalla «Descargas · propuesta final (desktop y mobile)» (`2575:22875`: Desktop `2564:20607` · Mobile `2558:20149`). Rama `feat/descargas-propuesta`, con dos propuestas de filtros para elegir una.

- **Dos propuestas de filtros** (atributo `filters` de `<arq-descargas>` y `<arq-downloads-table>`, solo de código): `dropdown`, un bloque desplegable debajo de la barra con un select multiple por filtro (`2571:22259` · Mobile `2580:22444`), y `panel`, el filter-panel de Productos con «Ver N variantes» (`2571:22966` · Mobile `2572:22988`). Demos: `/demo/descargas-propuestas.html` (las dos en una página, con un menú flotante abajo a la izquierda), `/demo/descargas-desplegable.html` y `/demo/descargas-lateral.html`. Cuando se elija una, se quita la otra.
- **Filtros:** lista fija `DOWNLOAD_FILTERS` (`attributes.js`), en el orden de la propuesta: Montaje, Acabado (campo Color), Potencia, Temperatura de color, IP, Regulación, CRI, Ángulo, Fuente, Material del cuerpo y Tensión de entrada; solo los que tienen al menos dos valores en el catálogo. Tamaño, Flujo luminoso y Eficiencia quedan solo como columnas: casi cada SKU tiene un valor propio (64, 52 y 24 opciones). Fuera también Altura y Peso (30 y 60) y los campos con pocos SKU cargados (Material de la lente, Largo de cable, UGR, Driver, Resistencia al impacto). Familia y Fotometría de la propuesta no tienen campo en la base. **Pendiente (datos):** IP llega como «IP20», «20» y «65»; Vida útil y Temperatura de operación, el mismo valor escrito distinto.
- **Selección múltiple:** dentro de un filtro, una fila cumple si tiene cualquiera de los valores elegidos; entre filtros, todos (`src/data/variants.js` acepta un array por filtro). Los filtros aplicados se ven como filter-chip con «Limpiar filtros», y el botón dice «Filtros (N)».
- **`<arq-downloads-table>`** reemplaza a variants-table en Descargas: nombre del producto sobre el SKU, «N variantes» al lado de Filtros, tarjetas Mobile con «Descargas» y «Ver producto», filas de carga y vacío propio. variants-table queda para la ficha sin cambios.
- **Catálogo general:** en lugar de download-card, tapa + nombre + bajada + «Descargar catálogo» (Outline en Desktop, Underline en Mobile).
- **Modal:** download-modal `show-product` (producto + download-file-row, `2554:20047`); en Mobile, hoja abajo a todo el ancho.
- **Desvíos de la propuesta:** sin sombra en el menú de selección múltiple (DESIGN.md: no hay sombras); sin manija en la hoja Mobile del modal; el encabezado de la tabla en `role/label-lg` va en mayúsculas.
- **Pendiente (tokens):** miniaturas de 64 (fila y modal) y 72 (tarjeta), tapa de 168 × 210 (Mobile 104 × 130), buscador de 480, select de 224, ayuda del vacío de 560: sin variable, se usan las más cercanas.
- **Pendiente (datos):** peso de los archivos, URL y portada del catálogo general.
- **Descarga de cada fila:** icon-button Large Background=Outline, como el glosario de la ficha (Figma 1218:10705), en las dos propuestas. Reemplaza «sin borde» de Descargas v2 (2026-10-14). Outline Large sigue al set (1818:8044): borde `color/border/default` (antes `color/border/strong`, como dice todavía la descripción) y el ícono con el trazo escalado (1,5 a 24 px, sin `non-scaling-stroke`). Vale también para el glosario de la ficha. Descripción de icon-button y DESIGN.md §8 corregidos el mismo día (ver «Descargas: ajustes»).
- **Columnas = filtros:** la tabla de Descargas muestra solo las columnas del glosario que también son filtro (Potencia, Temp., Ángulo, Regulación, IP, Fuente y CRI). Tamaño, Flujo lum. y Eficiencia salen: con las 10 columnas la tabla no entraba a 1400 px. Entre columnas, `space/gap/lg`. La tarjeta Mobile muestra Ángulo en lugar de Flujo lum. El glosario de la ficha no cambia.
- **Columnas = filtros (2):** la tabla muestra una columna por filtro, en el orden de `DOWNLOAD_FILTERS` y con el nombre corto: suma Montaje, Acabado, Material y Tensión. Todo en una sola línea: si no entran, la tabla se desliza en horizontal con el producto y la descarga fijos (a 1400 px, Material y Tensión quedan a la derecha).
- **Nombres cortos:** sobre el SKU va el nombre de la colección («Nobu», «Sento», «Köen»); si la colección tiene varios productos, con la aplicación («Kanu Pared», «Kanu Jardín»); si la aplicación no alcanza para distinguirlos, el nombre del producto (Tori: «Tori Jardín», «Mini Tori Jardín», «Tori Visera», los tres Jardín); sin colección en la base, la primera palabra («Skyline»). El buscador sigue buscando por el nombre completo.
- **Barra de scroll:** fina (`scrollbar-width: thin`, pulgar `color/border/default`), pegada al borde inferior de la pantalla mientras la tabla está a la vista y sincronizada con la tabla; solo si la tabla no entra. Excepción a DESIGN.md §2 («sin barra de scroll visible»), a confirmar.
- **Elegida: panel lateral.** De las dos propuestas queda la de panel lateral (filter-panel con «Ver N variantes»). Se quitan el modo desplegable de `<arq-downloads-table>`, el atributo `filters` de `<arq-descargas>` y las demos de comparación (`descargas-desplegable`, `descargas-lateral`, `descargas-propuestas`): la página se ve en `/demo/descargas.html`. La versión desplegable queda en la historia de la rama `feat/descargas-propuesta`. Se conserva `multiple` en select (función general del componente, en la demo).

## 2026-10-15 · Descargas: ajustes

- **«Productos» en lugar de «variantes»:** la cantidad («243 productos»), «Ver N productos» del panel de filtros, el vacío («No hay productos con estos filtros») y el nombre de la tabla para lectores de pantalla. Cada SKU cuenta como un producto. filter-panel deja de tener la unidad `variantes`.
- **Tokens nuevos** (Figma, 2 · Semantic · Dimension): `layout/download-thumb` (72; miniaturas de la tabla, las tarjetas Mobile y el modal, más grandes que los 64 de la propuesta, a pedido), `layout/download-search` (480, buscador) y `layout/catalog-cover` (168 · Mobile 104, tapa del catálogo). Reemplazan a los tokens prestados (`search-thumb`, `gallery-thumb`, `search-field`, `compare-column`, `table-thumb`).
- **Resueltos sin token nuevo:** la ayuda del vacío va hasta `layout/measure-wide` (520; la propuesta, 560) y las barras de carga usan `icon/sm` y `space/gap/sm-md` (12 y 14 en la propuesta).
- **DESIGN.md** (repo y copia del Plan del proyecto en Figma): excepción de la barra de scroll de Descargas (§2), los tres tokens (§5), el trazo escalado del ícono en icon-button Outline Large (§8) y su borde `color/border/default`. **Figma:** descripción de icon-button corregida (Outline: Default en `color/border/strong`, Large en `color/border/default` con trazo escalado).
- **Modal sin formato:** las filas del modal (Ficha técnica, IES, CAD…) muestran solo el nombre, sin «PDF» ni «IES» debajo. download-file-row conserva el slot `meta` opcional.

## 2026-10-15 · Ficha: acordeón, filas de especificación y opciones (Ficha v2, 2587:26558)

- **accordion-item:** título en `role/heading-3` (antes `role/body-xl`); el ícono +/– va sin borde (solo `icon/xl` con `space/padding/sm-md`) y sin fondo en hover; en Mobile no lleva padding lateral.
- **Última spec-row de cada columna sin línea inferior**, para no duplicar la del acordeón. spec-list reparte las filas en dos columnas con una grilla (`ceil(n / 2)` filas por columna, la izquierda primero; antes `column-count`) y marca la última de cada columna con `data-arq-last`. Una spec-row suelta conserva su línea.
- **option-tile en Hug content:** mide su texto y no se estira para llenar la fila (antes Fill); si no entran, bajan a otra línea.
- **Galería de la ficha (Desktop):** la foto va absoluta dentro del recuadro y la columna fija su ancho (`justify-self: stretch`): una foto grande ya no estira el alto ni, por el `aspect-ratio`, el ancho, que hacía que la imagen se montara sobre el configurador.

## 2026-10-15 · La URL de la ficha siempre lleva el SKU

- Todo link a una ficha lleva `?sku=`, también el del SKU predeterminado (cards de Productos y Colecciones, buscador, mega-menú, recomendados). Una ficha abierta sin parámetro se abre con el predeterminado y completa la URL con `history.replaceState`. Motivo: más adelante Webflow guardará solo los SKU, y la URL tiene que identificarlos.
- El canonical sigue sin parámetro (Webflow). Abrir con un `?sku=` que no es del grupo cae en el predeterminado.

## 2026-10-15 · Ficha: descripción con foto a todo el ancho (Ficha v2, 2587:26784)

- La sección de descripción (`product_story_text`) pasa a ser la foto de ambiente 6 a todo el ancho con el texto encima: título (primera línea) a la izquierda; texto, lista y «Ver colección …» a la derecha, en `role/body-xl`. Es Dark local (texto y subrayado claros, sin depender de Iluminar). Se quita de esta sección el bloque «Otras familias» (en Figma está oculto): esas tarjetas siguen solo en «Explora la colección».
- **Foto fija (parallax):** la foto queda quieta y la página pasa por encima. Se resuelve con la imagen en `position: fixed` dentro de un recuadro con `clip-path` (funciona también en iOS, donde `background-attachment: fixed` no). Con `prefers-reduced-motion: reduce` la foto se mueve con la página. Riesgo: si Webflow envuelve la ficha en un contenedor con `transform`, el efecto se pierde (la sección se ve igual, sin movimiento).
- **TODO (diseño):** el alto de 971 y los márgenes de 150 / 113 de Final no tienen token; se usan 100svh y `space/section/lg`. Sin scrim sobre la foto, como en Figma: si la foto es clara, el texto puede no leerse.

## 2026-10-15 · Contacto: animaciones

Búsqueda con el skill find-animation-opportunities (criterio de Emil Kowalski: animar poco y solo con un para qué). Se probaron cuatro en la rama `feat/contacto-animaciones` y se aprobaron:

- **faq-item:** la respuesta anima el alto (`grid-template-rows: 0fr → 1fr`, `motion/duration/expand`) y la opacidad (`motion/duration/base`) al abrir y al cerrar; el padding inferior de la pregunta acompaña. Disclosure suma la opción `animateHeight`: el panel se oculta con `data-open` y `visibility` en vez de `hidden`, y su único hijo es el que se recorta (sin padding, si no el panel cerrado no mide 0). Solo faq-item la usa; accordion-item, filter-row y catalog-nav-group siguen igual.
- **form-message:** al aparecer, el texto funde y sube `space/gap/sm` (`motion/duration/slow`). Va en el elemento interno: Chrome no aplica `@starting-style` al `:host`.
- **input, error:** el mensaje crece (`motion/duration/base`) y funde (`motion/duration/fade`); los campos de abajo se deslizan en vez de saltar. El gap de `.input` va dentro del alto animado (margen negativo + padding).
- **input, menú de Select:** crece desde el campo (escala 0.97 → 1, `motion/duration/base`) y funde (`motion/duration/fade`). Al cerrar, sin animación. TODO: la escala no tiene token.
- **Tokens nuevos** (Figma, 2 · Semantic · Motion): `motion/easing/out` (`cubic-bezier(0.23, 1, 0.32, 1)`, para entradas), `motion/duration/expand` (250 ms, alto de desplegables; 0 con reduced motion) y `motion/duration/fade` (150 ms; no cambia con reduced motion). Los valores de la prueba se redondearon a los tokens que ya había: 180 y 200 → `base`, 300 → `slow`, los fundidos de reduced motion (120–200) → `fade`.
- **Reduced motion:** cambia el criterio. Antes todo pasaba a 0; ahora se quitan desplazamientos, escalas y cambios de alto, pero quedan los fundidos (`fade`).
- **DESIGN.md §6** (repo y copia en Figma): los tres tokens, el criterio de reduced motion y la excepción del alto (solo faq-item y el error de input). **Figma:** descripciones de faq-item, input y form-message con su movimiento.
- **Descartadas:** escala al apretar botones y chips (ya tienen Pressed de color), scroll suave de «Escribinos» (más de 300 ms y pide estilar `html`), fundido del hero (demora la primera impresión), archivo adjunto de file-upload (la caja ya cambia de borde) y entrada escalonada del formulario.

## 2026-10-15 · Filtros del glosario en panel lateral

- Los filtros del glosario de variantes (variants-table de la ficha) dejan de desplegarse sobre la tabla (filter-bar con un select por filtro) y se abren en el panel lateral derecho, como en Descargas: filter-panel con una filter-row de checkbox por filtro, «Ver N variantes» para aplicar, botón «Filtros (N)», filter-chip de lo aplicado y «Limpiar filtros». Selección múltiple dentro de cada filtro.
- Se quita la prop `filters` de variants-table. filter-bar queda como componente (demo) pero ya no lo usa ninguna tabla.
- **TODO (diseño):** el set variants-table de Figma sigue con Filters=On y filter-bar; hay que actualizarlo (y la ficha doc/variants-table).

## 2026-10-15 · Descargas: animaciones (registro)

Aprobadas y mergeadas con `feat/descargas-animaciones`; faltaba anotarlas acá.

- **download-modal:** entra y sale como filter-panel. El scrim funde. En Desktop el panel funde y sube un 2 %; en Mobile (`show-product`) la hoja sube desde el borde inferior (`translateY(100%)`). Cierra por el mismo camino y el `<dialog>` se cierra recién al terminar la transición. Mientras entra, el `<dialog>` no se desplaza (`overflow: clip` hasta `is-settled`): `showModal()` enfoca un control que todavía está fuera de la pantalla y el desplazamiento se peleaba con la transición, y en Mobile la hoja subía y bajaba.
- **downloads-table:** al reemplazar las filas de carga, la tabla (o las tarjetas) funde una sola vez (`motion/duration/base`). La clase `reveal` se quita con el `transitionend`, no con un temporizador: con cientos de filas el primer cuadro tarda y el temporizador cortaba el fundido.

## 2026-10-15 · Contacto y Descargas: táctil, peor caso y auditorías

Pasada con los skills emil-design-eng, improve-animations, apple-design, mobile-native y break-ui sobre las dos páginas.

- **Hover solo con mouse:** todo `:hover` va dentro de `@media (hover: hover) and (pointer: fine)` (en táctil quedaba pegado después del toque). En los componentes de Contacto y Descargas (button, icon-button, checkbox, choice-chip, filter-chip, footer-link, contact-item, sku, nav-link, mega-link, select-option, downloads-table, input, faq-item, filter-row, download-file-row, select y `src/base/card-link.css`). En mega-link la flecha queda oculta salvo con foco o con hover de mouse. Después se sumaron los componentes de otras páginas que tenían solo `(hover: hover)` (accordion-item, breadcrumb-item, catalog-nav, catalog-nav-group, catalog-nav-item, compare-bar, compare-product, download-item, product-card, search-card, variants-table).
- **Hoja base (`src/base/arq-element.js`):** `:host` con `-webkit-tap-highlight-color` transparente y `touch-action: manipulation` (sin el destello gris ni la espera del doble toque; `touch-action` se suma con el de los ancestros, así que alcanza con el host). Los controles (`button`, `[role=button]` y los host con `role` button, radio o checkbox) no seleccionan su texto al dejar el dedo apretado; checkbox y la zona de file-upload, lo mismo en su CSS. El texto que es contenido (mails, teléfonos, respuestas) se sigue pudiendo seleccionar.
- **Área segura:** la hoja de download-modal en Mobile y el panel de filtros en Mobile suman `env(safe-area-inset-bottom)` abajo. Vale 0 mientras Webflow no ponga `viewport-fit=cover` en el meta viewport (pendiente del sitio).
- **Teclado del teléfono:** input pasa `autocapitalize` y `enterkeyhint` al campo interno; el formulario de Contacto los usa (mayúscula inicial en nombre, empresa y ciudad; «Siguiente» en los de una línea). La barra de scroll de Descargas lleva `overscroll-behavior-x: contain` (no dispara el «atrás» del navegador).
- **Peor caso en la demo (break-ui):** un selector abajo al centro (`demo/demo-data-toggle.js`) cambia `?data=`. Descargas: Demo · Peor caso · Vacío · Uno · 1.500 filas · Error, desde `demo/fixtures/peor-caso.js` por `src/data/catalog.js` (bloque `import.meta.env.DEV`, no llega a `dist/`). Contacto: Demo · Peor caso · Errores · Enviado, con el embed `demo/fixtures/contacto-peor-caso.html` y el formulario completado como lo haría una persona. Los valores salen de la base real (SKU con espacios y paréntesis, columnas vacías, valores más largos) o tienen su forma.
- **Animación** (planes de improve-animations en `plans/`, ejecutados): con reduced motion, filter-panel, download-modal, los desplegables y la primera carga de Descargas funden con `motion/duration/fade` en vez de aparecer de golpe (DESIGN.md §6); token nuevo **`motion/duration/panel`** (400 ms, 0 con reduced motion; Figma, 2 · Semantic · Motion) en lugar de `slow × 1,25`, en filter-panel, download-modal, search-sheet y el mega-menú; «Copiado» del sku entra con un fundido (`fade`).
- **Hover con mouse en todo el repo:** también se pasaron a `(hover: hover) and (pointer: fine)` los componentes de otras páginas.
- **Roturas del peor caso (break-ui), arregladas:**
  - **hero:** a 320 px una palabra larga del título («arquitectónica») empujaba título y bajada fuera del borde: en Mobile `.text` ocupa el ancho de la columna y los textos llevan `max-width: 100%`, así `overflow-wrap` parte la palabra.
  - **link-list:** la lista ocupa el ancho de la columna; un label largo se corta con «…», como button. Se recomendaba pasarlo a dos líneas, pero button no tiene esa opción en Figma y no se inventa una prop.
  - **footer:** en Mobile las columnas no bajan del ancho de su palabra más larga y, si no entran (320 px), la última pasa abajo (antes partía palabras: «Instagr am»).
  - **downloads-table:** de a 100 filas con «Ver más productos» (button Outline); con 1.500 filas, borrar la búsqueda pasó de 1,2 s a 80 ms. Cantidades con separador de miles («1.500 productos»), también en «Ver N productos» de filter-panel. `TODO` (diseño): «Ver más» no está en la propuesta.
  - **faq-item:** sin respuesta, la pregunta no se muestra (`data-arq-empty`; antes se abría a un panel vacío).
  - **descargas:** si falla la carga, «Reintentar» (button Underline); al volver a cargar, el foco va al buscador. Sin `catalog-href`, «Descargar catálogo» no se muestra (antes, un botón que no hacía nada; a 320 px queda con «…», como button). `TODO` (diseño): «Reintentar» no está en la propuesta.
- **Revisión apple-design, aplicada:**
  - «Ficha técnica» en el modal de Descargas dice «Generando…» mientras se arma el PDF (`detail.pending`, como la ficha): download-file-row suma la prop `loading`. `TODO` (diseño): State=Loading en el set.
  - Formulario: un campo con error se revalida mientras se escribe; el error se va apenas el valor es válido.
  - Vacío de Descargas según la causa: «No hay productos para «…»» si viene de la búsqueda.
  - Búsqueda y filtros de Descargas en la URL (`?q=…&tipo_montaje=…`, `history.replaceState`): al volver de un producto, la tabla está igual.
  - Avisos `aria-live` de input y file-upload: región oculta siempre presente; solo cambia el texto.
  - La cantidad de Descargas se anuncia al dejar de escribir (500 ms), no con cada tecla.
  - navbar Transparent: con `prefers-reduced-transparency: reduce` o `prefers-contrast: more` se ve Default también sobre la foto.
  - input y file-upload: con `prefers-contrast: more`, borde `color/border/strong`. `TODO` (diseño): `color/border/default` da 1,6:1 sobre blanco (WCAG pide 3:1 para el borde de un control).
- **DESIGN.md** (repo y copia en Figma): `motion/duration/panel` en §6, hover solo con mouse en §7, avisos `aria-live` y `prefers-contrast` / `prefers-reduced-transparency` en §9. **Figma:** descripciones de faq-item, input, file-upload, sku, navbar y download-file-row.

## 2026-10-16 · Demo sin selector de datos

- Las páginas Descargas y Contacto de la demo dejan de mostrar el selector de datos abajo al centro. Los modos de peor caso siguen andando escritos en la URL (`demo/demo-data-toggle.js`): Descargas `?data=worst|empty|one|huge|error`, Contacto `?data=worst|errors|sent`.

## 2026-10-16 · Navegación de Productos y Colecciones sin recarga

- **catalog-nav:** abrir un grupo ya no lleva a su primer link («Todo interior»…) ni cierra los demás: la navegación queda abierta como la dejó la persona. El listado se actualiza recién al elegir una subcategoría. Al cargar la página se sigue abriendo solo el grupo de la categoría actual. Hasta 1023 px, el panel de catalog-nav-mobile queda abierto al elegir un ítem.
- **Scroll:** elegir una subcategoría (o Atrás / Adelante) no sube al inicio: el listado cambia y la persona sigue donde estaba.
- **Colecciones en el catalog-nav:** Kanu, Tori, Douli, Yoru… ya no llevan a la página de la colección (`/arq/coleccion/<id>`): muestran las cards de producto de esa colección en el mismo listado (`/arq/productos?collection=<id>`: Kanu Pared y Kanu Jardín, con Comparar). «Todas las colecciones» sigue mostrando una card por colección con su meta (Kanu: Jardín · Pared). Se probó mostrar la card unificada de la colección también en `?collection=` y se descartó. El mega-menu, la búsqueda y la ficha siguen enlazando a la página de la colección.
- **Breadcrumb de los listados:** ya no queda fijo en Inicio / Productos. Sigue al `<h1>` con hasta 3 niveles: Inicio / Productos / Interior (vista completa de un grupo), Inicio / Exterior / Jardín (subcategoría), Inicio / Colecciones / Kanu (colección, como en la ficha) e Inicio / Productos / Resultados para «…» (búsqueda). Sus links al mismo listado no recargan. Al volver a Productos sin categoría también vuelve el `<h1>` «Productos» (antes quedaba el de la categoría anterior).
- Excepción: en Productos hasta 767 px las categorías están dentro de filter-panel (pantalla completa); al elegir una, el panel se cierra para mostrar el listado.

## 2026-10-15 · Ficha: versión 1 elegida (galería de ambiente)

Se probaron dos versiones del diseño (Figma «Ficha - 1920-V1», `2612:12168`, y «V2», `2587:26558`) y **se elige la V1**, la de la galería de ambiente. La V2 (sin galería, con dos bloques de fotos y texto con línea y la colección con la card debajo) se quitó del código (atributo `version`, selector de la demo); queda en el frame de Figma.

- **Orden:** el glosario va antes del parallax (antes iba después); después del parallax, el bloque «¿Te interesa este producto?» (fondo `color/surface/subtle`, título `role/heading-1`, bajada `role/body-lg`, button Filled con `icon/arrow-right` a `/arq/contacto`; los textos llegan por slot `cta-title` · `cta-description` · `cta-action`); y «Explora la colección» en Light sobre `color/surface/subtle` (en Figma ya no es Dark local; DESIGN.md §2 sigue diciendo Dark local: hay que actualizarlo en una rama `docs/`).
- **Galería:** las fotos miden 640 de alto (`40rem`) en todos los dispositivos (antes 70svh); lo que cambia es el ancho de cada una, que sale de su proporción. TODO (diseño): 640 no tiene token.
- **Inspiración:** foto ancha o video, una foto vertical y el texto a la derecha; Explora la colección con la introducción a la izquierda y la card a su derecha.
- **Fotos:** las de `multimagen_ambiente` posiciones 2, 3, 4, 5 y 7 (las posiciones 2 y 3 llegan como `ambient_2_on` y `ambient_3_on`), sin la 6, que es la del parallax. La galería toma todas y la inspiración las dos últimas.
- **Video:** `video_inspiration` todavía no tiene dato; mientras tanto, una foto ocupa el lugar del video. Con URL, es un `<video controls>`.
- **TODO (diseño):** el alto del CTA (474), las medidas de las fotos y de los textos de Final no tienen token. El hero de Final (miniaturas en fila abajo, columnas 1076 / 620) todavía no está aplicado.

## 2026-10-15 · Flechas en la galería de ambiente

- Con mouse, el cursor sobre la galería de ambiente pasa a ser la flecha del sistema (`icon/arrow-right` o `arrow-left`, al doble de `icon/2xl`: 64, con trazo `border/strong`; TODO diseño: no hay un ícono más grande): mitad derecha, siguiente; mitad izquierda, anterior; al inicio solo hay «siguiente» y al final solo «anterior». El clic pasa de a una foto, igual que los botones: adelante, la próxima foto que no entra completa se lleva hasta que entre con el margen de página a la derecha (alineada a la izquierda si es más ancha que la pantalla); atrás, la última cortada a la izquierda se alinea a la izquierda. La última foto queda con el margen derecho (un espaciador al final de la fila). Se quitó el scroll-snap de la galería: devolvía el scroll a la foto anterior. La flecha es blanca (`color/icon/inverse`).
- En pantallas sin cursor (`hover: none` o `pointer: coarse`) van dos botones (icon-button Large Outline, flechas izquierda y derecha) debajo de las fotos, abajo a la derecha; se deshabilitan al llegar al inicio o al final. No se reutilizó carousel-button (solo existe en Figma, todavía no en código).
- TODO (diseño): el cursor y las flechas de la galería no están en Figma.

## 2026-10-16 · Ficha: hero sin padding inferior e Iluminar dentro de la foto

- **Hero:** sin padding inferior (con Iluminar quedaba una franja oscura bajo la foto). El aire de abajo (`space/padding/xl`, 32 en Figma `2612:12210`) pasa a `configurator-column` y, hasta 1023 px, a `.buy`.
- **Iluminar:** va dentro de la imagen de `product-gallery` (slot nuevo `overlay`), abajo a la derecha, en todos los tamaños. En Desktop su borde inferior coincide con el de las miniaturas (`space/padding/xl`); hasta 1023 px, a `space/padding/md` de las esquinas (`TODO`: sin Figma de Tablet y Mobile).

## 2026-10-16 · Checkbox sin fondo

- **checkbox:** la caja sin marcar no tiene fondo (`color/surface/transparent`), solo el borde. Antes usaba `color/surface/default`, que con Iluminar pasaba a `neutral/800` y se veía un cuadrado oscuro sobre las cards. **Figma:** relleno de la caja de las variantes Checked=False cambiado a `color/surface/transparent` y descripción del set actualizada.
- **Figma (pantallas y fichas):** en Final › Productos, fila nueva con subcategoría (Exterior / Jardín) y colección (Kanu), Desktop y Mobile, más una nota con estas reglas. Fichas `doc/catalog-nav`, `doc/catalog-nav-group`, `doc/catalog-nav-mobile` y `doc/breadcrumb` y descripciones de catalog-nav, catalog-nav-mobile y breadcrumb actualizadas con la navegación sin recarga y el breadcrumb por categoría.
- **Figma:** el breadcrumb anidado del componente page-header decía Levels=3 pero conservaba las capas de Levels=2 (las pantallas nuevas usaron una copia del page-header del frame Wide). Resuelto: ver «Figma según el código: Productos Mobile y breadcrumb».

## 2026-10-16 · Hover de product-card: hero encendido (y ambiente 1 encendido con Iluminar)

Se probaron tres variantes del hover (prueba en la rama `feat/prueba-hover-productos`, ya borrada) y se decide:

| | Reposo | Hover / Focus |
| --- | --- | --- |
| Sin Iluminar | `img_main` (hero apagado) | `img_main_on` (hero encendido) |
| Con Iluminar | `img_main_on` (hero encendido) | `img_ambient_1_on` (ambiente 1 encendido) |

- **Vale donde se use la card**, no solo en Productos: en la sección de productos destacados de la Home las cards se ven apagadas (con el hero normal) y su hover es el hero encendido, igual que el de un listado sin iluminar.
- **Dónde está:** `productCard()` de `src/data/catalog.js` (`imageHover = img_main_on`, con `img_ambient_1` de respaldo si falta; `imageHoverLit = img_ambient_1_on`). `product-card` no cambia de lógica, solo cambia qué imagen recibe en cada prop. Lo usan por igual los listados, la ficha (explora la colección) y la Home.
- **Cards de colección:** no cambian (solo tienen `img_collection` y `img_collection_on`); `TODO` (datos) para su hover.
- **Actualizados:** DESIGN.md §8 · Imágenes de product-card (**falta copiarlo en el frame DESIGN.md de Figma, página Plan del proyecto**), `docs/typesense-schema.md` y el README de product-card.

## 2026-10-16 · Ambiente 1 encendido: la base lo trae en la posición 0

El hover de las cards con Iluminar no se veía: `multimagen_ambiente` trae `…_AMBIENT_1_ON.webp` en la posición 0 y deja la 1 (la del encendido) vacía, así que `imageHoverLit` llegaba vacío en las 250 filas. `src/data/typesense-adapter.js` toma el archivo de la posición 0 como encendido si su nombre termina en `_ON` y la posición 1 falta. `TODO` (datos): que la sincronización respete 0 = `img_ambient_1` y 1 = `img_ambient_1_on`; entonces el parche sobra.

## 2026-10-16 · Figma según el código: Productos Mobile y breadcrumb

- **filter-panel (Figma):** la variante Mobile suma las tabs Características · Categorías, con la prop **Show categories** (el atributo `show-categories` del código, apagada por defecto) y **Show category list** para dibujar la tab Categorías activa (en código es el estado de la tab, no una prop). Las categorías son una instancia de catalog-nav.
- **Pantallas Mobile de Productos (Final):** sin catalog-nav-mobile, porque hasta 767 px las categorías van en Filtrar (como en el código). Los paneles de filtro de Productos llevan las tabs y hay una pantalla nueva, «filter-panel · mobile · categorías». Las dos pantallas «catálogo abierto» quedan como registro («anterior · reemplazada por…»). Colecciones Mobile sigue con catalog-nav-mobile.
- **page-header (Figma):** el breadcrumb anidado decía Levels=3 pero tenía las capas de Levels=2, y en una instancia no se podía pasar a 3 niveles. Se reemplazó por Levels=2 en las variantes List; ahora las instancias pasan a 3 niveles con la prop. El arreglo borró los 3 niveles del frame Wide y de las pantallas nuevas: se volvieron a cargar.
- Fichas `doc/filter-panel` y descripción del set actualizadas.

## 2026-10-16 · Buscador: variante predeterminada y conteo de productos

- «Ver todos los resultados (N)» cuenta solo productos (luminarias), no colecciones: lleva al listado de Productos, que no las incluye.
- La búsqueda (navbar y listado con `?q=`) usa la variante predeterminada del grupo (`is_group_default`) cuando coincide el nombre, la colección o la aplicación. Solo si coincide únicamente por SKU se usa esa variante.
- Con `?q=` el título del page-header («Resultados para «…»») va en `role/display` (atributo de código `search-title`) y el breadcrumb queda «Inicio / Productos /», sin nivel actual.
- toggle **sin Hover** (ni Off ni On). `TODO` (Figma): quitar la variante State=Hover del set toggle; el texto de DESIGN.md §8 sigue listando Hover en toggle · toggle-switch.

## 2026-10-19 · Caché del catálogo entre páginas

- `src/data/source.js` guarda los documentos del catálogo liviano en `sessionStorage` (`arq:catalog`, ~444 KB). La primera página de la visita pide a Typesense; las siguientes lo leen sin llamada (4 ms contra ~3 s medidos con 2 pedidos de 250 documentos).
- Vence al minuto: pasado ese tiempo se usa igual lo guardado y se actualiza por detrás, para la próxima página. Si cambian el host, la colección o `LIGHT_FIELDS`, lo guardado se descarta.
- Sin `sessionStorage` (modo privado, lleno) o con el JSON roto, se pide al servidor como antes. Con `?arq-nocache` en la URL se pide siempre al servidor (para ver un cambio de Sheets antes de los 10 minutos).
- No se guarda el detalle de la ficha (`loadGroupDetails`): es chico (~1 KB por grupo) y solo lo usa la ficha.
- Recargar la página (F5) también ignora lo guardado y pide al servidor: quien edita Sheets recarga y ve el cambio al instante (la sincronización Sheets → Typesense tiene su propia demora, fuera de este repo).
- Navegando por links (sin recargar), un cambio en Sheets puede tardar hasta 1 minuto en verse.
- Sigue pendiente la compresión en el servidor (`docs/consultas-typesense.md`): sin gzip el catálogo pesa ~470 KB.

## 2026-10-16 · Productos: movimiento y scroll

Revisión de la página de Productos con las skills de movimiento, mobile y peor caso. Rama `feat/arq-productos-pulido`.

- **Cards nuevas:** al armar la grilla (categoría, filtros, búsqueda) entran con fundido y suben `space/gap/sm` (`motion/duration/base`, `motion/easing/out`), escalonadas de a `motion/duration/fast` ÷ 4 (≈30 ms), solo las 8 primeras. Antes la grilla vieja quedaba igual hasta que llegaban los datos y se reemplazaba de golpe.
- **Cargando:** si la respuesta tarda más que `motion/duration/fast`, la grilla se atenúa. `TODO` (token): no hay opacidad semántica para «cargando»; se usa 0,5 local.
- **compare-bar:** entra y sale por el borde de abajo (entrada `base` + `easing/out`, salida `fast`: al quitar el último producto la persona ya terminó). Suma el área segura del teléfono abajo.
- **Scroll:** el navbar cambia de dirección recién después de `space/gap/sm` (el temblor del trackpad lo hacía aparecer y desaparecer). La barra de herramientas y el sidebar acompañan al navbar con `transform` en vez de saltar de `top`. Se quitó `data-arq-catalog-scroll` de `<html>`: no lo usaba nadie y se escribía en cada evento de scroll.
- **Hover de product-card:** vuelve a `motion/duration/slow` (320 ms). Se quitaron las variables de prueba de 500 ms de `global.css`.
- **Iluminar con movimiento reducido:** en vez de pasar de claro a oscuro de golpe, funde con `motion/duration/fade` (DESIGN.md §6: los fundidos se quedan).
- **Límite de Comparar:** al marcar un cuarto producto se avisa a lectores de pantalla. `TODO` (diseño): aviso visible.
- **Cantidad:** «1.500 productos» con separador de miles, como «Ver N» del filter-panel.
- Quedan para decidir: escalado al presionar los botones, tope de acabados con «+N» en la card, cierre más rápido del filter-panel (contradice `motion/duration/panel` de DESIGN.md §6) y `theme-color` de Webflow con Iluminar.

## 2026-10-16 · Iluminar sin saltos (View Transitions)

En Productos y Colecciones, Iluminar parpadeaba: durante el cambio corrían más de 450 transiciones a la vez (379 de `color`, una por elemento de cada componente, por la hoja base de `ArqElement`). Recalcular estilos se llevaba 1 de los 1,5 s, los cuadros duraban 50–83 ms y la pantalla avanzaba a saltos. Ya pasaba en `main`.

- **catalog-toolbar** usa `switchTheme` (`src/base/theme.js`): `document.startViewTransition` fotografía la página, aplica `data-arq-theme` de una vez (sin transiciones, como `withoutThemeTransition`) y funde la foto vieja sobre la página nueva en la GPU. Medido: cuadros parejos de 17 ms y recálculo de estilos de 1,0 s a 0,07 s.
- Duración y curva: `--arq-illumination-bg-duration` y `--arq-illumination-bg-easing` (con movimiento reducido, `motion/duration/fade`). Se ponen en las animaciones del navegador con `updateTiming`: no hace falta CSS global (`::view-transition-*`).
- La foto nueva se toma cuando cargaron las imágenes encendidas visibles de las product-card (`trackThemeImage`), con un tope de 400 ms.
- **Las fotos se adelantan al fondo** (referencia: toggle Light de incommonwith.com/collections/lido). Al tocar Iluminar, las product-card pasan ya a su foto encendida (o apagada) con su propio fundido: `--arq-illumination-image-duration` 600 ms, `cubic-bezier(0.4, 0, 0.2, 1)`. El fondo arranca cuando la foto hizo el 40 % (`--arq-illumination-image-lead`, 240 ms) y termina a 1 s del clic, con `cubic-bezier(0.42, 0, 0.58, 1)`, la de la referencia. Se probó `motion/easing/standard` (sin arranque lento) y se volvió a esta. Así se ve que la luz se prende antes de que oscurezca la página. Con movimiento reducido, todo funde junto. A diferencia de la referencia, acá el texto también cambia de color (Dark), y funde con el fondo.
- Una foto que no cargó (falta en el servidor) no se funde: antes se veía el ícono de imagen rota durante el cambio.
- Se pierde el escalonado de antes (el texto después del fondo): ahora todo funde junto. El texto pasa un instante por poco contraste a mitad del fundido; antes quedaba casi invisible bastante más tiempo.
- Sin View Transitions (navegadores viejos), sigue `animateThemeChange`. La ficha mantiene su Iluminar como estaba.
- Mientras dura el fundido (1,2 s), un clic o un scroll actúan sobre la página nueva, pero se ve la mezcla.
- **Más fluido, en prueba (2026-10-19):** el blanco caía a negro de golpe en el centro de la curva. Fundido más largo (fondo hasta 1,6 s, foto 700 ms, adelanto 35 %) con curva de seno `cubic-bezier(0.37, 0, 0.63, 1)`, de centro menos empinado. Se suma un estilo experimental, `--arq-illumination-style: spread`: el modo nuevo se abre desde el interruptor en un círculo de borde muy difuso (máscara radial sobre `::view-transition-new(root)`, animada con WAAPI, sin CSS global). Con movimiento reducido, siempre fundido.
- **Valores elegidos por Lau en el panel (2026-10-19):** foto 900 ms con `cubic-bezier(0.42, 0, 0.58, 1)`, adelanto 30 %, fondo hasta 1,2 s, estilo fade. El fondo todavía se sentía raro. Medido (luminosidad L* de un punto del fondo, cuadro a cuadro): el fundido de la página oscurece mucho al principio de la mezcla, así que casi todo el cambio visible pasaba en ~350 ms en el centro; con curva lineal, la mitad del cambio caía en el primer 30 %. Se calculó una curva para que el brillo siga una forma de dimmer de punta a punta: `cubic-bezier(0.1, 0.1, 0.95, 0.4)`. Medido después: del 10 % al 90 % del cambio de brillo pasan ~700 ms, repartidos parejo, en los dos sentidos. Además, Iluminar espera como mucho 150 ms a las fotos que no cargaron (antes 400 ms dos veces): el arranque del fondo variaba entre 0,4 y 0,75 s según la caché y ahora entre 0,49 y 0,6 s.
- **Valores finales (Lau, 2026-10-19):** foto 900 ms con `cubic-bezier(0.42, 0, 0.58, 1)`, adelanto 180 ms, fondo hasta 800 ms con `cubic-bezier(0.1, 0.1, 0.95, 0.4)`, estilo fade. Pasaron a tokens de 2 · Semantic · Motion en Figma: `motion/duration/illumination`, `illumination-image`, `illumination-lead` y `motion/easing/illumination`, `illumination-image` (DESIGN.md §6). `global.css` reúne los `--arq-illumination-*` como alias de esos tokens y los pasa a `motion/duration/fade` con movimiento reducido; `illumination-lead` va a 0 (modo reducedMotion). El adelanto es ahora un tiempo (ms), no una parte del fundido de la foto. El estilo spread queda en el código pero no se usa. Se quitó el panel de afinado de la demo.

## 2026-10-19 · Botones: se achican al presionarlos

button (Filled y Outline) e icon-button se achican un poco mientras se presionan: `motion/scale/pressed` (0,97, token nuevo de 2 · Semantic · Motion), con `motion/duration/fast` y `motion/easing/out`. Da respuesta física al clic sin mover nada: va en el host con la propiedad `scale`, que no cambia el lugar que ocupa en el layout ni pisa las transiciones de color de la hoja base. Underline no se achica (es un link de texto), tampoco `disabled` ni `loading`, y con movimiento reducido no cambia de tamaño. En Figma la variante State=Pressed no muestra la escala; está en la descripción de los sets y en las fichas `doc/button` y `doc/icon-button`.

- `motion/scale/*` es un tipo nuevo para el import (número sin unidad): `scripts/import-tokens.js` y `scripts/lib/validate-tokens.js`.

## 2026-10-19 · Sidebar de catálogo y compare-bar

Lau no veía bien las animaciones del sidebar ni de la compare-bar: abrir un grupo mostraba la lista de golpe (solo un fundido corto) y la barra entraba en 200 ms.

- **catalog-nav-group:** la lista se despliega y se pliega animando el alto, como faq-item (Disclosure `animateHeight`, `motion/duration/expand`, `motion/easing/out`), y el chevron es uno solo que gira media vuelta con el mismo tiempo. Cambia la regla de DESIGN.md §6: el alto se anima en tres casos (faq-item, catalog-nav-group y el error de input).
- **compare-bar:** entra y sale por abajo como un panel, con `motion/duration/panel` (400 ms) y `motion/easing/standard`, como filter-panel y download-modal. Se probó `motion/easing/out` al entrar: hacía el 85–90 % del recorrido en los primeros 150 ms y se seguía viendo como un salto (revisión con improve-animations). Con standard, a los 50 ms se ve el 26 % de la barra y a los 100 ms el 68 %.
- **Espacio reservado:** el listado deja abajo un espacio del alto de la barra para que no tape las últimas cards. Al sacar el último producto se quitaba en el acto y, con la página al final, el contenido saltaba mientras la barra todavía bajaba. Ahora se quita cuando la barra terminó de salir (`#syncSpace` en catalog-listing, con la duración de la transición de la barra). Queda un ajuste del scroll en ese momento, ya con la barra afuera.
- **Chevron (Open):** plegar y desplegar se desliza como la entrada (pedido de Lau). La barra es fija abajo y cambia de alto de golpe; el JS (`#slide`) anima la diferencia con `transform`, desde donde estaba el borde de arriba hasta su lugar nuevo, con `motion/duration/panel` y `motion/easing/standard`. Al plegar, la barra arranca más arriba de su lugar: un fondo debajo de ella (`.bar::after`, fuera de la pantalla en reposo) tapa lo que quedaría a la vista. Si se aprieta otra vez a mitad de camino, sigue desde donde está. Con movimiento reducido cambia de golpe (panel vale 0). La descripción de `motion/duration/panel` suma compare-bar (Figma y `tokens.css`).
- Con movimiento reducido, los dos quedan como estaban (alto de golpe con fundido; la barra, solo fundido).

## 2026-10-19 · Barra del navegador con Iluminar

En el teléfono, la barra de la dirección y la zona de arriba toman el color de `<meta name="theme-color">`, que pone Webflow en el `<head>` y comparte con el e-commerce de Macroled. Con Iluminar la página pasaba a oscuro y esa barra quedaba clara.

- Solo mientras Iluminar está prendido (Productos, Colecciones y ficha), y solo en Arq: la etiqueta toma `color/surface/default` del bloque en Dark (`<html>` en los listados, el navbar en la ficha). Al apagarlo vuelve exactamente a lo que tenía; el valor original queda guardado en `data-arq-theme-color` mientras tanto. Si la página no tenía etiqueta, se agrega una y se quita al apagar.
- `setBrowserBar` en `src/base/theme.js`; la llaman catalog-toolbar y ficha-producto (también cuando la ficha llega iluminada desde un listado).
- No toca nada de Macroled fuera de ese momento: es una excepción acotada a la regla de no tocar lo global (AGENTS.md · Integración con Webflow), decidida por Lau.

## 2026-10-19 · Imágenes de acabados

Cada acabado es una imagen (DESIGN.md §8 · Acabados de producto). Cómo funciona y cómo se agrega uno: `docs/acabados.md`.

- **Imágenes:** PNG de 128 × 128 (gradients diseñados en Figma, sección ACABADOS), uno por acabado, en `https://s3.coresagroup.com/MACROLED/ARQ/imagenes/acabados/acabado-<slug>.png`. La dirección base es `config.images.finishesBase` (`src/config.js`).
- **La base no cambia.** El nombre del acabado sigue siendo el de Sheets («Negro»): es lo que muestran la ficha, las características y los filtros. Solo cambia qué imagen se pide.
- **Un único archivo de mapeo:** `src/data/finishes.js`. Nombre del acabado (sin tildes ni mayúsculas) → slug. Un nombre que no está mapeado no tiene imagen: el swatch muestra el neutro con el nombre.
- **La familia decide el negro.** Hay dos negros: metálico (DAO, `acabado-negro`) y mate (`acabado-negro-mate`). La base los llama igual y no se renombra, así que el código mira el campo `familia` del grupo: mate en Kanu, Nobu, Tori, Koen, Douli, Yoru y Sento; metálico en el resto. Se descartó `material_cuerpo` (casi todo es «Aluminio») y el SKU (formato pendiente, es un identificador opaco). La familia se compara exacta (sin tildes ni mayúsculas). En la base, «Mini Tori Jardín» tiene familia «Tori», así que entra.
- **Datos:** `group.family` (la familia del SKU predeterminado) sale del adaptador; las cards traen `finishes: [{ name, src }]`; `getProduct` suma `finishImages: { nombre: url }` y la comparativa, `swatch` en cada opción. Las cards de colección juntan los acabados de sus grupos y repiten solo el que tiene igual nombre e igual imagen.
- **Carga:** sin `loading="lazy"`. El `<img>` del swatch arranca oculto hasta cargar y una imagen diferida y oculta nunca se pide.
- **Fuera de este cambio:** los filtros de acabado del glosario y de Descargas siguen con la muestra neutra.

## 2026-10-19 · Acabados de la card a 16 px

Con las imágenes reales, la muestra de 20 px en la product-card Large se veía grande al lado del nombre.

- **product-card:** los acabados van siempre en `arq-swatch` Size=Small (`swatch/sm`, 16 × 16), en Large y en Small (antes Large usaba Default, 20). Vale en Productos, Colecciones y la ficha (otras familias): colección usa la misma tarjeta. El swatch-picker de la ficha no cambia: 24 la elegida y 20 las demás, también en mobile.
- **Figma:** set `product-card` (`990:2372`): los swatches de las tres variantes `Size=Large` pasaron de Size=Default a Size=Small; la descripción del set lo aclara.

## 2026-10-19 · compare-picker («Agregar producto»)

Modal para sumar productos a la comparativa (Figma 2724:8761, con compare-picker-item 2723:8420). Lo abren el lugar vacío (+) de compare-bar (Productos y Colecciones) y el compare-product vacío en Comparativa. Pedidos de Lau que se apartan del set:

- **Sin chips de categoría:** el set trae choice-chip Todos · Interior · Exterior · Lámparas y artefactos. Se probó sumar «Colecciones» (una fila por colección que abría sus productos) y al final se sacaron todos: se busca solo con el buscador (nombre, SKU o familia, el criterio del buscador del navbar).
- **Al pie, «Ver todos los productos»** (button Underline con subrayado y arrow-right) en lugar de «Comparar» (Filled). Lleva al listado de Productos sin categoría.
- **compare-bar también en «Todas las colecciones»:** antes se ocultaba porque las cards de colección no tienen Comparar. La selección sigue y se puede agregar con el +.
- **Lugar vacío de compare-slot:** el dibujo del set (foto en `color/surface/subtle` con el «+» resaltado y «Agregar producto») dentro de una caja punteada, como el lugar vacío de compare-product Compact en Comparativa; cursor pointer y Hover con `color/surface/faint` y borde `color/border/strong`.
- **Mobile:** la compare-bar suma un solo lugar vacío debajo de los productos elegidos mientras haya menos de 3. El modal es pantalla completa.
- Datos: `listCompareCandidates` filtra en memoria el catálogo que ya trae Typesense (una consulta por visita); no consulta por cada letra. En la barra, lo agregado guarda la misma meta que las cards.
- Pendiente en Figma: ficha `doc/compare-picker`, sacar los chips y cambiar el botón del pie en el set, la caja punteada del lugar vacío de compare-slot y el lugar vacío en compare-bar Mobile.

## 2026-10-19 · Tokens opacity/disabled y layout/compare-picker-list; compare-slot empty-hover

Cierra los pendientes de diseño de compare-picker.

- **`opacity/disabled`** (colección nueva 2 · Semantic · Opacity, modo Value): 50 en Figma, `--arq-opacity-disabled: 0.5` en código. Para imágenes o partes gráficas deshabilitadas (la miniatura de compare-picker-item Disabled); el texto deshabilitado sigue con `color/text/disabled`. En Figma las variables de opacidad van de 0 a 100 (el campo de opacidad): `scripts/import-tokens.js` convierte `opacity/*` a 0–1.
- **`layout/compare-picker-list`** (2 · Semantic · Dimension, 400 en todos los modos): alto de la lista de compare-picker en Desktop, 5 filas de compare-picker-item. En Figma la lista tiene ese alto fijo y el panel abraza el contenido (690); en código, `block-size` de la lista. La fila mide 80 como el set: la línea inferior se descuenta del padding de abajo.
- **compare-slot State=empty-hover** (Size=Default): el Hover del lugar vacío pasa al set, con el mismo nombre de valor que compare-product (`empty-hover`): fondo `color/surface/faint` y borde punteado `color/border/strong`. En código sigue siendo `:hover`.
- La lupa del buscador del modal no era una diferencia: el set usa search-field-line, que la dibuja en `color/icon/tertiary`, como el código.
- Export: `tokens/figma/2-semantic-dimension.*` y `2-semantic-opacity.value.json`. Antes de regenerar Dimension se comparó por hash el resto de la colección en Figma con el último export del repo (iguales), así el diff solo suma la variable nueva.
- **compare-slot sin Size=Compact:** la barra en Mobile usa el tamaño Default (lista apilada) y la cabecera compacta de Comparativa usa compare-product, así que Compact ya no se usaba. Se quitó del set (las variantes quedan State=Filled · Empty · empty-hover, sin la propiedad Size), de la ficha `doc/compare-slot` y del código (atributo `size`). Se borró `layout/compare-thumb-sm` (solo lo usaba Compact): Figma, export de Dimension, `tokens.json` y `tokens.css`.

## 2026-10-19 · Negro satinado, blanco mate y acero

Salió de revisar los valores de `color_carcasa` de toda la base (326 documentos) contra las imágenes de acabados.

- **«Negro satinado» = negro mate.** Lo traen dos SKU de la línea Skyline (`RMS-AR-E` y `RMS-AR-S`, conectores de riel, familia Acoplador). Se mapea por nombre a `acabado-negro-mate` (`SLUGS` de `src/data/finishes.js`), sin regla por familia.
- **Blanco mate: imagen lista, sin regla.** `acabado-blanco-mate.png` (mismo estilo mate que el resto) es para los productos Skyline. No se conecta todavía: falta organizar su estructura en la base. Mientras tanto, «Blanco» sigue siendo el blanco metálico de DAO.
- **Acero (`RMS-S-S`): sin imagen.** Producto de un solo color que la ficha no ofrece como variante; se resuelve junto con la regla de los productos Skyline.
- **«Blanco y negro» no existe en la base:** solo está en `demo/fixtures/peor-caso.js` (datos de prueba).

## 2026-10-19 · Blanco y negro y códigos de acabado

- **«Blanco y negro» (código BN del SKU)** tiene imagen propia: `acabado-blanco-y-negro.png`, mitad blanco mate arriba a la izquierda y mitad negro mate abajo a la derecha, con corte nítido en diagonal (Figma, sección ACABADOS). Se mapea por nombre en `SLUGS` (`src/data/finishes.js`). Hoy no hay SKU con ese valor en la base: el mapeo queda listo para cuando se carguen.
- **La tabla de códigos de acabado (N, V, R, B, BN, P) se descarta.** El acabado sale siempre del nombre completo de `color_carcasa` y el SKU es un identificador opaco, así que no hace falta traducir letras. Se sacó de los pendientes de DESIGN.md §12, de `docs/acabados.md`, del README de `swatch` y de `docs/setup.md`.

## 2026-10-19 · catalog-toolbar sin nombre de la página

- catalog-toolbar State=Scroll ya no muestra el nombre de la página («Exterior») ni el divider antes de la cantidad: el nombre ya está en el `<h1>` del page-header. Scroll solo pasa a padding vertical `space/padding/sm`.
- Se quitó del código (atributo `name` de `<arq-catalog-toolbar>` y la copia del `<h1>` en `arq-catalog-listing`), de la demo, del README, de `docs/components.md` y de DESIGN.md.
- Figma: se sacaron el texto del nombre y el divider de la variante State=Scroll (1810:19453), se actualizó la descripción del set (1244:4058) y la copia de DESIGN.md en Plan del proyecto. La ficha `doc/catalog-toolbar` no lo mencionaba.

## 2026-10-19 · Elegir acabado en la card

- **La card de producto deja elegir el acabado.** Con más de un acabado, los swatches son un radiogroup: el elegido (por defecto el primero, negro) lleva State=Selected del swatch y todos el Hover, sin crecer (siempre Small, 16). Al elegir uno cambian las cuatro imágenes y el link a los de ese acabado. Con un solo acabado no se ve elegido ni se puede elegir.
- **Cada acabado es un SKU.** `src/data/catalog.js` (`finishOptions`) arma, por acabado, la variante que lo tiene: la que ya se ve, o la predeterminada, o la primera, prefiriendo las que cumplen los filtros activos. De ella salen el SKU, el link (`?sku=`) y las fotos. La card avisa con `arq:finish` y el listado actualiza el SKU y la foto de «Comparar» y de la compare-bar.
- **Arranca en negro.** Sin SKU buscado, la card muestra la variante del primer acabado en el orden de la card (negro, blanco, terracota, verde, el resto), con la predeterminada del grupo primero entre las de ese acabado (`firstFinishVariant`). Antes arrancaba en la predeterminada del grupo, aunque no fuera negra. Con filtros, la primera que los cumple en ese orden; con un SKU buscado, ese SKU.
- **Un acabado sin fotos** muestra el fondo con el nombre (regla de §8), no la foto de otro color.
- **Solo en cards de producto** (Productos y página de colección). Las cards de colección no lo tienen: sus imágenes son de la colección.
- **Mobile (Size=Small):** nombre y acabados en columna a `space/gap/sm`; nombre a 20/28 (`role/body-xl`; en Mobile `role/heading-3`); info a `space/gap/md`; acabados a `space/gap/sm`. Sale del set de Figma (990:2327).
- **Área de clic de los swatches: queda en 16 × 16.** Aunque es menos que el mínimo de 24 × 24 de DESIGN.md §9, se decidió no ampliarla (2026-10-19). Es una excepción de las muestras de la card.

## 2026-10-19 · catalog-toolbar sin State=Scroll

- Lau no quiere que la barra se achique al desplazarse la página: se sacó State=Scroll. Queda siempre con padding vertical `space/padding/md`; el listado la sigue dejando fija debajo del navbar.
- Código: atributo `state` de `<arq-catalog-toolbar>`, su regla CSS y la línea de `arq-catalog-listing` que lo ponía; demo, README, `docs/components.md` y DESIGN.md (§8 y Anexo A).
- Figma: se borró la variante State=Scroll (1810:19453, sin instancias) y la propiedad State del set (1244:4058); las variantes quedan `Breakpoint=Desktop` y `Breakpoint=Mobile`. Se actualizó la descripción del set y las copias de DESIGN.md y COMPONENTS.md en Plan del proyecto.

## 2026-10-19 · Navbar fijo en los listados

- Lau quiere el navbar siempre a la vista en Productos y Colecciones: ya no se esconde al bajar (desde 1024 px) ni vuelve al subir. Reemplaza lo de 2026-10-16 · Productos: movimiento y scroll (umbral de dirección y toolbar y sidebar que acompañaban al navbar con `transform`).
- La barra de herramientas y el sidebar quedan pegados siempre debajo del navbar (`top` del alto de la barra: `space/gap/md` × 2 + `icon/xl`).
- **Sin doble línea:** pegada debajo del navbar, la línea superior de catalog-toolbar se juntaba con la inferior del navbar. Mientras está pegada, el listado le pone el atributo `stuck` (solo de código, sin variante en Figma) y la línea pasa a `color/surface/transparent` con `motion/duration/fast`; el borde mantiene su ancho para que la barra no cambie de alto. Se detecta con un `IntersectionObserver` (margen superior del `top` sticky + 1 px), sin escuchar el scroll.
- **Sidebar de catálogo como compare-bar:** a Lau el despliegue de catalog-nav-group le resultaba lento (alto animado con `grid-template-rows` y `motion/easing/out`, que hace casi todo al principio y se arrastra al final). Ahora funciona como el pliegue de compare-bar (`#slide`): la lista cambia de golpe y la línea del grupo (en `::after`) y los grupos de abajo vuelven con `transform` desde donde estaban, con `motion/duration/expand` (250 ms) y `motion/easing/standard`; al abrir, la lista se descubre con `clip-path` al mismo ritmo. El chevron gira con el mismo tiempo y curva. Ya no usa Disclosure `animateHeight` (queda solo en faq-item); DESIGN.md §6 pasa a dos casos de alto animado. Con reduced motion, de golpe con el fundido de Disclosure.
- Se quitó de `arq-catalog-listing` el seguimiento de la dirección del scroll y `#followNavbar`, y de navbar el atributo `data-arq-catalog-hidden`. Sigue `data-arq-compare-hidden` (la comparativa Mobile, que reemplaza el navbar por compare-header Compact).

## 2026-10-19 · announcement-bar (propuesta)

- Lau pidió una línea fina arriba del navbar, en todas las páginas, con fondo oscuro y «Suscribite al newsletter». No hay set en Figma: se arma primero en código como propuesta y, si queda bien, se diseña en Figma (set + ficha `doc/announcement-bar`).
- `<arq-announcement-bar>` con un button Underline por slot, sin subrayado en reposo (sin `show-underline`: aparece en hover), con el ícono `arrow-up-right` y texto de 14 px (`role/body-compact-regular`) con el atributo `compact` del button, solo de código. Pedido de Lau. Siempre en Dark local (`data-arq-theme="dark"` en el `<aside>` interno, como compare-bar): no cambia con Iluminar.
- **Al hacer scroll se oculta:** va en el flujo de la página, antes del navbar, y se va con el contenido; no escucha el scroll.
- **navbar Transparent pasa de fixed a sticky** con margen inferior negativo (su alto, 56): sigue encima del hero, pero arranca debajo de la barra y se pega arriba cuando la barra se va. Sin la barra se ve igual que antes. El alto de la barra del navbar queda en una variable local (`--bar-height`).
- El link va a la sección Newsletter de la Home: `/arq#newsletter` (el cta-block lleva `id="newsletter"`). Confirmado por Lau.
- **Figma (19/10):** set `announcement-bar` (2780:8595) en Componentes › 2 · Navegación › Announcement bar: Breakpoint Desktop · Mobile, modo Dark fijado en cada variante, padding `space/padding/xs` × `layout/gutter`, button Underline (Show underline=false, icon/arrow-up-right) como instancia expuesta y el label con el estilo `role/body-compact-regular` como override (el set de button no tiene `compact`). Ficha `doc/announcement-bar` (2781:13825) en Documentación › 2 · Navegación. Link confirmado: sección Newsletter de la Home.
- **Ajustes (19/10):** con `compact`, el subrayado del button Underline sube (arranca `space/padding/2xs` antes del borde inferior de la línea de 24, en lugar de 3 px debajo): con texto de 14 sobraba aire. También es más fino: queda en `border/default` (1 px) en hover y pressed, en lugar de `border/strong` (2 px). Solo afecta a compact; el resto de los button sigue como Figma. El hero `full-height` de la Home descuenta el alto de announcement-bar (lo mide con un `ResizeObserver`): barra + hero ocupan el 100 % del alto de la pantalla.
- **Figma (19/10, cierre):** descripción del set y ficha `doc/announcement-bar` con el subrayado de 1 px y más pegado en hover; anotación de Dev Mode «✅ En código: arq-announcement-bar (src/components/announcement-bar)»; copias de DESIGN.md y COMPONENTS.md de Plan del proyecto actualizadas (la de COMPONENTS.md ya venía atrasada respecto del repo).

## 2026-10-19 · announcement-bar solo en la Home

- Lau pidió que la barra vaya solo en la Home. Reemplaza «en todas las páginas» de 2026-10-19 · announcement-bar (propuesta): se sacó de los embeds de Productos, Colección, Ficha, Comparativa, Descargas y Contacto.
- El navbar sigue siendo sticky en Default y en Transparent: sin la barra se ve igual que antes. El hero `full-height` solo descuenta la barra si está en la página.
- Figma: descripción del set, ficha `doc/announcement-bar` y copias de DESIGN.md y COMPONENTS.md de Plan del proyecto.

## 2026-10-19 · Tablet

- Final no tiene pantallas Tablet (768–1023 px) y varias pantallas usaban el layout Desktop, que no entra: nombres de una letra por línea en compare-bar, el título de Descargas partido en sílabas, campos angostos en Contacto y columnas apretadas en el mega-menu. Criterio: donde el Desktop no entra, se apila como Mobile y conserva los tamaños de Desktop.
- **Productos:** hasta 1023 px (antes, hasta 767) las categorías van en la pestaña Categorías de filter-panel y no se muestra catalog-nav-mobile arriba de la grilla. En Tablet el panel sigue lateral, con scrim. Colecciones no cambia.
- **compare-bar:** en Tablet los tres lugares van en una línea y «Borrar todo» y «Comparar» debajo, a la derecha, a `space/gap/md`. Plegada, una sola línea como en Desktop.
- **Descargas:** en Tablet el catálogo va debajo del título, a `space/gap/xl`, con la bajada hasta `layout/measure-wide`.
- **Tabla de Descargas:** pedido de Lau, un indicador de que hay más fila por ver. Un difuminado de `space/gap/3xl`, del transparente al fondo de la celda (también en Hover), junto a la columna fija de cada lado mientras queda contenido de ese lado (a la derecha, junto a Descargas; a la izquierda, junto al producto desde 1024 px o a la miniatura hasta 1023 px). Entra y sale con `motion/duration/fast`. Se ve en cualquier ancho en que la tabla no entra (no en Mobile, que usa tarjetas). Se eligió difuminado y no blur (el blur sobre texto se ve sucio y cuesta en el teléfono).
- **Contacto:** en Tablet la información va arriba y el formulario debajo (como Mobile), con los campos de a dos; la bajada hasta `layout/measure-wide` y la información sin sticky.
- **mega-menu:** en Tablet no se muestra el preview (`layout/mega-menu-image`, 420): las columnas toman todo el ancho, con `layout/gutter` a los dos lados. Se probó la miniatura de mega-link (Show image) en las colecciones y no entra en 4 columnas a 800–900 px: queda sin miniatura.
- Figma: descripciones de los sets filter-panel (1225:13576), compare-bar (1233:3963) y mega-menu (841:2282); fichas `doc/filter-panel`, `doc/compare-bar` y `doc/mega-menu`; copias de DESIGN.md y COMPONENTS.md en Plan del proyecto (la de compare-bar en COMPONENTS.md venía atrasada: se copió la del repo, y en `docs/components.md` se sacó el párrafo de movimiento que estaba repetido).

## 2026-10-19 · Tablet: registro en Figma

- Lau pidió las pantallas Tablet en Figma como registro. Sección «Tablet · registro (2026-10-19)» (2791:24150) en Final, a la derecha de todo: Productos, Productos · filtros (Características y Categorías), compare-bar, Descargas, Contacto y Mega menu (Por espacio y Colecciones), a 834 px (iPad vertical) con el modo Tablet de Dimension. Se armaron clonando las Desktop y apilando lo que el código apila, más una nota con el criterio.
- Desacoplados porque los sets no tienen variante Tablet: compare-bar (fila vertical) y filter-panel (Desktop con las tabs y la lista de categorías copiadas de su variante Mobile). Los sets no se tocaron.
- En la tabla de Descargas, el difuminado es un rectángulo con degradado: la parada final está atada a `color/surface/default`; la inicial es blanco al 0 % sin variable, porque Figma mezcla sin premultiplicar y con `color/surface/transparent` (negro al 0 %) el medio se ve gris. En código no pasa.
- En la cabecera de Productos, la bajada del page-header se desató de `layout/measure-wide` y llena el lugar libre (≈ 400, como `layout/measure` en código): la variable no se puede cambiar en la instancia.
- Pendiente: el footer de Figma no entra en 834 («Redes» se corta); en código sí entra.

## 2026-10-20 · Figma: Tablet, textos de error y tokens nuevos

- **Tablet · diseño:** Lau pidió el diseño Tablet de Mega menu, Descargas y Contacto. Sección «Tablet · diseño (2026-10-20)» (2803:40995) en Final, a la derecha del registro del 19/10, con frames de 834 en el modo Tablet de Dimension. Sale del registro, revisado como diseño:
  - **footer:** variante nueva `Breakpoint=Tablet` en el set (2803:8580): marca arriba y debajo Productos, Información y Redes, de `layout/footer-column` a `space/gap/xl`, a `space/gap/2xl` de la marca. Cierra el pendiente del 19/10 («Redes» se cortaba). `TODO` código: hoy el footer Tablet es el de Desktop achicado y parte «Lámparas y artefactos».
  - **Descargas:** la download-card del catálogo de `layout/measure-wide`, con título y bajada visibles (en el registro el bloque tenía alto fijo y la recortaba). Igual que el código.
  - **Contacto:** Contacto y Recursos técnicos en dos columnas a `space/gap/xl`, debajo de la bajada. `TODO` código: hoy van apilados.
  - **Mega menu:** las tres pestañas, sin preview. Lámparas y artefactos con el contenido del frame 2295:23691; Colecciones con las filas alineadas a 68.
- **Textos de error del formulario de contacto:** «Contacto v3 · errores» (2804:26205) y la tabla «Textos de error · formulario de contacto» (2805:26390) en Final › Contacto. Obligatorios: nombre, email y detalles, sin marca (los demás dicen «(opcional)»). Cada error debajo de su campo; al enviar con errores, el foco va al primero y debajo del botón aparece «Revisá los campos marcados para enviar tu consulta.» (form-message Error). Nuevos respecto del código: validación del teléfono, el aviso al enviar, y los textos del adjunto y del envío fallido. `TODO` código: pasarlos a form-contacto y file-upload.
- **Tokens nuevos en Figma** (cada uno con descripción y code syntax; `TODO` exportarlos por MCP a `tokens/figma/`, `npm run tokens:import` y `npm run tokens`, y reemplazar los valores sueltos):
  - `offwhite/sand` (#F7F1EC, Primitive) y `color/surface/sand` (Light `offwhite/sand`, Dark `neutral/750`): la banda de Casa FOA del Home (section `background="sand"`).
  - `layout/navbar-height` (56): compare-header Compact y la columna fija de la ficha.
  - `layout/mega-link-thumb` (60), `layout/result-thumb` (100 · Mobile 76, search-result Simple), `layout/gallery-thumb-overlay` (66, miniaturas sobre la foto en la Ficha v2).
  - `motion/scale/hover` (1,05: zoom de category-card, collection-tile y search-card) y `motion/scale/enter` (0,97: menú de input Select y search-card al aparecer).
  - `opacity/muted` (50: grilla cargando y slide inactivo) y `opacity/track` (35: pista de carousel-controls).
  - Sin token, a propósito: medidas de un solo uso (fotos de 684, bajadas de 440, padding de 10 de mega-link), el desplazamiento de la grilla `stagger` (prueba) y el ancho de tarjeta del carrusel mobile (es un porcentaje). El título Regular 50/64 de Home v2 pide un estilo `role/*` nuevo: queda para acordar.

## 2026-10-20 · Tokens nuevos en código

- Export por MCP de 1 · Primitive · Color, 2 · Semantic · Color, Dimension, Motion y Opacity; `tokens:import` sumó los 10 tokens nuevos sin quitar ni cambiar otros.
- **color/surface/bone** estaba solo en el repo (Home, 2026-10-19): se creó en Figma con el mismo valor y descripción para que el export no lo borre.
- `import-tokens.js`: las primitivas de marca que usa un semántico van en `USED_BRAND` (`offwhite/bone`, `offwhite/sand`).
- Reemplazos: section `sand` → `color/surface/sand`; compare-header Compact y glosario de la ficha → `layout/navbar-height`; mega-link → `layout/mega-link-thumb`; search-result Simple → `layout/result-thumb`; product-gallery `fill` → `layout/gallery-thumb-overlay` (las miniaturas pasan de 105 a 66, como Figma); category-card, collection-tile y search-card → `motion/scale/hover`; menú de input Select → `motion/scale/enter`; catalog-listing cargando y project-slide inactivo → `opacity/muted`; carousel-controls → `opacity/track`.
- Con `prefers-reduced-motion` ya no hay zoom en category-card, collection-tile ni search-card (antes el zoom pasaba de golpe).
- DESIGN.md §3–§6: tokens nuevos y `color/surface/bone`.

## 2026-10-20 · announcement-bar más chica

- Pedido de Lau: el texto más chico y un poco menos de padding. El label pasa de `role/body-compact-regular` (14/24) a `role/body-sm` (12/16) y el ícono de `icon/md` a `icon/sm` (12); el padding de la barra, de `space/padding/xs` a `space/padding/2xs`. Alto: de 40 a 30. El área del link sigue en 24 (mínimo de §9).
- El subrayado de `compact` va justo debajo de la línea de 16 (2 px más arriba que en el resto de los button, pedido de Lau) y más fino: 1 px también en hover y pressed.
- Figma: set announcement-bar (2780:8595) con su descripción y ficha `doc/announcement-bar`. El hero `full-height` mide el alto real de la barra, así que no cambia.

## 2026-10-20 · Fotos del mega-menú

- Pedido de Lau: el preview del mega-menú muestra una foto de contexto elegida para cada aplicación de Por espacio (Embutir, Colgante, Jardín…, también Artefactos y Lámparas) y para cada colección, traída de Typesense.
- **Aplicaciones:** columna nueva `is_menu_default` (casilla, como `is_group_default`). Se marca un SKU por link de Por espacio (por aplicación y entorno; para Artefactos y Lámparas, un producto de ese tipo) y su foto de ambiente pasa a ser la del menú. No hacen falta filas ni SKU nuevos (el SKU no se inventa). Se descartó una fila «Aplicación» por link por eso mismo. Si hay más de un TRUE en una aplicación, manda el primero en el orden de la hoja.
- **n8n y Typesense:** `is_menu_default` se sumó a `BOOLEAN_FIELDS` del nodo Code de n8n (llega como `true` / `false`). No está en el esquema de Typesense y no hace falta: se guarda igual y el sitio lo recibe (no se filtra por él).
- **Foto:** se reutiliza la columna `img_ambient_1_on` (llega en `multimagen_ambiente`); si está vacía, `img_ambient_1` (en la hoja, la columna `img_ambient_1_off`; n8n la renombra). Sirve igual para el SKU marcado y para la fila de colección. Hoy la apagada no llega a Typesense por el orden de `multimagen_ambiente` en n8n (`typesense-schema.md` · Nombres de la hoja y de Typesense), así que ese paso no hace nada hasta que se corrija allá; el sitio no cambia.
- **Colecciones:** la foto se guarda aparte (`images.menu`), no como contexto, para que la card de colección siga sin cambiar en hover.
- **Respaldo:** sin foto propia, o si no carga, el preview prueba en orden las fotos de contexto de los productos de la categoría y después las de estudio, hasta encontrar una que cargue. En una colección, solo las de contexto de sus productos: nunca una de estudio (pedido de Lau). Si ninguna carga, `color/surface/subtle`. Hace falta probar en orden porque muchas URL de la base todavía dan 404.
- Al abrir el menú se ve siempre la primera pestaña y su primer link (Embutir), y la foto llega al borde inferior (la línea del menú va solo debajo de las columnas).
- Al 2026-10-20 están marcados DAO-EC-X1-N (Embutir), DOULI-C-15W-N-WW (Colgante), YORU-J-8W-N-WW (Jardín) y KANU-P-350-12W-N-WW (Pared). Dan 404 las fotos de ambiente de DAO-EC-X1-N y KANU-P-350-12W-N-WW y las siete `col-*_AMBIENT_1_ON.webp`: ahí el preview usa el respaldo.
- Typesense conserva 187 documentos de Skyline (`RMS-*`) que ya no están en la hoja: n8n agrega y actualiza, no borra. No se listan (no tienen `is_group_default`). `TODO` (datos): decidir si se borran del índice.

## 2026-10-20 · Colecciones: categorías en Filtrar

- Pedido de Lau: en Colecciones, hasta 1023 px, se veía `catalog-nav-mobile` («Todas las colecciones») arriba de la grilla además del botón Filtrar, y no funcionaba como Productos.
- Ahora Colecciones hace lo mismo que Productos: sin `catalog-nav-mobile` arriba de la grilla y con las categorías en la pestaña Categorías de filter-panel (Show categories). Desde 1024 px sigue el sidebar.
- Reemplaza «Colecciones no cambia» (2026-10-19) y «Colecciones Mobile sigue con catalog-nav-mobile». DESIGN.md §2 y AGENTS.md actualizados.

## 2026-10-20 · Cards de carga en Productos y Colecciones

Pedido de Lau, con los skills emil-design-eng, find-animation-opportunities, apple-design, mobile-native y break-ui. Rama `feat/arq-product-card-skeleton`.

- **Antes:** en la primera visita (unos 3 s sin caché) se veía «Cargando productos…» y la grilla vacía.
- **product-card `loading`:** card de carga con la misma geometría que la card real (bloque 7:10, barra del nombre con tres muestras, barra de «Comparar» o de la meta), en `color/surface/subtle`, como las filas de carga de Descargas (2564:21523). Las barras van en líneas de `1lh` del `role/*` de cada texto: medido a 1400 px, la card de carga y la real miden lo mismo (550,3 px). Se eligió una prop de product-card y no un dibujo dentro del listado, para que la geometría coincida sola y sirva después en Colecciones, la página de colección y los destacados del Home.
- **Shimmer (elegido por Lau):** una franja de brillo cruza los bloques en diagonal, de izquierda a derecha, cada 1,6 s y lineal (movimiento constante). Brillo `color/surface/default` (en Dark `color/surface/strong`, que ahí es más claro que subtle). El degradé es uno solo para toda la pantalla (`background-attachment: fixed`): la franja pasa pareja por todas las cards, como un solo reflejo; en iOS Safari `fixed` no aplica y cada bloque lleva su franja. Con movimiento reducido, fija. Duración: token nuevo **`motion/duration/shimmer`** (1600 ms; 2 · Semantic · Motion en Figma, no cambia con movimiento reducido porque ahí no hay franja).
- **Figma:** product-card suma `State=Loading` (Size Large y Small, estática: los bloques en `color/surface/subtle`, con los altos de línea enlazados a `type/*/leading` como el `1lh` del código); la descripción del set y la ficha `doc/product-card` cuentan el shimmer.
- **DESIGN.md** (repo y copia en Figma): `motion/duration/shimmer` en §6, con la excepción a «se anima solo opacity, transform y colores» (el shimmer mueve `background-position`), y product-card con State=Loading en §8 y el Anexo A.
- **Qué se probó antes:** fija (como Descargas): Lau no veía movimiento. Pulso de opacidad (toda la card a `opacity/muted` cada 2 s): poco notorio, porque bajar la opacidad acerca el gris al blanco. Pulso de color (`surface/subtle` ↔ `surface/strong`, 1,6 s): más notorio. Se comparó con el shimmer al lado (prop de prueba `skeleton`) y quedó el shimmer; el pulso y la prop se borraron.
- **Cuándo se ve:** solo en la primera carga del listado (todavía sin cards); al cambiar de categoría o de filtros sigue el atenuado de la grilla. Dos filas de la grilla (6 desde 1024 px, 8 desde 1920 px, 4 en Mobile). Aparecen con un fundido de `motion/duration/fade` después de esperar lo mismo: con el catálogo en caché no llegan a verse (medido: ningún cuadro). Se usa `fade` y no `fast` porque `fast` vale 0 con movimiento reducido y las haría aparecer siempre.
- **Paso a las cards:** si las cards de carga ya se veían, las cards ocupan su lugar sin la entrada (con el fundido desde 0, el gris bajaba a blanco y volvía): lo que aparece es la foto. Si todavía no se veían, entrada normal.
- **Primera foto de product-card:** funde al llegar (`motion/duration/slow`, `motion/easing/standard`; con movimiento reducido, `fade`), en todo el sitio. Si ya estaba en la caché aparece directo. Al cambiar de acabado o con Iluminar no hay fundido de entrada.
- **Accesibilidad:** las cards de carga llevan `aria-hidden`; «Cargando productos…» sigue en la región `role="status"`, solo para lectores de pantalla.
- **Demo:** `demo/productos.html?data=loading` demora la respuesta 3 s (`loading-one`, `loading-empty` y `loading-error` cambian lo que llega después; `demo/fixtures/peor-caso.js`, no llega a `dist/`). En `demo/index.html`, cada card de carga junto a la card que reemplaza, en Light, Small y Dark.

## 2026-10-20 · Una sola variants-table

- Pedido: consistencia entre la tabla de la ficha y la de Descargas. `<arq-downloads-table>` se elimina y `<arq-variants-table>` queda como único componente, con la prop `type` (`product` por defecto, ficha; `catalog`, Descargas). Se quitan `show-search` (pasa a ser `type="catalog"`) y `show-sort` (solo de código, sin uso).
- **Barra.** Descargas: buscador a la izquierda y Filtros a la derecha; los filtros aplicados y «Limpiar filtros» van debajo de Filtros, alineados a la derecha (en Mobile, debajo de todo). Ficha: Filtros a la izquierda y, a la derecha, CAD 2D/3D y Manual (campos `cad` y `manual` de Typesense, del SKU predeterminado).
- **Filas.** En los dos: sku Compact (el de Descargas); el nombre del producto solo en Descargas. Miniatura de `layout/table-thumb` (100), la de la ficha. Encabezado en `role/body-regular` (el de la ficha, sin mayúsculas: Descargas usaba `role/label-lg`). Difuminado de la derecha en los dos. Mobile: las tarjetas de Descargas.
- **Columnas** (`TABLE_COLUMNS`, reemplaza a `GLOSSARY_COLUMNS`; Descargas ya no arma las suyas a partir de sus filtros): Acabado, Tamaño, Potencia, Temp., CRI, Flujo lum., Ángulo, Eficiencia, IP, Regulación. Salen «Fuente» (la ficha) y Montaje, Material y Tensión (Descargas); siguen siendo filtros de Descargas.
- **Tamaño en mm.** La base lo trae en cm; `toMillimeters` (`src/data/attributes.js`) multiplica cada número por 10 y cambia la unidad. Solo en la tabla: el acordeón y la comparativa siguen como llegan.
- **Gap entre columnas** `space/gap/lg` y del sku a los datos `space/gap/xl` en los dos (la ficha tenía sm y sm-md).
- **Ancho parejo y encabezado gris.** Las columnas de datos miden lo mismo (la más ancha) salvo las `wide` (Tamaño); el encabezado lleva fondo `color/surface/soft` y la barra (buscador y Filtros, o Filtros y archivos generales) queda fija debajo del navbar al desplazar solo si la tabla no entra en la pantalla (con pocas filas, o una búsqueda o filtro con pocos resultados, no se fija), junto con la fila de encabezados (una copia del `<thead>`: el real no puede ser sticky dentro del scroll horizontal). Las columnas de datos miden lo mismo y el ancho que sobra se reparte parejo entre ellas (el sku conserva lo que mide). Una columna con un valor muy largo (más de 1,5 veces la mediana, como Regulación con «Si, mediante fuente DIM») mide lo suyo y no ensancha a las demás. variants-table no tiene Dark: se quitó de la demo.
- **Descargas · link al producto.** El nombre y la miniatura son un link a la ficha (con `?sku=`) en la tabla y en las tarjetas Mobile; desaparece el botón «Ver producto». En las tarjetas, la descarga pasa a ser el icon-button Large Outline arriba a la derecha (como variants-table-card de la ficha en Figma, 2399:31269) y se quita la fila de botones. La fila entera no es clickeable (choca con la descarga, copiar el sku y seleccionar texto). Los botones de las tarjetas no usan `compact`.
- **variants-table · jerarquía de texto (2026-10-20).** Nombre, sku y datos siguen una sola escala en Desktop, Tablet y Mobile. Hasta 1919 px: datos y encabezados 14 (`role/body-compact-regular`), sku 14 (`dense`) y nombre 16 (`role/body-lg-medium`). Desde 1920 px (Wide): datos y encabezados 16, sku 16 y nombre 18. Antes los datos pasaban de 16 a 18 en Wide, el sku quedaba en 16 y el nombre en 14. El encabezado de columnas acompaña a los datos (antes 16 fijo). El nombre va siempre subrayado (indica que lleva a la ficha; `border/strong` con el mouse). `dense` del sku ahora sigue el escalón Wide por CSS.
- **Nombre en 14 siempre (2026-10-20); gap nombre–sku 0,5 rem en la tabla (`space/gap/sm`; en la tarjeta Mobile sigue `space/gap/xs`).** Se corrige lo anterior: el nombre queda en 14 px en todos los anchos (sku, datos y encabezados pasan a 16 px desde 1920 px; el nombre no) (con el escalón a 16 por CSS). Peso Regular (en Medium, con el subrayado, llamaba más la atención que el sku y los datos en Desktop): se distingue solo por el subrayado. En las tarjetas Mobile también 14.
- **Tarjetas Mobile · tamaños.** Datos (etiqueta y valor) y sku en 14 px (`role/body-compact-regular`, `role/body-compact-medium` y `role/body-compact`); el nombre sigue en 16 px (`role/body-medium`). El sku suma el atributo solo de código `dense` (Size=Compact con el código en 14 px); TODO Figma: el set sku no tiene ese tamaño.
- **Tarjetas Mobile.** Datos: Potencia, Temp., CRI, Flujo lum., Acabado y Tamaño (antes Potencia, Temp., Ángulo e IP), de a dos por fila. La línea entre tarjetas pasa a `color/border/default` y va de borde a borde de la pantalla.
- **Barra de columnas.** Sustituye a la barra de scroll espejo de Descargas, y también en la ficha cuando la tabla no entra en el ancho: la línea de progreso de la Home (`arq-carousel-controls` con `buttons="none"` y `progress="scroll"`, modos nuevos; el trazo mide la parte visible de la tabla y sigue el scroll), sin flechas ni contador, a todo el ancho de la tabla y con `space/padding/sm` (0,5 rem) de aire arriba y abajo (antes `space/padding/xs`: se leía como adorno y no como indicador de desplazamiento). Con flechas ocupaba demasiado alto (en pantallas bajas solo entraban 3 filas). Fija abajo de la pantalla. Excepción a «sin barra visible» (DESIGN.md §2). `buttons="chevron"` (icon-button Large sin fondo) y `page-inset` quedan en carousel-controls, sin uso.
- **Figma · estados nuevos (2026-10-20).** variants-table suma State: Default · Applied (filtros aplicados como filter-chip y «Limpiar filtros») y la prop Show more («Ver más productos»); el set queda en 2 filas (Default arriba, Applied abajo). `doc/sku` muestra Size=Dense y `doc/variants-table` suma filas de tokens y las instancias nuevas. El modal de filtros ya existía (filter-panel, «Ver N productos»).
- **Figma y DESIGN.md (2026-10-20).** El set variants-table se rearmó con Type (Product · Catalog) × Breakpoint (sin Filters ni Show search); variants-table-row (columnas nuevas, encabezado surface/soft, Show name · Name, sku Dense), variants-table-card (nueva), sku (Size=Dense), descripciones de los componentes y de layout/download-thumb, download-search, table-thumb y navbar-height, fichas `doc/` y las copias de DESIGN.md y COMPONENTS.md del Plan del proyecto. DESIGN.md §2 y §8 reescritos (la línea de progreso reemplaza a la barra de scroll).
