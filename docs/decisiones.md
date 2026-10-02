# Decisiones

Registro de decisiones técnicas que no están en AGENTS.md ni en DESIGN.md. Si una decisión no está escrita acá, las IAs no la conocen.

Formato: fecha · decisión · por qué.

---

## 2026-09-30 · Base del repo

### Albert Sans se carga a nivel página

- En Webflow, la fuente se carga en la página (custom code o fuentes del sitio), **no** en `dist/arq.css` ni dentro del Shadow DOM.
- `dist/arq.css` tiene solo `tokens.css`.
- La demo la carga con un `<link>` a Google Fonts (pesos 300–700, `display=swap`).
- Por qué: el sitio de Macroled puede tener Albert Sans cargada; así no se descarga dos veces ni se pisa su configuración.

### Salida del build

- Vite en modo librería genera solo `dist/arq.js` (ES module) y `dist/arq.css`, con nombre fijo y sin hash, para publicarlos en jsDelivr con tag de versión.
- La demo no entra al build.
- `dist/` se commitea.

### CSS de componentes y estilos role/*

- Cada componente importa su CSS con `?inline` y lo aplica en su Shadow DOM.
- Los estilos `role/*` se generan en `src/styles/roles.css` (clases `.role-<nombre>`, sin prefijo porque viven dentro del Shadow DOM). Se comparten como **una única `CSSStyleSheet`** vía `adoptedStyleSheets` con el helper `src/styles/roles.js` (`adoptStyles(shadowRoot, css)`). La hoja de cada componente también se crea una sola vez y la comparten sus instancias.
- `roles.css` referencia primitivos de tipografía (`--arq-font-*`) porque así están definidos los estilos de texto en Figma. Los componentes siguen sin usar primitivos directamente: usan las clases `.role-*`.

### Formato de tokens/tokens.json

- DTCG (`$type`, `$value`, `$description`). La ruta es el nombre de la variable en Figma sin el nombre de la colección: `color/text/primary` → `color.text.primary` → `--arq-color-text-primary`.
- `$value` es el valor del **primer modo** (Light o Desktop). El otro modo va en `$extensions["arq.modes"]` con la clave `dark` o `mobile`, **solo si cambia** respecto del primero. Si vale lo mismo, el token no lleva la extensión (el script lo marca como error).
- Tipos: `color` (hex de 6 u 8 dígitos), `dimension` (`px`), `fontWeight` (número), `fontFamily` (texto), `duration` (`ms`), `cubicBezier` (cuatro números) y `typography` (solo en `role/*`).
- Los colores con transparencia salen como `rgba()` con el alpha redondeado a 2 decimales (`#1010101A` → `0.1`), porque el hex de Figma no da el porcentaje exacto. Los opacos quedan en hex.
- Los alias se escriben `{ruta.del.token}` y salen como `var(--arq-…)`.
- Un token no puede tener más de un modo (`dark`, `mobile` o `reducedMotion`): el script corta con error (hoy los modos no se cruzan entre colecciones). `reducedMotion` solo vale en duraciones.
- Los estilos de texto `role/*` van en la rama `role` con `$type: typography` y **solo alias** en sus campos (familia, peso, tamaño, interlineado, tracking). No salen como variables: generan `roles.css`.
  - `fontSize` y `lineHeight` tienen que apuntar a `type/*` (Semantic · Type). En `roles.css` quedan como `var(--arq-type-<rol>-size)`, así el cambio a Mobile llega solo desde `tokens.css`.
  - `$extensions["arq.textTransform"]` (`uppercase`, por ejemplo en `role/label` y `role/label-sm`) genera `text-transform`.
  - Los `role/*` no llevan modos.
- Antes de convertir, `npm run tokens` valida todo el archivo (alias inexistentes, tipos, valores, modos, extensiones desconocidas). Si hay problemas, los lista y no escribe nada.
- Salida (`npm run tokens`): `:root` (base), `[data-arq-theme="dark"]`, `@media (max-width: 767px) { :root }` y `@media (prefers-reduced-motion: reduce) { :root }`. Nunca `prefers-color-scheme`.
- `tokens.json` se genera desde Figma con `npm run tokens:import` (ver 2026-10-01 · Tokens desde Figma). La rama `role` no viene de variables y se conserva.

## 2026-09-30 · Base de componentes (src/base/)

### ArqElement

Todo componente extiende `ArqElement` (`src/base/arq-element.js`):

```js
import css from './accordion-item.css?inline';

class ArqAccordionItem extends ArqElement {
  static tag = 'arq-accordion-item';
  static styles = css;
  static properties = {
    open: { type: Boolean },                                            // Open
    type: { type: String, values: ['plain', 'outline'], default: 'plain' },
    count: { type: Number },
  };
  static template = `<button type="button">…</button><div class="panel"><slot></slot></div>`;
  setup() { … }          // una vez, al conectarse por primera vez
  update(changed) { … }  // al conectarse y cuando cambian props (Set con los nombres)
}
ArqAccordionItem.define();
```

- **Props = propiedades de Figma**, declaradas una por una. El nombre de Figma pasa a atributo en kebab-case y a prop JS en camelCase: `Show icon` → `show-icon` → `showIcon`. Los valores van en kebab-case en los dos lados: `Layout=Image left` → `layout="image-left"` → `el.layout === 'image-left'`.
- **No son props:** `Breakpoint` (media query) ni `State=Hover / Pressed / Focus` (`:hover`, `:active`, `:focus-visible`). **Sí son props** los estados que dependen de datos o de la app: `open`, `selected`, `current`, `checked`, `value`, `filled`, `error`, `disabled`, `loading`, `copied`, `applied`.
- **Tipos:** `Boolean` (atributo de presencia; ausente = `false`), `String` (con `values` y `default` si es una variante) y `Number`. Un valor fuera de `values` vuelve al `default` y avisa solo en `npm run dev`.
- **Reflejo:** atributo → prop y prop → atributo. Las props asignadas antes de que se registre el elemento se recuperan al registrarlo.
- **Estilos:** el Shadow DOM adopta, en orden, la hoja de roles, una hoja base (`[hidden] { display: none !important }`) y la del componente. Cada hoja se crea una vez y la comparten todas las instancias.
- **Render:** `static template` se parsea una vez por clase y se clona en cada instancia. El texto principal llega por slot.
- **Eventos:** `this.emit('change', detail)` despacha `arq:change` con `bubbles` y `composed`. Nombres: `arq:change` para cambios de valor, `arq:toggle` para abrir / cerrar.
- **Controladores:** `addController(obj)` llama a `obj.hostUpdate(changed)` después de cada `update()`. Lo usa Disclosure.
- **Registro:** `define()` no hace nada si el tag ya existe (Webflow puede cargar el script dos veces). Cada componente se importa en `src/main.js`.

