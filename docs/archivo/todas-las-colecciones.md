# Archivo · vista «Todas las colecciones»

Se sacó del proyecto el **2026-10-23** (`docs/decisiones.md`, 2026-10-23 · Sin vista «Todas las colecciones»). Esta nota dice qué era, qué se quitó y cómo recuperarla. No hay código comentado en el proyecto: la lógica completa está en el historial de git.

## Qué era

Una vista del embed de Productos: `/arq/productos?view=colecciones`. En lugar de las cards de producto mostraba **una card por colección**, con sus propios filtros técnicos. No era una página aparte (`docs/decisiones.md`, 2026-10-02).

- **Card de colección:** nombre de la colección (`<h2>`), foto de reposo `images.studio` (la posición `card` de `multimagen_coleccion`) y con Iluminar `images.studioOn` (`cardOn`). Sin foto de hover. Acabados de todos sus grupos, sin repetir los de igual nombre e imagen. Meta: las aplicaciones de sus grupos, unidas con « · ».
- **Filtros:** los mismos del panel de Productos, calculados sobre todos los grupos que tienen colección. Una colección aparecía si alguno de sus grupos tenía una variante que cumplía los filtros marcados.
- **Diferencias con Productos:** sin Iluminar (el toggle no se mostraba), sin bajada en el page-header, sin «Comparar» en las cards (la compare-bar sí se veía, con lo ya elegido).
- **Cómo se llegaba:** ítem «Todas las colecciones» del catalog-nav (primero del grupo Colecciones), footer «Colecciones», botones «Explorar colecciones» y «Ver todo» del Home, título «Colecciones» del mega-menu, «Ver todo» del submenú Colecciones en Mobile y el primer nivel del breadcrumb de la ficha y de la colección.

## Por qué se sacó

En la v1 no hay fotos de colección (el equipo industrial no las puede producir), así que la vista mostraba básicamente lo mismo que elegir una colección desde la navegación (`?collection=<id>`, las cards de producto de esa colección). Las páginas de cada colección (`/arq/coleccion/<id>`) **siguen existiendo**.

## Qué se quitó

| Dónde | Qué |
| --- | --- |
| `src/data/catalog.js` | `listCollections`, `collectionCard`, `uniqueFinishes` (acabados de una colección sin repetir), el parámetro `cardOf` de `availableValues` (contaba cards por colección) y `allCollections` de `getNavigation` |
| `src/components/catalog-listing/` | La prop `unit` (`productos` · `colecciones`), el `?view=colecciones`, los textos de carga y vacío de colecciones, el apagado de Iluminar y de la bajada, la card sin «Comparar» y con meta |
| `src/components/catalog-toolbar/`, `filter-panel/` | El valor `colecciones` de `unit` («10 colecciones», «Ver 1 colección») |
| `src/components/mega-menu/`, `navbar/` | El título «Colecciones» como link a la vista y el «Ver todo» de Mobile |
| `src/pages/productos.html` | El ítem «Todas las colecciones» del catalog-nav |
| `src/pages/*.html`, `ficha-producto.js` | Los links `?view=colecciones` (footer, Home, breadcrumbs): pasaron a `data-arq-menu="colecciones"` |
| `demo/index.html` | Las demos con `unit="colecciones"` |

## Qué hay en su lugar

Los links de «Colecciones» abren el **mega-menu del navbar en la pestaña Colecciones** (en Mobile, el submenú Colecciones) en lugar de navegar. Es el atributo `data-arq-menu="colecciones"` en cualquier link o botón de la página; lo resuelve `arq-navbar` (README del navbar). Cada colección del menú lleva a sus productos (`?collection=<id>`).

Una URL vieja con `?view=colecciones` (marcadores, embeds de Webflow que todavía no se actualizaron) muestra el listado de Productos.

## Cómo recuperarla

La última versión con la vista es el commit **`da4962f`** (`main`, 2026-10-23). Para ver el código de entonces:

```
git show da4962f:src/components/catalog-listing/catalog-listing.js
git show da4962f:src/data/catalog.js
```

- **Todo junto:** buscar el commit que la sacó con `git log --oneline --grep "Todas las colecciones"` y hacer `git revert <commit>`. Puede pedir resolver conflictos si los archivos cambiaron desde entonces.
- **Por partes:** copiar de `da4962f` solo lo que haga falta (por ejemplo `listCollections` y `collectionCard` de `catalog.js`).

## Qué definir antes de retomarla

- **Fotos de colección** (`TODO` de datos): hoy solo llegan `img_collection` e `img_collection_on` (`multimagen_coleccion`), y las filas `col-*` de la base no las tienen cargadas. Sin fotos propias, la vista no aporta más que la navegación.
- **Qué la distingue de la navegación:** una página de colecciones con imágenes, un texto de cada una y su línea de producto. Hoy se resolvió con el mega-menu.
- **Documentación de diseño:** DESIGN.md, la ficha de Figma y `docs/components.md` mencionan «Todas las colecciones» (compare-bar, catalog-toolbar, mega-menu); al retomarla hay que volver a revisarlas.
