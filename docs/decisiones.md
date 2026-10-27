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
- **`page-header` Type=Detail:** `layout/measure-wide` aplica solo a la bajada, no a todo el bloque del título (si no, «Comparar productos» se baja de línea).
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
- **Hojas:** (reemplazado por 2026-10-23 · Ficha técnica: una hoja menos) la portada es la hoja 1; las especificaciones arrancan en la 2 y suman hojas si no entran. Una sección no se parte: si no entra en lo que queda, pasa entera a la hoja siguiente. Solo una sección más alta que una hoja se corta y repite su título. El pie de la hoja 2 en adelante es el aviso legal.
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
- **S3:** ~~confirmar que el servidor de imágenes responde con CORS~~ S3 no manda CORS; la ficha técnica en PDF pide la foto al CloudFront (2026-10-23 · Ficha técnica: una hoja menos).
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
- **Breadcrumb de los listados:** ya no queda fijo en Inicio / Productos. Sigue al `<h1>` y siempre pasa por Productos: Inicio / Productos / Interior (vista completa de un grupo), Inicio / Productos / Exterior / Jardín (subcategoría), Inicio / Productos / Colecciones / Kanu (colección; «Colecciones» abre el mega-menu en esa pestaña, `data-arq-menu`) e Inicio / Productos / Resultados para «…» (búsqueda). Pedido de Lau (2026-10-27): un nivel más, hasta 4; la ficha también suma Productos o Colecciones (hasta 4, sin Inicio). Sus links al mismo listado no recargan. Al volver a Productos sin categoría también vuelve el `<h1>` «Productos» (antes quedaba el de la categoría anterior).
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
- **Espacio reservado:** el listado dejaba abajo un espacio del alto de la barra. Reemplazado por 2026-10-23 · compare-bar sticky (sin espacio).
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
- **Listas largas del sidebar (2026-10-27):** con muchas colecciones, la lista se descubría en 250 ms sobre un recorrido muy largo (se veía demasiado rápido) y el sidebar fijo pasaba el alto de la pantalla. Desde 1024 px, la lista de un catalog-nav-group mide hasta 9 ítems y medio y el resto se desplaza adentro (barra fina; el medio ítem cortado avisa que hay más). El recorrido al abrir queda como el de los otros grupos. El ítem elegido se centra en la lista al abrir o al cambiar. En filter-panel (hasta 1023 px) no se corta: desplaza el panel.
- **Sidebar a la altura de la pantalla (2026-10-27):** reemplaza el corte de 9 ítems y medio. Con el corte, la barra de la lista aparecía siempre que había más de 9 colecciones, aunque la pantalla tuviera lugar. Lau pidió que dependa del viewport. Ahora la lista no se corta y el tope lo tiene el sidebar entero (desde 1024 px): mide como mucho lo que se ve de pantalla desde su borde superior (pegado, desde el navbar; con la página arriba, desde debajo del título) y, solo si los grupos abiertos no entran, se desplaza adentro con barra fina. Lo mide `arq-catalog-listing` al hacer scroll, al cambiar el tamaño de la ventana y al abrir o cerrar un grupo, con el alto del nav sin los `transform` del pliegue: así la barra no asoma mientras se cierra un grupo. Ya no se centra el ítem elegido: al cargar, desplazar el sidebar escondía los primeros grupos con la página todavía arriba. La barra es la misma de variants-table en Descargas (Lau, 2026-10-27): primero se probó la nativa estilada con sus colores, pero no tenía los chevrons ni engordaba en hover. Ahora es `carousel-controls` con `scrub` y `orientation="vertical"` (solo de código): chevrons arriba y abajo que avanzan media página, se arrastra, el clic en la pista lleva hasta ahí y engorda en hover. Va en el espacio entre el sidebar y la grilla, a `space/gap/sm`, para no angostar los grupos; el contenido se desplaza en `.nav-scroll`, sin barra nativa. `TODO` (diseño): Figma no tiene la barra vertical.
- **Pliegue según el recorrido (2026-10-27):** sin el corte, Colecciones (15 ítems, unos 500 px) se descubría en 250 ms con `motion/easing/standard`, casi todo en los primeros 90 ms: se veía como un salto. La duración del pliegue ahora sale del recorrido, en alturas de ítem, de 4 a 15 ítems y lineal en el medio: al abrir, de `motion/duration/slow` (320 ms) a `motion/duration/fold` (500 ms); al cerrar, más corta, de `motion/duration/expand` (250 ms) a `motion/duration/panel` (400 ms). Primero se probó 250 → 400 al abrir y Lau lo pidió un poco más lento, también en Colecciones; como `panel` era el más largo de UI, se creó en Figma `motion/duration/fold` (500 ms, en 0 con reduced motion; `scripts/import-tokens.js` lo suma a la lista de reduced motion). El chevron gira con la misma duración. La curva no cambia. Con reduced motion sigue de golpe con el fundido. Plan `plans/005-catalog-nav-group-duracion-segun-recorrido.md`. `TODO` (docs): DESIGN.md §6 todavía dice `motion/duration/expand` para catalog-nav-group y su tabla de Motion no tiene `motion/duration/fold`; se cambia en una rama `docs/` junto con la copia de Figma.
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

## 2026-10-20 · Home: Explorar por espacio en Mobile

- En Mobile las tres fotos de Explorar por espacio se apilaban (el layout `editorial` solo armaba la fila desde 768 px). Pedido: que queden una al lado de la otra y se deslicen con el dedo.
- Hasta 767 px, `arq-grid layout="editorial"` es una fila con scroll horizontal y snap, adentro de la caja. Cada foto ocupa el 80 % del ancho y la siguiente asoma; el hueco sigue siendo `space/5`. La última llega al mismo borde izquierdo que la primera. `arq-section` recorta el eje horizontal (`overflow-x: clip`) para que esa fila, y el resto de los carruseles, no ensanchen la página. El margen lateral de títulos y textos pasa a `space/padding/sm`; las fotos que lo cancelan siguen al borde. Home v2 no tiene frame Mobile: el 80 % es el mismo criterio del carrusel de `arq-grid`.

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

## 2026-10-20 · Nosotros

- Pedido: una página de marca con la base de la Home y el mismo criterio editorial (foto protagonista, título corto, bajada, alternancia izquierda/derecha). No hay frame en Final.
- URL `/arq/nosotros`, embed `src/pages/nosotros.html`. Sin hero de apertura: el navbar va en Theme Default y la página arranca en un `feature-block`. Siguen tres `feature-block` de Oficio (sobre `background="bone"`, con `size` large, small y medium), otro `feature-block`, una banda `hero` tall + parallax, `project-mosaic` con `bleed` y `cta-block` a Contacto.
- «Conocer Macroled ARQ» de la Home apunta ahí. El footer suma Nosotros en Información, en todas las páginas. El navbar sigue el de Figma (Productos, Descargas, Contacto): no se agregó el link.
- TODO: confirmar textos.
- Fotos: en el S3 de la empresa, `https://s3.coresagroup.com/MACROLED/ARQ/imagenes/arq_nosotros/` (2026-10-26). La carpeta `arq_nosotros/` del repo queda como copia local.

## 2026-10-21 · Foto inicial del mega-menú

- Pedido de Lau: al abrir el mega-menú tiene que verse una foto fija, por ahora la de Colgante. Antes mostraba la del primer link (Embutir), cuya foto da 404 y caía en el respaldo.
- Al abrir (y al volver a Por espacio) el preview muestra el link Interior · Colgante, con su eyebrow y nombre. Se elige en `OPENING` de `mega-menu.js`; si ese link no existe, el primero. Las demás pestañas siguen con su primer link. Hover y foco siguen cambiando la foto.
- `TODO`: DESIGN.md §8 (ficha mega-menu) todavía dice «su primer link»; se actualiza en una rama `docs/` junto con la copia del Plan del proyecto en Figma.
- Para que la foto ya esté al abrir, el navbar pide la navegación al acercarse a Productos (mouse o foco), como la búsqueda con sus recomendados; antes la pedía recién al abrir y el preview quedaba vacío hasta que llegaban los datos y cargaba la foto.

## 2026-10-21 · Nosotros en el navbar

- Pedido: el menú tiene que incluir Nosotros. Va en todas las páginas, entre Productos y Descargas (`/arq/nosotros`). En la página Nosotros el link va en `current`. El menú mobile usa los mismos links del slot.
- Figma todavía no lo tiene (set navbar y footer). TODO: sumarlo en el set y en la ficha `doc/navbar`.

## 2026-10-21 · Recursos

- Pedido: Descargas deja de ser un link suelto. En el navbar se llama Recursos y abre un panel, con la misma apertura que Productos (debajo de la barra, scrim, Light local). A la izquierda, Catálogos y Descargas; a la derecha, el lugar de una foto grande. La referencia es una columna de links al costado y la foto a sangre. Los dos links son `arq-mega-link`, el mismo de Embutir y Colgante dentro de Interior: fila con línea inferior, fondo en hover y flecha. Arriba, el título Recursos en `role/heading-1`, el de Interior y Exterior.
- Descargas sigue en `/arq/descargas`. Catálogos apunta a `/arq/catalogos`: la página todavía no existe. Sin foto, el lugar queda en `color/surface/subtle` (slot `recursos-media`). En la página Descargas, Recursos va en `current`. En Mobile, Recursos entra a un submenú con volver y los dos links, sin la foto.
- El menú queda: Productos, Nosotros, Recursos, Contacto. El footer no cambia (sigue listando Descargas).
- TODO (diseño): no está en el set de Figma. El alto mínimo de la foto es `layout/mega-menu-image` en 4:5. El ancho es 2 × `layout/mega-menu-image` (si no entra, se achica) y la columna de links ocupa el resto (mínimo `layout/measure`; en Tablet, `layout/catalog-nav`). TODO (imagen): falta la foto del panel.

## 2026-10-21 · Catálogos

- Pedido: una página en `/arq/catalogos` (el link de Recursos) con el título «Catálogos 2026» y tapas de catálogo. La referencia es una grilla de portadas verticales, con el nombre debajo y dos acciones: ver y descargar. Por ahora, dos tapas.
- Sin pantalla en Final. El título es `page-header` Type=List, sin breadcrumb ni bajada, en `role/heading-1` (el de «Buscar archivos por producto» en Descargas, no el `role/display-lg` del título de página). Atributo de código `title-style="heading-1"`. Las tapas son `catalog-card` (componente nuevo, sin set): ratio/portrait, título `role/body` y dos links (ver en otra pestaña, descargar). En Desktop la grilla es de 4 columnas, así cada tapa queda del tamaño de una de cuatro y las que faltan no estiran las dos. En Mobile, dos columnas. Al pasar el mouse, la tapa y los botones de ver y descargar hacen zoom (`motion/scale/hover`) sin cambiar el tamaño de la card.
- Los nombres son provisorios: «Catálogo general 2026» y «Catálogo Skyline 2026» (la tapa dice Skyline). Las tapas son `tapa_catalogo.jpg` y `tapa_skyline.png`. Sin URL de PDF, ver y descargar se ven y no navegan.
- En la página, Recursos va en `current`. El footer no cambia.
- TODO (datos): URL de cada PDF y tapas definitivas. TODO (diseño): no hay set; `icon/eye` no está en el set de íconos.

## 2026-10-21 · Descargas sin hero

- Pedido: sacar el bloque de arriba de `/arq/descargas` (título «Descargas», bajada y el catálogo general con tapa y «Descargar catálogo»). Los catálogos están en `/arq/catalogos`.
- La página arranca en «Buscar archivos por producto» (`role/heading-1`), ahora el `<h1>`. Se fueron `catalog-href` y los slots `title`, `description`, `catalog-cover`, `catalog-title`, `catalog-description` y `catalog-action`.

## 2026-10-21 · Dropdowns del navbar con hover

- Pedido: Productos y Recursos se abren al pasar el mouse, no con el clic.
- En desktop con mouse (`hover: hover` y `pointer: fine`) el panel se abre al entrar al nav-link y se cierra al salir del link y del panel. El link ocupa el alto de la barra y el panel ya tiene su caja (aunque la persiana todavía se esté abriendo), así se puede bajar de la palabra y recorrer el menú. Esc y un clic afuera siguen cerrando. El foco del teclado también abre. El clic en el link no abre ni cierra.
- En Mobile sigue el submenú con clic. En una pantalla táctil de ancho desktop, el clic sigue abriendo el panel.

## 2026-10-21 · Títulos Interior y Exterior del mega-menú

- Pedido: Interior y Exterior son el link a esa categoría, con la línea de «Ver todo interior» al pasar el mouse. Esos botones del pie se van. La flecha diagonal se sacó después. Lámparas y Artefactos siguen con su «Ver todo…».
- Colecciones hace lo mismo: el título es el link a `/arq/productos?view=colecciones` y se va «Ver todas las colecciones». En mobile, el «Ver todo» del submenú sigue.

