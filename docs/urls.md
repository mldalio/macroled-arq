# URLs

Páginas del sitio en `macroled.com.ar/arq`. Todo el contenido se carga con Code Embed (`docs/decisiones.md`, 2026-10-01 · Páginas en Webflow); el HTML de cada embed vive en `src/pages/`.

- Las páginas de colección del CMS se anidan en la carpeta `/arq` de Webflow (CMS Folders).
- Una carpeta, una página estática y una colección no pueden compartir slug en el mismo nivel. Por eso los templates del CMS van en singular (`producto`, `coleccion`) y los listados en plural (`productos`, `colecciones`).
- La ficha de producto y la página de colección usan el slug del CMS, que es el ID de la base: `PRODUCT_GROUP_ID` (un ítem del CMS por grupo) y `COLLECTION_ID`.

| Página | URL | Tipo en Webflow | Pantalla en Final | Notas |
| --- | --- | --- | --- | --- |
| Home | `/arq` | estática + Code Embed | Home (`1203:9715`) | El logo apunta a `/arq`. Verificar en el Designer que Webflow permita la página en la URL de la carpeta |
| Productos (listado) | `/arq/productos` | estática + Code Embed | Productos (`1161:6541`) | Una card por grupo, desde Typesense (decisiones.md, 2026-10-02 · Base de datos). Filtros, Iluminar y compare-bar |
| Productos por categoría (Interior, Exterior, Lámparas y artefactos) | PENDIENTE | — | dentro de Productos | Links del footer y del catalog-nav. PENDIENTE: parámetro o subpágina. Cada categoría es un filtro sobre `environment`, `application` y `product_type` (decisiones.md, 2026-10-02 · Navegación) |
| Ficha de producto | `/arq/producto/{slug}` · `?sku={SKU}` | template de colección CMS «Productos» + Code Embed | Ficha (`1218:10486`) | Slug = `PRODUCT_GROUP_ID`. `?sku=` elige la variante (sin parámetro, el SKU predeterminado); el canonical va sin parámetro. El embed imprime el grupo y el nombre (`<h1>`); el resto sale de Typesense, textos incluidos (decisiones.md, 2026-10-07 · Base de datos sin IDs). El breadcrumb (Colecciones / Kanu / Kanu Jardín) sale de los datos, no de la URL |
| Colecciones (vista del listado) | `/arq/productos?view=colecciones` | el embed de Productos | Colecciones (`1157:10222`) | Una card por colección, desde Typesense, con filtros técnicos; no es una página aparte |
| Colección (p. ej. KANU) | `/arq/coleccion/{slug}` | template de colección CMS «Colecciones» + Code Embed | Colección (`1234:13200`) | Slug = `COLLECTION_ID`. Una card por grupo de la colección |
| Comparativa | `/arq/comparativa` | estática + Code Embed | Comparativa (`1227:12373`) | `?sku=SKU1,SKU2,SKU3` (hasta 3, con `encodeURIComponent`; lo arma compare-bar) |
| Contacto | `/arq/contacto` | estática + Code Embed | Contacto (`1364:15761`) | El estado "enviado" es la misma página |
| Descargas | `/arq/descargas` | estática + Code Embed | Descargas (antes Glosario) (`1801:19315`) | Navbar, footer (Información) y link-list de Contacto. Todos los SKU del catálogo en una variants-table con buscador (decisiones.md, 2026-10-06 · Descargas). Antes era `/arq/glosario`: en Webflow, redirección 301 de `/arq/glosario` a `/arq/descargas` |
| Resultados de búsqueda | `/arq/productos?q=…` | el listado de Productos | sin pantalla | Destino de "Ver todos los resultados" (search-see-all) y de Enter en el buscador. No es una página aparte (decisiones.md, 2026-10-05 · Búsqueda en Productos) |

No son páginas:

- **Mega menu** (`1237:13492`): overlay del navbar.
- **ficha-accesorios/productos** (`1498:19001`): se ignora.
