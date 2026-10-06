# ficha-producto · `<arq-ficha-producto>`

Ficha de un producto (grupo): hero con galería y configurador, descargas y especificaciones, galería de ambiente, descripción con otras familias, glosario, inspiración y "Explora la colección". Es un contenedor de página, sin set en Figma: sale de la pantalla Ficha de Final (`1218:10487` Desktop · `1220:11334` Mobile · `1218:11777` / `1220:12601` Iluminar). Decisión: `docs/decisiones.md`, 2026-10-05 · Ficha de producto.

```html
<arq-ficha-producto data-group="kanu-jardin">
  <h1 slot="title">Kanu Jardín</h1>
  <p slot="description">Descripción corta</p>
  <img slot="image" src="…" alt="Kanu Jardín" fetchpriority="high">
  <h2 slot="downloads-title">Descargas</h2>
  <div slot="story">## Luz que acompaña y define los recorridos exteriores.
- Iluminación dirigida para acompañar recorridos.</div>
  <h2 slot="glossary-title">Glosario</h2>
  <p slot="inspiration">Texto de inspiración</p>
  <h2 slot="collection-title">Explora la colección</h2>
  <h2 slot="modal-title">Descargas</h2>
</arq-ficha-producto>
```

El HTML del embed completo está en [src/pages/ficha.html](../../pages/ficha.html).

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| `data-group` | `PRODUCT_GROUP_ID` del ítem del CMS. El componente pide el grupo a `getProduct()` (`src/data/catalog.js`) |
| slot `title` | `<h1>` con el nombre (`role/display`) |
| slot `description` | Descripción corta del CMS. Se reemplaza por la descripción de la variante cuando la trae |
| slot `image` | `<img>` principal (LCP, `fetchpriority="high"`). Pasa a la galería: es la que muestra la primera imagen de la variante |
| slot `downloads-title` · `glossary-title` | `<h2>` de Descargas y Glosario (`role/display-sm`) |
| slot `story` | `PRODUCT_STORY_TEXT` como texto. Ver Descripción |
| slot `inspiration` | `PRODUCT_INSPIRATION_TEXT` (`role/body-xl`) |
| slot `collection-title` | `<h2>` de "Explora la colección" (`role/heading-2`) |
| slot `modal-title` | `<h2>` del download-modal del glosario |

- Los encabezados van en el HTML de la página (AGENTS.md). Los nombres de las family-card (`<h3>`) los arma el componente con los datos, como las cards de catalog-listing.
- **Eventos:** `arq:variant { sku }` al mostrar una variante. `arq:datasheet { sku }` al pedir la ficha técnica ("Generar ficha técnica", "Ficha técnica" de Descargas y del modal del glosario). Mientras se arma el PDF, el botón que se tocó queda en State=Loading con "Generando…" (Filled o Outline).

## Comportamiento

- **Variante:** abre con `?sku=` si es del grupo; si no, con la predeterminada. Al elegir otra en el configurador se actualiza `?sku=` con `history.replaceState` (la predeterminada va sin parámetro). Cambian galería, sku, descripción, acordeón y descargas; el resto no (decisión 2026-10-02 · Ficha de producto por grupo).
- **Configurador:** un option-group por atributo de `variant_attributes`, en ese orden: Swatches para el acabado y Tiles para el resto (`src/data/attributes.js`). Las opciones que no forman un SKU van deshabilitadas (`src/data/variants.js`).
- **Iluminar:** el toggle pone `data-arq-theme="dark"` en el hero (contenedor interno) y en el `<arq-navbar>` de la página. La galería pasa a las fotos encendidas. No se guarda: `arq:theme` es de los listados. Con Iluminar, el hero baja su padding inferior a `space/section/lg` y Descargas suma `space/section/md` arriba (DESIGN.md §2 · Cambio de fondo).
- **Ver glosario:** desplaza hasta el glosario y le pasa el foco a su título.
- **Descargas:** "Ficha técnica" (se genera) y los archivos del SKU elegido, en el orden de Final (CAD 2D/3D, Manual, IES, Fotometría). Un archivo que falta no se muestra.
- **Acordeón:** una sección por grupo de especificaciones. La primera abre abierta; al cambiar de variante quedan abiertas las mismas.
- **Glosario:** variants-table con una fila por SKU (columnas en `GLOSSARY_COLUMNS` de `src/data/attributes.js`). En la barra, CAD 2D/3D y Manual. El ícono de cada fila abre el download-modal con los archivos de ese SKU.
- **Descripción (STORY):** el componente lee el texto del slot `story` y lo reemplaza en el DOM de la página por un `<h2>` por cada `## ` (los siguientes, `<h3>`), un `<p>` por línea y un `<ul>` con las líneas `- `, con `createElement` y `textContent` (nunca `innerHTML`). La lista va con la etiqueta "Características del producto".
- **Otras familias y Explora la colección:** family-card de los otros grupos de la colección (Default y Large), en un carrusel con scroll-snap si no entran. Sin colección no se muestran, el breadcrumb pasa a Productos / nombre y no está "Ver colección".
- **Imágenes:** ambiente, descripción e inspiración muestran solo las que existen; un bloque sin imágenes ni texto no se muestra.
- **Estados:** mientras carga (`aria-busy`) solo se ve lo que imprime el CMS y "Cargando producto…". Si el grupo no existe, "No encontramos este producto."; si falla la carga, "No se pudo cargar el producto. Probá de nuevo en unos minutos.".

