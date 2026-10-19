# compare-header · `<arq-compare-header>`

Cabecera de la página Comparativa: toggle "Solo diferencias" (al pie de la columna de controles, a la altura del último select) + hasta 3 compare-product, estiradas a la misma altura. Cuando el bloque completo termina de pasar al desplazar, se muestra una versión mini fija arriba (compare-product Size=Compact por producto y el toggle debajo; compare-slot ya no se usa acá). El cambio Default ↔ Compact no es una prop: lo decide el propio componente con un `IntersectionObserver`.

- Figma: [1265-4330](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1265-4330) · ficha `doc/compare-header`

```html
<arq-compare-header></arq-compare-header>
```

```js
header.products = [
  {
    sku: 'KANU-J-500-12W-N-WW', name: 'Kanu Jardín', href: '/arq/producto/kanu-jardin', image: '…', meta: 'Exterior · Jardín',
    attributes: [{ field: 'altura', label: 'Altura', value: '50 cm', options: [{ value: '50 cm', label: '50 cm' }] }], // uno por atributo de variante, como la ficha
  },
  null, // lugar vacío → compare-product State=Empty (caja clickeable, sin selects)
  null,
];
header.onlyDifferences = false;

header.addEventListener('arq:differences', (e) => (table.onlyDifferences = e.detail.value));
header.addEventListener('arq:remove', (e) => quitarDeLaComparativa(e.detail.sku));
header.addEventListener('arq:change', (e) => elegir(e.detail.index, e.detail.field, e.detail.value)); // field: el campo del atributo
header.addEventListener('arq:add', (e) => picker.show()); // compare-picker
```

## Props

| Figma | Prop JS | Valores · por defecto |
| --- | --- | --- |
| — | `products` | Hasta 3: `{ sku, name, href, image, meta, attributes }` o `null` (Empty). Siempre se muestran 3 columnas, estiradas a la misma altura |
| Toggle | `onlyDifferences` | Boolean. Valor del toggle "Solo diferencias" (Default y Compact comparten el mismo) |
| — | `diffLabel` | Texto del toggle. Por defecto "Solo diferencias" |

- **No consulta Typesense**: la página arma `products` con `src/data/catalog.js` (AGENTS.md · Datos).
- **Eventos:** `arq:differences { value }` al tocar el toggle; `arq:remove { sku }` al quitar un producto (Default o Compact); `arq:change { index, field, value }` al elegir un select en un compare-product (`index`: 0-2, qué columna); `arq:add { index }` al clickear un lugar vacío (sin acción todavía, ver compare-product).
- **Type (Default/Compact) no es una prop**: un `IntersectionObserver` sobre un centinela al final del bloque Default decide cuándo mostrar el Compact. En Mobile, Compact oculta la navbar y queda fijo arriba; al volver a tocar Default al subir, se quita y restaura la navbar.
- **`layout/navbar-height` no existe** (`docs/decisiones.md`, 2026-10-01 · hero, `TODO` abierto): mientras tanto se mide el alto real de `<arq-navbar>` en el DOM de la página con `getBoundingClientRect()` y se vuelve a medir en cada resize.

## Scroll horizontal en Mobile

En Mobile, el Default desplaza solo la tira de productos (columnas de `layout/compare-column`, 160, igual que los valores de compare-table; el gutter va dentro de la tira y el scroll llega al borde derecho); el resto de la cabecera queda fijo. Dentro de `arq-comparativa` va con `embedded`: la tira no tiene scroll propio y se desplaza con el contenedor de la página, junto con compare-table (un solo scroll, como macroled.com.ar/comparativa); la tira del Compact sigue ese desplazamiento. Si se usa compare-header suelto en Mobile (como en `demo/index.html`), su tira de productos conserva scroll propio.

## Adaptaciones sobre el set de Figma

- **Sin controles en el Default de Mobile:** el set no muestra ahí ni el toggle ni una columna de controles (a diferencia de Desktop, que sí tiene su columna de 200): las columnas de producto arrancan directo en el gutter.
- **Compact/Mobile:** la tira de productos sigue el scroll del contenedor de la comparativa (y, si se desliza ella, lo mueve); el toggle "Solo diferencias" queda debajo, fuera de la tira desplazable. Al aparecer Compact, oculta la navbar Mobile y ocupa el borde superior hasta que vuelve a mostrarse Default.
- **Compact/Mobile como macroled.com.ar/comparativa** (2026-10-19): cada producto ocupa exactamente una columna de compare-table (`layout/compare-column`, con la misma línea vertical `color/border/subtle` y el mismo padding que un valor), así cabecera y filas quedan alineadas mientras se desplazan. Dentro de la columna, miniatura, nombre y SKU van apilados y centrados, sin recortar el nombre; quitar va en la esquina superior derecha y «Agregar producto» toma el alto de la columna. En Figma: compare-product Size=Compact, Breakpoint=Mobile dentro de la variante Type=Compact, Breakpoint=Mobile.
- **Compact usa compare-product Size=Compact** (cambio de 2026-10-06): miniatura + nombre + quitar, y un lugar libre es la caja punteada «Agregar producto» (`arq:add { index }`). El SKU se muestra en Desktop y en Mobile (`show-sku`).
- **Ancho de la columna de controles (Desktop):** sin token propio para 200; se reusa `layout/compare-label` (mismo valor, usado también en compare-table) con un comentario `TODO` en el CSS.

## Tokens

| Parte | Token |
| --- | --- |
| Padding lateral | `layout/gutter` (40 Desktop · 20 Mobile) |
| Gap entre columnas | `space/gap/xl` (32 Desktop · 24 Mobile) |
| Columna de controles (Desktop) | `layout/compare-label` (200, reusado) |
| Ancho máximo de foto (vía compare-product) | `layout/compare-media-max` |
| Fondo / borde del Compact | `color/surface/default` · `color/border/subtle` |
