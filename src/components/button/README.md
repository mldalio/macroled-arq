# button · `<arq-button>`

Botón del sistema en tres jerarquías: Filled (acción principal), Outline (secundaria o de herramienta) y Underline (terciaria, texto subrayado).

- Figma: [907-2375](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=907-2375) · ficha `doc/button` (`1440:3630`)

```html
<arq-button show-icon>Información técnica</arq-button>
<arq-button type="outline" show-icon icon="filter" show-count count="3">Filtrar</arq-button>
<arq-button type="underline" show-leading-icon href="/arq/productos">Volver a productos</arq-button>
<arq-button loading>Enviar</arq-button>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | Texto de la acción (infinitivo o sustantivo corto, sin punto final) |
| Type | `type` | `type` | `filled` · `outline` · `underline` (def. `filled`) |
| Show icon | `show-icon` | `showIcon` | booleano · ícono a la derecha |
| Icon | `icon` | `icon` | cualquier nombre de `src/base/icons.js` (def. `arrow-up-right`) |
| Show underline | `show-underline` | `showUnderline` | booleano · solo Underline. Sin el atributo, el subrayado aparece solo en hover |
| Show count | `show-count` | `showCount` | booleano · count-badge después del label (Tone=Inverse en Filled) |
| — (Count del badge) | `count` | `count` | número. Sin `count` no se muestra el badge |
| Show leading icon | `show-leading-icon` | `showLeadingIcon` | booleano · ícono a la izquierda |
| Leading icon | `leading-icon` | `leadingIcon` | nombre de ícono (def. `chevron-left`) |
| State=Disabled | `disabled` | `disabled` | booleano |
| State=Loading | `loading` | `loading` | booleano · solo Filled. Label "Enviando…", `aria-busy="true"`, deshabilitado, sin íconos ni badge |
| — | `href` | `href` | Con `href` se dibuja un `<a>` (navegación); sin `href`, un `<button type="button">` |
| — | `target` | `target` | Para links. Con `_blank` suma `rel="noopener"` |

- Los booleanos son atributos de presencia: en Figma Show icon y Show underline valen `true` por defecto, en código hay que escribir el atributo.
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
| Fondo Outline hover · pressed | `color/surface/hover` · `color/surface/selected` |
| Subrayado | `border/default` en `color/border/strong` |
| Disabled | `color/text/disabled`, `color/border/disabled`, fondo Filled `color/surface/subtle` |
| Foco | `border/focus` en `color/border/focus` (outline, no cambia el tamaño) |
| Padding · gap | `space/gap/sm` + `space/padding/md` (Underline: `space/gap/xs`, sin padding horizontal) · `space/gap/sm` |
| Ícono | `icon/md` |
| Texto | `role/body-regular` (badge: `role/caption-medium`) |

## Pendientes

- `TODO` Subrayado en hover: Figma usa 1 px (`border/focus`) y DESIGN.md §8 dice 2 px. Hoy sigue a Figma.
- `TODO` Foco: en Figma, Filled y Outline en Light tienen el borde de foco del mismo color que el fondo o el borde, y no se ve. En código el anillo va separado un `border/focus` del botón para que sea visible.
- `TODO` Nombre accesible con count: la ficha pide "Filtrar, 3 filtros activos"; hoy se lee "Filtrar 3".
- `TODO` El badge es interno: reemplazar por `<arq-count-badge>` cuando exista.
- `TODO` Enviar formularios: `type` es la prop de Figma, así que no hay `type="submit"`. Falta definir cómo se envía un formulario (lo necesita `form-contacto`).
- Sin ícono de carga en Loading (no existe en la librería).
