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
- **product-card:** Large pasa sola a Small hasta 767 px; `size="small"` fija Small. Imágenes en `image`, `image-hover`, `image-lit`, `image-hover-lit`. Acabados Default (20) en Large, sin borde en la imagen. El cambio de imagen en hover es solo con el mouse sobre la imagen (toda la tarjeta sigue siendo link): sobre el nombre o «Comparar» no cambia. El foco de teclado sí la cambia.
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

- Sin imágenes: el swatch muestra el neutro con el nombre (DESIGN.md §8).

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
- **Duraciones y curvas** (variables `--arq-illumination-*` en `global.css`, provisorias, sin token en Figma): fondo 2100 ms; imagen 1200 ms con curva que termina antes. Con `prefers-reduced-motion` valen 0.
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

