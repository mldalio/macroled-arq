# catalog-listing · `<arq-catalog-listing>`

El título de una subcategoría es el nombre del ítem elegido; los enlaces principales de cada grupo conservan el nombre del grupo.

El listado usa cards de producto (una por grupo). No hay vista «Todas las colecciones»: se sacó el 2026-10-23 (`docs/archivo/todas-las-colecciones.md`).

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
| slot `nav` | — | un `arq-catalog-nav` con los grupos fijos (Interior, Exterior, Lámparas y artefactos, Colecciones) y su link «Todo…». Cada grupo con `data-arq-nav="interior · exterior · lamparas-artefactos · colecciones"` recibe el resto de sus links de los datos (`getCatalogNav()`: solo categorías con productos) |
| slot `filter-title` | — | el `<h2>` del filter-panel ("Filtrar") |

En Productos y Colecciones, en Mobile y Tablet (hasta 1023 px), el árbol de navegación aparece en la tab Categorías de Filtrar. Los grupos y enlaces se copian del `arq-catalog-nav` del HTML para conservar sus URLs y la selección actual. Desde 1024 px se ve el sidebar.

## Comportamiento

- **Categoría:** sale de la URL (`?environment=`, `?application=`, `?product_type=`, `?collection=` y `?family=`, como `categoryHref`). `?family=` (los nombres de la Home) lista las luminarias de esa familia y el título pasa a ser el nombre. Con `?collection=<id>` (las colecciones del catalog-nav), el listado muestra las cards de producto de esa colección (Kanu Pared y Kanu Jardín, con Comparar) y el título pasa al nombre de la colección. Una URL vieja con `?view=colecciones` muestra el listado de Productos. Con `?collection=<id>` el `<h1>` es el nombre de la colección y el breadcrumb queda «Inicio / Colecciones / nombre», donde «Colecciones» abre el mega-menu del navbar en su pestaña (`data-arq-menu`). Las URLs de categoría siguen PENDIENTES (`docs/urls.md`). El `catalog-nav-item` cuyo `href` es esta misma página queda `selected` (el orden de los parámetros no importa).
- **Cambio de categoría:** elegir una subcategoría del catalog-nav (misma página) no recarga la página: actualiza la URL (`history.pushState`), vuelve a pedir solo el listado y deja el scroll donde está. Atrás / Adelante del navegador hacen lo mismo. Los links a otra página (una colección) navegan normal.
- **Título:** el `<h1>` del page-header (`[slot="title"]`) pasa a ser el nombre del grupo del ítem actual: Interior, Exterior, Lámparas y artefactos o Colecciones. Sin ítem actual (Productos sin categoría) queda el del HTML. El HTML de la página sigue imprimiendo "Productos" (lo que lee un buscador sin JS) mientras las URLs de categoría sigan PENDIENTES.
- **Bajada:** la del page-header (`[slot="description"]`) pasa a ser la del grupo del ítem actual, que va en `data-arq-description` del `catalog-nav-group` (una por grupo: Interior, Exterior y Lámparas y artefactos; las subcategorías usan la de su grupo). Sin ítem actual, o si el grupo no la tiene (Colecciones), queda la del HTML. `TODO` (datos): provisoria en el HTML hasta que la bajada de cada categoría venga de Typesense.
- **Breadcrumb:** sigue al título, con hasta 3 niveles (Levels 3 · 2): Inicio / Productos sin categoría; Inicio / Productos / Interior en la vista completa de un grupo; Inicio / Exterior / Jardín en una subcategoría (el grupo enlaza a su vista completa); Inicio / Colecciones / Kanu en una colección; Inicio / Productos / Resultados para «…» con `?q=`. Los niveles que vuelven a este listado cambian la categoría sin recargar, como el catalog-nav. Sin categoría vuelven el `<h1>` y el breadcrumb del HTML.
- **Búsqueda:** `?q=` filtra el listado de Productos con el mismo criterio que el buscador del navbar (`searchProducts`): nombre, colección, aplicación, entorno, tipo o SKU, sin importar tildes, mayúsculas ni plural. Llegan acá "Ver todos los resultados" y Enter. Se combina con la categoría y los filtros; las filas del filter-panel salen de los resultados. Si coincide un SKU, la card abre esa variante. El `<h1>` pasa a «Resultados para «término»» y el vacío a «No encontramos productos para «término».» (el mismo texto que compare-picker State=No results). En Colecciones, `?q=` no se usa.
- **Cards:** una por grupo (`listProducts`), con acabados (swatch) y "Comparar". El nombre es un `<h2>` (debajo del `<h1>` del page-header).
- **Filtros:** las filas del filter-panel salen de los datos de la categoría. Mientras se marcan, solo cambia "Ver N productos"; "Ver N" aplica, la grilla se arma de nuevo y el toolbar muestra el total y la cantidad de filtros.
- **Comparar** (solo Productos): suma o saca el producto de la compare-bar (hasta 3; si ya hay 3, la card se desmarca y un aviso `aria-live` dice «Podés comparar hasta 3 productos…»; TODO diseño: no hay aviso visible en Figma). La selección se guarda en `localStorage` (`arq:compare`) y las cards la reflejan al cargar.
- **Movimiento** (decisión 2026-10-26 · Animaciones: auditoría de todo el sitio): las cards entran como las del Home (`src/base/reveal.js`: suben `space/gap/2xl` y aparecen al entrar en pantalla, escalonadas, después del preloader). Si se llegaron a ver las cards de carga, la entrada la hacen ellas y las cards ocupan su lugar. Al filtrar, las cards que siguen se reusan y quedan quietas; solo entran las nuevas. Mientras carga otra categoría o filtros, si la respuesta tarda más que `motion/duration/fast`, la grilla se atenúa a `opacity/muted`. Con movimiento reducido, solo el fundido (`motion/duration/fade`).
- **Cards de carga** (decisión 2026-10-20 · Cards de carga): en la primera carga, cuando todavía no hay cards, la grilla muestra dos filas de product-card `loading` (6 desde 1024 px, 8 desde 1920 px, 4 en Mobile; salen de las columnas de la grilla). Aparecen con un fundido de `motion/duration/fade` después de esperar lo mismo: con el catálogo en caché las cards llegan antes y no se ven. Si ya se veían, las cards ocupan su lugar sin la entrada (lo que aparece es la foto); si no, entrada normal. Mientras se ven, la grilla no se atenúa. «Cargando productos…» queda solo para lectores de pantalla. En la demo: `demo/productos.html?data=loading` (también `loading-one`, `loading-empty` y `loading-error`).
- **Scroll (desde 1024 px):** el navbar queda siempre a la vista (no se esconde al bajar). La barra de herramientas y el sidebar quedan pegados debajo de él (decisión 2026-10-19 · Navbar fijo en los listados). Mientras la barra está pegada, el listado le pone `stuck` (un `IntersectionObserver` con el margen de su `top`) y pierde la línea superior, que se juntaba con la del navbar.
- **Iluminar:** lo resuelve catalog-toolbar (`data-arq-theme="dark"` en `<html>`); las cards pasan a sus imágenes encendidas.
- **Compare-bar fija:** al final del listado queda un espacio de su alto, así no tapa las últimas cards ni el footer.
- **Estados:** mientras carga, `aria-busy="true"` y "Cargando productos…"; sin resultados, "No hay productos con estos filtros."; si falla el catálogo, un mensaje de error. Los mensajes van en `role="status"`.

