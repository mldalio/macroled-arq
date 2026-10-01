# sku · `<arq-sku>`

Código de producto con botón de copiar. Size=Default en el configurador de la ficha (con etiqueta SKU); Compact en las filas de la tabla de variantes.

- Figma: [920-2539](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=920-2539) · ficha `doc/sku` (`1462:8671`)

```html
<arq-sku>KANU-J-500-12W-N-WW</arq-sku>
<arq-sku size="compact">KANU-J-500-12W-N-WW</arq-sku>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Code | slot por defecto | `code` (solo lectura) | el SKU tal como viene de Sheets (identificador opaco: puede tener espacios o paréntesis) |
| Size | `size` | `size` | `default` · `compact` (def. `default`) |
| State=Copied | `copied` | `copied` | booleano; lo pone el componente al copiar y lo saca pasado `motion/duration/feedback` (2000 ms) |

- State=Hover es CSS (el ícono pasa a `color/icon/primary`).
- **Copiar:** toda la fila (código + ícono) es el botón. Copia con `navigator.clipboard.writeText` y emite `arq:copy` con `{ code }`. `el.copy()` hace lo mismo por código.
- **Accesibilidad:** el botón se llama "Copiar SKU KANU-J-500-12W-N-WW". "Copiado" se anuncia con `aria-live="polite"`.
- **Si falla el portapapeles** (permiso denegado, contexto no seguro): el código queda seleccionado, en el lugar de "Copiado" se ve "Copialo con Ctrl+C" y se anuncia por el mismo `aria-live`. Dura `motion/duration/feedback`; la selección queda. Estado interno `:state(copy-failed)`.
- **Textos largos:** el código se parte en varias líneas y nunca se corta (también sin espacios). El ícono y "Copiado" quedan en la primera línea.
- El SKU no se usa como `id` HTML ni como slug.

## Tokens

| Parte | Token |
| --- | --- |
| Etiqueta "SKU" | `color/text/secondary` · `role/label` (solo Default) |
| Código | `color/text/primary` · `role/body-lg` (Compact: `role/body`) |
| Ícono · Hover | `copy` en `icon/md`, `color/icon/secondary` · `color/icon/primary` |
| "Copiado" | `color/text/success` · `role/caption` |
| "Copialo con Ctrl+C" | `color/text/secondary` · `role/caption` (ver Pendientes) |
| Duración de Copied | `motion/duration/feedback` |
| Hover del ícono | transición de color `motion/duration/fast` |
| Gaps | `space/gap/xs` (etiqueta–fila) · `space/gap/sm` (código–ícono) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` Color de "Copialo con Ctrl+C": Figma no lo define; se usa `color/text/secondary`. El texto dice Ctrl+C también en Mac (como en Figma).
- Con "Copiado" el componente se ensancha unos 34 px (igual que en Figma).