## 2026-10-21 · Sin flecha en los dropdowns del navbar

- Pedido: sacar el chevron hacia abajo de Productos y Recursos. En desktop el ítem queda solo con el nombre. En mobile sigue la flecha hacia la derecha, la que entra al submenú.

## 2026-10-21 · Orden del navbar

- Pedido: Nosotros va justo antes de Contacto. El menú queda Productos, Recursos, Nosotros, Contacto, en todas las páginas.

## 2026-10-21 · Cards de carga en los destacados del Home

- Pedido: el carrusel de productos de la Home usa el mismo skeleton que el listado de Productos.
- Mientras `getProductCards` no responde, `<arq-featured-products>` muestra una `product-card` con `loading` por cada link del HTML (misma geometría y shimmer; sin Comparar, porque los destacados no lo tienen). Las flechas siguen ocultas hasta que llegan las cards.
- Mismo tiempo de aparición que el listado: fundido de `motion/duration/fade` después de esperar lo mismo, así con el catálogo en caché no se ven. Si ya se veían, las cards ocupan su lugar sin la entrada al hacer scroll.
- «Cargando productos…» queda en un `role="status"` solo para lectores de pantalla. En la demo, `demo/home.html?data=loading` demora la respuesta igual que Productos.

## 2026-10-21 · Preloader: solo la vista

- Pedido: una pantalla de entrada para todas las páginas. Primero se define cómo se ve; todavía no cubre las páginas.
- Fondo blanco (Light local, también si la página está en Dark), el logo de Macroled ARQ (el dibujo de Size=Default, sin link) y una línea debajo, del mismo ancho, que se completa de izquierda a derecha con `scaleX`.
- `TODO` (diseño): no hay token para esa duración. Sin `page`, la línea de la demo usa `motion/duration/shimmer` (1600 ms). En las páginas lo reemplaza la decisión de abajo.

## 2026-10-21 · Preloader en todas las páginas

- Pedido: no mostrar la página hasta que estén cargadas las imágenes, los videos y los textos.
- Cada embed de `src/pages/` abre con `<arq-preloader open page>`. `dist/arq.css` pinta esa etiqueta en blanco antes de que el módulo se defina, así no se ve la página en el medio.
- La línea es la parte ya cargada. Se espera: imágenes (las `lazy` se piden igual, si no las de abajo no arrancan mientras la pantalla las tapa), videos hasta el primer frame, la fuente y los componentes con `aria-busy` (listado, destacados, ficha, colección, comparativa, descargas). Después funde con `motion/duration/fade`.
- Si un recurso no responde, a los 20 s se muestra la página igual. `TODO` (diseño): no hay token para ese tope.
- Hay que volver a pegar los embeds en Webflow.

## 2026-10-21 · Bajada por categoría en Productos

- Pedido: la bajada del page-header era siempre la misma. Ahora cambia con el grupo de la categoría: Interior, Exterior y Lámparas y artefactos (las subcategorías usan la de su grupo). Sin categoría queda la del HTML; Colecciones sigue sin bajada.
- Provisorio: el texto va en `data-arq-description` de cada `catalog-nav-group` del embed (`src/pages/productos.html`). `TODO` (datos): pasarlo a Typesense.

## 2026-10-21 · Filtros de Productos según los datos

- Pedido: los filtros no pueden ser una lista fija. Reemplaza «solo Potencia y Temperatura de color» (`filter: true` en `attributes.js`).
- Es filtro todo campo técnico de `src/data/attributes.js` con al menos dos valores en la categoría, en el orden de ese archivo. Un campo nuevo aparece solo.
- Excepción, `filter: false`: medidas y datos con casi un valor por producto o que no se eligen al buscar (Flujo luminoso, Eficiencia, SDCM, Vida útil, Factor de potencia, THD, Driver, EMC, Altura, Medidas, Largo de cable, Peso, Temperatura de operación, Garantía). Se descartó un tope de opciones: en una categoría chica Potencia tiene un valor por producto, igual que Flujo o Peso.
- Solo Productos (y Colecciones, que usa la misma función). Descargas sigue con `DOWNLOAD_FILTERS`.
- `TODO` (datos): las opciones muestran la base como está: «0,6 | 0.6», «Superficial | Superficie», «20 | IP20», «4 | IK06».

## 2026-10-21 · Búsqueda con errores de tipeo

- Pedido: "kani" no encontraba Kanu ni "dai" a Dao.
- Los tres buscadores (navbar, listado de Productos y Descargas) aceptan errores de tipeo con el criterio permisivo: 1 error en palabras de 3 a 5 letras y 2 desde 6; hasta 2 letras, tal cual. Un error es una letra cambiada, de más, de menos o dos vecinas invertidas. Se compara con el comienzo de cada palabra del texto, así funciona mientras se escribe (`src/data/text.js`).
- Los SKU no aceptan errores: un código parecido es otro producto.
- Los que coinciden tal cual van primero; después, los con errores de tipeo.
- A prueba: si aparecen demasiados resultados sin relación, pasar al criterio de Typesense (1 error desde 4 letras, 2 desde 8) cambiando `typosFor`.

## 2026-10-21 · Buscador: texto grande

- Pedido: lo que se escribe en el buscador pasaba desapercibido frente a los resultados.
- search-field suma Size: `large` en el search-sheet del navbar (lo escrito en `role/heading-3`, 24/32 · 20/28 en Mobile) y `medium` en Descargas (`role/body-xl`, 20/28 · 16/24). En Descargas, 24 competía con el título y la tabla: es una herramienta dentro de una página densa, no la pantalla entera.
- El placeholder va un peso menos que lo escrito, en Light (`role/heading-3-light` · `role/body-xl-light`, estilo nuevo). Bajar el color no servía: el siguiente gris es `color/text/disabled`, que no llega a AA y dice "deshabilitado".
- Show clear: con texto, una cruz a la derecha borra lo escrito, en los dos buscadores. Show icon: Descargas lleva la lupa, como el general.
- Se mantiene la diferencia: caja con borde en Descargas (un control más entre Filtros y las descargas de la tabla, todos con borde) y solo línea en el search-sheet (el campo es lo único en pantalla).
- compare-picker y la búsqueda `search="inline"` siguen en `role/body`. En Figma: Size, Show icon y Show clear en los sets search-field y search-field-line; estilo `role/body-xl-light`.

## 2026-10-21 · search-sheet: cruz y announcement-bar

- Al cerrar, la cruz del sheet quedaba encima de la lupa del navbar mientras la barra volvía a ser transparente. Ahora la lupa y la cruz se funden una con otra (`motion/duration/fast`) al abrir y al cerrar.
- Con announcement-bar a la vista, todo lo que se abre desde el navbar arranca en su barra, y announcement-bar queda visible y sin scrim: el mega-menu y Recursos (con su scrim), el top sheet (con su scrim) y el menú mobile. El navbar mide dónde está la barra al abrir (`--bar-top`; en el sheet, `--sheet-top`).

## 2026-10-21 · Navbar: cerrar al volver a la barra y transiciones

- Pedido: el mega-menu solo se cerraba sacando el mouse por abajo; el cambio entre Productos y Recursos y el hover de los links eran bruscos.
- Con el panel abierto, pasar por Nosotros, Contacto o la lupa (o el scrim) lo cierra. El logo y los espacios vacíos de la barra no: se pueden cruzar. Espera `motion/duration/base` antes de cerrar (con reduced motion, `fade`), así un roce no lo cierra. Referencia: samsung.com/ar (unos 200 ms).
- Sobre el scrim (la zona oscura debajo del panel) se escucha `pointermove` además de `pointerover`: al bajar del panel al scrim, Chrome no siempre emite `pointerover`. Si el mouse vuelve al panel antes de que pase la demora, sigue abierto.
- Al cerrar, el contenido se desvanece con la persiana (antes se ocultaba de golpe y se cerraba vacía).
- De Productos a Recursos (o al revés), como samsung.com/ar: el cambio espera `motion/duration/base` con el cursor encima (cruzar el link de pasada no lo cambia; con teclado, al instante); el contenido hace un fundido cruzado (`motion/duration/slow`) sobre el fondo fijo del drawer (antes cada panel traía su fondo y a mitad del fundido se veía el scrim), y el alto visible va del de uno al del otro con el recorte de la persiana (`clip-path`, `motion/duration/panel`), sin animar `height`.
- El search-sheet no se cierra al pasar por la barra (su barra tapa el nav y se perdería lo escrito): se cierra con la cruz, Esc o un clic en el scrim.
- Hover de nav-link: el subrayado se dibuja de izquierda a derecha y se va hacia la derecha (`transform`, `motion/duration/base`, `motion/easing/standard`). Con reduced motion, de golpe.

## 2026-10-21 · search-sheet: cruz para borrar

- Se probó «Borrar» (texto) en lugar de la cruz chica que borra lo escrito, porque queda debajo de la cruz que cierra el sheet. Por ahora queda la cruz chica (icon-button Default); se revisa con el equipo.

## 2026-10-21 · search-sheet: apertura, pie y recomendados

- Al abrir, la franja de arriba se veía gris contra el panel blanco: el scrim (::backdrop) cubría también la barra del navbar mientras la del sheet pasaba de transparente a sólida. Ahora el scrim arranca debajo de la barra, como el del mega-menu.
- «Ver todos los productos» lleva abajo space/padding/2xl, el mismo aire que los «Ver todo…» del mega-menu.
- La fila de recomendados va a sangre a la derecha: llega al borde de la pantalla y el margen (--page-gutter) aparece recién al final del scroll horizontal.
- Recomendados en ratio/landscape (5:4) en lugar de ratio/square, para que entren con ese aire sin achatar la imagen.
- «Ver todos los resultados para “…”» del sheet (search-see-all Type=Simple) va siempre en 14: role/body-compact-regular y el término en role/body-compact-medium (role/body-sm medía 12 y subía a 14 recién desde 1920 px). El search-dropdown sigue en role/body-sm.
- A prueba: el zoom de search-card en hover pasa de motion/scale/hover (1.05) a 1.1. TODO: si se confirma, token en Figma (subir motion/scale/hover para todas las tarjetas o uno nuevo solo para search-card).

## 2026-10-21 · Toggle Iluminar según la foto

- Pedido: que el toggle Iluminar de la ficha contraste con la foto que tiene debajo, clara u oscura.
- La ficha mide el brillo medio (luminancia relativa) de la parte de la foto que tapa el toggle, con el recorte de `object-fit: cover`. Sobre una foto clara va la versión de siempre (negra; `data-arq-theme="light"` en el toggle, aunque el hero esté en Dark). Sobre una foto oscura va toggle `theme="inverse"`, un blanco apagado (neutral/200: `color/icon/secondary` y `color/text/secondary` en Dark) y no el blanco pleno, para no llamar la atención. Decide la foto, con Iluminar prendido o apagado. El corte es L ≈ 0,16, donde neutral/900 y neutral/200 contrastan lo mismo.
- Se vuelve a medir al cambiar la foto (variante, miniatura o Iluminar) y el tamaño. La primera foto de cada variante, apagada y encendida, se mide por adelantado, así el toggle cambia junto con la foto.
- Las fotos vienen de `s3.coresagroup.com`, que no manda encabezados CORS: no se pueden leer sus píxeles. Se mide una copia de 128 px que sirve el CloudFront `d1zltvqju4u8ql.cloudfront.net/fit-in/128x128/<misma ruta>` con CORS (`config.images.sampleFrom` y `sampleBase`, `src/config.js`). Una foto de otro servidor no se mide (no deja errores en consola) y el toggle sigue el modo del hero.
- Theme=Inverse del toggle es solo de código: falta sumarlo al set de Figma.

## 2026-10-21 · Fondos con Iluminar

- Pedido: al iluminar la ficha, el fondo del botón «Generar ficha técnica» y de los option-tile saltaba.
- El fondo del hero funde en `motion/duration/illumination` con su curva, pero la hoja base de cada componente funde `background-color` en `motion/duration/fast`: el botón Filled pasaba a claro mientras el hero seguía claro. Ahora `animateThemeChange` (`src/base/theme.js`) pone `--arq-theme-surface-duration` y `--arq-theme-surface-easing` con la duración y la curva del fondo mientras dura el cambio, y la hoja base las usa para `background-color`. Al terminar se quitan, así el hover sigue rápido.

## 2026-10-21 · Acabado no disponible con opacidad

- Pedido: la línea diagonal del swatch Disabled casi no se veía.
- El swatch Disabled (ficha) y la muestra de select-option Disabled (comparativa) quedan en `opacity/disabled`, como el texto deshabilitado; sin la línea diagonal. Falta actualizar la variante State=Disabled del set swatch en Figma.

## 2026-10-21 · Configurador de la ficha

