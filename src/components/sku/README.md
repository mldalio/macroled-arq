# sku · `<arq-sku>`

Código de producto con botón de copiar. Size=Default en el configurador de la ficha (con etiqueta SKU); Compact en las filas de la tabla de variantes; Underline en la columna de SKU del glosario (código largo en columna angosta).

- Figma: [920-2539](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2539) · ficha `doc/sku` (`1462:8671`)

```html
<arq-sku>KANU-J-500-12W-N-WW</arq-sku>
<arq-sku size="compact">KANU-J-500-12W-N-WW</arq-sku>
<arq-sku size="underline">KANU-J-500-12W-N-WW</arq-sku>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Code | slot por defecto | `code` (solo lectura) | el SKU tal como viene de Sheets (identificador opaco: puede tener espacios o paréntesis) |
| Size | `size` | `size` | `default` · `compact` · `underline` (def. `default`) |
| — (solo de código) | `dense` | `dense` | booleano; con `size="compact"`, el código en `role/body-compact` (14/24) y, desde 1920 px (Wide), en `role/body` (16/24). Lo usa variants-table. TODO (Figma): el set no tiene este tamaño |
| State=Copied | `copied` | `copied` | booleano; lo pone el componente al copiar y lo saca pasado `motion/duration/feedback` (2000 ms) |

- **Size=Underline** (Ficha v2): solo el código, subrayado, en `role/caption-medium`; sin etiqueta ni ícono. Al hacer clic, «Copiado» (o el aviso de error) **reemplaza al código en el mismo lugar**, no va al costado, porque el SKU es muy largo. Se usa en las filas de la tabla y en las tarjetas Mobile de variants-table.
- State=Hover es CSS (el ícono pasa a `color/icon/primary`).
- **Copiar:** toda la fila (código + ícono) es el botón. Copia con `navigator.clipboard.writeText` y emite `arq:copy` con `{ code }`. `el.copy()` hace lo mismo por código.
- **Accesibilidad:** el botón se llama "Copiar SKU KANU-J-500-12W-N-WW". "Copiado" se anuncia con `aria-live="polite"`.
- **Si falla el portapapeles** (permiso denegado, contexto no seguro): el código queda seleccionado, en el lugar de "Copiado" se ve "Copialo con Ctrl+C" ("Copialo con ⌘C" en Mac y iPad) y se anuncia por el mismo `aria-live`. Dura `motion/duration/feedback`; la selección queda. Estado interno `:state(copy-failed)`.
- **Textos largos:** el código se parte en varias líneas y nunca se corta (también sin espacios). El ícono y "Copiado" quedan en la primera línea.
- El SKU no se usa como `id` HTML ni como slug.

## Tokens

En el hero y variants-table, «Copiado» lleva delante `icon/check` de Figma (2891:13154), separado por space/gap/xs. Se usa el SVG original de 16 × 16 con color/text/success heredado; acompaña el mismo fundido de la confirmación.

Microinteracción del hero y variants-table: fundido cruzado de opacidad con motion/duration/fade y motion/easing/standard, sin escala ni desplazamiento. En tablas, «Copiado» ocupa el lugar del código; en el hero, el del ícono, con espacio reservado para evitar cambios de ancho. Tras motion/duration/feedback vuelve el estado inicial con el mismo fundido. Repetir la copia prolonga el aviso sin reiniciar el movimiento. El fundido se mantiene con movimiento reducido. Se conserva color/text/success.

| Parte | Token |
| --- | --- |
| Etiqueta "SKU" | `color/text/secondary` · `role/label` (solo Default) |
| Código | `color/text/primary` · `role/body-lg` (Compact: `role/body`; Compact + `dense`: `role/body-compact`, 16 desde 1920 px) |
| Ícono · Hover | `copy` en `icon/md`, `color/icon/secondary` · `color/icon/primary` |
| "Copiado" | `color/text/success` · `role/caption` |
| "Copialo con Ctrl+C" / "⌘C" | `color/text/secondary` · `role/caption` |
| Duración de Copied | `motion/duration/feedback` |
| Hover del ícono | transición de color `motion/duration/fast` |
| Gaps | `space/gap/xs` (etiqueta–fila) · `space/gap/sm` (código–ícono) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- Con "Copiado" el componente se ensancha unos 34 px (igual que en Figma).
