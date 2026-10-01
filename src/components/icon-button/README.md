# icon-button · `<arq-icon-button>`

Botón de solo ícono. Size Default (24 × 24) para navbar, tablas y controles chicos; Large (48 × 48) para acciones de bloque, como el acordeón.

- Figma: [752-2882](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=752-2882) · ficha `doc/icon-button` (`1440:4000`)

```html
<arq-icon-button icon="search">Buscar</arq-icon-button>
<arq-icon-button icon="plus" size="large">Abrir especificaciones</arq-icon-button>
<arq-icon-button icon="download" background="subtle">Descargar ficha técnica</arq-icon-button>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| — (nombre accesible) | slot por defecto | — | **Obligatorio.** Qué hace el botón ("Buscar", "Cerrar"). Queda oculto visualmente; si falta, avisa con `console.warn` |
| Icon | `icon` | `icon` | cualquier nombre de `src/base/icons.js` (def. `search`) |
| Size | `size` | `size` | `default` · `large` (def. `default`) |
| Background | `background` | `background` | `none` · `surface` · `subtle` (def. `none`) |
| State=Disabled | `disabled` | `disabled` | booleano · atributo `disabled` nativo en el `<button>` interno |

- **Background=None** sobre `color/surface/default` (lo más común: navbar, cerrar paneles, + / – de acordeones). **Surface** cuando va sobre otra superficie (faint, subtle…). **Subtle** para que la acción se note entre mucha información (descarga en la tabla de variantes).
- Hover, Pressed y Focus no son props: `:hover`, `:active`, `:focus-visible`.
- `el.focus()` enfoca el `<button>` interno. Deshabilitado, el clic no se propaga.
- Si un ícono es clickeable, va siempre dentro de icon-button.

## Tokens

| Parte | Token |
| --- | --- |
| Ícono | `color/icon/primary` (Disabled: `color/icon/disabled`) · `icon/md` (Large: `icon/xl`) |
| Padding | `space/padding/xs` (Default: 16 + 4 + 4 = 24) · `space/padding/sm-md` (Large: 24 + 12 + 12 = 48) |
| Fondo None · hover · pressed | transparente · `color/surface/hover` · `color/surface/selected` |
| Fondo Surface · hover · pressed | `color/surface/default` · `color/surface/subtle` · `color/surface/selected` |
| Fondo Subtle · hover · pressed | `color/surface/subtle` · `color/surface/selected` · `color/surface/strong` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |
| Radio | `radius/control` |

## Pendientes

- `TODO` `aria-expanded` y `aria-controls` cuando el botón abre algo (menú, búsqueda, acordeón): se definen al construir esos componentes.
- En Figma, Size=Default es una caja fija de 24 sin padding y no hay token para 24. En código es ícono de 16 + `space/padding/xs`, que da 24 en Desktop y Mobile.
- En Figma el ícono está enlazado a `color/text/primary`; en código usa `color/icon/primary` (mismo valor en Light y Dark).