- Pedido: lo más importante del configurador es elegir el color y las demás características; la descripción es lo menos relevante y cambia con esa elección.
- **Orden:** encabezado (nombre, descripción y sku), opciones, Comparar y acciones. Entre el encabezado y las opciones, `space/gap/2xl` (antes `space/gap/4xl`, demasiado aire); entre características, `space/gap/xl-2xl` (antes `space/gap/lg`, quedaban pegadas).
- **Descripción:** debajo del nombre y arriba del sku, a `space/gap/sm` de los dos, en `role/body-compact` (14 px, Light) y `color/text/tertiary`, para que no compita; desde 1920 px (Wide) pasa a 16/24 con el mismo peso y color, como sku Dense. Se probó abajo, antes de Comparar, y arriba de las especificaciones: en los dos lugares quedaba suelta. Sigue cambiando con la variante; si no hay, no deja espacio.
- **Alto de la sección (desde 1024 px):** el hero mide el alto de la pantalla debajo del navbar (`100svh` − `layout/navbar-height`). La foto queda fija (`position: sticky`) y, si el configurador no entra, se desplaza con la página, sin barra de scroll propia. Con poco contenido, las acciones quedan abajo. En Tablet la ficha sigue apilada (la columna de info quedaría de unos 280 px).
- **Mobile y Tablet:** la foto va primero, a todo el ancho y pegada al navbar (en Mobile, en `ratio/portrait-soft` 4:5, para que se sienta vertical; en Tablet sigue 5:4); las miniaturas llevan el margen de página (`inset-thumbs` de product-gallery) y después vienen breadcrumb, nombre, sku y descripción.
- **Etiquetas de las opciones:** se quedan (sin ellas «2700K» o una fila de muestras no dicen qué se elige, y son el nombre del grupo para lectores de pantalla), en `color/text/tertiary` para que pesen menos. En Color, el acabado elegido va junto a la etiqueta («COLOR Negro», `role/body-sm` en `color/text/secondary`), porque la muestra no tiene texto.
- **option-tile sin caja:** el dato solo, sin padding lateral ni superior y sin fondo. La línea de abajo marca la elegida (`border/strong` en `color/border/strong`); las demás no tienen línea y en hover muestran una gris (`color/border/hover`). Entre opciones, `space/gap/lg`.
- **Swatches más grandes:** token nuevo `swatch/xl` = 32 (creado en Figma). En swatch-picker todas las muestras miden 32 y la elegida no crece. La elegida lleva un borde fino (`border/default` en `color/border/strong`) separado de la muestra por `space/padding/2xs`: el borde Selected de 2 px pegado a la muestra no se veía sobre el acabado negro. Size=XLarge del swatch es solo de código por ahora.
- **No disponible:** el color ya no se apaga (ver Característica madre). Una opción de texto que no existe con lo de arriba queda en `color/text/disabled`, sin tachado, y no se puede elegir. `opacity/disabled` bajó de 50 a 40 en Figma. Vale para el swatch y la muestra de select-option Disabled y para la miniatura de compare-picker-item Disabled.
- Falta en Figma: Size=XLarge en el set swatch, el swatch-picker con todas a 32, el option-tile sin caja y la ficha con el nuevo orden.

## 2026-10-21 · Característica madre

- Pedido: en productos como Tori Jardín (color, altura y potencia) cada opción se comparaba con todas las demás elegidas, se apagaba casi todo y no había forma de pasar a otras variantes. Un acabado apagado en tono pastel además invitaba a hacer clic, y el clic no hacía nada.
- **La característica madre** rige a las demás: el color si el grupo lo tiene (esté donde esté en `variant_attributes`); si no, la primera de `variant_attributes`. Va primera en el configurador y sus opciones nunca se apagan. Con una sola característica, esa es la madre.
- **Las demás** siguen el orden de `variant_attributes` y dependen solo de las de arriba: Altura según el color, Potencia según color y altura. Una opción que no forma un SKU con lo de arriba queda apagada y **no se puede elegir**.
- **Al elegir**, las de abajo se acomodan: queda el valor que tenían si existe con lo nuevo; si no, el del SKU predeterminado, o el primero que exista. La selección siempre es un SKU.
- Vale para la ficha y para los selects de la comparativa (`configuratorOrder`, `variantOptions` y `choose` de `src/data/variants.js`).
- **Actualiza 2026-10-27 · Potencia segunda:** si el grupo declara `potencia` en `variant_attributes`, va segunda en el configurador (después de la madre) y no en el lugar que tenga en la hoja. Los demás siguen el orden de la hoja. Si no la declara, no se agrega.

## 2026-10-21 · Breadcrumb sobre la foto

- Pedido: el breadcrumb flota sobre la foto, como las miniaturas y el toggle Iluminar, en Desktop y en Mobile.
- Va arriba a la izquierda de la foto: en Desktop a `space/padding/xl` del borde de arriba y `space/padding/xl-2xl` del izquierdo (alineado con las miniaturas); en Mobile y Tablet a `space/padding/md`, como el toggle.
- Contraste: igual que el toggle, la ficha mide el brillo de la foto debajo del breadcrumb. Foto clara: `data-arq-theme="light"`; foto oscura: `data-arq-theme="dark"`. Los links y el separador van en `color/text/secondary` (breadcrumb-item `theme="transparent"`, solo de código), porque `color/text/tertiary` no llega a 4,5:1 sobre una foto de tono medio.
- **A tiempo con Iluminar:** el ítem actual del breadcrumb toma el color en su contenedor (que funde), no en la etiqueta (sin transición: cambiaba de golpe y los niveles anteriores parecían ir a destiempo). Breadcrumb y toggle cambian de modo en el mismo instante que el hero, con la medición de la foto nueva (las copias de la versión apagada y encendida se precargan), no cuando termina de cargar. El fondo del navbar funde con la misma duración y curva que el hero (`--arq-illumination-bg-*`, `animateThemeChange` de `src/base/theme.js`); antes usaba 1200 ms y una curva propia y se apagaba a destiempo.

## 2026-10-21 · Hover del configurador y secciones de la ficha

- **Hover de los acabados:** el mismo borde separado de la muestra elegida (`border/default`, separado `space/padding/2xs`), en `color/border/hover`, menos intenso que el `color/border/strong` de la elegida. El borde está siempre reservado (transparente) y funde en `motion/duration/base` con `motion/easing/standard`, así pasar de una muestra a otra es suave. Con reduced motion, el cambio es instantáneo.
- **Opciones de texto (option-tile):** la línea y el texto funden igual, en `motion/duration/base`; con Iluminar siguen la duración del texto de la página.
- **Secciones:** «Materiales y dimensiones» e «Instalación y protección» quedan en una sola, **«Materiales e instalación»** (grado de protección, resistencia al impacto, montaje y temperatura de operación pasan ahí). Vale para el acordeón de la ficha, los grupos de la comparativa y la ficha técnica en PDF (`SECTIONS` de `src/data/attributes.js`).

## 2026-10-21 · Barra de newsletter en Nosotros

- Pedido: la misma línea de arriba que la Home, con «Suscribite al newsletter».
- `<arq-announcement-bar>` va antes del navbar en `src/pages/nosotros.html`. El link sigue a `/arq#newsletter`. Al hacer scroll se va y el navbar queda pegado arriba, como en la Home.
- Reemplaza «solo en la Home» (2026-10-19) para esta página. El resto de las páginas sigue sin la barra.

## 2026-10-21 · Barra de newsletter en Catálogos

- Pedido: la misma línea de arriba que la Home, con «Suscribite al newsletter».
- `<arq-announcement-bar>` va antes del navbar en `src/pages/catalogos.html`. El link sigue a `/arq#newsletter`.

## 2026-10-21 · Preguntas del FAQ más chicas

- Pedido: el texto de los desplegables de preguntas frecuentes un poco más chico.
- Sin `number`, la pregunta pasa de `role/heading-3-light` (24 px) a `role/body-xl` (20 px). La respuesta sigue en `role/body`. Con `number`, la pregunta sigue en `role/heading-3`.
- Figma y DESIGN.md siguen en `role/heading-3-light`. Falta corregir el set y la ficha `doc/faq-item`.

## 2026-10-21 · Margen del FAQ en la Home

- Pedido: en responsive, el padding izquierdo y derecho de las preguntas frecuentes no seguía al resto de la página.
- `layout="split"` usa `--page-gutter` a los lados en todos los anchos (newsletter y footer), en vez de `space/padding/4xl` y, en mobile, `space/padding/sm`.
- Las dos columnas arrancan en 1024. Hasta ahí el bloque se apila: la columna de `layout/measure-wide` (520) más el hueco se comía el margen y las preguntas quedaban sin ancho.

## 2026-10-22 · «Borrar todo» de los filtros se aplica en el momento

- Pedido: en los paneles de filtros (filter-panel: Productos, Colecciones, ficha y Descargas), «Borrar todo» no se aplicaba hasta tocar «Ver N». Ahora desmarca todo y lo aplica en el momento (`arq:apply`): el listado o la tabla se actualizan sin cerrar el panel.
- Cerrar después con la X, el scrim o Esc ya no restaura lo borrado. Lo que se marque después de borrar sigue la regla de 2026-10-02: se aplica con «Ver N» y cerrar lo descarta.

## 2026-10-22 · Filtros que no aplican

- Pedido: en Descargas, con una búsqueda el panel mostraba todo el catálogo y apagaba casi todo (buscando «kanu»: 59 de 72 opciones grises, mezcladas con las que sirven). Se veía roto y obligaba a recorrer opciones que no sirven.
- **Las opciones que no darían resultados se ocultan**, no se apagan: las que no existen en lo que se está viendo (la búsqueda en variants-table; la categoría y la búsqueda en Productos y Colecciones) y las que dejarían «Ver 0» con lo marcado. Se recalcula con cada opción que se marca o desmarca, así que la lista se acomoda mientras se elige (se eligió así frente a dejarlas apagadas, separadas abajo o plegadas).
- Lo marcado queda siempre a la vista, para poder desmarcarlo. Un filtro que se queda con una sola opción visible (sin marcar) no filtra nada y se oculta entero.
- Una opción sirve si alguna variante tiene ese valor y cumple los filtros de los otros campos (dentro del mismo campo los valores se suman).
- Código: `showAvailable(isAvailable)` de filter-panel oculta opciones y filas; variants-table lo llama con `filterOptions` (`src/data/variants.js`) y catalog-listing con `available`, que devuelven `listProducts` y `listCollections` (`src/data/catalog.js`).

## 2026-10-22 · Cantidad por opción en los filtros

- Pedido: mostrar al lado de cada opción de filtro cuántos resultados da, como el catálogo de Macroled (macroled.com.ar/productos).
- **checkbox** suma en Figma (975:2322) **Show count** (en `false` por defecto, así no cambian las instancias que ya había) y **Count**. En código, atributo `count` (el número, con separador de miles).
- **Cómo se ve:** el número sin paréntesis, al borde derecho (space between: en Figma caja y label van en `content` y el número al otro extremo), en el mismo estilo de texto que el label y `color/text/tertiary` (Disabled `color/text/disabled`), con cifras de ancho fijo. Las opciones de filter-row ocupan todo el ancho (Fill), así las cantidades forman una columna que termina donde el −/+ (padding derecho `space/padding/xs`). Se eligió frente a «Negro (24)»: repite la alineación de spec-row y del −/+, se compara de un vistazo y no se mezcla con valores numéricos («12W (4)»). Con un label de varias líneas, el número queda a la altura de la primera.
- **Hover de toda la opción:** como la fila entera es clickeable, reacciona entera (también sobre el número): label `color/text/primary`, número `color/text/secondary`, caja con borde `border/strong`. Fundido de color `motion/duration/fast` con `motion/easing/standard` (0 con reduced motion), solo con mouse. En filter-row suma un fondo tenue `color/surface/faint` en toda la opción, que se asoma `space/padding/sm-md` a los lados y `space/padding/xs` arriba y abajo (el gap entre opciones baja lo mismo: la distancia entre opciones no cambia); el cuerpo de filter-panel deja ese lugar a la izquierda para que el scroll no lo corte. No va en opciones Disabled ni en el «Comparar» de las tarjetas.
- **Barra de scroll del panel:** el cuerpo de filter-panel llega al borde derecho y devuelve el margen como padding, así la barra queda en el borde del panel, a `space/padding/xl-2xl` (Mobile `layout/gutter`) del contenido, que sigue alineado con el título y el footer.
- **Qué cuenta:** lo que daría «Ver N» si se marcara esa opción con lo demás marcado (en el mismo filtro, como si fuera la única elegida ahí). Productos: productos (cards); Colecciones: colecciones; variants-table (ficha y Descargas): variantes, con la búsqueda. Una opción en 0 se oculta (ver Filtros que no aplican). Lo marcado sin resultados queda a la vista, sin número.

## 2026-10-22 · Galería de ambiente, Recomendados y scrim