### Íconos (src/base/icons.js)

- Los 20 de Figma (`icon/*`, sección icons `1075:4571`), leídos por MCP desde la variante `Theme=Default`. El node id de cada uno queda anotado en el archivo.
- `icon('plus')` devuelve el `<svg>` como string para usar en templates. No hay elemento `<arq-icon>`: los íconos viven dentro de los componentes.
- `stroke="currentColor"`: el color lo pone el componente con `color/icon/*`. `Theme=Inverse` no es otro SVG, es `color/icon/inverse`.
- `vector-effect="non-scaling-stroke"`: el trazo queda en 1 px en cualquier tamaño. El tamaño lo define el componente con `--arq-icon-*` (el SVG no trae width/height).
- `aria-hidden="true"`: el nombre accesible lo lleva el botón o link.
- `data-icon="<nombre>"` en el SVG, para elegir con CSS cuál mostrar (por ejemplo, plus o minus según `open`).

### Desplegables (src/base/disclosure.js)

accordion-item, faq-item, filter-row, catalog-nav-group y catalog-nav-trigger usan el controlador `Disclosure`, armado según sus fichas `doc/<nombre>`:

```js
setup() {
  this.disclosure = new Disclosure(this, { trigger: button, panel: region });
}
```

- Encabezado `<button type="button">` con `aria-expanded` y `aria-controls`. Enter y Espacio son nativos.
- Panel con el atributo `hidden` (no solo CSS). El contenido va por slot: queda en el HTML aunque esté cerrado.
- El ícono + / – es decorativo; el estado lo comunica `aria-expanded`.
- **Desplegables independientes:** pueden quedar varios abiertos (así lo dicen las fichas de accordion-item y faq-item).
- El estado es la prop `open`. Figma define `Open=True` por defecto en filter-row y catalog-nav-group, pero en código lo decide el HTML o los datos (el grupo de la categoría actual, la fila con filtros aplicados).
- Cambiar `open` por código no emite eventos. La acción del usuario y `show()` / `hide()` / `toggle()` emiten `arq:toggle` con `{ open }`.
- Opción `closeOnEscape` (apagada por defecto).
- **Movimiento:** al abrir, el panel aparece con un fundido de `opacity` en `motion/duration/base` (`@starting-style`). El alto cambia de golpe (no se anima layout) y al cerrar se oculta sin fundido. La hoja la adopta `Disclosure` en el Shadow DOM del host: los componentes no la repiten.
- Se usa `<button>` y no `<details>` en todos los casos, también en faq-item (su ficha acepta las dos), para tener un solo patrón.

### Finales de línea (LF)

- `.gitattributes` fuerza LF en todos los archivos de texto (`* text=auto eol=lf`, SVG incluido) y marca como binarios PNG, JPG, WebP y WOFF2.
- Coincide con `.editorconfig` (`end_of_line = lf`). Evita diffs que solo cambian finales de línea entre máquinas con distinta configuración de `core.autocrlf` (Windows / macOS).
- Si se suma otro tipo de binario (por ejemplo `.gif`, `.avif`, `.pdf`), se agrega a `.gitattributes`.

### Variables de entorno

- `src/config.js` lee `import.meta.env.VITE_*`. Vite reemplaza los valores al compilar y quedan dentro de `dist/arq.js`: solo se usa la search-only key de Typesense.

## 2026-10-01 · button

- **`<button>` o `<a>`:** `<arq-button>` sin `href` dibuja un `<button type="button">`; con `href`, un `<a>` (ficha `doc/button`: "`<a>` con la misma clase para navegación"). Un link deshabilitado pierde el `href` y lleva `aria-disabled="true"`.
- **Foco:** anillo separado, según DESIGN.md §7 (capa `focus-ring` de Figma): `outline` de `border/strong` en `color/border/focus` con `outline-offset: 2px`, en los tres Type.
- **Subrayado de Underline:** `border/default` en reposo y `border/strong` en hover y pressed. Es un pseudo-elemento absoluto anclado por arriba: pasar a 2 px no cambia el alto del botón.
- **count-label:** texto para lectores de pantalla en un span oculto visualmente (", 3 filtros activos"); con `count-label`, el número visible del badge lleva `aria-hidden`.
- **Alto de Outline:** el borde se descuenta del padding para que mida 36 como Filled.
- **Booleanos con `true` por defecto en Figma** (Show icon, Show underline): en código son atributos de presencia, así que hay que escribirlos.

### Envío de formularios (todavía no se construye)

- `type` es la prop de Figma (Filled · Outline · Underline), así que no se puede usar `type="submit"`.
- Cuando se construya `form-contacto`, el envío se va a hacer con un atributo **`submit` sin valor**: `<arq-button submit>Enviar</arq-button>`.
- Implementación prevista: `static formAssociated = true` y `attachInternals()` (`ElementInternals`); al hacer clic, `this.internals.form?.requestSubmit()`. Así el formulario corre su validación y dispara `submit` como con un botón nativo.
- Hasta entonces el `<button>` interno es siempre `type="button"`.

## 2026-10-01 · logo

- **px como excepción:** los anchos del logo (181 · 158 · 117 px, alto por el viewBox 181 × 16) son medidas del archivo del logo, no del sistema. Van en px dentro de `src/components/logo/logo.css` y no se crean tokens. Es la única excepción a "sin px" en componentes junto con el `outline-offset: 2px` del foco (DESIGN.md §7).
- **Un solo SVG:** Small y Compact son el mismo dibujo que Default escalado. Los trazos se exportaron de Figma (Size=Default) y quedaron en `logo.js` con `fill="currentColor"`.
- **Link incluido:** `<arq-logo>` es siempre un link (`href="/arq"` por defecto) con `aria-label="Macroled Arq, inicio"`, según la ficha `doc/logo`.

## 2026-10-01 · Textos en mayúsculas (role/label)

