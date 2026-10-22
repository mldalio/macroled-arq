# faq-item · `<arq-faq-item>`

Pregunta frecuente desplegable, para el bloque de preguntas frecuentes del Home. La pregunta es el encabezado y la respuesta aparece al abrir. No confundir con accordion-item, que agrupa especificaciones en la ficha.

- Figma: [1036-2430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2430) · ficha `doc/faq-item` (`1452:5345`)

```html
<arq-faq-item>
  <span slot="question">¿Desarrollan luminarias a medida para proyectos?</span>
  Sí. Nuestro equipo técnico adapta medidas, acabados y temperatura de color según los requerimientos de cada proyecto.
</arq-faq-item>

<arq-faq-item open>
  <span slot="question">¿Dónde descargo los archivos IES?</span>
  En la ficha de cada producto, en <a href="/arq/productos">Descargas</a>.
</arq-faq-item>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Question | slot `question` | — | texto de la pregunta; va dentro del botón del encabezado |
| Answer | slot por defecto | — | texto de la respuesta (1 a 3 oraciones; puede llevar un `<a>`) |
| Open | `open` | `open` | booleano (def. cerrado) |
| State | — | — | Hover y Focus por CSS (`:hover`, `:focus-visible`) |

- **Texto, no bloques:** la pregunta y la respuesta van como texto (la respuesta puede tener un `<a>`). El componente las pone en su propio botón y en su panel, con `role/body-xl` y `role/body`. Con `number`, la pregunta usa `role/heading-3`. Si llegan dentro de un `<p>` o un `<h3>`, toman los estilos de Webflow.
- **La respuesta queda en el HTML** aunque el ítem esté cerrado (indexable). Cerrado, el panel queda con alto 0 y `visibility: hidden` (Disclosure `animateHeight`).
- **Sin respuesta no se muestra:** si el slot de la respuesta está vacío, el ítem lleva `data-arq-empty` y no se ve (AGENTS.md: si falta un dato, esa parte no se muestra).
- **Varios abiertos:** cada ítem abre y cierra por su cuenta.
- **Evento:** al abrir o cerrar con clic o teclado se emite `arq:toggle` con `{ open }`. Cambiar `open` por código no emite eventos.
- **Teclado:** el encabezado es un `<button>` con `aria-expanded` y `aria-controls`: Tab llega a la pregunta y Enter o Espacio abren y cierran.

## Armado en la página

Los ítems se apilan uno debajo del otro, a ancho completo de la columna. Cada uno trae su línea arriba; el último queda sin línea abajo, como en el Home de Figma. El margen lateral (`layout/gutter`) lo pone la sección.

## Layout y estados

| | Desktop | Mobile |
| --- | --- | --- |
| Padding arriba y abajo | `space/padding/lg` (24) | `space/padding/lg` (20) |
| Alto cerrado (una línea) | 73 | 65 |
| Respuesta | hasta `layout/measure-wide` | ancho completo |
| Con `number` | el número queda a la izquierda de la pregunta y la respuesta se alinea con el texto | el número pasa arriba: pregunta y respuesta arrancan en el mismo borde que el título de la sección |

- **Hover:** fondo `color/surface/faint`, solo con el ítem cerrado (el set no tiene Open=True + Hover).
- **Focus:** anillo de DESIGN.md §7 alrededor de todo el ítem, abierto o cerrado. No cambia el tamaño.
- Todo el alto del encabezado es clickeable (el padding del ítem está en el botón).
- Una pregunta larga se parte en varias líneas; el ícono queda centrado en la fila.

## Tokens

| Parte | Token |
| --- | --- |
| Separador (arriba) | `border/default` en `color/border/default` |
| Pregunta | `color/text/primary` · `role/body-xl` (con `number`, `role/heading-3`) |
| Respuesta | `color/text/secondary` · `role/body` · ancho máximo `layout/measure-wide` (Desktop) |
| Link en la respuesta | `color/text/primary`, subrayado |
| Ícono | `icon/plus` / `icon/minus` · `icon/md` · `color/icon/primary` |
| Gap pregunta–ícono | `space/gap/lg` |
| Gap pregunta–respuesta | `space/gap/sm-md` |
| Hover | `color/surface/faint` |
| Foco | `border/strong` en `color/border/focus` |
| Abrir y cerrar | alto `motion/duration/expand` · opacidad `motion/duration/base` · `motion/easing/out` (reduced motion: solo `motion/duration/fade`) |

## Movimiento

La respuesta anima el alto al abrir y al cerrar (Disclosure `animateHeight`, `grid-template-rows: 0fr → 1fr`), y el padding inferior de la pregunta acompaña. Cerrada queda con `visibility: hidden`: el link de la respuesta no recibe foco. Es el único desplegable con alto animado (DESIGN.md §6 · Movimiento).

## Pendientes

- `TODO` (diseño): en el set la respuesta mide 560 fijos y no hay token. Se usa el más cercano, `layout/measure-wide` (520).
- La descripción del set y la ficha `doc/faq-item` dicen "borde inferior color/border/subtle"; el set y el Home usan línea arriba en `color/border/default`. Se sigue el set (`docs/decisiones.md`, 2026-10-01 · faq-item): falta corregir la descripción y la ficha en Figma.
