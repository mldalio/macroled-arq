# compare-picker-item · `<arq-compare-picker-item>`

Fila del modal «Agregar producto» de la comparativa (`compare-picker`): miniatura, nombre, meta y el botón «Agregar». No se usa suelta: la arma `compare-picker` con los datos que le pasa la página.

- Figma: [2723-8420](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2723-8420) · sin ficha `doc/compare-picker-item` todavía

```html
<arq-compare-picker-item sku="KANU-J-500-12W-N-WW" image="…/kanu.jpg">
  <span slot="name">Kanu Jardín</span>
  <span slot="meta">Exterior · Jardín</span>
</arq-compare-picker-item>
<arq-compare-picker-item added>…</arq-compare-picker-item>      <!-- Agregado -->
<arq-compare-picker-item disabled>…</arq-compare-picker-item>   <!-- ya hay 3 -->
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Name | slot `name` | — | Nombre del producto |
| Meta | slot `meta` | — | «Exterior · Jardín», «Lámparas y artefactos · Colgante». Opcional |
| State=Default / Hover | — | — | Hover es `:hover` de la fila (solo con mouse) |
| State=Added | `added` | `added` | Booleano. Ya está en la comparativa: «Agregado», sin ícono, deshabilitado |
| State=Disabled | `disabled` | `disabled` | Booleano. Ya hay 3 productos: «+ Agregar» deshabilitado, textos en `color/text/disabled` y miniatura atenuada |
| — (foto) | `image` | `image` | URL de la miniatura. Sin imagen (o si no carga): fondo `color/surface/subtle` |
| — | `sku` | `sku` | SKU que se agrega |

- **«Agregar»** (button Outline con `icon/plus` adelante) emite `arq:add { sku }`. Su nombre accesible suma el producto: «Agregar Kanu Jardín».
- Nombre y meta en una línea; si no entran, terminan en «…».
- `focus()` va a «Agregar».
- Lleva `role="listitem"` (la lista del modal es `role="list"`).

## Tokens

| Parte | Token |
| --- | --- |
| Fila | padding `space/padding/md` × `space/padding/sm-md`, gap `space/gap/md`, línea inferior `border/default` en `color/border/subtle`; Hover `color/surface/hover` |
| Miniatura | `layout/search-thumb` (48 × 48), fondo `color/surface/subtle` |
| Textos | nombre `role/body-compact-regular` en `color/text/primary`; meta `role/caption` en `color/text/tertiary`; gap `space/gap/xs` |
| Botón | button Outline (Disabled: `color/border/disabled` y `color/text/disabled`) |

## Pendientes

- `TODO` (token): no hay token de opacidad; la miniatura Disabled va al 50 % (`0.5`, como `--busy-opacity` de catalog-listing).
