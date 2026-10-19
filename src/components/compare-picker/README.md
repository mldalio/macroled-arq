# compare-picker · `<arq-compare-picker>`

Modal «Agregar producto» de la comparativa. Lo abren el lugar vacío (+) de `compare-bar` en Productos y el `compare-product` vacío (y el «Agregar producto» de la cabecera compacta) en Comparativa. No consulta: la página le pasa los productos y agrega lo que se elige.

- Figma: [2724-8761](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2724-8761) (sección Compare picker [2723-8349](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2723-8349)) · sin ficha `doc/compare-picker` todavía

```html
<arq-compare-picker></arq-compare-picker>
```

```js
import { listCompareCandidates } from '../../data/catalog.js';

picker.addEventListener('arq:search', async () => {
  picker.count = elegidos.length;
  picker.items = (await listCompareCandidates({ ...picker.search, selected: elegidos })).items;
});
picker.addEventListener('arq:add', (e) => agregar(e.detail.item)); // { id, sku, name, meta, image }
boton.addEventListener('click', () => picker.show(boton));         // emite arq:search
```

Lo usan `catalog-listing` (Productos: agrega a la compare-bar) y `comparativa` (suma el SKU a `?sku=` y rearma la comparación detrás del modal).

## Props, métodos y eventos

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Breakpoint | — | — | Media query: Desktop centrado sobre el scrim; Mobile (hasta 767 px) pantalla completa |
| State=Results / No results | — | `items` | `[{ id, sku, name, meta, image, added }]` (otros campos, como `cardMeta`, vuelven tal cual en `arq:add`). Sin ítems: «No encontramos productos para «…».» + «Probá con otro nombre, SKU o familia.», sin CTA |
| — | — | `count` | Productos ya elegidos. Con 3, las filas no agregadas pasan a Disabled |
| — | `href` | `href` | URL de «Ver todos los productos». Por defecto `/arq/productos` (en Productos, el listado sin categoría) |
| — | `open` | `open` | Booleano. Abierto |
| — | slot `title` | — | Título. Por defecto «Agregar producto» |
| — | — | `search` | Solo lectura: `{ query }` actual |

- **`show(opener)`** abre el modal sin búsqueda y en «Todos» y emite `arq:search`. **`close()`** lo cierra.
- **`arq:search { query }`**: al abrir y al escribir en el buscador.
- **Sin filtros de categoría:** el set trae choice-chip Todos · Interior · Exterior · Lámparas y artefactos; se sacaron a pedido (`docs/decisiones.md`, 2026-10-19 · compare-picker). Se busca solo con el buscador.
- **`arq:add { item }`**: «Agregar» en una fila. El modal sigue abierto y anuncia «Kanu Jardín agregado a la comparación.».
- **`arq:close { restored }`**: al cerrar. `restored` es `false` si el foco no pudo volver a quien lo abrió (el lugar vacío pasó a tener producto); la página lo mueve (Productos: al próximo lugar vacío de la barra o a su «Comparar»; Comparativa: al próximo compare-product vacío o al nombre del último producto).
- **Diálogo modal nativo** (`<dialog>` + `showModal`), como download-modal: el foco queda adentro, Esc (también con texto en el buscador), el scrim o la X lo cierran, y la página de atrás no se desplaza (`containScroll`). Con mouse el foco entra al buscador; en táctil, a la X (no abre el teclado).
- **Siempre en Light** (`data-arq-theme="light"` en el `<dialog>`, DESIGN.md §2 · Light local).
- **Lectores de pantalla:** una región `aria-live` (siempre presente y vacía) anuncia la cantidad de resultados después de buscar o filtrar, «no encontramos…» y lo que se agrega.
- **Movimiento:** el scrim funde y el panel funde y sube un 2 %, con `motion/duration/panel` y `motion/easing/standard`; cierra por el mismo camino. Con movimiento reducido, solo el fundido (`motion/duration/fade`).

## Datos

`listCompareCandidates({ query, selected })` (`src/data/catalog.js`): un producto por grupo (los que se listan), con su SKU predeterminado; si la búsqueda coincide por SKU, ese SKU. La búsqueda usa el mismo criterio que el buscador del sitio (nombre, colección, aplicación o SKU, sin tildes ni mayúsculas). `added` marca los grupos que ya tienen algún SKU en `selected`.

**Typesense:** los productos salen de Typesense, como todo el sitio: el catálogo se pide una sola vez por visita (`loadCatalog`, la misma consulta que usan los listados, guardada en `sessionStorage`). Buscar y filtrar en el modal no hace una consulta nueva por cada letra: se filtra ese catálogo en memoria, con el mismo criterio que el buscador del navbar y `?q=` de Productos (decisiones.md, 2026-10-02 · Listados: una sola consulta).

## Tokens

| Parte | Token |
| --- | --- |
| Panel | `color/surface/default`, borde `border/default` en `color/border/default`, padding `space/padding/xl-2xl`, gap `space/gap/lg`; ancho `layout/filter-panel` (Desktop) |
| Scrim | `color/overlay/scrim` |
| Título | `role/heading-2` en `color/text/primary`; cerrar: icon-button Large |
| Buscador | search-field `type="line"` |
| Lista | compare-picker-item; en Desktop, el alto de 5 filas (las demás se desplazan adentro) |
| Sin resultados | `role/body-regular` en `color/text/primary` + `role/body-compact` en `color/text/tertiary`, a `space/gap/md`, centrado |
| Ver todos los productos | button Underline con subrayado (`show-underline`) e `icon/arrow-right`, a la derecha |

## Pendientes

- `TODO` (Figma): no hay ficha `doc/compare-picker` ni `doc/compare-picker-item` en la página Documentación.
- `TODO` (diseño): el alto del panel en Desktop no tiene token: se arma con 5 filas de lista, como el set (sin los chips queda más bajo que los 760 del set). Si la pantalla es más baja, la lista se achica.
- `TODO` (diseño): la lupa del buscador sale de search-field `type="line"` (`color/icon/tertiary`); el set del modal la dibuja con `color/icon/primary`.
- `TODO` (Figma): sacar del set los choice-chip de categoría y cambiar «Comparar» (Filled) por «Ver todos los productos» (Underline), como en código.
- `TODO` (Figma): en Mobile, la compare-bar suma un lugar vacío debajo de los elegidos para abrir el modal; el set de compare-bar Mobile no lo muestra.