- Ambiente de la ficha: avance automático con el patrón de Destacados (una foto cada `motion/duration/feedback × 1.5`, 3 s, scroll suave y vuelta al inicio). Pausa al interactuar, con foco, fuera de vista, pestaña oculta, visor abierto y movimiento reducido.
- El cursor de flechas se reemplaza por grab/grabbing. Arrastrar desplaza; clic o Enter/Espacio sobre una foto abre un visor completo como el de FOA, compartiendo plantilla y estilos. Los controles táctiles usan chevrons. El visor admite ←/→, Esc, botón de cierre y devuelve el foco a la foto.
- Recomendados del buscador: arq-carousel-button con chevrons y el estilo original del componente, superpuesto a ambos lados y centrado en las imágenes. Aparecen al hacer hover sobre la sección o con foco de teclado. Cada dirección solo aparece si queda contenido por recorrer de ese lado; si todo cabe, no hay botones. Un clic avanza una tarjeta. Sin arrastre con mouse; en táctil sigue el desplazamiento nativo.
- El usuario eligió elevar el scrim del 60 al 80 % en todos los modales y paneles. En Figma se creó `alpha/black-80` y `color/overlay/scrim` apunta a ese primitivo en Light y Dark. Se exportaron las colecciones afectadas y se regeneraron los tokens.
- El mosaico de Colección está en la ficha individual de una colección, debajo del bloque de texto e imagen. No se modificaron sus controles en esta tarea.

## 2026-10-22 · Opacidad diferenciada de paneles y galerías

- Reemplaza la elección anterior del 80 % compartido: menú desplegable, panel de filtros, modal de descargas, buscador general y selector de comparación usan negro al 70 % (`color/overlay/scrim` → `alpha/black-70`).
- Las galerías ampliadas de FOA y de la ficha usan negro al 90 % (`color/overlay/scrim-gallery` → `alpha/black-90`). El visor de project-mosaic usa el mismo token de galería.
- Ambos tokens tienen los mismos valores en Light y Dark. Se actualizaron en Figma, se exportaron las colecciones afectadas y se regeneraron los archivos de tokens.

## 2026-10-22 · Recomendados del buscador: salto por tarjeta

- Pedido de Gabriela, con capturas de referencia (Occhio). El salto de los chevrons cortaba la tarjeta; ahora es de a una (`scroll-snap-type: x mandatory` y botones) y la última card (`scroll-snap-align: end`) termina contra el margen derecho.
- Tarjetas siempre `ratio/square`, con `space/gap/lg` (`space/gap/md` en Mobile). Entran enteras 4 (5 desde 1600 px, 3 en Tablet, 2 en Mobile) y la siguiente asoma cortada en el margen (`--peek`, media tarjeta) para mostrar que hay scroll. Si todas entran (`data-scroll="false"`), reparten el ancho y no asoma nada.
- Laptops y pantallas bajas: en vez de achatar la imagen (antes `--card-ratio`, que quedaba rectangular y muy grande), `search-sheet.js` suma columnas hasta que el panel entra sin scroll; las tarjetas se achican y siguen cuadradas.
- carousel-button gana la prop `background`: `outline` (por defecto, fondos lisos) y `frosted` (sobre fotos y capas con transparencia). El Disabled de `outline` pasa a sin relleno (antes `color/surface/subtle`, que parecía un botón relleno).
- Frosted: blanco al 60 % (`color/overlay/frosted` → `alpha/white-60`), blur suave (`blur/backdrop-soft` → `blur/4`; no se toca `blur/backdrop` del navbar), borde fino `color/border/subtle` y chevron en `icon/xl` (24). Probado primero una variante `translucent` (negro al 10 %, `color/overlay/translucent`): no se notaba sobre fotos y se descartó. Todos los tokens nuevos se crearon en Figma y se exportaron.
- Uso: Recomendados del buscador, donde los botones aparecen solo al pasar el mouse sobre la fila (o con foco de teclado). Para el hero y las galerías de la ficha se prevé una versión con menos opacidad y más minimalista; no está en uso ahí. `TODO`: dentro de un contenedor Dark el chevron (`color/icon/primary`) pasa a claro y se pierde sobre el blanco; resolverlo entonces.

## 2026-10-22 · Ficha: información técnica en pestañas

- Pedido de Gabriela. La información técnica de la ficha pasa a dos pestañas con el mismo `arq-tab` del mega-menu (separación `space/gap/xl`, línea `border/default` en `color/border/subtle`): **Especificaciones** (acordeón con Características lumínicas, Características eléctricas y Materiales e instalación) e **Información comercial** (su lista de datos, sin acordeón: el título ya es la pestaña).
- Al cambiar de variante queda la pestaña elegida. Si una variante no trae datos comerciales, la pestaña no aparece (y con una sola, no se muestra la barra).
- Figma al día (2026-10-22): las cuatro Fichas de Final (Desktop, Mobile e Iluminar) llevan el frame `info-tecnica` (tabs + acordeón), con el acordeón abierto según el breakpoint; `doc/tab`, `doc/accordion-item` y la descripción del set tab suman este uso. `TODO` (diseño): falta dibujar la pestaña Información comercial seleccionada.
- Abiertas por defecto: en Desktop las tres secciones de Especificaciones; en Mobile (hasta 767 px) solo Características lumínicas. Se decide la primera vez que se arma; al cambiar de variante quedan como las dejó la persona.

## 2026-10-22 · Ficha: descripción en minúscula y Iluminar del breadcrumb

- La descripción de la variante (debajo del nombre) se muestra en minúscula con la primera letra en mayúscula (`text-transform: lowercase` + `::first-letter` en mayúscula); el dato no se modifica.
- Breadcrumb y toggle Iluminar van sobre la foto, pero su color funía con el texto de la página (retraso del 25 % y 50 % de duración), cuando la foto ya había empezado a cambiar. Ahora, al iluminar, funden con la foto: sin retraso y con `--arq-illumination-image-duration` y `-easing`. Las variables se ponen en los dos elementos y se quitan a los 1,2 s (hover y foco no se retrasan).

## 2026-10-23 · Colecciones sin Iluminar

- Pedido de Gabriela. «Todas las colecciones» (`?view=colecciones`) no tiene el toggle Iluminar: `catalog-listing` apaga `show-iluminar` del toolbar cuando `unit` es `colecciones`. Si el listado venía iluminado de Productos (cambio de vista sin recarga), vuelve a Light.
- DESIGN.md (§2 · Iluminar, footer y catalog-toolbar) y el README de catalog-toolbar al día. `TODO` (Figma): quitar Iluminar del frame de Colecciones y de la ficha de catalog-toolbar, y actualizar la copia de DESIGN.md en Plan del proyecto.

## 2026-10-23 · Revisión de accesibilidad y diseño

- Auditoría de todo el sitio (accesibilidad WCAG 2.1 AA y reglas de DESIGN.md). Se corrigió lo de accesibilidad y diseño; lo propio del código (webhook de n8n, timeouts de `fetch`, tamaño del bundle, `esc()` duplicado) queda para otra tarea.
- **Avisos de estado:** las regiones `role="status"` (Colección, Comparativa, Descargas, ficha, form-message, preloader) están siempre en la página y vacías; solo cambia el texto (DESIGN §9). Al enviar el formulario con errores, el foco va al primer campo y los demás no se anuncian a la vez (`setError(…, { announce: false })` de input).
- **Buscador:** search-field es un combobox (`combobox`, `expanded`) y anuncia «N resultados», «sin resultados» o el error (`status`). search-dropdown y search-sheet suman el estado de error («No se pudo completar la búsqueda.»); compare-picker, «No se pudieron cargar los productos.» con «Reintentar». El foco de search-field se marca solo con el borde, como el set: se probó el anillo separado de DESIGN §7 y quedaba mal sobre la caja y la línea.
- **Mega-menú con teclado:** Enter o Espacio lo abren y el foco queda en el link; Tab o ↓ entran al panel; al salir con Tab se cierra. Se probó llevar el foco al panel al abrir con Enter y se descartó: el anillo aparecía de entrada.
- **«Saltar al contenido»:** se probó en el navbar y se descartó.
- **Foco:** se probaron 1 px gris y 1 px oscuro; queda el de DESIGN §7 (2 px en `color/border/focus`, a 2 px).
- **Carruseles** (project-slider, featured-products, galería de ambiente): el autoplay se detiene con el mouse encima o con el foco adentro. `TODO` (diseño): botón de pausa (WCAG 2.2.2); no hay ícono de pausa en el set.
- **Hover:** search-result y search-collection ya no cambian el peso (DESIGN §6). Todo `:hover` va dentro de `@media (hover: hover) and (pointer: fine)`. category-card (overlay), collection-tile y search-sheet dejan de animar el alto: la bajada sube con `transform` y la persiana usa `clip-path`.
- **Otros:** «Comparar» de product-card con el nombre del producto (texto oculto); accordion-item con encabezado accesible (`heading-level`, 3 por defecto); listbox de select-menu con nombre; menú Mobile con nombre; preloader sin `inert` en sus ancestros; `alt=""` en las fotos de Colecciones de la Home; `forced-colors` en checkbox, toggle y swatch; «Lámparas y artefactos» en el footer; vacío de búsqueda «No encontramos productos para «q».» (texto de compare-picker en Figma).
- **Pendientes de diseño:** swatches de las cards de 16 px (mínimo 24 px), borde de los campos por debajo de 3:1 (`color/border/default`), tokens para el degradado de las cards, la duración larga y la opacidad de collection-tile, y confirmar «Explora / Explorá la colección».

## 2026-10-23 · Impresión de la comparativa

- «Descargar comparación» sigue siendo `window.print()`. Para que el PDF no lleve fecha, título de la pestaña, URL ni número de página, el embed de `src/pages/comparativa.html` declara `@page { margin: 0 }`: sin margen de hoja, Chrome, Edge y Firefox no imprimen esos textos (no hay forma de apagar la opción del diálogo por código). Es una excepción a «nada global» (AGENTS.md), aprobada por Lau: va solo en esta página, no en `dist/arq.css`, y solo afecta la impresión. Safari puede seguir mostrándolos; ahí se quitan desmarcando «Encabezados y pies de página».
- Tamaño de hoja: el que elija quien imprime (A4 si es el de su sistema o su impresora). Se probó `size: A4` y se descartó: fija la hoja y el diálogo de Chrome deja de ofrecer otros tamaños. Probado en A4 y Carta: 3 productos entran en 2 hojas.
- El margen lo ponen los componentes: `--page-gutter` vale `space/padding/2xl` al imprimir (`ArqElement`) y `arq-comparativa` suma ese aire arriba y abajo de cada hoja (`box-decoration-break: clone`).
- Encabezado de la hoja: «Comparativa de productos» en role/heading-3, de la altura del logo (slot `print-title` de page-header; en pantalla sigue «Comparar productos») a `--page-gutter` del borde, con el logo a la derecha centrado en la línea del título (navbar, `position: absolute`).
- Ritmo al imprimir: productos a `space/padding/2xl` del título; tabla a `space/gap/xl` de los productos (el aire del título del grupo).
- compare-table al imprimir: filas a `space/padding/sm`, grupos a `space/gap/xl`, sin el `space/section/xl` del final (sumaba una hoja en blanco) y la última fila de un grupo no pasa sola de hoja. Se corrigió una celda vacía que se imprimía debajo de cada etiqueta. compare-header ya no se sale de la hoja y las fotos de compare-product miden como mucho `layout/compare-column`.
- `TODO` (diseño): sigue faltando el diseño del PDF de la comparación (DESIGN.md §12); estas medidas son provisorias.

## 2026-10-23 · Productos agrupados por grupo_variantes

