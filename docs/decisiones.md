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
- Tipos: `color` (hex de 6 u 8 dígitos), `dimension` (`px`), `fontWeight` (número), `fontFamily` (texto) y `typography` (solo en `role/*`).
- Los colores con transparencia salen como `rgba()` con el alpha redondeado a 2 decimales (`#1010101A` → `0.1`), porque el hex de Figma no da el porcentaje exacto. Los opacos quedan en hex.
- Los alias se escriben `{ruta.del.token}` y salen como `var(--arq-…)`.
- Un token no puede tener `dark` y `mobile` a la vez: el script corta con error (hoy los modos no se cruzan entre colecciones).
- Los estilos de texto `role/*` van en la rama `role` con `$type: typography` y **solo alias** en sus campos (familia, peso, tamaño, interlineado, tracking). No salen como variables: generan `roles.css`.
  - `fontSize` y `lineHeight` tienen que apuntar a `type/*` (Semantic · Type). En `roles.css` quedan como `var(--arq-type-<rol>-size)`, así el cambio a Mobile llega solo desde `tokens.css`.
  - `$extensions["arq.textTransform"]` (`uppercase`, por ejemplo en `role/label` y `role/label-sm`) genera `text-transform`.
  - Los `role/*` no llevan modos.
- Antes de convertir, `npm run tokens` valida todo el archivo (alias inexistentes, tipos, valores, modos, extensiones desconocidas). Si hay problemas, los lista y no escribe nada.
- Salida (`npm run tokens`): `:root` (base), `[data-arq-theme="dark"]` y `@media (max-width: 767px) { :root }`. Nunca `prefers-color-scheme`.
- Pendiente: conversor del export de variables de Figma a este formato (TODO).

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
- **TODO:** sin animación, porque no hay tokens de movimiento. Si se anima, respetar `prefers-reduced-motion`.
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
