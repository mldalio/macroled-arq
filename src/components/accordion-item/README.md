# accordion-item · `<arq-accordion-item>`

Bloque desplegable de especificaciones de la ficha (características lumínicas, eléctricas, materiales y dimensiones), con una spec-list adentro. No confundir con faq-item (preguntas del Home).

- Figma: [922-2645](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=922-2645) · ficha `doc/accordion-item` (`1462:9426`)

```html
<arq-accordion-item open>
  <span slot="title">Características lumínicas</span>
  <arq-spec-list>
    <arq-spec-row><span slot="label">Flujo luminoso</span>850 lm</arq-spec-row>
  </arq-spec-list>
</arq-accordion-item>
<arq-accordion-item>
  <span slot="title">Características eléctricas</span>
  …
</arq-accordion-item>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Title | slot `title` | — | Texto del encabezado (`role/heading-2`) |
| Open | `open` | `open` | booleano · cerrado por defecto |
| — (contenido) | slot por defecto | — | En la ficha, una `arq-spec-list` |

- **No son props:** State=Hover (`:hover`, solo cerrado, como el set), State=Focus (`:focus-visible`, anillo alrededor de todo el ítem) y Breakpoint (media query `max-width: 767px`).
- **Comportamiento** (`src/base/disclosure.js`): el encabezado es un `<button>` con `aria-expanded` y `aria-controls`; Enter y Espacio abren y cierran. El contenido queda en el HTML aunque esté cerrado. Pueden quedar varios abiertos. La acción del usuario emite `arq:toggle` con `{ open }`.
- **Título:** va dentro del botón, por eso se escribe como `<span slot="title">` y no como `h2` / `h3` (un encabezado dentro de un botón pierde su rol). Mismo criterio que faq-item.
- **Ícono +/–:** medidas de icon-button Size=Large (48 × 48, ícono 24), pero es parte del botón: no hay un botón dentro de otro. Cerrado como Background=None (Hover `color/surface/hover`); abierto como Background=Surface.
- **Sin divisor** bajo el título al abrir (decisión 2026-10-02 · accordion-item): como Open=True Default y la Ficha de Final. La variante Open=True Focus del set sí lo tiene.
- **Alto:** cerrado mide 128, como el set: la línea inferior se descuenta del padding.

## Tokens

| Parte | Token |
| --- | --- |
| Padding | `space/padding/xl-2xl` arriba (y abajo cerrado) · `space/padding/2xl` a los lados (Mobile `space/padding/xl`) y abajo abierto (Mobile cerrado también `space/padding/2xl`) |
| Gap título–ícono · encabezado–contenido | `space/gap/md` · `space/gap/xl` |
| Título | `role/heading-2` en `color/text/primary` |
| Cerrado | línea inferior `border/default` en `color/border/default`, sin fondo. Hover `color/surface/faint` |
| Abierto | fondo `color/surface/faint`, sin línea; ícono sobre `color/surface/default` |
| Ícono | `space/padding/sm-md` + `icon/xl`, `color/icon/primary` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- `TODO` (diseño) En Dark, la etiqueta de spec-row (`color/text/tertiary`, #8A8A8A) sobre el fondo abierto (`color/surface/faint`, #252525) da 4.44 de contraste: no llega a 4.5 (axe lo marca en la demo). Es así en Figma; hace falta que diseño ajuste un token.
- `TODO` (datos) Secciones del acordeón y sus filas: `src/data/attributes.js`, cuando estén las columnas técnicas. Una sección sin filas no se muestra (lo resuelve la ficha).