## Layout

Tablet (768–1023 px) usa la columna Desktop salvo en los bloques marcados: ahí se apila como Mobile, con los espaciados de Desktop (`TODO` diseño: Final no tiene Ficha en Tablet).

| Bloque | Desktop | Mobile |
| --- | --- | --- |
| Todos | `--page-gutter` a los lados (`layout/gutter` con tope en `layout/max-width`), `space/section/xl` abajo | ídem |
| Hero · encabezado | `space/padding/xl` arriba, `space/padding/xl-2xl` abajo, gap `space/gap/xl`; título y "Ver colección" en fila a `space/gap/md` | gap `space/gap/2xl`; "Ver colección" debajo a `space/gap/xs` |
| Hero · configurador | galería y configurador 60/40 (`3fr` · `2fr`, el configurador con `layout/measure` de mínimo), a `space/gap/5xl` | apilado a `space/gap/2xl` (también Tablet) |
| Columna del configurador | info (`space/gap/xl`: sku y descripción a `space/gap/lg`, opciones a `space/gap/xl-2xl`) y acciones abajo (`space/gap/md`) | acciones a todo el ancho, una debajo de la otra |
| Descargas + acordeón | columna de `layout/measure` + acordeón, a `space/gap/3xl` | apilado a `space/gap/2xl`, acordeón a todo el ancho (también Tablet) |
| Galería de ambiente | fila con scroll hasta el borde derecho, gap `space/gap/md`; snap `proximity` y `overscroll-behavior-x: contain` para no pelear con el scroll vertical | gap `space/gap/sm-md` |
| Descripción | textos a `space/gap/lg`; otras familias e imagen (`ratio/wide`) en dos mitades, abajo, a `space/gap/sm` | imagen arriba, otras familias a `space/gap/6xl` |
| Glosario | título a `space/gap/md` de la tabla | ídem |
| Inspiración | texto (un tercio) e imágenes (dos tercios) en `ratio/portrait-soft` | apilado a `space/gap/xl` (también Tablet, con las fotos en fila y el texto hasta `layout/measure`) |
| Explora la colección | Dark local, padding `space/padding/5xl`; introducción de `layout/measure` y cards a `space/gap/2xl` | apilado a `space/gap/4xl` (también Tablet) |

## Pendientes

- `TODO` (diseño) Medidas sin token: Descargas e introducción de Explora 440 (`layout/measure`), lista de características 539 (`layout/measure-wide`), sangría de la lista 21 (`space/padding/lg`), alto de la galería de ambiente 684 / 440 (70svh), texto de Inspiración 330 (`layout/measure`), fotos de Inspiración 440 × 568 (`ratio/portrait-soft`) y family-card de 200 y 328 (`layout/card-min` y `layout/card-min-wide`).
- `TODO` (diseño) Mensaje de error si no se puede generar la ficha técnica en PDF (hoy queda en consola).
- `TODO` (navbar) Falta `layout/navbar-height` (56): el margen al llegar al glosario usa `space/gap/4xl`.
- `TODO` (datos) Archivos de la barra del glosario: no hay descargas por grupo; salen del SKU predeterminado. Imágenes de los acabados, `alt` de las fotos y columnas del glosario (`src/data/attributes.js`).
- `TODO` (diseño) "Características del producto" va en `role/body-medium` como Desktop; en Mobile Final lo muestra en Regular.
- Video de inspiración (`video_inspiration`): no está en Final; no se muestra.
