# URLs

Páginas del sitio en `macroled.com.ar/arq`. Todo el contenido se carga con Code Embed (`docs/decisiones.md`, 2026-10-01 · Páginas en Webflow); el HTML de cada embed vive en `src/pages/`.

- Las páginas de colección del CMS se anidan en la carpeta `/arq` de Webflow (CMS Folders).
- Una carpeta, una página estática y una colección no pueden compartir slug en el mismo nivel. Por eso los templates del CMS van en singular (`producto`, `coleccion`) y los listados en plural (`productos`, `colecciones`).
- La ficha de producto y la página de colección usan el slug del CMS, que es el ID del grupo en la base (el slug del nombre del grupo: `kanu-jardin`, `dao`; un ítem del CMS por grupo, ver AGENTS.md · Datos) y `COLLECTION_ID`.

| Página | URL | Tipo en Webflow | Pantalla en Final | Notas |
| --- | --- | --- | --- | --- |
| Home | `/arq` | estática + Code Embed | Home (`1203:9715`) | El logo apunta a `/arq`. Verificar en el Designer que Webflow permita la página en la URL de la carpeta |
| Productos (listado) | `/arq/productos` | estática + Code Embed | Productos (`1161:6541`) | Una card por grupo, desde Typesense (decisiones.md, 2026-10-02 · Base de datos). Filtros, Iluminar y compare-bar |
| Productos por categoría (Interior, Exterior, Lámparas y artefactos) | PENDIENTE | — | dentro de Productos | Links del footer y del catalog-nav. PENDIENTE: parámetro o subpágina. Cada categoría es un filtro sobre `environment`, `application` y `product_type` (decisiones.md, 2026-10-02 · Navegación) |
| Ficha de producto | `/arq/producto/{slug}` · `?sku={SKU}` | template de colección CMS «Productos» + Code Embed | Ficha (`1218:10486`) | Slug = `PRODUCT_GROUP_ID`. `?sku=` elige la variante y todos los links a la ficha lo llevan, también el del SKU predeterminado (sin parámetro se abre el predeterminado y la URL se completa con su SKU); el canonical va sin parámetro. El embed imprime el grupo y el nombre (`<h1>`); el resto sale de Typesense, textos incluidos (decisiones.md, 2026-10-07 · Base de datos sin IDs). El breadcrumb (Colecciones / Kanu / Kanu Jardín) sale de los datos, no de la URL |
| Productos de una colección (catalog-nav y mega-menu) | `/arq/productos?collection={COLLECTION_ID}` | el embed de Productos | Productos | Links del grupo Colecciones del catalog-nav: las cards de producto de esa colección (Kanu Pared, Kanu Jardín) en el mismo listado, sin ir a la página de la colección. No hay vista «Todas las colecciones»: se sacó el 2026-10-23 y los links de «Colecciones» abren el mega-menu del navbar en su pestaña (`data-arq-menu="colecciones"`; `docs/archivo/todas-las-colecciones.md`) |
| Colección (p. ej. KANU) · sin links entrantes desde 2026-10-23 | `/arq/coleccion/{slug}` | template de colección CMS «Colecciones» + Code Embed | Colección (`1234:13200`) | Slug = `COLLECTION_ID`. Una card por grupo de la colección |
| Comparativa | `/arq/comparativa` | estática + Code Embed | Comparativa (`1227:12373`) | `?sku=SKU1,SKU2,SKU3` (hasta 3, con `encodeURIComponent`; lo arma compare-bar) |
| Contacto | `/arq/contacto` | estática + Code Embed | Contacto (`1364:15761`) | El estado "enviado" es la misma página |
| Nosotros | `/arq/nosotros` | estática + Code Embed | sin pantalla | Se arma con los bloques de la Home. Textos e imágenes de ejemplo (decisiones.md, 2026-10-20 · Nosotros). El navbar la lista entre Productos y Descargas (2026-10-21); Figma todavía no |
| Descargas | `/arq/descargas` | estática + Code Embed | Descargas (antes Glosario) (`1801:19315`) | Navbar (dentro de Recursos), footer (Información) y link-list de Contacto. Todos los SKU del catálogo en una variants-table con buscador (decisiones.md, 2026-10-06 · Descargas). Antes era `/arq/glosario`: en Webflow, redirección 301 de `/arq/glosario` a `/arq/descargas` |
| Catálogos | `/arq/catalogos` | estática + Code Embed | sin pantalla | Link del menú Recursos. Título y dos tapas (decisiones.md, 2026-10-21 · Catálogos). Faltan los PDF y las tapas definitivas |
| Resultados de búsqueda | `/arq/productos?q=…` | el listado de Productos | sin pantalla | Destino de "Ver todos los resultados" (search-see-all) y de Enter en el buscador. No es una página aparte (decisiones.md, 2026-10-05 · Búsqueda en Productos) |

No son páginas:

- **Mega menu** (`1237:13492`): overlay del navbar.
- **ficha-accesorios/productos** (`1498:19001`): se ignora.
