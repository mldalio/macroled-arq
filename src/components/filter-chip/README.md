# filter-chip · `<arq-filter-chip>`

Filtro aplicado que se puede quitar. Todo el chip es el botón. Va en la fila "applied" de filter-panel, uno por valor aplicado.

- Figma: [1238-3693](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1238-3693) · ficha `doc/filter-chip` (`1433:3371`)

```html
<arq-filter-chip>8 W</arq-filter-chip>
<arq-filter-chip>3000 K</arq-filter-chip>
```

## Props

| Figma | Slot | Valores |
| --- | --- | --- |
| Label | slot por defecto | valor corto del filtro, sin el nombre del atributo salvo que sea ambiguo |

- State (Default · Hover · Focus) es CSS. No tiene Disabled.
- **Al tocarlo** dispara un `click` como un `<button>`. filter-panel quita el filtro, actualiza el conteo y mueve el foco al chip siguiente (o a Summary si era el último). `el.focus()` enfoca el botón interno.
- **Accesibilidad:** el botón se llama "Quitar filtro 8 W". El ícono es decorativo.

## Tokens

| Parte | Token |
| --- | --- |
| Borde · Hover | `border/default` en `color/border/default` · `color/text/primary` |
| Texto · ícono | `color/text/primary` · `role/body-sm` · `icon/sm` (`close`) |
| Padding · gap | `space/padding/xs` · `space/padding/sm` · `space/gap/xs` |
| Radio | `radius/control` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- Hover usa `color/text/primary` como color de borde (set y ficha); la descripción de Figma dice `color/border/strong`. En Dark difieren un tono.
- Un label que no entra se corta con puntos suspensivos (Figma no lo define).
