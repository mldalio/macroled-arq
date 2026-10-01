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
| State=Copied | `copied` | `copied` | booleano; lo pone el componente al copiar y lo saca a los 2 s |

- State=Hover es CSS (el ícono pasa a `color/icon/primary`).
- **Copiar:** toda la fila (código + ícono) es el botón. Copia con `navigator.clipboard.writeText` y emite `arq:copy` con `{ code }`. `el.copy()` hace lo mismo por código.
- **Accesibilidad:** el botón se llama "Copiar SKU KANU-J-500-12W-N-WW". "Copiado" se anuncia con `aria-live="polite"`.
- El SKU no se usa como `id` HTML ni como slug.

## Tokens

| Parte | Token |
| --- | --- |
| Etiqueta "SKU" | `color/text/secondary` · `role/label` (solo Default) |
| Código | `color/text/primary` · `role/body-lg` (Compact: `role/body`) |
| Ícono · Hover | `copy` en `icon/md`, `color/icon/secondary` · `color/icon/primary` |
| "Copiado" | `color/text/success` · `role/caption` |
| Gaps | `space/gap/xs` (etiqueta–fila) · `space/gap/sm` (código–ícono) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` Duración de Copied: 2 s fijos en `sku.js` (no hay token).
- `TODO` Si el portapapeles falla: no hay estado diseñado. Hoy no muestra "Copiado" y avisa en consola.
- `TODO` Un SKU muy largo se corta con puntos suspensivos (Figma es nowrap).
- Con "Copiado" el componente se ensancha unos 34 px (igual que en Figma).
- El ícono en reposo es `color/icon/secondary` (set); la descripción del ícono `copy` dice `color/icon/primary`.
- El código usa `role/body-lg` / `role/body` en `text/primary` (set); DESIGN.md §6 sugiere `role/body-sm` para SKU.