- `role/label` y `role/label-sm` ponen la mayúscula con `text-transform`. Chrome arma el nombre accesible con esa transformación ("COLECCIONES") y algunos lectores de pantalla leen las palabras en mayúsculas como siglas.
- En links con texto `role/label` (por ahora breadcrumb-item), el link lleva `aria-label` con el texto tal como llega del HTML, en caja normal. En elementos sin rol (un `<span>`) no se puede: ARIA no permite `aria-label` ahí.

## 2026-10-01 · Fase 1 (controles y formularios)

### Foco en campos de texto (excepción)

- En `input` (Text y Textarea) el foco **solo cambia el color de la línea inferior** a `color/border/focus`, sin anillo. Así está en Figma y en la ficha `doc/input`. Es la única excepción a la regla del anillo de DESIGN.md §7.
- La línea no cambia de grosor (`border/default` en todos los estados): no hay salto de layout.

### Controles de formulario con ElementInternals

- checkbox, toggle, choice-chip, input y file-upload son *form-associated custom elements* (`static formAssociated = true` + `attachInternals()`): mandan su valor con el `<form>` que los contiene (`FormData`), como un control nativo. Un `<input>` dentro del Shadow DOM no lo haría solo.
- Atributos de formulario: `name` y `value` (como en HTML). `form.reset()` los vuelve al estado inicial.

### Selección única (src/base/single-select.js)

- choice-chip, option-tile, swatch y tab se comportan como opciones de un grupo: una sola elegida, flechas para moverse (roving tabindex), Inicio / Fin. El controlador `SingleSelect` lo arma el contenedor (option-group, swatch-picker, el tablist del mega-menu o el grupo de choice-chip, todavía no construidos). La demo usa contenedores de prueba (`demo-radio-group`, `demo-tablist`).
- Cada opción sola funciona igual con clic, Enter o Espacio y emite `arq:change`.

### Ayuda de un input deshabilitado

- Con `disabled`, la ayuda (helper) de input queda en `color/text/disabled`, como el label y el valor. No llega a 4.5 de contraste (2.24 en Light, 2.96 en Dark) y es a propósito: WCAG 1.4.3 no exige contraste mínimo a los controles inactivos. axe lo marca en la demo; se ignora para este caso.

### Alto de nav-link en mobile

- La fila de nav-link en mobile mide 56 (padding `space/gap/md` + `role/body-xl`). Figma ya está corregido a 56.

## 2026-10-01 · Publicación

