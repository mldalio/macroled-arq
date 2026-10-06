# compare-product · `<arq-compare-product>`

Columna de producto dentro de compare-header: foto, nombre con link a la ficha, SKU y **un select por atributo de variante** (Color, Altura…), igual que el configurador de la ficha (State=Filled); o una caja clickeable para agregar un producto cuando queda un lugar libre, del alto de la columna (State=Empty, hasta 3 columnas). No hay select de familia: para cambiar de producto se quita la columna y se agrega otra. **Size=Compact** es la versión mini que usa el compare-header Compact: miniatura + nombre (+ SKU) + quitar, o una caja punteada «Agregar producto».

- Figma: [1057-2522](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1057-2522) (+ Hover de Empty: [1769-26241](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1769-26241)) · ficha `doc/compare-product`

```html
<arq-compare-product></arq-compare-product>
```

```js
product.data = {
  sku: 'KANU-J-500-12W-N-WW',
  name: 'Kanu Jardín',
  href: '/arq/producto/kanu-jardin',
  image: 'https://…/kanu.jpg',
  // uno por campo de VARIANT_ATTRIBUTES, como el configurador de la ficha
  attributes: [
    { field: 'color_carcasa', label: 'Color', value: 'Negro', options: [{ value: 'Negro', label: 'Negro', showSwatch: true }, { value: 'Verde', label: 'Verde', showSwatch: true }] },
    { field: 'altura', label: 'Altura', value: '50 cm', options: [{ value: '50 cm', label: '50 cm' }, { value: '90 cm', label: '90 cm', disabled: true }] },
  ],
};

// State=Empty: sin data, la caja entera es un botón
product.data = null;

// Size=Compact: mismos datos, sin selects ni link
compact.size = 'compact';   // o <arq-compare-product size="compact" show-sku>
compact.showSku = true;
product.addEventListener('arq:add', () => abrirModalDeProductos()); // TODO: el modal no existe todavía
```

## Props

| Figma | Prop JS | Valores · por defecto |
| --- | --- | --- |
| Name, SKU | `data` (getter/setter) | `{ sku, name, href, image, attributes }` o `null` (Empty). `attributes`: `[{ field, label, value, options: [{ value, label, disabled?, showSwatch? }] }]` |
| State | atributo `empty` | Lo pone el componente: Empty si `data` es `null` |
| — | `addLabel` | Texto junto al `+` de Empty. Por defecto "Agregar producto" |
| Size | `size` | `default` · `compact`. Por defecto `default` |
| Show SKU | `show-sku` | `showSku`, booleano. Solo aplica a `size="compact"`: muestra el SKU bajo el nombre (el compare-header lo activa en Desktop y lo apaga en Mobile). En Figma la prop viene activada; en código va desactivada por defecto (atributo de presencia). En Default el SKU siempre se ve |

- **No consulta Typesense**: la página arma `attributes` con `src/data/catalog.js` (`getCompare()`, que usa las mismas funciones de `src/data/variants.js` que la ficha) y vuelve a asignar `data` cuando cambian (AGENTS.md · Datos).
- **Quitar** (icon-button `icon/close`, "Quitar {nombre}") emite `arq:remove { sku }`. Solo en Filled.
- **Selects**: un `arq-select` Type=Field por atributo de variante, con la misma disponibilidad que la ficha (una opción que no forma un SKU va deshabilitada). Elegir emite `arq:change { field, value }`, donde `field` es el campo del atributo (`'altura'`, `'color_carcasa'`…); la página resuelve el nuevo SKU (`skuForAttribute()`) y vuelve a asignar `data`. La muestra de color solo aparece en los atributos de acabado (`showSwatch`, ver `select`).
- **Empty es un `<button>`** que ocupa toda la caja: emite `arq:add` al clickear. `TODO` (diseño + código): no abre nada todavía — la ficha dice que más adelante abre un modal para elegir producto; por ahora solo está resuelto el Hover (fondo `color/surface/faint`, borde `color/border/strong`).
- El nombre es un link a la ficha (`icon/arrow-up-right`) con `aria-label` "Ver ficha de {nombre}".
- La imagen mantiene proporción 1:1 (`aspect-ratio` bloqueado) con tope `layout/compare-media-max`: al cambiar el ancho de la columna, el alto de la media acompaña. **Empty no es 1:1**: ocupa el 100% del alto de la columna (como un Filled completo) — por eso `arq-compare-header` estira sus columnas a la misma altura (`align-items: stretch`).

## Size=Compact

- **Filled** (Figma 1912:5841): miniatura `layout/compare-thumb` en `color/surface/subtle` (con la imagen si hay), nombre en `role/label` y SKU en `role/body-sm`, gap `space/gap/sm-md`, y `arq-icon-button` de cerrar (`arq:remove { sku }`). El nombre no es link y no hay selects.
- **Empty** (1912:5860): caja punteada `color/border/default` del alto de la miniatura, `padding-inline` `space/padding/md`, con `icon/plus` (`icon/md`) y el texto en `role/body-sm` en `color/text/secondary`. Emite `arq:add`.
- **empty-hover** (1912:5864): `:hover`, fondo `color/surface/faint` y borde `color/border/strong`.
- Reemplaza a `arq-compare-slot` en compare-header; compare-slot queda solo para compare-bar.

## Tokens

| Parte | Token |
| --- | --- |
| Fondo de media (Filled) | `color/bg/subtle` |
| Borde (Empty) | `color/border/default`, punteado; Hover `color/border/strong` |
| Fondo (Empty Hover) | `color/surface/faint` |
| Ícono «+» (Empty) | `icon/xl` (24) con padding `space/padding/sm-md` (icon-button Large, Background=None: sin fondo) |
| Ancho máximo de foto | `layout/compare-media-max` (2000) |
| Gap general | `space/gap/lg`; selects `space/gap/sm-md` |
| Nombre | `role/heading-3` en `color/text/primary` |
| SKU y labels de select | `role/label` en `color/text/tertiary` |
| Texto «Agregar producto» | `role/body` en `color/text/secondary` |
| Valores de select | `role/body-regular` (vía `arq-select`) |
| Compact: miniatura | `layout/compare-thumb` (48), fondo `color/surface/subtle` |
| Compact: nombre · SKU | `role/label` en `color/text/primary` · `role/body-sm` en `color/text/secondary`; gap `space/gap/xs` |
| Compact Empty | borde `color/border/default` punteado; Hover `color/surface/faint` + `color/border/strong`; padding `space/padding/md`; texto `role/body-sm` en `color/text/secondary` |
