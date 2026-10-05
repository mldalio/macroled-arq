# catalog-listing · `<arq-catalog-listing>`

Listado de Productos (y de Colecciones con `unit="colecciones"`): navegación de categorías, catalog-toolbar, grilla de product-card, filter-panel y compare-bar. Es un contenedor de página que pide los datos a `src/data/catalog.js`, como el navbar. Pantallas: Final, Productos (`1153:5679` · `1155:5837` · filtros `1199:20568`). Decisión: `docs/decisiones.md`, 2026-10-02 · Productos.

```html
<arq-catalog-listing>
  <arq-catalog-nav slot="nav" label="Categorías">
    <arq-catalog-nav-group>
      <span slot="label">Interior</span>
      <arq-catalog-nav-item href="/arq/productos?environment=Interior">Todo interior</arq-catalog-nav-item>
      …
    </arq-catalog-nav-group>
    …
  </arq-catalog-nav>
  <h2 slot="filter-title">Filtrar</h2>
</arq-catalog-listing>
```

## Props y slots

| Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- |
| `unit` | `unit` | `productos` · `colecciones` (def. `productos`) |
| slot `nav` | — | un `arq-catalog-nav` con los links de categoría (en el HTML: indexables) |
| slot `filter-title` | — | el `<h2>` del filter-panel ("Filtrar") |

## Comportamiento

- **Categoría:** sale de la URL (`?environment=`, `?application=`, `?product_type=`, como `categoryHref`). Las URLs de categoría siguen PENDIENTES (`docs/urls.md`). El `catalog-nav-item` cuyo `href` es esta misma página queda `selected` (el orden de los parámetros no importa).
- **Título:** el `<h1>` del page-header (`[slot="title"]`) pasa a ser el nombre del grupo del ítem actual: Interior, Exterior, Lámparas y artefactos o Colecciones. Sin ítem actual (Productos sin categoría) queda el del HTML. El HTML de la página sigue imprimiendo "Productos" (lo que lee un buscador sin JS) mientras las URLs de categoría sigan PENDIENTES.
- **Cards:** una por grupo (`listProducts`) o por colección (`listCollections`). En Productos: acabados (swatch) y "Comparar"; en Colecciones: acabados de todos sus grupos y la meta (sus aplicaciones), como Final (`1160:6116`). El nombre es un `<h2>` (debajo del `<h1>` del page-header).
- **Filtros:** las filas del filter-panel salen de los datos de la categoría. Mientras se marcan, solo cambia "Ver N productos"; "Ver N" aplica, la grilla se arma de nuevo y el toolbar muestra el total y la cantidad de filtros.
- **Comparar** (solo Productos): suma o saca el producto de la compare-bar (hasta 3; si ya hay 3, la card se desmarca). La selección se guarda en `localStorage` (`arq:compare`) y las cards la reflejan al cargar.
- **Iluminar:** lo resuelve catalog-toolbar (`data-arq-theme="dark"` en `<html>`); las cards pasan a sus imágenes encendidas.
- **Compare-bar fija:** al final del listado queda un espacio de su alto, así no tapa las últimas cards ni el footer.
- **Estados:** mientras carga, `aria-busy="true"` y "Cargando productos…"; sin resultados, "No hay productos con estos filtros."; si falla el catálogo, un mensaje de error. Los mensajes van en `role="status"`.

## Layout

| | Desde 1024 px | Hasta 1023 px | Hasta 767 px |
| --- | --- | --- | --- |
| Armado | sidebar a la izquierda, contenido a la derecha a `space/section/sm` | nav (catalog-nav-mobile), toolbar y grilla apilados a `space/gap/xl` | ídem |
| Toolbar → grilla | `space/gap/xl-2xl` | `space/gap/xl-2xl` | `space/gap/xl` |
| Grilla | `arq-grid` sin `columns` (auto-fill con `layout/card-min`; filas a `space/gap/2xl`, columnas a `space/gap/lg`) | ídem | filas a `space/gap/xl`, columnas a `space/gap/md` |
| Padding | `layout/gutter` a los lados, `space/section/xl` abajo | ídem | ídem (valores Mobile) |

## Pendientes

- `TODO` (diseño): el sidebar mide 240 en Figma y no hay token; se usa `layout/card-min` (280). Entre sidebar y contenido el set usa `space/section/sm`, un token de separación entre bloques.
- `TODO` (diseño): no hay pantalla de carga, vacío ni error; los textos son provisorios.
- `TODO` (urls): los filtros aplicados no van en la URL (se pierden al recargar).
- `TODO` (acabados): los swatch de las cards no tienen imagen (muestran el neutro).
