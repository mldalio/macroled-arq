# compare-header · `<arq-compare-header>`

Cabecera de la página Comparativa: toggle "Solo diferencias" + hasta 3 compare-product, estiradas a la misma altura. Cuando el bloque completo termina de pasar al desplazar, se muestra una versión mini fija arriba (compare-slot por producto y el toggle debajo). El cambio Default ↔ Compact no es una prop: lo decide el propio componente con un `IntersectionObserver`.

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
header.addEventListener('arq:add', (e) => abrirModalDeProductos(e.detail.index)); // TODO: el modal no existe todavía
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

En Mobile, el Default desplaza solo la tira de productos (`layout/compare-column`, como los valores de compare-row); el resto de la cabecera queda fijo. `arq-comparativa` sincroniza su `scrollLeft` con todas las filas de `arq-compare-table` y con la tira del Compact. Si se usa compare-header suelto en Mobile (como en esta demo, `demo/index.html`), su tira de productos conserva scroll propio.

## Adaptaciones sobre el set de Figma

- **Sin controles en el Default de Mobile:** el set no muestra ahí ni el toggle ni una columna de controles (a diferencia de Desktop, que sí tiene su columna de 200): las columnas de producto arrancan directo en el gutter.
- **Compact/Mobile:** la tira de productos se sincroniza con el Default y las filas de compare-table; el toggle "Solo diferencias" queda debajo, fuera de la tira desplazable. Al aparecer Compact, oculta la navbar Mobile y ocupa el borde superior hasta que vuelve a mostrarse Default.
- **Compact/Mobile sin quitar:** el `product` mobile del set no tiene icon-button de quitar (solo miniatura + nombre); para sacar un producto en mobile hay que volver a desplazarse hasta el Default. Replicado tal cual el set, aunque la ficha ("Código y accesibilidad") menciona un icon-button para quitar que no aparece en la variante estática.
- **Ancho de la columna de controles (Desktop):** sin token propio para 200; se reusa `layout/compare-label` (mismo valor, usado también en compare-table) con un comentario `TODO` en el CSS.

## Tokens

| Parte | Token |
| --- | --- |
| Padding lateral | `layout/gutter` (40 Desktop · 20 Mobile) |
| Gap entre columnas | `space/gap/xl` (32 Desktop · 24 Mobile) |
| Columna de controles (Desktop) | `layout/compare-label` (200, reusado) |
| Ancho máximo de foto (vía compare-product) | `layout/compare-media-max` |
| Fondo / borde del Compact | `color/bg/default` · `color/border/subtle` |
