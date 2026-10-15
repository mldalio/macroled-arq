# downloads-table · `<arq-downloads-table>`

Tabla de la página Descargas: todos los SKU del catálogo con buscador, filtros de selección múltiple, los filtros aplicados como filter-chip y la descarga de cada fila. Es propia de Descargas: la tabla de la ficha sigue siendo [variants-table](../variants-table/README.md).

- Figma: «Descargas · propuesta final (desktop y mobile)» [2575-22875](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2575-22875) (frames «variants-table» de la pantalla; no es un set). Panel lateral: 2571:22966 · Mobile 2572:22988 (de las dos propuestas se eligió esta; la desplegable, 2571:22259, quedó en la historia de la rama `feat/descargas-propuesta`). Vacío: 2564:20982 · 2565:21934. Cargando: 2564:21164 · 2565:22101.

```html
<arq-downloads-table downloads="descargas"></arq-downloads-table>
<arq-download-modal id="descargas" show-product>…</arq-download-modal>
```

```js
tabla.data = {
  columns: [{ key: 'potencia', label: 'Potencia' }, …],
  filters: [{ key: 'color_carcasa', label: 'Acabado', swatches: true }, …],
  rows: [{ sku, name, href, meta, thumb, search, attributes: { … }, values: { … } }],
};
tabla.addEventListener('arq:downloads', (e) => llenarModal(e.detail.sku));
```

Los datos los arma `getDownloadsTable()` (`src/data/catalog.js`).

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| — | `loading` | `loading` | booleano. Filas (Mobile: tarjetas) de carga y «Buscando…» en la cantidad |
| — | `downloads` | `downloads` | `id` del `arq-download-modal` que abre la descarga de cada fila |
| — | `label` | `label` | Nombre de la región con scroll. Por defecto «Variantes» |
| — (datos) | — | `data` | `{ columns, filters, rows }` (solo JS) |
| Breakpoint | — | — | Media query: hasta 767 px es Mobile |

## Comportamiento

- **Barra:** Filtros (button Filled, «Filtros (N)» con N = valores elegidos) con la cantidad al lado («4 variantes», `role/body` en `color/text/secondary`) a la izquierda y el buscador a la derecha. En Mobile, el buscador arriba a todo el ancho y Filtros con la cantidad debajo.
- **Buscador:** filtra mientras se escribe por SKU, nombre del producto y de la colección, sin tildes ni mayúsculas (`searchVariants`).
- **Filtros:** el botón abre filter-panel (`unit="variantes"`): panel lateral derecho con scrim en Desktop, pantalla completa en Mobile. Una filter-row de checkbox por filtro; «Ver N variantes» aplica y cierra, cerrar descarta.
- **Selección múltiple:** dentro de un filtro, una fila cumple si tiene cualquiera de los valores; entre filtros, todos (`src/data/variants.js`). Las opciones son las de todo el catálogo; las que no darían filas con la búsqueda y los demás filtros van deshabilitadas.
- **Aplicados:** un filter-chip por valor y «Limpiar filtros» (button Underline). Quitar un chip pasa el foco al siguiente.
- **Desktop:** `<table>` real. Miniatura, producto (nombre `role/body-compact-medium` sobre sku Compact) y Descargas quedan fijas al desplazar; hasta 1023 px solo la miniatura. Todo en una línea; si la tabla no entra, una barra de scroll fina (pulgar `color/border/default`) queda pegada al borde inferior de la pantalla mientras la tabla está a la vista, sincronizada con la tabla (la del contenedor quedaría al final de cientos de filas). `TODO` (diseño): DESIGN.md §2 pide la tabla sin barra visible; confirmar la excepción. Encabezado `role/label-lg` en `color/text/tertiary`, valores `role/body-lg-regular`. Descarga: icon-button Large Background=Outline, como el glosario de la ficha (Figma 1218:10705).
- **Mobile:** una tarjeta por variante: miniatura, nombre (`role/body-medium`) y sku; Potencia, Temp., Ángulo e IP en dos columnas; «Descargas» (Outline) abre el modal y «Ver producto» (Underline, ↗) va a la ficha con `?sku=`.
- **Vacío:** «No hay variantes con estos filtros» (`role/heading-2`) y su ayuda (`role/body-regular`).
- Emite `arq:downloads { sku }` y, con `downloads`, abre ese modal. La cantidad de filas se anuncia en una región `role="status"`.

## Tokens

| Parte | Token |
| --- | --- |
| Barra | padding vertical `space/padding/md`; Filtros → cantidad `space/gap/lg` |
| Aplicados | chips a `space/gap/sm`, «Limpiar filtros» a `space/gap/lg`, padding inferior `space/padding/md` |
| Filas | padding vertical `space/padding/sm`, línea `color/border/subtle`, Hover `color/surface/faint` |
| Entre columnas | `space/gap/lg` entre columnas de datos (en la propuesta, `space/gap/sm`: quedaban pegadas) |
| Tarjeta | padding vertical `space/padding/lg`, gap `space/gap/md`, datos `role/body-compact-regular` + `role/body-medium` a `space/gap/xs` |
| Vacío | `space/section/sm` arriba, `space/section/md` abajo, gap `space/gap/sm-md` |

## Pendientes

- `TODO` (token): miniatura de la fila 64 (se usa `layout/search-thumb`, 48) y de la tarjeta 72 (se usa `layout/gallery-thumb`, 76 en Mobile); buscador de 480 (se usa `layout/search-field`, 360); ayuda del vacío de 560 (se usa `layout/measure-wide`); barras de carga de 12 y 14.
- `TODO` (diseño): qué datos van en la tarjeta Mobile (hoy Potencia, Temp., Ángulo e IP; la propuesta tiene Flujo lum., que ya no es columna).
- El encabezado de la tabla usa `role/label-lg`, que va en mayúsculas; en la propuesta se ve en caja normal.