- Pedido de Gabriela. Productos que solo cambian en algo visual (Daö Simple, Doble…) eran una card por `product_name`. Ahora el grupo son las filas con el mismo `grupo_variantes` (el SKU cortado que comparten las variantes). Una fila sin `grupo_variantes` se agrupa por nombre, como antes.
- Resultado en Daö: 4 cards (Daö, Mini Daö, Daö Trimless, Mini Daö Trimless); la entrada siguiente (Modelos de un producto) las une un nivel más. En la ficha se eligen Color y Módulos (campo `modulos`, nuevo en `attributes.js`).
- **Nombre del grupo:** las palabras que comparten al principio los `product_name` de sus filas, sin importar tildes ni mayúsculas («Daö Simple» y «Daö Doble» → «Daö»). Con un solo nombre, ese. Cada variante conserva su `product_name` (`variant.name`).
- **id y URL:** el slug del nombre del grupo (`dao`, `mini-dao`, `dao-trimless`). Cambian los de Dao con varios nombres (`dao-simple`, `dao-doble`…); los demás quedan igual. El CMS de Webflow necesita un ítem por grupo con ese slug. `TODO` (Webflow): cargar los ítems nuevos y dar de baja los viejos.
- **SKU predeterminado:** el marcado con `is_group_default`; con varios marcados (la base marca uno por nombre), el de SKU menor (`X1` antes que `X2`, o sea «Simple»). Lo ideal es marcar uno solo por `grupo_variantes`.
- **Card:** al elegir otro acabado se mantiene lo demás de la variante (Doble negro → Doble blanco, no Simple).
- **Buscador:** un resultado por grupo; si lo escrito coincide con el nombre de una variante («dao doble») o con un SKU, el resultado lleva a esa variante (`?sku=`) y muestra su nombre. Comparativa, ficha técnica y Descargas muestran el nombre de la variante («Daö Doble») cuando el grupo reúne varios.
- **Ficha:** el título (h1 del CMS) y la última migaja del breadcrumb pasan al nombre de la variante elegida cuando el grupo reúne varios product_name («Daö Doble»); el detalle se pide por lista de SKU (antes por `product_name`), porque un grupo reúne varios nombres.
- Skyline sigue la misma regla cuando vuelva a la hoja (v2); necesita `variant_attributes` y un campo de largo para los rieles. Docs de gobierno (AGENTS.md, DESIGN.md y `docs/urls.md`) actualizados el 2026-10-23; queda la copia en Figma.

## 2026-10-23 · Modelos de un producto (Daö y Mini Daö)

- Pedido de Gabriela, tras comparar dos versiones en la demo. Daö y Mini Daö son un solo producto con dos modelos (Estándar · Mini): cada modelo tiene su propio `grupo_variantes` (`DAO-E` y `DAO-MINI-E`), y ahora se unen en una sola card y una sola ficha, con el selector **Modelo** además de Color y Módulos. En Interior · Embutir pasa de 9 a 6 cards de Dao (Daö, Daö Trimless, Daö Cabezal, Pinhole, Cabezal Direccionable, Deepframe).
- **Por código, por ahora.** `src/data/models.js` (único archivo de reglas, como `finishes.js`) une los grupos `DAO-MINI-X` con `DAO-X` y completa `grupo_producto` y `modelo` («Estándar» o «Mini»; no «Simple», que ya es un nombre de módulos). Solo Daö tiene esta cualidad en el catálogo. Cuando otro producto la necesite, la hoja gana las columnas `grupo_producto` y `modelo`: el adaptador ya las lee y una fila que las trae no se toca. Los SKU no siguen una regla común (Kai usa `KAI-M-` y `KAI-MR-`, Tori `TORI-M-J-`), por eso no se deduce de ellos más allá de esta regla explícita.
- **Dos reglas de seguridad:** solo se unen dos grupos que existen los dos (un `DAO-E-PH` sin Mini no recibe «Modelo») y no se unen grupos de distinta macrofamilia o subfamilia (Aplicar y Embutir son categorías de navegación; el producto se listaría solo en una). Si pasa, avisa en consola.
- **Nombre del grupo:** las palabras del nombre del predeterminado que están en todos los `product_name` («Daö Trimless Doble» y «Mini Daö Trimless Triple» → «Daö Trimless»). **Predeterminado:** de los SKU marcados con `is_group_default`, el más corto y, a igual largo, el menor (`DAO-T-X1-N` antes que `DAO-MINI-T-X1-N`). Lo ideal es marcar uno solo por producto en la hoja.
- **Ficha:** el título y el breadcrumb siguen al nombre de la variante elegida («Mini Daö Trimless Doble»). El resumen de la card de colección no incluye «Modelo» (`summary: false` en `attributes.js`); sí «1 – 3 módulos».
- **URLs:** desaparecen los slugs `mini-dao`, `mini-dao-trimless` y `mini-dao-cabezal` (y los de la entrada anterior: `dao-simple`, `dao-doble`…). Quedan `dao`, `dao-trimless` y `dao-cabezal`. `TODO` (Webflow): un ítem del CMS por producto con esos slugs.
- `TODO` (diseño): mostrar la dimensión (`dimensiones`, texto libre) debajo de la opción elegida del selector, para ubicar qué es el Mini. Hoy `dimensiones` no se usa en ningún lado.
- `TODO` (n8n, opcional): aviso de posibles uniones («¿conviene unir estos grupos?») para cuando lleguen productos nuevos.

## 2026-10-23 · Qué se lista: is_group_default; product_type vacío es Luminaria

- Al cargar la nueva estructura de Dao con `grupo_variantes`, `tipo_producto` quedó vacío en sus 35 SKU y el listado de Productos dejó de mostrarlos: exigía `product_type = Luminaria`. Había 108 filas de la hoja sin tipo.
- Pedido de Gabriela: la columna ya no tiene que separar las cards de colección (esa vista se sacó), así que **qué se lista lo decide `is_group_default`**: un producto con SKU predeterminado marcado se lista; sin marca, no. Ya era así (`hasDefault`).
- **`product_type` vacío = Luminaria** (`DEFAULT_TYPE` en `typesense-adapter.js`). La columna se completa solo en lo que no es luminaria: Lámpara, Artefacto y Accesorio. Esos siguen sin entrar al listado general (se ven en su categoría) y los accesorios fuera de las colecciones. «Colección» sigue marcando las filas `col-…`.
- Costo: una lámpara sin tipo aparece en el listado general en vez de en su categoría. Es un error visible y fácil de corregir en la hoja.
- `TODO` (n8n, opcional): aviso `sinTipoProducto` en el nodo de limpieza.

## 2026-10-23 · Sin vista «Todas las colecciones»

- Pedido de Gabriela. Se saca la vista `/arq/productos?view=colecciones` (una card por colección): en la v1 no hay fotos de colección (el equipo industrial no las puede producir), así que mostraba básicamente lo mismo que elegir la colección desde la navegación. Las páginas de cada colección (`/arq/coleccion/<id>`) siguen.
- **Los links de «Colecciones» abren el mega-menu en su pestaña.** Footer, botones «Explorar colecciones» y «Ver todo» del Home, y el nivel «Colecciones» del breadcrumb de la ficha y de la colección llevan `data-arq-menu="colecciones"` (con `href="/arq/productos"` de respaldo): `arq-navbar` abre el menú de Productos directo en esa pestaña, en Desktop, y el submenú Colecciones, en Mobile. Con Ctrl, Cmd o Mayús, o clic del medio, el link navega a su `href`. En el menú, el título «Colecciones» ya no es un link y se va el «Ver todo» de Mobile.
- **Las colecciones del mega-menu (y del submenú Mobile) llevan a la navegación de productos de la colección** (`/arq/productos?collection=<id>`, como el sidebar), no a su página: en la v1 la página mostraba básicamente lo mismo, y el listado suma filtros, Comparar e Iluminar. Los links «Ver colección X» de la ficha, las colecciones de la Home (collection-index, line-card, feature-block) y los resultados de colección del buscador también (antes, a la página). La página de cada colección (`/arq/coleccion/<id>`) sigue existiendo pero ya no tiene links entrantes: se retoma cuando haya fotos y textos propios.
- **Buscador:** las colecciones tienen su propio límite (`collectionLimit`, 3), aparte del de productos (5). Antes un solo límite de 5 cortaba la lista y, con muchos productos que coinciden («dao»: 6), la colección quedaba afuera; «kanu» (2 productos) sí la mostraba.
- **Breadcrumb y título:** el nivel con el nombre de la colección en el breadcrumb de la ficha lleva a `/arq/productos?collection=<id>` (antes, a su página). En el listado de una colección (`?collection=<id>`) el `<h1>` es el nombre de la colección («Daö») y el breadcrumb queda «Inicio / Colecciones / Daö», con «Colecciones» abriendo el mega-menu en su pestaña. Arreglo: al sacar «Todas las colecciones», el primer ítem del grupo Colecciones (Daö) se tomaba como la vista completa del grupo y el título quedaba «Colecciones»; ese grupo ya no tiene vista completa.
- Se quitan `listCollections` y lo que solo usaba esa vista, la prop `unit="colecciones"` de catalog-listing, catalog-toolbar y filter-panel, y el ítem «Todas las colecciones» del catalog-nav. Una URL vieja con `?view=colecciones` muestra el listado de Productos.
- **Cómo retomarla:** `docs/archivo/todas-las-colecciones.md` (qué era, qué se quitó, la última versión con la vista: commit `da4962f`, y cómo recuperarla con git). Sin código comentado en el proyecto.
- Docs de gobierno: AGENTS.md y DESIGN.md al día (2026-10-23). `TODO` (Figma): la copia de AGENTS.md y DESIGN.md en Plan del proyecto y las menciones de «Todas las colecciones» en la ficha de Figma y en `docs/components.md` (compare-bar).

## 2026-10-23 · compare-bar sticky

- Pedido de Lau: el espacio que el listado reservaba abajo (`.compare-space`, del alto de la barra) quedaba entre la grilla y el footer y no servía: al final de la página la barra igual tapaba el pie del footer, y en Mobile, con la lista abierta, el hueco era enorme.
- La compare-bar pasa de `position: fixed` a `position: sticky; bottom: 0`, como macroled.com.ar/productos: queda pegada al borde de la pantalla mientras se recorre el contenedor y, al final, se apoya sobre el footer. Sin espacio reservado (se quitan `.compare-space` y `#syncSpace` de catalog-listing).
- Va al final de su contenedor y a todo su ancho: en catalog-listing el padding de página pasa de `:host` a `.layout`, así la barra llega de borde a borde y queda pegada al footer. En ficha-producto ya era el último elemento.
- Si aparece con la página al final, la barra ocupa su lugar y el footer baja lo que mide la barra.
- El fondo debajo de la barra al plegar (`.bar::after`) se muestra solo mientras se desliza (`.sliding`): apoyada sobre el footer, lo taparía.
- **Mobile:** «Borrar todo» pasa de junto al título a debajo de «Comparar», centrado, a `space/gap/md`: por debajo de 375 px no entraba bien. `TODO` (diseño): pasarlo al set Mobile.
- **Plegada (Open=False):** queda solo el título con el chevron; «Borrar todo» y «Comparar» se ocultan con la lista (antes, en Desktop, iban en la misma línea). `TODO` (diseño): pasarlo al set.

## 2026-10-23 · Sin «Suscribite» arriba del menú

- Pedido: sacar la parte de suscribirse del menú.
- Se quitó `<arq-announcement-bar>` de la Home, Nosotros y Catálogos. El bloque de newsletter de la Home sigue. El componente queda en la demo.

## 2026-10-23 · Ficha Daö: pestaña Configurador

- Pedido: en las pestañas de la ficha (Especificaciones · Información comercial) sumar «Configurador», con el armado del demo `arq_nosotros/dao_config` (aro, módulos, terminación, cabezal, lámpara y frente).
- Solo en los productos de la colección Daö. Los datos salen de Typesense (`src/data/dao-config.js`), no del CSV del demo. «Ver ficha» abre la ficha del SKU cuando el catálogo tiene ese grupo.
- La pieza de la ficha abre elegida. En un cabezal (`DAO-C-B`) ese cabezal queda seleccionado y el aro, los módulos y el color son unos compatibles con él. Igual con una lámpara o un frente. Al cambiar de variante en la ficha, el configurador vuelve a esa pieza.
- Frente: solo si la lámpara elegida trae `frentes_compatibles`. En `PAR11-C-5W-DIM-36G-WW` son `PAR11-C-FRENTE-B` y `PAR11-C-FRENTE-N`. Se eligen; abre el del color del aro.
- Bornera y panal no se muestran: no tienen SKU en la base. `TODO` (diseño): la pestaña no está en Final.

## 2026-10-23 · Ficha técnica: una hoja menos

