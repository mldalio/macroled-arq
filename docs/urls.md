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
| Ficha de producto | `/arq/producto/{slug}` · `?sku={SKU}` | template de colección CMS «Productos» + Code Embed | Ficha (`1218:10486`) | Slug = `PRODUCT_GROUP_ID`. `?sku=` elige la variante (sin parámetro, el SKU predeterminado); el canonical va sin parámetro. El embed imprime el grupo, nombre (`<h1>`), descripción corta, imagen principal y textos editoriales; el resto sale de Typesense. El breadcrumb (Colecciones / Kanu / Kanu Jardín) sale de los datos, no de la URL |
| Colecciones (listado) | `/arq/colecciones` | estática + Code Embed | Colecciones (`1157:10222`) | Una card por colección, desde Typesense, con filtros técnicos |
| Colección (p. ej. KANU) | `/arq/coleccion/{slug}` | template de colección CMS «Colecciones» + Code Embed | Colección (`1234:13200`) | Slug = `COLLECTION_ID`. Una card por grupo de la colección |
| Comparativa | `/arq/comparativa` | estática + Code Embed | Comparativa (`1227:12373`) | `?sku=SKU1,SKU2,SKU3` (hasta 3, con `encodeURIComponent`; lo arma compare-bar) |
| Contacto | `/arq/contacto` | estática + Code Embed | Contacto (`1364:15761`) | El estado "enviado" es la misma página |
| Descargas | `/arq/descargas` | estática + Code Embed | sin pantalla | Footer (Información) y page-header List |
| Glosario | `/arq/glosario` | estática + Code Embed | sin pantalla | Footer (Información). No es la tabla de variantes de la ficha (que en Figma se llama Glosario) |
| Resultados de búsqueda | `/arq/buscar?q=…` | estática + Code Embed | sin pantalla | Destino de "Ver todos los resultados" (search-see-all) |

No son páginas:

- **Mega menu** (`1237:13492`): overlay del navbar.
- **ficha-accesorios/productos** (`1498:19001`): se ignora.
