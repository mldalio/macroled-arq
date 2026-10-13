# search-sheet · `<arq-search-sheet>` (prueba)

Búsqueda de Desktop como **top sheet**: un panel que baja desde arriba, a todo el ancho, con scrim. Barra (logo + cerrar), search-field `type="line"` y el contenido según el estado.

> **Componente de prueba: no existe en Figma.** Ni el sheet, ni el Type=Line de search-field, ni el `search="sheet"` del navbar. Si se adopta, diseñarlo primero en Figma (TODO).

```html
<arq-navbar search="sheet">…</arq-navbar>   <!-- el navbar lo arma y lo alimenta -->
```

```html
<arq-search-sheet state="recommended">
  <arq-product-card slot="recommended" size="small" href="…">…</arq-product-card>
  <arq-button slot="all" type="underline" show-underline show-icon icon="arrow-right" href="/arq/productos">Ver todos los productos</arq-button>
  <div slot="results">…search-result, search-see-all…</div>
</arq-search-sheet>
```

```js
sheet.show(botonLupa); // el foco vuelve a botonLupa al cerrar
```

## Props

| Atributo / slot | Valores |
| --- | --- |
| `state` | `recommended` (campo vacío), `results`, `no-results`. Lo pone quien lo usa |
| `open` | booleano. Mejor `show(opener)` y `close()` |
| `label` | Nombre del diálogo. Por defecto "Buscar" |
| `recommended-title` | Título de los recomendados. Por defecto "Productos recomendados" |
| slot `recommended` | Tarjetas (product-card Size=Small) en una fila con scroll horizontal sin barra: 6 en Desktop, 4 en Tablet, 2 en Mobile, con la siguiente asomando |
| slot `all` | El link a todos los productos (button Underline) |
| slot `results` | Resultados. El navbar arma dos grupos: **Productos** (search-result `type="simple"`: miniatura y nombre, sin SKU) a la izquierda y **Colecciones** ([search-collection](../search-collection/README.md)) a la derecha en grilla; con un solo grupo, una columna; hasta 1023 px, apilados. Cierra con search-see-all, o `search-dropdown state="no-results"` |

- **Diálogo modal nativo** (`<dialog>` + `showModal()`): foco en el campo, Esc / cruz / clic en el scrim cierran y emiten `arq:close`. La página de atrás no se desplaza (`scroll-lock`).
- Baja con `@keyframes arq-search-sheet-in` (solo `transform`, `motion/duration/base`). No hay animación de cierre.
- Los eventos del campo (`arq:input`, `arq:submit`, `arq:navigate`) salen del componente; `field` devuelve el search-field.
- **Solo Desktop.** En Mobile el navbar sigue usando search-screen.

## Tokens

| Parte | Token |
| --- | --- |
| Panel | fondo `color/surface/default`, sin sombra |
| Scrim | `color/overlay/scrim` |
| Barra | alto `space/gap/md` × 2 + `icon/xl` (igual al navbar), margen `--page-gutter` |
| Contenido | padding `space/gap/xl` arriba, `space/section/2xs` abajo, gap `space/gap/lg`; tarjetas con gap `space/gap/md` |
| Título | `role/label`, `color/text/tertiary` |
| Resultados | ancho máximo `layout/search-field` |

## TODO

- Diseño en Figma (sheet, Mobile y Type=Line de search-field).
- Criterio de «recomendados» (`getRecommendedProducts` en `src/data/catalog.js` toma hoy los primeros del catálogo con foto).
- Animación de cierre, flechas del carrusel de recomendados.
