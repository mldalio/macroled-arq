# ficha-producto · `<arq-ficha-producto>`

Ficha de un producto (grupo): hero con galería y configurador, descargas y especificaciones, galería de ambiente, glosario, descripción (foto a todo el ancho con el texto encima), «¿Te interesa este producto?», inspiración y "Explora la colección". Es un contenedor de página, sin set en Figma: sale de la pantalla Ficha de Final (`1218:10487` Desktop · `1220:11334` Mobile · `1218:11777` / `1220:12601` Iluminar). Decisión: `docs/decisiones.md`, 2026-10-05 · Ficha de producto. Los textos salen de los datos, no del CMS (2026-10-07 · Base de datos sin IDs).

```html
<arq-ficha-producto data-group="kanu-jardin">
  <h1 slot="title">Kanu Jardín</h1>
  <h2 slot="downloads-title">Descargas</h2>
  <h2 slot="glossary-title">Glosario</h2>
  <h2 slot="collection-title">Explora la colección</h2>
  <h2 slot="modal-title">Descargas</h2>
</arq-ficha-producto>
```

El HTML del embed completo está en [src/pages/ficha.html](../../pages/ficha.html).

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| `data-group` | Slug del ítem del CMS = id del grupo (`kanu-jardin`). El componente pide el grupo a `getProduct()` (`src/data/catalog.js`) |
| slot `title` | `<h1>` con el nombre (`role/display`) |
| slot `image` | Opcional. `<img>` principal (LCP, `fetchpriority="high"`). Pasa a la galería: es la que muestra la primera imagen de la variante. Sin ella, la galería la crea |
| slot `downloads-title` · `glossary-title` | `<h2>` de Descargas y Glosario (`role/display-sm`) |
| slot `inspiration` | Lo escribe el componente con `product_inspiration_text` (`role/body-xl`). No se carga en el HTML |
| slot `cta-title` · `cta-description` · `cta-action` | Bloque «¿Te interesa este producto?»: `<h2>` (`role/heading-1`), bajada (`role/body-lg`) y texto del button Filled con `icon/arrow-right`. Sin `cta-title` el bloque no se muestra |
| slot `collection-title` | `<h2>` de "Explora la colección" (`role/heading-2`) |
| slot `modal-title` | `<h2>` del download-modal del glosario |

- Los encabezados van en el HTML de la página (AGENTS.md). Los nombres de las family-card (`<h3>`) los arma el componente con los datos, como las cards de catalog-listing.
- **Eventos:** `arq:variant { sku }` al mostrar una variante. `arq:datasheet { sku }` al pedir la ficha técnica ("Generar ficha técnica", "Ficha técnica" de Descargas y del modal del glosario). Mientras se arma el PDF, el botón que se tocó queda en State=Loading con "Generando…" (Filled o Outline).

## Comportamiento

- **Variante:** abre con `?sku=` si es del grupo; si no, con la predeterminada. Al elegir otra en el configurador se actualiza `?sku=` con `history.replaceState` (la URL siempre lleva el SKU, también la de la predeterminada: al abrir sin `?sku=` se agrega con `replaceState`). Cambian galería, sku, descripción, acordeón y descargas; el resto no (decisión 2026-10-02 · Ficha de producto por grupo).
- **Configurador:** un option-group por atributo de `variant_attributes`, en ese orden: Swatches para el acabado y Tiles para el resto (`src/data/attributes.js`). Las opciones que no forman un SKU van deshabilitadas (`src/data/variants.js`).
- **Iluminar:** el toggle pone `data-arq-theme="dark"` en el hero (contenedor interno) y en el `<arq-navbar>` de la página. La galería pasa a las fotos encendidas. No se recuerda: recargar la ficha la deja apagada. Solo llega iluminada si se entró desde Productos o Colecciones iluminados (`takeThemeHandoff`, `src/base/theme.js`). Con Iluminar, el hero baja su padding inferior a `space/section/lg` y Descargas suma `space/section/md` arriba (DESIGN.md §2 · Cambio de fondo).
- **Ver glosario:** desplaza hasta el glosario y le pasa el foco a su título.
- **Descargas:** "Ficha técnica" (se genera) y los archivos del SKU elegido, en el orden de Final (CAD 2D/3D, Manual, IES, Fotometría). Un archivo que falta no se muestra.
- **Acordeón:** una sección por grupo de especificaciones. La primera abre abierta; al cambiar de variante quedan abiertas las mismas.
- **Glosario:** variants-table con una fila por SKU (columnas en `TABLE_COLUMNS` de `src/data/attributes.js`). En la barra, CAD 2D/3D y Manual. El ícono de cada fila abre el download-modal con los archivos de ese SKU.
- **Textos solo de los datos:** descripción corta (`description` de la variante), story e inspiración. Si un dato falta, esa parte no se muestra, aunque el HTML traiga texto: así se ve qué falta en la base.
- **Descripción (STORY):** el componente toma `product_story_text` del grupo y lo arma en el DOM de la página: la primera línea es el título (`<h2>` en `role/heading-2`, con o sin `## `), cada `## ` siguiente un `<h3>`, cada línea `- ` un ítem de la lista (con guion) y el resto un `<p>`, con `createElement` y `textContent` (nunca `innerHTML`). La sección es la foto de ambiente 6 a todo el ancho (`min-height: 100svh`) con el título (primera línea) a la izquierda y, a la derecha, el texto, la lista y el link «Ver colección …» (`role/body-xl`, Dark local: textos y subrayado claros). La foto queda quieta mientras la página pasa por encima (efecto parallax de imagen fija: `position: fixed` dentro de un recuadro con `clip-path`; con `prefers-reduced-motion` se mueve con la página). Sin foto, fondo `color/surface/default` en Dark; sin texto, la sección no se muestra. Mobile y Tablet: título arriba, texto abajo.
- **Explora la colección:** family-card de los otros grupos de la colección (Default y Large), en un carrusel con scroll-snap si no entran. Sin colección no se muestran, el breadcrumb pasa a Productos / nombre y no está "Ver colección".
- **Imágenes:** ambiente, descripción e inspiración muestran solo las que existen; un bloque sin imágenes ni texto no se muestra.
- **Galería de ambiente:** fila de fotos con scroll; cada foto mantiene su proporción y su alto es 640 (`40rem`) en todos los dispositivos y el ancho de cada foto sale de su proporción. **Con mouse** (`hover: hover` y `pointer: fine`) el cursor sobre la galería es la flecha (`icon/arrow-right` o `icon/arrow-left`, el doble de `icon/2xl` (64) con trazo `border/strong`, en blanco `color/icon/inverse`): mitad derecha, siguiente; mitad izquierda, anterior; al inicio solo hay «siguiente» y al final solo «anterior». El clic (y los botones) pasan de a una foto: adelante, la próxima que no entra completa se lleva hasta que entre completa con el margen de página a la derecha (o alineada a la izquierda si es más ancha que la pantalla); atrás, la última cortada a la izquierda se alinea a la izquierda. **Sin cursor** (táctil) no hay cursor: dos `arq-icon-button` (Large, Outline, `icon/arrow-left` y `arrow-right`) debajo de las fotos, abajo a la derecha, con el que no se puede usar deshabilitado.
- **Fotos de ambiente:** `multimagen_ambiente` posiciones 2 a 7 (`ambient_2_on`, `3_on`, `4`, `5`, `6`, `7`), menos la 6, que es la del parallax de la descripción: quedan cinco fotos (`images.ambient`). La galería toma todas y la inspiración las dos últimas. `TODO` (datos): son pocas para los dos diseños; algunas se repiten entre bloques de una misma versión.
- **Video de inspiración (`video_inspiration`):** si el grupo tiene URL, el lugar del video muestra un `<video controls>`; mientras no hay, una foto de ambiente ocupa su lugar.

