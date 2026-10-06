# button · `<arq-button>`

Botón del sistema en tres jerarquías: Filled (acción principal), Outline (secundaria o de herramienta) y Underline (terciaria, texto subrayado).

- Figma: [907-2375](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=907-2375) · ficha `doc/button` (`1440:3630`)

```html
<arq-button show-icon>Información técnica</arq-button>
<arq-button type="outline" show-icon icon="filter-off" show-count count="3" count-label="filtros activos">Filtrar</arq-button>
<arq-button type="underline" show-leading-icon href="/arq/productos">Volver a productos</arq-button>
<arq-button loading>Enviar</arq-button>
<arq-button type="outline" loading loading-label="Generando…">Ficha técnica</arq-button>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | Texto de la acción (infinitivo o sustantivo corto, sin punto final) |
| Type | `type` | `type` | `filled` · `outline` · `underline` (def. `filled`) |
| Show icon | `show-icon` | `showIcon` | booleano · ícono a la derecha. **En Figma viene en `true`; en código, sin el atributo no hay ícono** |
| Icon | `icon` | `icon` | cualquier nombre de `src/base/icons.js` (def. `arrow-up-right`) |
| Show underline | `show-underline` | `showUnderline` | booleano · solo Underline. **En Figma viene en `true`; en código, sin el atributo el subrayado aparece solo en hover y pressed** (p. ej. "Volver a productos") |
| Show count | `show-count` | `showCount` | booleano · [`<arq-count-badge>`](../count-badge/README.md) después del label (Tone=Inverse en Filled, Primary en Outline y Underline) |
| — (Count del badge) | `count` | `count` | número. Con `0` o sin `count` no se muestra el badge |
| — | `count-label` | `countLabel` | texto · qué cuenta el badge, solo para lectores de pantalla. Con `count="3" count-label="filtros activos"` se lee "Filtrar, 3 filtros activos" (el número visible no se lee dos veces). Sin `count-label` se lee "Filtrar 3" |
| Show leading icon | `show-leading-icon` | `showLeadingIcon` | booleano · ícono a la izquierda |
| Leading icon | `leading-icon` | `leadingIcon` | nombre de ícono (def. `chevron-left`) |
| State=Disabled | `disabled` | `disabled` | booleano |
| State=Loading | `loading` | `loading` | booleano · Filled y Outline (fondo de Hover). Label de carga, `aria-busy="true"`, deshabilitado, sin íconos ni badge |
| — | `loading-label` | `loadingLabel` | texto de carga (def. "Enviando…", al enviar un formulario). "Generando…" mientras se arma la ficha técnica en PDF. No es prop de Figma: en Figma es el Label de la variante Loading |
| — | `href` | `href` | Con `href` se dibuja un `<a>` (navegación); sin `href`, un `<button type="button">` |
| — | `target` | `target` | Para links. Con `_blank` suma `rel="noopener"` |
| — | `submit` | `submit` | booleano · envía el `<form>` del que es parte (ElementInternals + `requestSubmit()`): corre la validación y dispara `submit`, como un botón nativo. No es prop de Figma (`type` ya es Filled · Outline · Underline) |

- Los booleanos son atributos de presencia (AGENTS.md): Show icon y Show underline, que en Figma valen `true` por defecto, en código están desactivados hasta que se escribe el atributo.
- Hover, Pressed y Focus no son props: `:hover`, `:active`, `:focus-visible`.
- `el.focus()` enfoca el `<button>` o `<a>` interno.
- Deshabilitado o cargando, el clic no se propaga. Un link deshabilitado pierde el `href` y lleva `aria-disabled="true"`.

## Tokens

| Parte | Token |
| --- | --- |
| Fondo Filled · hover · pressed | `color/action/primary` · `color/action/primary-hover` · `color/surface/inverse-pressed` |
| Texto e ícono Filled | `color/action/on-primary` |
| Texto e ícono Outline y Underline | `color/action/primary` (Underline pressed: `color/text/tertiary`) |
| Borde Outline | `border/default` en `color/border/strong` |
| Fondo Outline hover · pressed · loading | `color/surface/hover` · `color/surface/selected` · `color/surface/hover` |
| Subrayado | `border/default` (1 px) en reposo y `border/strong` (2 px) en hover y pressed, en `color/border/strong` (pressed: `color/text/tertiary`). No cambia el alto |
| Disabled | `color/text/disabled`, `color/border/disabled`, fondo Filled `color/surface/subtle` |
| Foco | anillo `border/strong` en `color/border/focus`, separado 2 px (`outline-offset`, DESIGN.md §7). No cambia el tamaño |
| Padding · gap | `space/gap/sm` + `space/padding/md` (Underline: `space/gap/xs`, sin padding horizontal) · `space/gap/sm` |
| Ícono | `icon/md` |
| Texto | `role/body-regular` (badge: `role/caption-medium`) |

## Pendientes

- `TODO` Offset del subrayado: Figma lo pone 3 px debajo del texto y no hay token; se usa `space/padding/2xs` (3).
- Enter en un campo de texto no envía el formulario: un botón formAssociated no es el "botón predeterminado" del navegador. Se envía con el botón (clic, Enter o Espacio sobre él).
- `TODO` Sin ícono de carga en Loading (no existe en la librería).
