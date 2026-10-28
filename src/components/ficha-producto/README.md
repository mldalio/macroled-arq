# ficha-producto · `<arq-ficha-producto>`

Ficha de un producto (grupo): hero con galería y configurador, descargas y especificaciones, galería de ambiente, glosario, descripción (foto a todo el ancho con el texto encima), «¿Te interesa este producto?», inspiración y "Explora la colección". Es un contenedor de página, sin set en Figma: sale de la pantalla Ficha de Final (`1218:10487` Desktop · `1220:11334` Mobile · `1218:11777` / `1220:12601` Iluminar). Decisión: `docs/decisiones.md`, 2026-10-05 · Ficha de producto. Los textos salen de los datos, no del CMS (2026-10-07 · Base de datos sin IDs).

```html
<arq-ficha-producto data-group="kanu-jardin">
  <h1 slot="title">Kanu Jardín</h1>
  <h2 slot="downloads-title">Descargas</h2>
  <h2 slot="glossary-title">Glosario</h2>
  <h2 slot="compatible-title">Accesorios y lámparas compatibles</h2>
  <h2 slot="accessory-title">Accesorio requerido</h2>
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
| slot `compatible-title` · `accessory-title` | `<h2>` de «Accesorios y lámparas compatibles» (fichas de Daö) y de «Accesorio requerido» (ficha de la lámpara, `PAR11-`), `role/heading-2`. Se muestra uno según la ficha; el otro queda oculto |
| slot `collection-title` | `<h2>` de "Explora la colección" (`role/heading-2`) |
| slot `modal-title` | `<h2>` del download-modal del glosario |

- Los encabezados van en el HTML de la página (AGENTS.md). Los nombres de las family-card (`<h3>`) los arma el componente con los datos, como las cards de catalog-listing.
- **Eventos:** `arq:variant { sku }` al mostrar una variante. `arq:datasheet { sku }` al pedir la ficha técnica ("Generar ficha técnica", "Ficha técnica" de Descargas y del modal del glosario). Mientras se arma el PDF, el botón que se tocó queda en State=Loading con "Generando…" (Filled o Outline); si falla, `form-message` Tone=Error con «No se pudo generar la ficha técnica. Probá de nuevo.» debajo de los botones (o de la ficha técnica en el modal del glosario), siempre en la página y vacío hasta que falla (región viva).

## Comportamiento

- **Variante:** abre con `?sku=` si es del grupo; si no, con la predeterminada. Al elegir otra en el configurador se actualiza `?sku=` con `history.replaceState` (la URL siempre lleva el SKU, también la de la predeterminada: al abrir sin `?sku=` se agrega con `replaceState`). Cambian galería, sku, descripción, pestañas de información técnica (Especificaciones con el acordeón · Información comercial · Configurador, esta última solo en la colección Daö) y descargas; el resto no (decisión 2026-10-02 · Ficha de producto por grupo). Configurador arma el Daö (aro, módulos, terminación, cabezal y lámpara) con datos de Typesense.
- **Nombre de la variante:** si el grupo reúne varios product_name (Daö: «Daö Simple», «Daö Doble»), el título (el h1 del CMS, por slot, que arranca con el nombre del grupo) y la última migaja del breadcrumb pasan al nombre de la variante elegida («Mini Daö Trimless Doble»). Un grupo con un solo nombre no cambia.
- **Breadcrumb:** hasta 4 niveles, sobre la foto, siempre desde Productos (como el listado). Una luminaria: Productos / Colecciones / su `familia` (`?family=`) / el producto; «Colecciones» abre el mega-menu en esa pestaña (`data-arq-menu`). Una lámpara o artefacto (macrofamilia `Lámparas y Artefactos`, sin Interior ni Exterior): Productos / Lámparas y artefactos / su subfamilia, si tiene / el producto. Sin familia, si hay fila de colección, Productos / Colecciones / esa colección; si no, Productos / el producto. «Ver colección …» lleva al mismo listado que la migaja de la familia.
- **Configurador:** un option-group por atributo de `variant_attributes`, en ese orden: Swatches para el acabado y Tiles para el resto (`src/data/attributes.js`). Las opciones que no forman un SKU van deshabilitadas (`src/data/variants.js`).
- **Iluminar:** el toggle pone `data-arq-theme="dark"` en el hero (contenedor interno) y en el `<arq-navbar>` de la página. La galería pasa a las fotos encendidas. No se recuerda: recargar la ficha la deja apagada. Solo llega iluminada si se entró desde Productos o Colecciones iluminados (`takeThemeHandoff`, `src/base/theme.js`). Las especificaciones llevan siempre `space/section/md` arriba, con Iluminar o sin él. No tienen Iluminar las fichas de Daö, Tori Visera y el frente de PAR11 (sin toggle).
- **Toggle Iluminar sobre la foto:** se mide el brillo de la foto debajo del toggle. Foto clara: el toggle de siempre (negro, `data-arq-theme="light"`). Foto oscura: `theme="inverse"` (blanco apagado). Decide la foto, con Iluminar prendido o apagado. La foto se lee de una copia chica con CORS (`config.images.sampleBase`); si no se puede, el toggle sigue el modo del hero (`docs/decisiones.md`, 2026-10-21 · Toggle Iluminar según la foto).
- **Ver glosario:** desplaza hasta el glosario y le pasa el foco a su título.
- **Cotas (prueba):** el dibujo del SKU (`cotas_img`, o `src/data/cotas.js` si la base no lo trae) se muestra en la pestaña «Cotas», debajo de Materiales e instalación y como fila «Cotas» del modal de descargas. `TODO` (diseño): dejar un solo lugar.
- **Ver descargas:** abre el modal de descargas de la variante elegida (el mismo que el ícono de cada fila del glosario).
- **Descargas:** "Ficha técnica" (se genera) y los archivos del SKU elegido, en el orden de Final (CAD 2D/3D, Manual, IES, Fotometría). Un archivo que falta no se muestra.
- **Acordeón:** una sección por grupo de especificaciones. Todas abren abiertas; al cambiar de variante quedan abiertas las mismas (si se cerró una, sigue cerrada).
- **Información comercial:** la pestaña muestra su lista dentro del mismo acordeón, con una sección «Características comerciales» abierta, igual que las de Especificaciones.
- **Glosario:** variants-table con una fila por SKU (columnas en `TABLE_COLUMNS` de `src/data/attributes.js`). En la barra, CAD 2D/3D y Manual. El ícono de cada fila abre el download-modal con los archivos de ese SKU.
- **Textos solo de los datos:** descripción corta (`description` de la variante), story e inspiración. Si un dato falta, esa parte no se muestra, aunque el HTML traiga texto: así se ve qué falta en la base.
- **Descripción (STORY):** el componente toma `product_story_text` del grupo y lo arma en el DOM de la página: la primera línea es el título (`<h2>` en `role/heading-2`, con o sin `## `), cada `## ` siguiente un `<h3>`, cada línea `- ` un ítem de la lista (con guion) y el resto un `<p>`, con `createElement` y `textContent` (nunca `innerHTML`). La sección es la foto de ambiente 6 a todo el ancho (`min-height: 100svh`) con el título (primera línea) a la izquierda y, a la derecha, el texto, la lista y el link «Ver colección …» (`role/body-xl`, Dark local: textos y subrayado claros). La foto queda quieta mientras la página pasa por encima (efecto parallax de imagen fija: `position: fixed` dentro de un recuadro con `clip-path`; con `prefers-reduced-motion` se mueve con la página). Sin foto, fondo `color/surface/default` en Dark; sin texto, la sección no se muestra. Mobile y Tablet: título arriba, texto abajo.
- **Explora la colección:** family-card de los otros grupos de la colección (Default y Large), en un carrusel con scroll-snap si no entran. Sin colección no se muestran. El breadcrumb y «Ver colección» siguen a la familia (o a Lámparas y artefactos), no a esa sección.
- **Imágenes:** ambiente, descripción e inspiración muestran solo las que existen; un bloque sin imágenes ni texto no se muestra.
- **Galería de ambiente:** conserva las proporciones de las fotos y el alto responsive existente. Avanza automáticamente de a una foto con scroll suave cada `motion/duration/feedback × 1.5` (3 s), como Destacados; al llegar al final vuelve al inicio. Se pausa al interactuar, con foco, fuera de vista, con la pestaña oculta, con el visor abierto o con movimiento reducido. Mouse: cursor grab/grabbing y arrastre; el clic abre la foto completa en el mismo visor de FOA (imagen contenida, contador, chevrons, Esc y cierre con retorno de foco). Con teclado, cada foto es accesible con Tab y Enter/Espacio la amplía; ←/→ recorren la fila. En táctil hay scroll nativo y controles con chevrons al pie; los extremos se deshabilitan.
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
| Explora la colección | Fondo `neutral/700` y texto `color/text/inverse` (también el nombre de cada card), padding `space/padding/5xl` y `space/section/lg` a los lados; introducción de `layout/measure` + `space/gap/xl-2xl` | apilado a `space/gap/4xl` (también Tablet) |

