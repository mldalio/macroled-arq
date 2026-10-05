# compare-table · `<arq-compare-table>`

Tabla de la página Comparativa: hasta 3 productos, un grupo por sección y una fila por dato. Componente contenedor solo de código (decisión 2026-10-02 · Comparativa) que arma adentro **compare-group**, **compare-section-group** y **compare-row**.

- Figma: compare-group [1263-4320](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4320) · compare-section-group [1769-26234](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1769-26234) · compare-row [1263-4317](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4317) · fichas `doc/compare-group` y `doc/compare-row`

```html
<arq-compare-table></arq-compare-table>
```

```js
tabla.data = {
  products: [{ sku, name, meta, image }], // hasta 3, en el orden de ?sku=
  groups: [
    { label: 'Características lumínicas', rows: [{ label: 'Flujo luminoso', values: ['850 lm', '1250 lm', '850 lm'] }] },
  ],
};
// "Solo diferencias" lo decide arq-compare-header (arriba de la tabla, en la página):
header.addEventListener('arq:differences', (e) => (tabla.onlyDifferences = e.detail.value));
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| toggle "Solo diferencias" | `only-differences` | `onlyDifferences` | Booleano. Oculta las filas con todos los valores iguales y el grupo que queda vacío. Lo pone la página desde el toggle de `arq-compare-header` |
| — (datos) | — | `data` | `{ products, groups }` (arriba). Un valor que falta se muestra como «—» |
| — | `label` | `label` | Nombre de la región con scroll. Por defecto "Comparación de productos" |
| — | `embedded` | `embedded` | Booleano. El scroll horizontal (y su foco de teclado) lo maneja el contenedor de afuera — lo usa `arq-comparativa` para compartir un solo scroll con `arq-compare-header` en Mobile |
| Breakpoint | — | — | Media query: hasta 767 px, etiqueta fija y columnas de `layout/compare-column` |

- **Tabla real** (`<table>`): cada valor se anuncia con su producto (encabezado de columna) y su dato (encabezado de fila). El `<thead>` no muestra nada: solo texto `visually-hidden` con nombre y SKU de cada producto, para que un lector de pantalla anuncie la columna. La identidad visible de cada producto (foto, nombre, selects, quitar) la muestra **arq-compare-header**, siempre arriba de la tabla en la página.
- **Siempre 3 columnas de valor**, como `arq-compare-header` (que siempre muestra 3 compare-product): con menos de 3 productos, las columnas de más quedan en blanco en vez de desaparecer, para que la tabla no se estire al ancho que haya y las líneas queden donde quedarían con 3.
- **Un solo scroll** horizontal para la cabecera y las filas (salvo con `embedded`, ver arriba). La región tiene foco para desplazarla con teclado.
- **Quitar un producto** es acción de `arq-compare-header` (`arq:remove { sku }`), no de esta tabla: la página actualiza `?sku=` y vuelve a pasar `data` a los dos componentes.
- **Al final, `space/section/xl`** antes de lo que sigue en la página (como en Final: esa separación vive en el padding inferior del scroll de la tabla, no afuera).
- **Mobile (compare-row Breakpoint=Mobile):** la etiqueta pasa a ocupar toda la fila arriba (en vez de una columna fija al costado) y los 3 valores quedan en su propia línea debajo, dentro del mismo `<tr>` (con `flex-wrap`, no un segundo `<tr>`). Ya no hay columna sticky: todo el bloque, compare-header incluido, se desplaza junto con `embedded` (ver demo/comparativa.html). `<table>`, `<thead>` y `<tbody>` pasan a `display: block` para que el margen entre filas (compare-section-group) funcione; `compare-table.js` agrega `role="table"/"row"/"cell"/…` explícitos porque algunos lectores de pantalla pierden la semántica de tabla al cambiarle el display.
- **compare-section-group:** separación entre el título del grupo y su primera fila (`space/padding/md`) y entre filas (`space/gap/sm`), en Mobile.
- Los datos los arma `src/data/` (la tabla no consulta). Cantidad de grupos y filas libre.

## Tokens

| Parte | Token |
| --- | --- |
| Etiquetas | `layout/compare-label` (200, Desktop), `role/body` (Mobile `role/body-sm`) en `color/text/secondary`; separación `space/gap/lg` (Desktop) |
| Valores | `role/body-lg-regular` en `color/text/primary`, `space/padding/md` a la izquierda con línea `border/default` en `color/border/subtle` (la primera columna no lleva línea). Mobile: columnas de `layout/compare-column` (160), gap `space/gap/md` entre ellas |
| Filas | padding vertical `space/padding/md` (Mobile: `space/padding/xs` en la etiqueta, `space/padding/sm` en los valores), línea inferior `color/border/subtle`, fondo `color/bg/default` |
| compare-group | `role/label` en `color/text/primary`; arriba `space/gap/2xl`, abajo `space/padding/sm-md`; línea inferior `border/default` en `color/border/strong` |
| compare-section-group (Mobile) | gap entre filas `space/gap/sm`; separación con el grupo `space/padding/md` |
| Márgenes | `layout/gutter` a los lados, dentro del scroll (va a sangre en la página) |

## Pendientes

- `TODO` (datos): qué grupos y filas trae la comparativa sale de las columnas técnicas de la base (`docs/typesense-schema.md`).
