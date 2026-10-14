# filter-bar · `<arq-filter-bar>`

Barra de filtros de la tabla de variantes (visible con Filtros activos): una celda select Type=Filter por atributo y "Limpiar filtros".

- Figma: [1068-5165](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1068-5165) · ficha `doc/filter-bar`

```html
<arq-filter-bar>
  <arq-select type="filter" label="Color" name="color_carcasa"></arq-select>
  <arq-select type="filter" label="Altura" name="altura"></arq-select>
</arq-filter-bar>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| — (celdas) | slot por defecto | — | `arq-select type="filter"` con `name`, cantidad libre |
| State=Applied | `applied` | `applied` | Lo pone el componente cuando algún select tiene valor: aparece "Limpiar filtros" |
| Breakpoint | — | — | Media query: hasta 767 px las celdas van en columna |

- **Métodos y datos:** `filters` devuelve `{ name: value }` (sin los que están en "Todos"); `clear()` es "Limpiar filtros" (todo vuelve a "Todos" y el foco pasa al primer select).
- **Evento:** `arq:filters { filters }` cuando cambia un select o se limpian.
- **Ficha v2 (2026-10-14):** el fondo ocupa el ancho de su contenedor (en variants-table, el del contenido) y adentro lleva `--page-gutter` (`layout/gutter` dentro de variants-table). Filtros arriba y «Limpiar filtros» debajo.
- Las celdas miden lo que su contenido (en Figma, 160 fijas sin token).

## Tokens

| Parte | Token |
| --- | --- |
| Fondo | `color/surface/soft`, sin líneas |
| Padding | `space/padding/2xl` × `layout/gutter`; filtros → «Limpiar filtros» `space/gap/xl` |
| Celdas | gap `space/gap/lg`, divisor `border/default` en `color/border/subtle` entre una y otra; Mobile en columna con gap `space/gap/md` |
| Limpiar filtros | button Underline |