## Pendientes

- `TODO` (diseño) Medidas sin token: Descargas e introducción de Explora 440 (`layout/measure`), lista de características 539 (`layout/measure-wide`), sangría de la lista 21 (`space/padding/lg`), alto de la galería de ambiente 684 / 440 (70svh), texto de Inspiración 330 (`layout/measure`), fotos de Inspiración 440 × 568 (`ratio/portrait-soft`) y family-card de 200 y 328 (`layout/card-min` y `layout/card-min-wide`).
- Al llegar al glosario («Ver glosario»), el margen superior es `layout/navbar-height` (56): el título queda justo debajo del navbar fijo.
- `TODO` (datos) Archivos de la barra del glosario: no hay descargas por grupo; salen del SKU predeterminado. Imágenes de los acabados, `alt` de las fotos y columnas del glosario (`src/data/attributes.js`).
- `TODO` (diseño) "Características del producto" va en `role/body-medium` como Desktop; en Mobile Final lo muestra en Regular.
- Video de inspiración (`video_inspiration`): hoy vacío en la base; ver «Fotos de ambiente».

## Configurador (2026-10-21)

> En la colección Daö, el «Configurar» de Daö ya no es una pestaña: la ficha muestra el botón «Configura tu Daö» (texto en mayúsculas, 12 px, fondo `color/surface/inverse`) centrado sobre la foto, que abre `<arq-dao-configurator>` en un modal a pantalla completa ([README](../dao-configurator/README.md)). El resto de esta sección es el configurador de variantes de la ficha.

- **Característica madre:** el color, o la primera de `variant_attributes` si no hay color. Va primera y nunca se apaga; las demás dependen solo de las de arriba y una apagada no se puede elegir. Al elegir, las de abajo se acomodan solas (`src/data/variants.js`; `docs/decisiones.md`, 2026-10-21 · Característica madre).
- **Descripción** de la variante: debajo del nombre y arriba del sku, en `role/body-compact` (14 px; 16/24 desde 1920 px, mismo peso) y `color/text/tertiary`.
- **Desde 1024 px** el hero mide el alto de la pantalla debajo del navbar: la foto queda fija (sticky) y el configurador se desplaza con la página si no entra. **Mobile y Tablet:** foto a todo el ancho pegada al navbar, miniaturas con margen y la info debajo.
- **Breadcrumb** sobre la foto, arriba a la izquierda; su modo (Light o Dark) sale del brillo de la foto, como el del toggle Iluminar.
- En Color, el acabado elegido va junto a la etiqueta (`value` de option-group).