- Diseño nuevo (Figma `2940:27279`, pasado a componentes en «11 · Ficha PDF», `1907:8278`). Sin portada: la hoja 1 (pdf-page Type=Primera) lleva arriba pdf-cover y las especificaciones empiezan en la misma hoja. Con los datos reales, una hoja menos.
- **pdf-cover:** foto cuadrada de `layout/pdf-cover-image` (200, token nuevo) y, al lado, nombre (`role/display`), SKU (`role/body-lg`) y los datos clave abajo, alineados con el pie de la foto. Si el nombre ocupa muchas líneas, el bloque crece.
- **Foto entera** (contain) sobre `color/surface/subtle`: las fotos son 7:10 y, recortadas a un cuadrado, perdían arriba y abajo del producto.
- **Datos clave** (pdf-key-data, hasta 4 pdf-key-item): cambian según el producto. `KEY_DATA` en `src/data/attributes.js`, en orden: Potencia, Flujo, Protección (solo desde IP44, como «IP65»: IP20 es el de interior y no dice nada), Temperatura, CRI, Ángulo. Se muestran los primeros cuatro que el SKU tiene cargados; sin ninguno, la fila no se muestra. La protección va antes que la temperatura porque en Arq casi todo es 2700K.
- **Encabezado:** pdf-header pasa a set. Type=Default en la hoja 1: «Ficha técnica». Type=Product desde la hoja 2: el nombre (`role/body-sm-medium`) sobre el SKU (`role/body-sm`), alineados a la derecha y sin «Ficha técnica», para que una hoja suelta diga de qué producto es. Es más alto que el de la hoja 1: el margen de la hoja sale de él y pdf-cover sube lo que sobra (pdfmake no deja un margen por hoja).
- **Pie:** sin aviso legal ni «Macroled Arq», solo el paginado.
- Títulos de sección en `role/body-xl` y en caja normal (antes `role/label` en mayúsculas).
- **Foto por el CloudFront:** S3 (`s3.coresagroup.com`) no manda `Access-Control-Allow-Origin` y el navegador no deja leer la foto para meterla en el PDF. Se pide al CloudFront `d1zltvqju4u8ql.cloudfront.net`, que sirve los mismos archivos con CORS, en JPEG y a 500 px (`config.images.pdfBase`); es lo que hace la ficha de macroled.com.ar y lo que ya usa el toggle Iluminar (2026-10-21). Una foto de otro servidor se pide tal cual.
- **Fotos que faltan:** al 2026-10-23, de 170 SKU, 38 tienen la foto principal cargada en la base pero el archivo no existe en S3, y 74 no la tienen cargada. Probar con otra foto del producto solo salvaba uno: no se hace. `TODO` (datos).

## 2026-10-26 · filter-panel: «Limpiar filtros» y solo con filtros marcados

- Pedido: la barra de filtros aplicados decía «Limpiar filtros» y el panel «Borrar todo», para la misma acción. Quedan los dos como «Limpiar filtros». «Borrar todo» queda solo en compare-bar (borra los productos elegidos).
- En el panel, el botón se deshabilita mientras no hay ningún filtro marcado (antes estaba siempre habilitado). Si tenía el foco al deshabilitarse, el foco pasa a «Ver N».
- `TODO` (diseño): cambiar el texto y el estado Disabled en el set de filter-panel de Figma; DESIGN.md (fila de filter-panel) en una rama `docs/`.

## 2026-10-26 · Home en /arq/inicio

- Webflow no deja crear una página en la URL de una carpeta: toda página de la carpeta Arq necesita su slug (`index` está reservado) y una página `arq` en la raíz chocaría con la carpeta.
- La Home va en `/arq/inicio`. En Webflow, redirección 301 de `/arq` a `/arq/inicio` (Site settings → Publishing): quien entra a `/arq` llega a la Home, también con `#newsletter`.
- Los links internos apuntan directo a `/arq/inicio`, sin pasar por la redirección: el `href` por defecto de `<arq-logo>` (navbar y footer), el breadcrumb «Inicio» de Productos y los ejemplos del link al newsletter (`/arq/inicio#newsletter`).
- Se descartó un proxy delante de `macroled.com.ar` (Cloudflare Worker) para mostrar la Home en `/arq` sin redirigir: toca el dominio del e-commerce de Macroled.

## 2026-10-26 · Albert Sans en cada componente

- En Webflow, el título de compare-bar («Productos seleccionados») salía con la fuente de Macroled: el `font: inherit` de su `<button>` pisaba el `role/body-lg` del mismo elemento. En la demo no se veía porque su `body` ya usa Albert Sans.
- El rol pasa al `<span>` del texto. El encabezado «SKU» de variants-table tomaba el peso del `body` de la página por lo mismo (`font-weight: inherit` en `.sku-col`): ahora solo se aplica en las filas.
- `ArqElement` pone `font-family: var(--arq-font-family-sans)` en cada `:host`, así nada de adentro de un componente toma la fuente del `body` de Webflow.

## 2026-10-26 · option-tile Type=Value: una sola opción se muestra como dato

- Problema: en el configurador, un grupo con una sola opción (Cabezal, Lámpara) dejaba su único tile siempre con la línea de selección de 2 px, igual que un link o un tab, y no hay nada que elegir.
- Decisión: option-tile suma la variante Type: Option · Value. option-group (Type=Tiles) cuenta sus tiles: con uno solo lo pasa a Type=Value (sin línea, sin role ni foco, `color/text/primary`) y deja de ser un `radiogroup`; con más vuelve a Option. Regla de código en option-group, no una prop que se escriba en el HTML.
- La línea de 2 px del tile elegido queda como está: la distingue del tab y del link de texto.
- El set de option-tile en Figma ya tiene Type=Value. `TODO` (diseño): DESIGN.md (§8, fila de option-group · option-tile) y su copia en Figma.
## 2026-10-26 · text-link: componente para links de texto

- Pedido: el nombre del producto en Descargas se veía como un botón Underline (línea separada del texto, hover que dibuja otra línea). Es un link de texto, no un botón.
- Decisión: componente nuevo `<arq-text-link>` (Size: Default · Compact; State: Default · Hover · Focus). Línea de `border/default` pegada al texto, hover que atenúa texto y línea a `color/text/tertiary`, sin animación de línea. Se usa en el nombre de variants-table Type=Catalog (fila y tarjeta Mobile) y en las piezas del armado de Daö en la ficha. button Underline queda para acciones y llamadas.
- Medido en Chrome (Albert Sans 14, ampliado): un `<a>` en línea dejaba la línea a ~9 px de la base porque su caja es el área de contenido de la fuente, no el interlineado; con una caja de 1em + border/strong y la línea en su borde inferior queda a ~3,5 px y no toca las colas de g, p, y, q.
- variants-table: el nombre y el sku quedan a `space/gap/sm-md` (0,75 rem) en la tabla y en la tarjeta Mobile (antes `sm` y `xs`).
- `TODO` (diseño): ficha `doc/text-link` en Documentación y DESIGN.md (§8 y Anexo A). El set ya está en Figma (2965:9774).

## 2026-10-26 · Productos compatibles en la ficha de Daö

- Pedido: una sección que reúna los productos compatibles con el de la ficha de Daö, con cada tarjeta llevando a su ficha. La lógica sale del configurador.
- Decisión: componente nuevo `<arq-compatible-products>` (título por slot, grilla de search-card, la tarjeta cuadrada del buscador). `compatibleProducts()` en `src/data/dao-config.js` usa las relaciones del configurador (`cabezales_`, `lamparas_` y `frentes_compatibles`) hacia arriba y hacia abajo, una tarjeta por grupo, sin el grupo del propio SKU. `getDaoConfigurator()` carga una sola vez y lo comparten el configurador y esta sección. Va debajo de las pestañas de especificaciones.
- El rol de cada pieza (aro, cabezal, lámpara, frente) sale de quién la lista en los campos de compatibilidad, no de `categoria`: las filas de PAR11 la traen vacía en Typesense.
- Qué se muestra: en las fichas de Daö (aro, cabezal), «Accesorios y lámparas compatibles», sin frentes. En la ficha de la lámpara (`PAR11-`), «Accesorio requerido» con su frente (`frentes_compatibles`), porque es un accesorio de la lámpara y no de Daö. El frente no lleva sección. Sale de los campos de la base, sin SKUs escritos en el código. `TODO`: si aparecen accesorios opcionales, una columna en Sheets (requeridos / opcionales); set en Figma y ficha `doc/compatible-products`.
- Ficha: al abrir, solo la sección de características lumínicas queda abierta (antes, las tres en Desktop), para llegar rápido a lo que sigue, como los productos compatibles. Al cambiar de variante quedan abiertas las mismas.
- Ficha: la pestaña «Información comercial» muestra su lista dentro de un accordion-item «Características comerciales» (abierto), el mismo formato que las secciones de Especificaciones.
- Compatibles: search-card suma Size=Large (nombre en `role/body-xl`, 20 px) y los slots `finishes` (swatches Small a la derecha del nombre, como product-card) y `meta` (debajo del nombre). En los aros, la meta es la cantidad de módulos del grupo («1-3 módulos») y los acabados son los colores del grupo. La grilla va a 4 columnas de 1024 a 1439 px y a 5 desde 1440 px.
- Configurador de Daö: la opción Módulos se muestra «x1», «x2», «x3», como en la ficha (antes «Simple», «Doble», «Triple»); el nombre del armado y las piezas siguen esa forma («Daö Embutir x2 negro»).

## 2026-10-26 · Configurador de Daö en tres pasos, con option-tile Type=Card

- Problema: el configurador no se entendía. Los pasos no tenían jerarquía y todas las opciones se veían como tabs o links, sin un dato que ayudara a elegir.
- Decisión: tres pasos numerados (1 Aro, con Módulos y Terminación; 2 Cabezal; 3 Lámpara). El frente y el panal dejan de ser un paso: la lámpara Cerámica (`PAR11-C-5W-DIM-36G-WW`) los suma sola como accesorios requeridos y una nota lo avisa.
- option-tile suma Type=Card y option-group Type=Cards: caja de solo línea (`border/default`; elegida, `border/strong` de 2 px), título 16 px y subtítulo opcional 14 px. Terminación lleva el swatch dentro de la caja. Se probaron dos opciones: caja de solo línea y fondo gris con línea abajo; la de solo línea mantiene el estilo liviano.
- option-tile Type=Option sigue sin caja en la ficha: no se toca, para no sumar líneas arriba.
- `TODO` (diseño): Type=Card y Type=Cards en Figma, DESIGN.md (§8, fila de option-group · option-tile) y subtítulos del paso Aro.
- Configurador de Daö (ajustes): la caja elegida lleva 1 px en `color/text/secondary` (antes 2 px en `border/strong`). Los pasos aparecen de a uno, a medida que se elige en el anterior (fundido y ascenso de `motion/duration/base`; solo fundido con movimiento reducido), y el resultado queda fijo a la derecha mientras la columna de pasos se desplaza con la página (desde 768 px). Se pueden elegir el color del cabezal (paso 2) y el color del frente de la lámpara (paso 3); «Terminación» pasa a «Color» en todo el configurador. `TODO` (diseño): token de borde para la caja elegida.

## 2026-10-26 · Animaciones: auditoría de todo el sitio

- Pedido: revisar las animaciones de todas las páginas (skill improve-animations; con permiso para no tomar DESIGN.md como regla fija) y que las cards de Productos y Colección entren como las del Home.
- **Entrada de cards:** Productos (catalog-listing) y Colección (coleccion) usan la entrada al hacer scroll del Home (`src/base/reveal.js`). En Productos la hacen las cards de carga si llegan a verse; si no, las cards. Al filtrar, las cards que siguen se reusan (mismos datos) y quedan quietas: solo entran las nuevas. Reemplaza el fundido de 8 px que se repetía en todas las cards con cada filtro.
- **reveal.js:** el escalón se cuenta dentro de lo que entra junto (antes, en toda la lista: la card 8 de un riel esperaba ~1 s), con tope de 5 escalones. Mientras `arq-preloader` tapa la página no arranca: la entrada de lo que está arriba se hacía debajo del preloader y no se veía. Al terminar quita sus clases.
- **Iluminar:** el círculo del switch tiene su propia transición (`fast` + `easing/in-out`, 120 ms, entrada y salida suaves; con `easing/out` y con `standard` se sentía brusco). `motion/easing/in-out` es nuevo en Figma (2 · Semantic · Motion). Antes tomaba la del texto de Iluminar: en la ficha arrancaba 300 ms tarde y tardaba 900 ms, junto con el fundido de la página. El círculo no se anima al mismo tiempo que el fundido general (pedido de Lau): en Productos termina antes de que arranque (después del adelanto de las fotos). Se probaron 320, 400 y 800 ms y se descartaron.
- **Menús, más suaves (pedido de Lau):** el mega-menú entra en `panel` (400 ms) y sale en `slow` (320 ms), con `easing/standard` (250/200 ms con `easing/out` se veía rápido). El menú Mobile abre y cierra como una persiana desde la barra (`panel` + `standard`, como el search-sheet; antes aparecía de golpe) y al cambiar de nivel el que sale se corre `space/gap/4xl` y se desvanece mientras el nuevo entra del otro lado, los dos a la vez (`panel` + `standard`; con reduced motion, fundido). El menú del input Select crece y funde en `slow` + `standard`. filter-panel, download-modal y compare-picker salen en `expand` (250 ms); la entrada sigue en `panel`.
- **Reduced motion:** el mega-menú y el search-sheet funden con `fade` en vez de aparecer de golpe (como filter-panel, plan 001). El hover de product-card funde con `fade` (antes 0).
- **Hover de cards con overlay** (category-card, collection-tile): texto y bajada en `slow` con `easing/out`, zoom de la foto en `slow` + `standard` (lo que dice motion/scale/hover). Antes 1280 ms (`slow × 4`). collection-tile escalona de a `fast` (antes 640 ms por tarjeta).
- **Otros:** la foto de hover de product-card funde recién cuando cargó (antes aparecía de golpe la primera vez); la sección del Home se apaga al subir recién cuando salió entera de la pantalla; catalog-card se achica al apretar en `fast`; project-slider pasa de slide con un deslizamiento rápido (0,4 px/ms, como featured-products); la opacidad de swatch Disabled funde; catalog-nav-group retoma desde donde está si se vuelve a tocar; la galería de la ficha funde con `fade` al cambiar de foto o de variante, y un fundido de Iluminar en curso no salta; el visor de fotos entra con fundido y escala `enter`; compare-header Compact baja desde el navbar; collection-index funde la foto nueva sobre la anterior (sin lavarse); el riel de destacados vuelve al principio con un fundido, no rebobinando; el preview del mega-menú cambia el texto junto con la foto.
- **Sin cambio:** project-slide sigue cambiando de tamaño de golpe (animarlo con transform obliga a rehacer el cálculo de posiciones del slider); la repetición de la entrada de las secciones del Home y la doble entrada sección + cards quedan (es la referencia pedida).