## Layout

| | Desde 1024 px | Hasta 1023 px | Hasta 767 px |
| --- | --- | --- | --- |
| Armado | sidebar a la izquierda, contenido a la derecha a `space/section/sm` | toolbar y grilla apilados (las categorías, en la pestaña Categorías de filter-panel) a `space/gap/xl` | ídem |
| Toolbar → grilla | `space/gap/xl-2xl` | `space/gap/xl-2xl` | `space/gap/xl` |
| Grilla | 3 columnas hasta 1919 px; 4 desde 1920 px | auto-fill | filas a `space/gap/xl`, columnas a `space/gap/md` |
| Padding | `layout/gutter` a los lados, `space/section/xl` abajo | ídem | ídem (valores Mobile) |

## Pendientes

- Sidebar de `layout/catalog-nav` (240) y `space/section/xs` hasta el contenido, como la pantalla de Figma.
- `TODO` (diseño): no hay pantalla de carga, vacío ni error; los textos son provisorios.
- `TODO` (diseño): no hay pantalla de resultados de búsqueda; el título y el vacío con `?q=` son de código.
- `TODO` (búsqueda): sinónimos, en el front o en Typesense (`docs/decisiones.md`, Pendientes).
- `TODO` (urls): los filtros aplicados no van en la URL (se pierden al recargar).
- `TODO` (acabados): los swatch de las cards no tienen imagen (muestran el neutro).
