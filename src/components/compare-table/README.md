# compare-table · `<arq-compare-table>`

Tabla de la página Comparativa: hasta 3 productos, un grupo por sección y una fila por dato. Componente contenedor solo de código (decisión 2026-10-02 · Comparativa) que arma adentro **compare-group** y **compare-row**.

- Figma: compare-group [1263-4320](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4320) · compare-row [1263-4317](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1263-4317) · fichas `doc/compare-group` y `doc/compare-row`

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
tabla.addEventListener('arq:remove', (e) => quitar(e.detail.sku));
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| toggle "Solo diferencias" | `only-differences` | `onlyDifferences` | Booleano. Oculta las filas con todos los valores iguales y el grupo que queda vacío |
| — (datos) | — | `data` | `{ products, groups }` (arriba). Un valor que falta se muestra como «—» |
| — | `label` | `label` | Nombre de la región con scroll. Por defecto "Comparación de productos" |
| Breakpoint | — | — | Media query: hasta 767 px, etiqueta fija y columnas de `layout/compare-column` |

- **Tabla real** (`<table>`): cada valor se anuncia con su producto (encabezado de columna) y su dato (encabezado de fila).
- **Un solo scroll** horizontal para la cabecera y las filas. La región tiene foco para desplazarla con teclado.
- **Quitar** (icon-button de cada producto) emite `arq:remove { sku }`; la página actualiza `?sku=` y vuelve a pasar `data`.
- Los datos los arma `src/data/` (la tabla no consulta). Cantidad de grupos y filas libre.

## Tokens

| Parte | Token |
| --- | --- |
| Etiquetas | `layout/compare-label` (200 · Mobile 120), `role/body` (Mobile `role/body-sm`) en `color/text/secondary`; separación `space/gap/lg` |
| Valores | `role/body-lg-regular` en `color/text/primary`, `space/padding/md` a la izquierda con línea `border/default` en `color/border/subtle`. Mobile: columnas de `layout/compare-column` (160) |
| Filas | padding vertical `space/padding/md`, línea inferior `color/border/subtle`, fondo `color/bg/default` |
| compare-group | `role/label` en `color/text/primary`; arriba `space/gap/2xl`, abajo `space/padding/sm-md`; línea inferior `border/default` en `color/border/strong` |
| Márgenes | `layout/gutter` a los lados, dentro del scroll (va a sangre en la página) |

## Pendientes

- `TODO` (compare-header / compare-product): la cabecera es provisoria, con compare-slot (Default; Compact en Mobile con el nombre debajo). Falta la cabecera Default con compare-product (selects de colección, producto y variante) y la Compact fija al hacer scroll, cuando esté el rediseño en Figma.
- `TODO` (datos): qué grupos y filas trae la comparativa sale de las columnas técnicas de la base (`docs/typesense-schema.md`).