- **Opción A de docs/setup.md:** el repo [mldalio/macroled-arq](https://github.com/mldalio/macroled-arq) es público y jsDelivr sirve `dist/` desde los tags de GitHub. No hay paquete npm ni hosting aparte.
- URLs: `https://cdn.jsdelivr.net/gh/mldalio/macroled-arq@vX.Y.Z/dist/arq.js` y `…/dist/arq.css`. Siempre con tag de versión, nunca `@main` ni `@latest` en Webflow.
- Un tag publicado no se mueve ni se borra: jsDelivr lo cachea. Para corregir, se publica una versión nueva.
- `package.json` lleva la misma versión que el tag.

## 2026-10-01 · Tokens desde Figma

- No hay export nativo de variables. Claude Code las lee por MCP (`use_figma`, solo lectura) con `scripts/figma/export-variables.figma.js`, una colección por llamada (la respuesta se corta a los 20 KB; 1 · Primitive · Color va en dos partes).
- `scripts/figma/rows-to-dtcg.js` escribe un archivo por colección y modo en `tokens/figma/<colección>.<modo>.json` (DTCG: grupos por la `/` del nombre, `$type` color · number · string, hex `#rrggbb` o `#rrggbbaa`, alias `{neutral.900}`, `$description` y en `$extensions["com.figma"]` los scopes y el codeSyntax.WEB). Los nombres de archivo van en minúsculas y sin "·": `2-semantic-color.dark.json`. Se commitean.
- `npm run tokens:import` convierte `tokens/figma/` a `tokens/tokens.json`: modo base Value / Light / Desktop, Dark y Mobile en `arq.modes` solo si cambian, tipos del repo por ruta (`font/weight` → fontWeight, `font/family` → fontFamily, `motion/duration` → duration, `motion/easing` → cubicBezier, el resto de los números → dimension en px). Respeta el orden del `tokens.json` anterior, valida con las mismas reglas que `npm run tokens` (`scripts/lib/validate-tokens.js`) y lista las diferencias.
- **Figma es la fuente** también de las descripciones de cada variable: el import las pisa.
- No se importan bronze, cacao, olive, terracotta ni offwhite (paletas de marca sin uso).

## 2026-10-01 · Movimiento

- Colección `2 · Semantic · Motion`: `--arq-motion-duration-fast` (120 ms), `base` (200), `slow` (320), `feedback` (2000) y `--arq-motion-easing-standard`.
- **prefers-reduced-motion:** no es un modo de Figma. `npm run tokens:import` agrega a fast, base y slow el modo `reducedMotion` = `0ms` y `npm run tokens` lo escribe en `@media (prefers-reduced-motion: reduce)`. feedback no cambia (es un tiempo de lectura).
- **Una sola regla de transición:** la hoja base de `ArqElement` aplica a todo el Shadow DOM (`*`, `::before`, `::after`) una transición de colores (`color`, `background-color`, `border-color`, `outline-color`, `text-decoration-color`, `fill`, `stroke`) en fast + standard. Cubre hover, pressed, foco y selección de todos los componentes sin repetirla. No llega al contenido por slot (vive en el DOM de Webflow).
- Al cambiar Iluminar, los colores de los componentes también hacen ese fundido de 120 ms; el fondo de la página (fuera del Shadow DOM) cambia de golpe.
- Lo que además anima `transform` u `opacity` redeclara la lista completa en ese elemento, porque `transition-property` no se suma: el círculo de toggle (`transform`, fast) y el panel de los desplegables (`opacity`, base).
- Nunca se anima alto, ancho ni posición. El subrayado de button (1 → 2 px) cambia de golpe.
- **Tiempos en JS:** el "Copiado" de sku lee `--arq-motion-duration-feedback` con `getComputedStyle`; no hay milisegundos escritos en el código.

## 2026-10-01 · Casos definidos por diseño

- **file-upload:** Drag over y Error son estados internos (`:state(drag-over)`, `:state(error)`), no props: dependen de lo que hace el usuario. Disabled es la prop `disabled`. El mensaje de error es "<problema>. Formatos: <lista>." con la lista armada desde `accept` (JPEG se muestra como JPG).
- **input:** Textarea con `rows="4"` por defecto y `resize: vertical`.
- **breadcrumb:** una sola fila. El ítem actual tiene `flex-shrink` mucho mayor que los intermedios: primero se parte en líneas (hasta su palabra más larga) y recién después se cortan los intermedios con "…".
- **sku:** si falla `navigator.clipboard.writeText`, se selecciona el código (está en el DOM de la página) y se muestra y anuncia "Copialo con Ctrl+C" ("⌘C" si `navigator.userAgentData.platform` o `navigator.platform` es Mac, iPhone o iPad) en `color/text/secondary` durante feedback. Estado interno `:state(copy-failed)`.
- **spec-row y sku:** `overflow-wrap: anywhere` para que un código sin espacios también se parta.

## 2026-10-01 · hero y navbar

- **hero no contiene al navbar.** En código cada página tiene un solo `<arq-navbar>`, que va aparte, antes del hero, con `theme="transparent"` y encima de la media del hero. `<arq-hero>` usa solo button.
- **Por qué:** el navbar es uno por página (también en las páginas sin hero) y tiene su propio comportamiento (scroll, búsqueda, menú, mega-menu). Meterlo dentro del hero lo duplicaría en Home y Contacto.
- En Figma, hero muestra una instancia de navbar Theme=Transparent (y su descripción lo menciona): es una referencia de composición, no parte del componente.

## 2026-10-01 · faq-item

- **Separador:** línea arriba de cada ítem en `border/default` + `color/border/default`, como el set (1036:2430) y el Home (Final 1203:9906). La descripción del set y la ficha `doc/faq-item` dicen "borde inferior color/border/subtle": manda el set; falta corregir los dos textos en Figma. El último ítem de la lista queda sin línea abajo.
- **Ancho de la respuesta:** en el set mide 560 fijos y no hay token. Se usa `layout/measure-wide` (520) como ancho máximo en Desktop; en Mobile ocupa todo el ancho. `TODO` hasta que diseño confirme.
- **Hover solo cerrado:** el set no tiene la variante Open=True + Hover.
- **Foco alrededor de todo el ítem** (capa focus-ring del set), también abierto: `.item:has(.trigger:focus-visible)`.
- **El padding del ítem va en el botón**, así todo el alto del encabezado es clickeable. Abierto, el padding inferior del botón es el gap hasta la respuesta (`space/gap/sm-md`) y la respuesta lleva `space/padding/lg` abajo.

## 2026-10-01 · footer

- **API:** la bajada (slot `tagline`) y los links (`<arq-footer-link slot="productos|informacion|redes">`) llegan por HTML. Logo, títulos de columna y legal están en el componente; el año sale de `new Date().getFullYear()` (ficha `doc/footer`). Tres columnas fijas: una sección nueva es una columna nueva en el componente.
- **Logo Compact**, como el set del footer. La ficha `doc/logo` dice "Default en navbar desktop y footer": falta corregirla en Figma.
- **Anchos sin token:** en el set cada columna mide 200 y la bajada 240. En código toman el ancho de su contenido (`TODO` hasta que diseño cree tokens si los quiere). En Mobile la bajada queda en una línea y el footer mide 20 menos que en Figma.
- **Información:** Contacto, Descargas y Glosario (la lista de Mobile del set; Desktop no tiene Descargas). Falta igualar el Desktop en Figma.
- **Legal en un solo elemento:** grilla con el legal debajo de la marca en Desktop (segunda fila en 1fr para que el alto de las columnas no lo empuje) y al final en Mobile.
- **footer-link:** pasa a `role="listitem"` (como breadcrumb-item), suma la prop `label` (aria-label, para "Macroled Arq en Instagram") y su label se parte en líneas en vez de cortarse con "…", como en el set del footer en Mobile.

## 2026-10-01 · Tokens de navbar Transparent

- **Nuevos:** `blur/12` (colección nueva `1 · Primitive · Blur`, una por propiedad como Radius y Border), `blur/backdrop` (2 · Semantic · Dimension, igual en Desktop y Mobile) y `color/overlay/translucent` (2 · Semantic · Color, `alpha/ink-10` en Light y Dark). Ligados en las cinco variantes Theme=Transparent de navbar: fondo translúcido + background blur.
- `blur/12` no tiene scope en Figma (como `alpha/*`): en el selector solo aparece el semántico.
- **Blur de Figma ≠ CSS:** el radio del background blur de Figma equivale a la mitad en CSS. En código se escribe `backdrop-filter: blur(calc(var(--arq-blur-backdrop) / 2))`: el token conserva el valor de Figma (12) y la conversión queda en el CSS.

## 2026-10-01 · Dark dentro del Shadow DOM

- **Problema:** `tokens.css` vive en el documento. Su selector `[data-arq-theme="dark"]` alcanza el host de un componente o un ancestro del DOM de la página, pero no un elemento dentro de un Shadow DOM: un contenedor interno con el atributo seguía en Light.
- **Solución:** `npm run tokens` genera también `src/styles/dark.css`, con el mismo bloque Dark. `src/styles/roles.js` lo convierte en una sola `CSSStyleSheet` y `ArqElement` la adopta en cada Shadow DOM, junto con la de roles (compartida entre instancias). No se edita a mano.
- **Resultado:** `data-arq-theme="dark"` funciona en tres lugares: un ancestro del DOM de la página, el host del componente y un contenedor dentro del Shadow DOM. El contenido por slot hereda el modo del contenedor donde se muestra (las variables CSS siguen el árbol con los slots resueltos). Probado en la demo con `demo-dark-local` (Base): `<arq-button>` Filled y Outline por slot dentro de un contenedor interno Dark.
- **Regla para Dark local:** un componente con Dark fijo por diseño lo aplica en un contenedor interno; el contenido por slot lo hereda. Quien arma la página no pone el atributo.
- No hay modo Light local: dentro de un bloque Dark no se puede volver a Light (no existe `[data-arq-theme="light"]`).

## 2026-10-01 · Modo Dark: Iluminar y Dark local

- **Dos usos, un atributo:** Iluminar (switch del usuario: ficha, Productos y Colecciones) y Dark local (fijo por diseño, para colores claros sobre fotos o fondos oscuros). Los dos son `data-arq-theme="dark"`. Detalle en DESIGN.md §2 · Modo Dark.
- **Dónde va el atributo en Dark local:**
  - Componente con Dark propio (hero, compare-bar): en un contenedor interno de su Shadow DOM. El contenido por slot lo hereda y quien arma la página no pone nada.
  - Sección de página (explora-coleccion de la ficha): en la sección, en el DOM de la página.
- **hero:** solo el CTA va en Dark (button Outline claro); los textos siguen en `color/text/inverse`, como Figma. El CTA llega por slot (`slot="action"`, editable en Webflow) y el hero envuelve ese slot en un contenedor con `data-arq-theme="dark"`.
- **explora-coleccion es Dark local, no Iluminar:** en las cuatro pantallas de la ficha (con y sin Iluminar) está en Dark. Iluminar en la ficha cambia navbar, hero y la foto.

## 2026-10-01 · Páginas en Webflow

- **Todo el contenido de Arq se carga con Code Embed.** No se arma nada en el Designer de Webflow.
- **Páginas estáticas (Home, Contacto, Comparativa):** un Code Embed con el HTML de los componentes.
- **Ficha de producto:** template de la colección del CMS (slug propio) con un Code Embed que inserta los campos mínimos con campos dinámicos del CMS: nombre como `<h1>`, descripción corta, SKU e imagen principal. El componente busca el resto en Typesense. Desde 2026-10-02 el ítem del CMS es un grupo y el embed imprime su `PRODUCT_GROUP_ID` (ver 2026-10-02 · Base de datos, Ficha de producto por grupo).
- **Listados (Productos y Colecciones):** salen de Typesense (2026-10-02 · Base de datos, Listados).
- **`src/pages/`** guarda un archivo por página con el HTML exacto de su embed. Es la fuente: se edita en el repo y se pega en Webflow; no se edita el embed directo en Webflow.
- **Límite:** cada Code Embed admite hasta 50.000 caracteres (Webflow, "Increased custom code character limit"; antes era 10.000). Es un tope por elemento y no se puede subir.
  - Una página de Arq entra holgada: el embed lleva solo el HTML de los componentes y el texto indexable; estilos y lógica vienen de `dist/arq.js` y `dist/arq.css` (jsDelivr), y los datos de Typesense.
  - Si una página se acerca al límite, se parte **por sección**: un Code Embed por bloque de página (hero, categorías, FAQ…), en orden. Cada bloque es un conjunto de componentes que no depende del HTML de otro embed, así que se puede partir en cualquier límite entre secciones. En `src/pages/` la página sigue siendo un archivo, con un comentario `<!-- embed N -->` en cada corte.
  - Nunca se parte un componente entre dos embeds: el HTML de un elemento tiene que abrir y cerrar en el mismo embed.

## 2026-10-01 · hero

- **Slots:** media (`<img>` o `<video>`), eyebrow, title, description y action. La media va en el HTML del embed porque es el LCP: el navegador la descubre sin esperar al JS. Show eyebrow, Show description y Show button no son atributos: cada parte se muestra si su slot tiene contenido.
- **Dark local del CTA:** el slot `action` va envuelto en un contenedor interno con `data-arq-theme="dark"` (DESIGN.md §2). Los textos van en `color/text/inverse`, como Figma.
- **`<h1>` en el HTML de la página:** el título se escribe `<h1 slot="title">…</h1>` en el embed, no dentro del Shadow DOM, así el encabezado está en el HTML indexable. El componente lo estiliza con `::slotted(h1)`: hereda `role/display` y el color de un contenedor interno (`font: inherit`, sin escribir primitivas), con `!important` porque los estilos del sitio para `h1` ganan sobre `::slotted`.
- **scrim, excepción fija:** `hero/scrim` es un estilo de relleno de Figma y el export de variables no lo trae. El degradado (negro 52 → 20 → 20 → 68 %) va copiado con sus valores en `src/components/hero/hero.css`, como los px del logo. No es un pendiente: si cambia en Figma, se copia a mano.
- `TODO` (navbar): crear `layout/navbar-height` (56) en Figma al construir navbar; lo usan hero y compare-header Compact.
- **`<div>`, no `<header>`:** la ficha pide `<header class="hero">`, pero en esas páginas el navbar es el banner y dos banners es un error de axe.
- **Video y movimiento reducido:** con `prefers-reduced-motion: reduce` el componente quita el autoplay, pausa el video y vuelve al poster (`load()`); si la preferencia cambia, lo reanuda. Solo afecta a videos que vinieron con `autoplay` en el HTML.
- **Media con `!important`:** posición y tamaño de la media slotteada van con `!important`, porque los estilos del sitio para `img` ganan sobre `::slotted`.
- **Gap texto–CTA en Desktop:** `space/gap/xl`; en Figma es justify-between sin gap y un título largo tocaría el CTA.
- **Fondo de reserva** `color/surface/inverse` mientras carga la media o si falta, para que el texto inverso se lea.

## 2026-10-01 · cta-block

- **Slots:** title (`<h2>` en el HTML de la página, como el `<h1>` del hero), description, action (`<arq-button>`) y, en Newsletter, email (`<arq-input>`). Aplica su propio `layout/gutter` porque el fondo va a sangre.
- **Gaps del set, no de la ficha:** título–bajada `space/gap/sm-md` y email–button `space/gap/md` (la ficha dice `sm` y `sm-md`). Falta corregir la ficha.
- **Newsletter sin envío:** un `<form>` dentro del Shadow DOM no es dueño de un `arq-input` que llega por slot (el formulario dueño se busca en el DOM de la página). Por eso el componente valida el email con `reportValidity()` del `arq-input` al tocar el button o con Enter, y emite `arq:submit` con `{ email }`. `TODO` (formularios): envío a n8n y `form-message`, cuando se defina el webhook de la newsletter y se construya `arq-button submit`.
- **Email:** 380 fijos en el set, sin token; `layout/measure` (400) con `TODO`.

## 2026-10-01 · Encabezados en el HTML de la página

- **Regla (AGENTS.md):** los encabezados (h1–h6) se escriben en el HTML de la página con slot; el componente los estiliza con `::slotted()` y nunca crea su propia etiqueta de encabezado. Así el encabezado está en el HTML del embed (indexable y con su nivel visible en el DOM de la página).
- **Componentes:** hero (`<h1 slot="title">`), page-header (`<h1 slot="title">`), section-header y cta-block (`<h2 slot="title">`) y footer (`<h2 slot="productos-title">`, `"informacion-title"`, `"redes-title"`).
- **Estilo compartido:** la hoja base de `ArqElement` tiene una sola regla `::slotted(h1)…::slotted(h6)` que deja el encabezado sin margen y con `font`, `letter-spacing`, `text-transform` y `color` heredados (`inherit`). Cada componente pone la clase `role/*` y el color en el contenedor del slot: no se escriben primitivas. Va con `!important` porque los estilos del sitio (Webflow) para h1–h6 ganan sobre `::slotted`.
- **footer:** cada `<nav>` toma su nombre (`aria-label`) del texto de su `<h2>`: un `aria-labelledby` desde el Shadow DOM no puede apuntar a un id del DOM de la página.

## 2026-10-01 · Datos sin Typesense

- **Forma propia por componente:** cada componente que recibe datos define su propia forma: un objeto con nombres en inglés y camelCase (por ejemplo `{ name, sku, finishes: [{ slug, name }] }`), documentado en su README. No usa los nombres de Typesense ni los del CMS.
- **Fixtures:** `demo/fixtures/` usa esa forma, no la de Typesense ni la del CMS. Así la demo prueba el componente tal como lo va a recibir.
- **`src/data/` traduce:** es el único lugar que lee Typesense (o el CMS) y convierte a la forma de cada componente. Cuando exista `docs/typesense-schema.md`, solo cambia `src/data/`; los componentes y las fixtures no.
- `TODO` (schema): los campos de las 4 imágenes de product-card (estudio y contexto, luz apagada y encendida) y los códigos de acabado (N, V, R, B, BN, P). El resto del esquema está en `docs/typesense-schema.md` desde 2026-10-02.
- **Listados:** salen de Typesense (2026-10-02 · Base de datos, Listados).

## 2026-10-01 · URLs

- Propuesta acordada en `docs/urls.md`. Home en `/arq`; templates del CMS en singular (`/arq/producto/{slug}`, `/arq/coleccion/{slug}`) para no chocar con los listados en plural; `/arq/comparativa`, `/arq/glosario` y `/arq/buscar` como páginas estáticas.
- Las colecciones (KANU…) son una colección del CMS, con su template.
- Productos por categoría: PENDIENTE (parámetro o subpágina). Los listados ya están definidos (2026-10-02).

## 2026-10-01 · carousel-controls

- **`for="<id>"`:** el componente maneja el contenedor con scroll de la página: `scrollBy` de un ancho visible (el snap alinea) y Position calculada con el `scrollLeft`. Sin `for`, Position es un atributo fijo y las flechas emiten `arq:prev` / `arq:next`.
- **Foco:** si la flecha con foco se deshabilita al llegar a una punta, el foco pasa a la otra.
- **`aria-controls`** con `ariaControlsElements`: un id del DOM de la página no se puede referenciar desde el Shadow DOM.
- **El carrusel no es parte del componente.** `TODO` (páginas): el contenedor (snap, peek) se resuelve al armar Colección y Home.

## 2026-10-01 · Tarjetas con link estirado

- **Patrón común** de las tarjetas que son un link: category-card y line-card ahora; family-card y product-card lo van a usar. CSS compartido en `src/base/card-link.css` (cada tarjeta lo suma a su hoja).
- El componente recibe `href`. En el Shadow DOM, el `<a>` envuelve **solo el slot del nombre** (en line-card, `<h3 slot="name">`), así el nombre accesible es corto.
- El `::after` del `<a>` cubre toda la tarjeta (`position: absolute; inset: 0`): toda la tarjeta es clickeable.
- Hover y foco se aplican a la tarjeta con `:has(.card-link:hover)` y `:has(.card-link:focus-visible)`. El anillo de foco rodea la tarjeta, como en los sets. El hover (borde `color/border/hover` en la imagen, outline hacia adentro) va solo con `hover: hover`.
- Textos de acción como "Ver colección" se ven como button Underline pero son decorativos (`aria-hidden`): nunca dos links al mismo destino.
- Elementos interactivos dentro de la tarjeta (el checkbox "Comparar" de product-card) van por encima del `::after`: `position: relative` y `z-index: var(--card-above)`.

## 2026-10-01 · Proporciones de category-card, line-card y feature-block

- **Mandan los ratios del sistema** (DESIGN.md §5), no las medidas de los sets: category-card `ratio/portrait-soft` (4:5) en Desktop y Mobile; line-card `ratio/landscape` (5:4) en Desktop y `ratio/square` (1:1) en Mobile. Se corrigió en Figma el alto de la imagen de las 12 variantes (y el `focus-ring` de las Focus) y se sumó line-card Mobile a `ratio/square` en la tabla.
- **Gaps de los sets**, no de las fichas (las fichas de line-card y feature-block dicen `space/gap/sm`). Sin borde en reposo en la imagen de category-card (la ficha dice `color/border/subtle`).
- **feature-block:** imagen principal 4:5 (coincide con el set: 640 × 800). Texto desfasado como el set: `space/padding/xl-2xl` arriba en Image left y `space/padding/6xl` en Image right (la ficha dice que es un espejo). La secundaria tiene alto fijo en el set y no está en la tabla de ratios: `ratio/wide` con `TODO`.

## 2026-10-02 · Base de datos (estructura v5)

- **Fuente:** `docs/estructura-base-de-datos.md` (versión 5, convertida del .docx). Los datos son tentativos y la base se está armando en Typesense. Campos y tipos: `docs/typesense-schema.md` (propuesta hasta que se confirme con quien arma la base).
- **Un documento por SKU.** Los SKU con el mismo `PRODUCT_GROUP_ID` forman un producto (una card y una ficha); los grupos con el mismo `COLLECTION_ID`, una colección.
- **Nombres de campo:** columna en minúscula, sin tildes y con `_` (`Color de carcasa` → `color_de_carcasa`). Las etiquetas visibles, las secciones del acordeón, los filtros, las filas de la comparativa y las columnas del glosario viven en un único archivo de `src/data/`.
- De Figma se usan solo las páginas Componentes y Final: el documento cita *baja / media*, que no se usa.

### Ficha de producto por grupo

- **CMS Productos: un ítem por grupo**, cargado a mano en Webflow por ahora. Slug = `PRODUCT_GROUP_ID`. Campos: nombre (`PRODUCT_NAME`), SKU predeterminado, slug, meta title, meta description, imagen principal (`IMG_MAIN` del SKU predeterminado), descripción corta y textos editoriales (ver Textos editoriales).
- **El template imprime el grupo:** `<arq-ficha-producto data-group="kanu-jardin">` con el `<h1>` y los textos por slot. El componente pide a `src/data/` los SKU del grupo.
- **Variante en la URL:** `?sku=<SKU>` (con `encodeURIComponent`, porque el SKU puede tener espacios o paréntesis). La ficha abre con ese SKU si pertenece al grupo; si no viene o no es del grupo, con el predeterminado (`IS_GROUP_DEFAULT`). Al cambiar la variante se actualiza el parámetro con `history.replaceState` (sin recargar). El canonical es siempre la URL sin parámetro.
- **Qué cambia con la variante** (Final, Ficha `1218:10486`): galería superior, sku, descripción técnica, acordeón de características, descargas y ficha técnica. No cambian: breadcrumb, título, galería de ambiente, Descripción, Inspiración, Otras familias, Explora la colección ni el glosario (lista todos los SKU del grupo).

### Selectores de variante

- Un selector por cada campo de `VARIANT_ATTRIBUTES`, en ese orden. Las opciones son los valores únicos de los SKU del grupo.
- Solo se ofrecen combinaciones que existen: una opción que no forma un SKU con lo ya elegido va en **Disabled** (option-tile, select-option y swatch; swatch suma el estado Disabled en Figma).
- **Atributo → control:** el acabado (color) usa option-group Type=Swatches; el resto, Type=Tiles. Cada atributo declara su control en el archivo de etiquetas de `src/data/`. Type=Select queda sin uso por ahora.
- La misma lógica de combinaciones la usan la ficha, los filtros del glosario y la comparativa: un solo módulo en `src/data/`.

### Listados (cierra el PENDIENTE de 2026-10-01)

- **Productos, Colecciones y ficha de colección salen de Typesense**, sin Collection List de Webflow. El embed de la página tiene el componente de la grilla; las cards las dibuja el componente con los datos que le pasa `src/data/`.
- **Una sola consulta:** el catálogo tiene unos 50 SKU, así que `src/data/` trae todos los documentos de una vez (hasta 250 por página) y agrupa, filtra y cuenta en el navegador. Si el catálogo pasa de 250 SKU, se revisa (`group_by` de Typesense o paginado).
- **Una card por grupo** en Productos y en la ficha de colección; **una por colección** en Colecciones.
- **SKU de la card:** el predeterminado. Con filtros técnicos, si el predeterminado no cumple, el primer SKU del grupo que cumple según el orden de la hoja (`sheet_order`); la card enlaza a la ficha con `?sku=`. Sin filtros, siempre el predeterminado.
- **Conteo** (catalog-toolbar): grupos o colecciones que cumplen el filtro, no SKU.
- `TODO` (orden de las cards): el de la hoja (primera fila de cada grupo) hasta que se defina otro.
- **SEO:** las cards no están en el HTML inicial. Las fichas y las colecciones se indexan por sus páginas del CMS (sitemap).

### Cards

- **Colecciones con el mismo criterio que Productos:** cuatro imágenes (hover e Iluminar, DESIGN.md §8) y filtros técnicos (una colección aparece si alguno de sus SKU cumple). Sin Comparar. `TODO` (base): de dónde salen las cuatro imágenes de una colección.
- **family-card** (Default y Large) usa la misma imagen que la card de producto del grupo: estudio, luz apagada (`TODO` hasta definir la columna). "Explora la colección" es Dark local, no Iluminar: no pasa a la versión encendida.
- **Resumen de la card** (meta): valores de `VARIANT_ATTRIBUTES` (por ejemplo «35 cm – 50 cm») más una o dos características fijas. `TODO`: cuáles.

### Navegación

- **Un solo árbol** en `src/data/` para mega-menu, catalog-nav, catalog-nav-mobile y el menú mobile. Cada opción es un filtro sobre `environment`, `application` y `product_type`. Las opciones sin productos se ocultan.
- **Lámparas:** categoría propia (pestaña "Lámparas y artefactos" del mega-menu, sección Lámparas del lateral, `product_type` = Lámpara) y además aparecen dentro de Interior y Exterior (opción "Lámparas" = Lámpara + ese entorno), como en Final (`1237:13492`). Por eso `environment` admite una lista. `TODO`: confirmar si Artefactos sigue la misma regla (en Final también está dentro de Interior y Exterior).
- **Nombres:** la aplicación se llama **Colgante** (no Suspensión ni Colgantes). MR16 PRO y AR111 PRO son productos distintos.
- **catalog-nav-mobile:** la sección actual abierta, con su opción marcada; las demás visibles y cerradas, como en Figma (`1207:3314`). El documento dice "solo la sección actual": se descarta.
- `TODO` (mega-menu): pestañas, columnas y orden se pasan del Final (`1237:13492`) al árbol al construir mega-menu. URLs de categoría: siguen PENDIENTES (`docs/urls.md`).

### Comparativa

- **Cada columna es un grupo.** Selects en orden: colección (Kanu) → producto de esa colección (Jardín, Pared) → un select por campo de `VARIANT_ATTRIBUTES`, con la misma disponibilidad que la ficha. Ejemplo: Kanu · Jardín · Negro · 50 cm contra Kanu · Pared · sus variantes.
- Al cambiar un select se actualizan la imagen (`img_main` del SKU elegido) y todas las filas de la columna. Hasta 3 columnas.
- El set de compare-product (Familia + Variante) **se rediseña en Figma**: pendiente de diseño. `TODO`: cómo se nombra el producto en su select (aplicación o nombre completo) y cómo llegan los productos a `/arq/comparativa`.

### Galerías

- Galería superior, galería de ambiente, Inspiración y galerías de colección muestran solo las imágenes que existen: los campos vacíos y las URLs repetidas se omiten.
- Si hay más imágenes de las que entran, la galería se desliza (scroll-snap, como el carrusel de 2026-10-01 · carousel-controls). En product-gallery se desliza la fila de miniaturas (5 en Desktop, 4 en Mobile).
- `TODO` (diseño): cantidad de imágenes de cada galería.
- **product-gallery:** Iluminar cambia la imagen grande y también las miniaturas que tienen versión encendida. Las miniaturas se recorren con Tab. Su ancho es `layout/gallery-thumb` (105 Desktop · 76 Mobile, token nuevo) y la separación al borde de la imagen, `space/padding/lg` (en Figma 20, sin token).
- **catalog-nav:** un solo componente para Desktop y Mobile. catalog-nav-mobile y catalog-nav-trigger viven dentro de `<arq-catalog-nav>` (como toggle-switch dentro de toggle): desde 1024 px es el sidebar; hasta 1023 px, un encabezado con la selección actual que abre los mismos grupos. Así cada link está una sola vez en el HTML (ficha `doc/catalog-nav-mobile`: "reutilizá el mismo HTML"). Se siguen los sets donde la ficha difiere: panel mobile en `color/surface/default` y gap entre ítems `space/gap/sm-md`.
- **filter-panel:** con el panel abierto el listado no cambia; solo se actualiza el número de "Ver N productos" (la página lo calcula con `arq:filters`). "Ver N" aplica (`arq:apply`) y cierra. La X, el scrim o Esc descartan los cambios y vuelven a lo marcado al abrir. Summary y chips se arman solos con lo marcado. Es un `<dialog>` modal nativo. Ancho Desktop: `layout/filter-panel` (560, token nuevo).
- **catalog-toolbar · Iluminar:** en Productos y Colecciones el toggle pone `data-arq-theme="dark"` en `<html>` y guarda la preferencia en `localStorage` (`arq:theme`): al volver a Productos o Colecciones arranca como se dejó (ficha `doc/catalog-toolbar`). La ficha de producto no usa esta preferencia. Filtrar se conecta al panel con `for` y muestra solo la cantidad de filtros aplicados.
- **product-card:** Size=Large pasa sola al aspecto Small hasta 767 px (grilla mobile, ficha `doc/product-card`); `size="small"` la deja Small siempre. El cambio de imagen en hover aplica también a Small (cierra el pendiente de DESIGN.md §12). Las cuatro imágenes van en atributos (`image`, `image-hover`, `image-lit`, `image-hover-lit`) hasta definir las columnas. Se sigue al set: acabados Default (20) en Large y sin borde en la imagen.
- **family-card:** mandan los ratios del sistema (DESIGN.md §5): `ratio/square` en Default y `ratio/portrait` en Large. Se corrigió el alto de la imagen en las 6 variantes del set (Default 200 × 200, Large 328 × 469) y su descripción (también se quitó "nombre subrayado" en Hover, que el set no tiene). Toma el ancho de su columna; el ancho en el carrusel lo define la Ficha.
- **download-modal · download-item:** el modal usa el ancho de `layout/filter-panel` (560; el set se ajustó de 581 y el token ahora describe los dos paneles). En Mobile va abajo, a `layout/gutter` de los bordes y ocupando el ancho. En download-item Default el Hover subraya el texto, como dice la descripción (la variante del set no cambiaba nada y se corrigió). Sin `href` la opción es un botón que emite `arq:download` (ficha técnica generada).
- **Glosario (variants-table):** es un `<table>` real; variants-table-row vive adentro (es la fila), como toggle-switch dentro de toggle. Las columnas miden lo que su contenido (sin anchos fijos); la miniatura usa `layout/table-thumb` (56, token nuevo). Filtros con un select por atributo de variante y las opciones sin filas deshabilitadas (`filterOptions` y `filterVariants` en `src/data/variants.js`).
- **select:** las opciones las arma el componente con los datos (`options`): así el campo y la lista están en el mismo Shadow DOM y funciona el patrón de select de un valor (combobox + listbox con `aria-activedescendant`; el foco queda en el campo). select-option suma `active` (State=Focus de la opción resaltada). Se sigue al set: Hover del Field en `color/surface/faint` y valor del Filter en `role/body-medium`.
- **Iluminar en componentes:** `src/base/theme.js` detecta si un componente está dentro de un bloque con `data-arq-theme="dark"` y le avisa cuando cambia (un solo MutationObserver en el documento). Lo usan product-gallery y, después, product-card. No ve cambios dentro de un Shadow DOM: el Dark local es fijo.

### Textos editoriales

- **Ficha y colección:** `PRODUCT_STORY_TEXT`, `PRODUCT_INSPIRATION_TEXT`, `COLLECTION_INTRO_TEXT` y `COLLECTION_DESCRIPTION_TEXT` van también en el CMS, como texto plano. El template los imprime en el embed y llegan al componente por slot: quedan en el HTML (indexables). No van en el código.
- **Home y Contacto:** los textos van en su embed de `src/pages/`.
- La hoja es la fuente; el CMS es una copia cargada a mano. Si no coinciden, manda la hoja.
- **Markdown de STORY** (`##` título, `-` características): el componente lo lee del texto del slot y arma los nodos con `createElement` y `textContent`, nunca con `innerHTML`. Una línea que no es `##` ni `-` va como párrafo.
- `TODO` (Webflow): verificar si un campo Rich Text se puede insertar en un Code Embed; si se puede, se evalúa usarlo en lugar del Markdown.

### Ficha técnica en PDF

- **Descargable e imprimible.** Se genera en el navegador al hacer clic en "Generar ficha técnica" o en la descarga "Ficha técnica", con los datos del SKU elegido.
- La librería de PDF se carga desde jsDelivr, con versión fija, **solo al primer clic**: no entra en `dist/arq.js`. Es la única excepción a "solo `dist/arq.js`" y se documenta en el README del componente. Lo mismo para "Descargar comparación".
- `TODO` (diseño): el diseño del PDF no existe en Figma. `TODO` (código): elegir la librería al construirlo (tiene que poder incrustar Albert Sans).

### Sincronización Sheets → Typesense

- Por ahora no hay acceso a n8n. Mientras se arma la base, la carga la hace quien arma Typesense.
- **Propuesta para después:** Apps Script dentro de la hoja, con un menú "Publicar en Typesense", sin línea de comandos. La admin key va en las propiedades del script (nunca en el repo) y el código se guarda en el repo. Corre las validaciones del documento (SKU único, un predeterminado por grupo y colección, atributos que existen, combinaciones no ambiguas) y no publica si alguna falla. `TODO`: se define cuando la base esté armada.
- El CMS de Webflow se carga a mano.

### Acabados

- Sin definir. El swatch muestra el neutro con el nombre (DESIGN.md §8) hasta que haya imágenes y la tabla de códigos (N, V, R, B, BN, P).