## 2026-10-26 · Lámparas y artefactos sale de macrofamilia

- Pedido: el filtro de Lámparas y artefactos se arma como Interior y Exterior, desde `macrofamilia`, no desde `product_type`.
- En la hoja el valor es `Lámparas y Artefactos`. Los links de adentro son las `subfamilia` de esos productos (hoy «Lámpara» y «Artefacto»). Esos productos no entran al listado general: se ven en esa categoría. El sidebar, el mega-menú, el menú mobile y los links del footer y del Home apuntan a `?environment=Lámparas y Artefactos`.
- **Colecciones** (sidebar, mega-menú, menú mobile y buscador) salen de `familia`: una entrada por familia de las luminarias que se listan, en orden alfabético, y el link abre `?family=`. En el sidebar, abrir Colecciones cierra los otros grupos. Las filas `product_type` «Colección» siguen para la página de la colección y «Explora la colección» de la ficha.
- **Colecciones que inspiran** (Home) muestra solo Yoru, Afo, Sento, Hoshi, Kanu y Koen, en ese orden. Si una no está en la base y no tiene foto elegida, no aparece. El resto de las familias sigue en el menú.
- **Breadcrumb:** en el listado de una familia, Inicio / Productos / Colecciones / nombre; «Colecciones» abre el mega-menu en esa pestaña (`data-arq-menu`), porque no hay página de todas las colecciones. En la ficha de una luminaria, Productos / Colecciones / su `familia` (`?family=`) / el producto, y «Ver colección» va al listado de la familia. En la ficha de una lámpara o artefacto, Productos / Lámparas y artefactos / su subfamilia / el producto. La página de colección del CMS es Inicio / Productos / Colecciones / nombre. (2026-10-27: un nivel más, ver «Navegación de Productos y Colecciones sin recarga».)
- Figma: `motion/easing/in-out` nuevo y descripciones de Motion al día; fichas doc/toggle, doc/mega-menu, doc/navbar, doc/search-sheet, doc/product-card y doc/category-card actualizadas. DESIGN.md §6 y §8 actualizado, y su copia en Plan del proyecto sincronizada entera con el repo (arrastraba cambios anteriores sin pasar).

## 2026-10-26 · Configurador de Daö en un modal, paso por paso

- Pedido: que el configurador funcione como las páginas de compra de Apple, se abra desde la ficha de cualquier producto de Daö y se vaya armando de a un paso.
- Decisión: modal a pantalla completa (`<arq-dao-configurator>`, diálogo nativo como compare-picker) abierto con el botón «Configura tu Daö» sobre la foto de la ficha (texto en mayúsculas, 12 px, fondo `color/surface/inverse`). La pestaña «Configurador» de la ficha se quita.
- Siempre arranca en el aro, sin nada elegido: la pieza de la ficha no se adelanta (era confuso). Un paso abierto a la vez; dentro de un paso, cada grupo aparece al elegir el anterior; «Continuar» se habilita con todo lo del paso elegido; los pasos hechos se pliegan con «Cambiar».
- Panel de la derecha fijo y sin scroll, solo con las fotos de las piezas, que se suman al elegir (tarjetas de `color/surface/subtle`). Al terminar, los tres pasos se condensan arriba con «Cambiar» y debajo van el nombre, las especificaciones, las piezas y «Imprimir configuración» (button Filled).
- El color del cabezal se elige (cada aro lista el cabezal de su color, se juntan los de todos); la lámpara con frentes suma «Color del frente». El rol de cada pieza sale de quién la lista, no de `categoria` (vacía en PAR11). Las lámparas muestran ángulo de apertura y temperatura de color.
- option-tile (Type=Option): línea de 1 px (antes 2) y gap de 4 px bajo una caja de texto de `1em + border/strong` (la línea queda a ~8 px de la base, antes ~11). Type=Card: caja de 1 px en `color/border/subtle`, elegida en `color/border/strong`, subtítulo en `color/text/secondary`.
- `TODO`: Figma (modal, pasos plegado y condensado, panel de fotos, option-tile con la línea de 1 px y Type=Card, option-group Type=Cards, search-card Size=Large y los slots finishes y meta, compatible-products) y DESIGN.md (§8, Anexo A). El PDF de «Imprimir configuración» es provisorio (hoja simple); el real va con pdfmake. La imagen final del armado, cuando exista.

## 2026-10-26 · Auditoría de todo el sitio: peor caso, táctil y rendimiento

Pasada con los skills emil-design-eng, improve-animations, find-animation-opportunities, animation-performance, apple-design, mobile-native y break-ui sobre las páginas que no habían tenido peor caso ni revisión táctil (Home, Productos, Ficha, Colección, Comparativa, búsqueda, navbar). Rama `fix/auditoria-sitio`.

- **Decisiones de Lau:** la descripción de la ficha sigue en minúscula (2026-10-22); grilla de catálogo con al menos dos columnas en Mobile (la tarjeta baja de `layout/card-min` solo si dos no entran: 360, 375 y 320 px); muchos acabados en product-card bajan a otra línea (no «+N»); compare-bar en Mobile arranca plegada con 2 o más productos y no se abre sola al agregar; el glosario de la ficha muestra todas las variantes juntas, sin «Ver más» (se probó de a 30 y se descartó); breadcrumb en Mobile baja de línea en vez de cortar.
- **Roto con datos reales, arreglado:** el tono del breadcrumb y de Iluminar sobre la foto de la ficha tomaba como negro el fondo transparente de los PNG de estudio (ahora se mide sobre `color/surface/subtle`); la barra de Productos superponía Iluminar a la cantidad en 320 px (si no entran, las acciones bajan a otra línea, a la derecha; con los datos de hoy pasa también en 390); una variante sin fotos no ocultaba la foto anterior de la galería (el `display: none` en línea perdía contra `::slotted(img) { display: block !important }`; ahora `hidden`). Las fotos que dan 404 en la galería, las miniaturas y la galería de ambiente siguen a la vista por ahora, para ver qué falta en la base (pedido de Lau); product-card recuerda la foto que no cargó (antes, con Iluminar o el primer hover desaparecía el nombre); el bloqueo de scroll de los diálogos deja pasar el pellizco (zoom en el visor) y el deslizamiento de costado; el riel de destacados y el de la ficha ya no saltan a la card más cercana al soltar un arrastre con mouse (el snap se prende al terminar el deslizamiento).
- **Peor caso, arreglado:** mega-menu con tope de alto (lo que queda debajo de la barra) y scroll adentro; h1 de la ficha con `overflow-wrap: anywhere` y `hyphens: auto` (una palabra larga desbordaba a 1024 px); «Ver todos los resultados» con una búsqueda larga baja de línea; bloque de especificaciones oculto si la variante no tiene datos; Filtros oculto si el grupo no tiene filtros; flechas de destacados ocultas con una sola card; compare-bar con el nombre de la variante; datos clave largos en la ficha técnica PDF (se miden sus líneas); cantidades con separador de miles en búsqueda y compare-picker; `title` en lo que se corta con «…» (breadcrumb, filter-chip, compare-picker-item, compare-product Compact) y en los swatches; el nombre de compare-picker-item llega a dos líneas (`TODO` diseño).
- **Táctil:** menú Mobile y search-screen con `containScroll`; `:active` con los colores de Hover en táctil (cards, search-result, search-see-all, mega-link, catalog-nav-item, download-item); un `touchstart` pasivo en el documento para que iOS aplique `:active`; `text-size-adjust` en el host; destacados de la Home deslizan con el scroll nativo en táctil (el arrastre JS queda para el mouse); `overscroll-behavior-x: contain` en el carrusel de la ficha y las miniaturas; área táctil de los acabados de product-card (la fila suma `space/padding/xs` arriba y abajo, sin cambiar el dibujo); teclado del teléfono en search-sheet (`visualViewport`); con Iluminar, la barra del navegador toma el color Light de los paneles a pantalla completa (`setPanelBar`, `src/base/theme.js`).
- **Gestos y rendimiento:** project-slider sigue el arrastre desde donde se ve si se lo agarra en movimiento, y al soltar usa `easing/out` con la velocidad de los últimos 100 ms; los rieles con arrastre de mouse siguen con impulso al soltar; el cambio de nivel del menú Mobile se da vuelta desde donde está si se vuelve enseguida; Iluminar en la ficha pone las variables del fundido solo en navbar y hero (en `<html>` recalculaba unos 2.000 nodos); comparativa Mobile sin ida y vuelta entre los scrollers; carousel-controls no reescribe su configuración en cada cuadro de scroll; product-card no lee estilos al iluminar.
- **Quedan sin hacer:** deslizar la foto en la galería de la ficha y en el visor (no está en Figma: `TODO` diseño); el encabezado fijo de variants-table y la cabecera de la comparativa con `scroll-timeline` (requiere medirlo en un teléfono); `background-attachment: fixed` del shimmer (solo con evidencia); `viewport-fit=cover` e `interactive-widget` en el meta viewport (pendiente del sitio).
- **Para la base:** hay URLs de fotos que dan 404 (por ejemplo `TORI-J-600-3W-R-WW_HERO_OFF.png`).
- **DESIGN.md:** falta pasar a §2 (grilla Mobile), §8 (product-card con muchos acabados, compare-bar Mobile plegada) y la ficha de breadcrumb, en una rama `docs/` y su copia en Figma.

## 2026-10-27 · Capas de la página (z-index)

- Problema: los z-index de adentro de las tarjetas se escapaban a la página. product-card pone los acabados y «Comparar» en 4 (`--card-above`), el mismo valor que el navbar, y como la card va después en el DOM le ganaba: al desplazar, los swatches y el checkbox pasaban por encima del navbar, del mega-menú, de la barra de Productos y de la compare-bar, y el link estirado (3) tapaba los clics en la barra de Productos.
- Decisión: cada componente que usa z-index para ordenar sus propias piezas se aísla (`isolation: isolate`) y queda en la capa 0 de la página. Hoy: todas las tarjetas con link estirado (`.card` en `src/base/card-link.css`: product-card, family-card, category-card, collection-tile, download-card, line-card), product-gallery, collection-index, cta-block, compare-table y variants-table. Un componente nuevo con z-index internos hace lo mismo en su `:host` o en su contenedor.
- Escala de la página (sin token: no es un valor de Figma). Solo estos valores salen del componente:

| Capa | Qué |
| --- | --- |
| 0 | Contenido y componentes aislados |
| 1 | Elementos sobre su propio fondo dentro de un componente no aislado (lo mínimo) |
| 2 | Menús de select e input Select, compare-header, breadcrumb e Iluminar sobre la foto de la ficha |
| 3 | Barras fijas dentro de la página: barra de Productos, compare-bar, barra y scroll de variants-table |
| 4 | navbar (con mega-menú, search-sheet, menú Mobile y su scrim) |
| 5 | preloader |
| top layer | Diálogos nativos (`showModal`): filter-panel, download-modal, compare-picker, visor de fotos, configurador |

- Webflow: si una página de Macroled pone algo con z-index mayor a 4 (un widget, un banner), queda sobre el navbar de Arq. No se sube la escala hasta ver un caso.

## 2026-10-27 · Ficha técnica con cotas

Hoja de Figma «pdf · cotas A2 · 1 hoja» (2992:45969). Rama `feat/arq-pdf-cotas`.