## Layout

Tablet (768–1023 px) usa la columna Desktop salvo en los bloques marcados: ahí se apila como Mobile, con los espaciados de Desktop (`TODO` diseño: Final no tiene Ficha en Tablet).

| Bloque | Desktop | Mobile |
| --- | --- | --- |
| Todos | `--page-gutter` a los lados (`layout/gutter` con tope en `layout/max-width`), `space/section/xl` abajo | ídem |
| Hero · encabezado | `space/padding/xl` arriba, `space/padding/xl-2xl` abajo, gap `space/gap/xl`; título y "Ver colección" en fila a `space/gap/md` | gap `space/gap/2xl`; "Ver colección" debajo a `space/gap/xs` |
| Hero · configurador | galería y configurador 60/40 (`3fr` · `2fr`, el configurador con `layout/measure` de mínimo), a `space/gap/5xl` | apilado a `space/gap/2xl` (también Tablet) |
| Columna del configurador | info (`space/gap/xl`: sku y descripción a `space/gap/lg`, opciones a `space/gap/xl-2xl`) y acciones abajo (`space/gap/md`) | acciones a todo el ancho, una debajo de la otra |
| Descargas + acordeón | columna de `layout/measure` + acordeón, a `space/gap/3xl` | apilado a `space/gap/2xl`, acordeón a todo el ancho (también Tablet) |
| Galería de ambiente | fila con scroll hasta el borde derecho, gap `space/gap/md`; sin scroll-snap y `overscroll-behavior-x: contain` para no pelear con el scroll vertical; la última foto deja el margen de página a la derecha | gap `space/gap/sm-md` |
| Descripción | foto a todo el ancho; título a la izquierda y texto a la derecha, con `space/section/lg` alrededor; abajo `space/section/sm` | título arriba y texto abajo, con el margen de página |
| Glosario | título a `space/gap/md` de la tabla | ídem |
| Inspiración | foto ancha o video y una vertical, con la proporción de Figma, y el texto a la derecha | apilado a `space/gap/xl` (también Tablet) |
| Explora la colección | Light sobre `color/surface/subtle`, padding `space/padding/5xl` y `space/section/lg` a los lados; introducción de `layout/measure` + `space/gap/xl-2xl` | apilado a `space/gap/4xl` (también Tablet) |

## Pendientes

- `TODO` (diseño) Medidas sin token: Descargas e introducción de Explora 440 (`layout/measure`), lista de características 539 (`layout/measure-wide`), sangría de la lista 21 (`space/padding/lg`), alto de la galería de ambiente 684 / 440 (70svh), texto de Inspiración 330 (`layout/measure`), fotos de Inspiración 440 × 568 (`ratio/portrait-soft`) y family-card de 200 y 328 (`layout/card-min` y `layout/card-min-wide`).
- `TODO` (diseño) Mensaje de error si no se puede generar la ficha técnica en PDF (hoy queda en consola).
- `TODO` (navbar) Falta `layout/navbar-height` (56): el margen al llegar al glosario usa `space/gap/4xl`.
- `TODO` (datos) Archivos de la barra del glosario: no hay descargas por grupo; salen del SKU predeterminado. Imágenes de los acabados, `alt` de las fotos y columnas del glosario (`src/data/attributes.js`).
- `TODO` (diseño) "Características del producto" va en `role/body-medium` como Desktop; en Mobile Final lo muestra en Regular.
- Video de inspiración (`video_inspiration`): hoy vacío en la base; ver «Fotos de ambiente».