- **pdf-cover (decisión de Lau, se aparta de la hoja de Figma):** nombre y SKU arriba, a todo el ancho; debajo, la foto en un cuadrado de `layout/pdf-cover-image` (pasó de 200 a 240 en Figma) y, a `space/gap/md`, el dibujo de cotas del mismo alto, los dos enteros; las cotas sin recuadro, sobre el blanco de la hoja; y los datos clave abajo, a todo el ancho (`space/gap/lg`). Sin dibujo, la foto queda sola.
- **Cotas horizontales (decisión de Lau):** una cota vertical o cuadrada va en un cuadrado igual al de la foto; una horizontal se ensancha lo que necesita, hasta 1,5 veces la foto (`cotaWidth`), y si es más horizontal queda más baja, centrada. Así las medidas de la más horizontal (Mini Daö Trimless Triple) llegan a unos 9 pt impresos; en el cuadrado quedaban en 6 pt, y a todo lo ancho la cota quedaba demasiado grande. Se probaron antes 3:4 con el nombre al lado (la hoja de Figma, 160 × 213), un recuadro punteado que se ensanchaba hasta una columna de especificaciones y cotas siempre cuadradas.
- **Textos de impresión (decisión de Lau):** nombre `role/heading-1` (32 px = 24 pt), SKU `role/body-compact`, títulos de sección `role/body-lg-regular` (12 pt), etiqueta y valor de las filas `role/body-compact` y `role/body-compact-regular` (14 px = 10,5 pt) con padding vertical `space/padding/sm`. Datos clave, encabezado y pie sin cambios.
- **Una o dos hojas (decisión de Lau):** la meta es una hoja, pero con los datos reales muchas fichas tienen más filas que Figma (Kanu Jardín: 27 contra 15) y se acepta la segunda hoja. Más adelante el archivo de cotas puede venir de una columna de Sheets.
- **Foto entera** (contain), como antes: Figma la recorta (cover) y con las fotos reales se cortaba la base de los productos altos.
- **Cotas:** PNG en `MACROLED/ARQ/cotas/` (un archivo por medida y uno por familia), sin columna en la base. `src/data/cotas.js` relaciona cada SKU con su archivo por patrones sobre el SKU, como `finishes.js` con los acabados. Se piden al CloudFront en PNG (con CORS; el JPEG ensucia las líneas) a 4 × los px de Figma. `FUJI_12W.png` dibuja la Fuji de 7 W y se usa para ella; `DAO-E-H` es el Pinhole y `DAO_cabezal` el Cabezal Direccionable. Sin dibujo hoy: Mini Kai, Mini Kai Round, Sen, Töri Visera y Mini Töri. Sin uso: los archivos por familia (salvo PAR11), `DAO_ARO`, `DAO_PANAL` y `DAO_accesorios`.
- **Especificaciones en dos columnas** (pdf-spec-row · 2 col, token nuevo `layout/pdf-spec-label-compact`, 160): primera mitad de las filas a la izquierda, el resto a la derecha. Una sola tabla de cinco columnas para que las reglas de las dos columnas queden alineadas aunque una fila ocupe dos líneas. Secciones a `space/gap/lg`; arrancan a `space/padding/md` de pdf-cover.

## 2026-10-27 · Ficha: especificaciones, Iluminar y descargas

- Pedido de Gabriela. **Padding de las especificaciones:** la sección de especificaciones (`.details`) arranca siempre a `space/section/md` (Desktop 96 · Mobile 56), con Iluminar prendido o apagado. Se quita el ajuste atado a `data-arq-theme="dark"` (DESIGN.md §2 · Cambio de fondo): en la ficha ya no se aplica. La pestaña «Información comercial» deja de sumar un `padding-top` propio (era de cuando no tenía acordeón) y queda como Especificaciones.
- **Sin Iluminar:** además de Daö (decisión 2026-10-23), no lo tienen la ficha de Tori Visera (id de grupo `tori-visera`) y la del frente de PAR11 (`grupo_variantes` que empieza con `PAR11-` y contiene `FRENTE`). Sin toggle, y si llegó iluminado desde el listado, vuelve a Light. `TODO` (datos): confirmar los valores reales de `grupo_variantes` del frente.
- **Reparto de campos** (`src/data/attributes.js`): **Potencia** pasa de Características lumínicas a Características eléctricas. `lumenes_lmw` se llama «Eficacia luminosa» (antes «Eficiencia luminosa»; las columnas «Eficiencia» de variants-table no cambian). Materiales e instalación suma `dimensiones`, `calado`, `medidas_cabezal` y `color_lente` (sin filtro en Productos; sin dato no se muestran). `cotas_img` queda fuera de las especificaciones.
- **IP e IK:** un valor que es solo un número se muestra con su sigla en las especificaciones, la comparativa y la ficha técnica en PDF: `65` → IP65 y `6` → IK06 (IK a dos cifras); `IP65` o `IK 06` no duplican el prefijo y cualquier otro texto se muestra como llega. Los filtros y las columnas de las tablas siguen con el valor de la base.
- **Nombre de la sección:** se mantiene «Materiales e instalación» (2026-10-21), aunque ahora suma medidas.
- **Cotas (`cotas_img`), prueba en tres lugares:** (1) fila «Cotas» en el modal de descargas (también en Descargas), con los demás archivos; (2) la imagen debajo de las filas de Materiales e instalación; (3) pestaña «Cotas» junto a Especificaciones e Información comercial. Se ven los tres para decidir cuál queda; los otros dos se sacan. Mientras la base no traiga `cotas_img`, el dibujo sale de `src/data/cotas.js` (patrones sobre el SKU, el mismo del PDF); sin ninguno, no aparece nada. `TODO` (diseño): lugar definitivo, tamaño de la imagen y su set en Figma.
- **Secciones apagadas:** la galería de ambiente que se desplaza (no hay tantas fotos; queda la de ambiente encendido en la galería del hero) y la descripción (STORY) con foto fija (parallax). Siguen en el código, apagadas con `SHOW_AMBIENT_GALLERY` y `SHOW_STORY_PARALLAX` (`false`) en `ficha-producto.js`; para volver, se ponen en `true`. Inspiración y Explora la colección no cambian. La STORY no se arma mientras está apagada.
- **Cotas:** todas con el mismo alto (`layout/pdf-cover-image`, 240) y el ancho según su proporción: las horizontales más anchas y las verticales más angostas.
- **«Ver descargas»** abre el modal de descargas (show-product) de la variante elegida, el mismo que el ícono de cada fila del glosario, en lugar de llevar al glosario. Al cambiar de variante, el modal toma la nueva.

## 2026-10-27 · Buscador sin resultados y nombre de los recomendados

- Pedido de Gabriela. El vacío del buscador (search-dropdown No results y Error, también dentro de search-screen y search-sheet) toma el dibujo del vacío de Descargas: sin caja ni línea, título `role/heading-2` en `color/text/primary`, ayuda `role/body-regular` en `color/text/tertiary` y un button Underline con flecha «Todos los productos» (reemplaza a «Explorá nuestros productos»; se quitó la prop `explore-href`). Se probaron «Todo en Interior» y «Todo en Exterior» y se descartaron.
- **Redacción común:** buscador general «No encontramos resultados para «término».» + «Probá con otro nombre, revisá la ortografía o buscá por SKU.»; Descargas, el mismo título (con filtros: «… con estos filtros.») + «Probá con otro nombre o SKU, o con una parte del código.». Se mantiene «del código» y no «del mismo», que no aclara a qué se refiere. El texto que se anuncia a lectores de pantalla en el navbar también cambió.
- **Recomendados del buscador:** el nombre de cada card sale del nombre de la variante (`variantName`, como el resto de las cards y el buscador), no del grupo. Antes un SKU de Mini Daö Doble se veía como «Daö» (nombre del grupo) y enlazaba a una ficha titulada con el nombre de la variante.

## 2026-10-27 · Ficha técnica: error si no se genera

- Si la ficha técnica en PDF no se puede generar (SKU inexistente, pdfmake o la fuente no cargan), la pestaña nueva se cierra y quien la pidió muestra `form-message` Tone=Error: «No se pudo generar la ficha técnica. Probá de nuevo.». En la ficha va debajo de «Generar ficha técnica» y «Ver descargas»; en el modal del glosario y en el de Descargas, debajo de la fila «Ficha técnica» (slot `message` nuevo de download-modal). Se borra al volver a intentar o al abrir el modal con otro SKU. Rama `feat/arq-pdf-error`.
- Es una región viva (`role="alert"`): está siempre en la página, vacía, y vacía sale del flujo para no sumar el gap (como en Contacto). Se reusa form-message, sin componente nuevo; no hay diseño propio en Figma.
- Demo: `?data=datasheet-error` en la ficha y en Descargas.
- Figma: pdf-cover, pdf-cover-title, pdf-spec-row · 2 col y la hoja de ejemplo (2992:45969) quedaron con el diseño del código (2026-10-27 · Ficha técnica con cotas). En la hoja se sacó una fila de ejemplo para que entre en una hoja.

## 2026-10-27 · Ficha técnica: ajuste de impresión

Prueba impresa de Lau: textos grandes, espacios amplios, cotas grandes, líneas finas y fondo de la foto sin imprimir.

- **Textos:** nombre `role/heading-2` (18 pt), SKU `role/body-sm`, datos clave `role/body-lg` (12 pt), títulos de sección `role/body-compact-medium` (10,5 pt), etiqueta y valor de las filas `role/body-sm` y `role/body-sm-medium` (9 pt, el tamaño habitual de una tabla impresa).
- **Espacios:** márgenes de la hoja `space/padding/xl` · `xl-2xl` · `lg` (arriba · lados · abajo); encabezado y pie `space/padding/sm-md`; pdf-cover con padding `space/padding/md` y gaps `space/gap/md`; secciones a `space/gap/sm-md`; datos clave con padding superior `space/padding/sm`.
- **Cotas:** el dibujo va a `space/padding/lg` del borde de su lugar (240 de alto, hasta 1,5 veces de ancho): se ve más chico sin mover la fila.
- **Líneas finas:** `color/border/default` en el PDF (en pantalla las filas usan `color/border/subtle`, tinta al 10 %, que impresa no se ve).
- **Fondo de la foto:** `color/surface/subtle` (#F0F0F0) va pintado en la imagen; no se imprime por ser un gris de 6 %, que muchas impresoras (láser, ahorro de tóner) dejan en blanco. No es un error del código. Decisión de Lau: en el PDF la foto va sobre `color/surface/strong` (#E0E0E0, 12 %), que sí se imprime (en pantalla sigue `color/surface/subtle`).
- **Secciones que siguen en la hoja siguiente (decisión de Lau):** si una sección no entra en lo que queda de la hoja, sigue en la próxima en vez de pasar entera (reemplaza «una sección no se parte», 2026-10-06). Las filas no se parten, el título se repite arriba y nunca queda solo al pie (`headerRows`, `keepWithHeaderRows`, `dontBreakRows`). Se quitó `pageBreakBefore`.
- Figma al día: pdf-cover (cota en un marco con `space/padding/lg`), pdf-cover-title, pdf-key-item, pdf-key-data (alto según el contenido), pdf-spec-row · 2 col, pdf-header, pdf-footer, pdf-page y la hoja 2992:45969, con sus descripciones.

## 2026-10-27 · Ficha técnica sin datos clave

- **Decisión de Lau:** la ficha técnica en PDF ya no lleva la fila de características destacadas (pdf-key-data: Potencia, Flujo, Temperatura, CRI…) debajo de la foto. Esos datos ya están en las especificaciones; pdf-cover termina en la foto y las cotas. Reemplaza los datos clave de 2026-10-23 · Ficha técnica: una hoja menos.
- Código: se quitaron `KEY_DATA`, `keyData()` (`src/data/attributes.js`), el campo `keyData` de `getDatasheet` y la fila del PDF. Figma: pdf-cover sin pdf-key-data ni la propiedad Show key data; se borraron pdf-key-data y pdf-key-item. Rama `feat/pdf-sin-datos-clave`.

## 2026-10-27 · Cotas desde la base

- Las cotas de la ficha técnica en PDF salen del campo `cotas_img` de Typesense (columna de Sheets con la URL del PNG), por SKU. Se borró `src/data/cotas.js` (las reglas por patrón de SKU) y `config.images.cotasBase`. Reemplaza el mapeo de 2026-10-27 · Ficha técnica con cotas. Rama `feat/pdf-cotas-desde-base`.
- **Solo de la base (decisión de Lau):** sin `cotas_img`, la ficha sale sin cotas; no hay respaldo en el código. Al cambiar, los 108 SKU con dato coincidían con el mapeo anterior; PAR11 (5 SKU) tenía dibujo en el código y no en la hoja, y queda sin cotas hasta que se cargue.
- `cotas_img` entra en `LIGHT_FIELDS`: el PDF se genera desde cualquier página (ficha y Descargas) sin pedir el detalle del grupo.

## 2026-10-27 · Foto transparente en el PDF

- La Fuji (y cualquier foto de estudio en PNG transparente) salía en la ficha técnica sobre fondo negro: la foto se pedía al CloudFront en JPEG y el CloudFront pinta de negro la transparencia, antes de que el canvas ponga `color/surface/strong`. Ahora la foto se pide en WebP (conserva la transparencia y pesa como el JPEG); el canvas pinta el fondo y la guarda en JPEG para pdfmake. Las cotas siguen en PNG. Rama `fix/pdf-foto-transparente`.
