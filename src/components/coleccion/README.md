# coleccion · `<arq-coleccion>`

Contenido de la página de una colección: grilla de product-card (una por grupo), galería, texto + imagen y mosaico de fotos con carousel-controls. Contenedor de página, sin set en Figma: sale de la pantalla Colección de Final (`1234:13201` Desktop · `1234:13448` Mobile). Decisión: `docs/decisiones.md`, 2026-10-05 · Colección.

```html
<arq-page-header show-breadcrumb show-description>…breadcrumb, <h1> e intro del CMS…</arq-page-header>
<arq-coleccion data-collection="kanu">
  <p slot="description">COLLECTION_DESCRIPTION_TEXT</p>
</arq-coleccion>
```

El HTML del embed completo está en [src/pages/coleccion.html](../../pages/coleccion.html).

## Atributos y slots

| Atributo / slot | Contenido |
| --- | --- |
| `data-collection` | `COLLECTION_ID` del ítem del CMS. El componente pide la colección a `getCollection()` (`src/data/catalog.js`) |
| slot `description` | Texto del bloque texto + imagen (`role/body-xl`) |

- El page-header (breadcrumb, `<h1>` e intro) va aparte, en el embed: es del CMS y queda indexable.

## Comportamiento

- **Cards:** una por grupo de la colección, con acabados y la meta con el resumen de sus variantes (el rango de cada atributo que no es acabado, `variantSummary`). El nombre es un `<h2>` (debajo del `<h1>` del page-header). Sin Comparar ni Iluminar (Final).
- **Imágenes** (`getCollection().images`): galería = `gallery`, texto + imagen = `description`, mosaico = `inspiration`. Solo las que existen; un bloque sin imágenes no se muestra (texto + imagen se muestra con texto o con imagen).
- **Mosaico:** carrusel con scroll-snap que llega al borde derecho; en Desktop, carousel-controls arriba a la derecha. En Mobile no hay flechas: la foto siguiente asoma.
- **Estados:** mientras carga (`aria-busy`) "Cargando colección…"; sin grupos, "Esta colección todavía no tiene productos."; si la colección no existe, "No encontramos esta colección."; si falla la carga, "No se pudo cargar la colección. Probá de nuevo en unos minutos.".

## Layout

| Bloque | Desktop | Mobile |
| --- | --- | --- |
| Productos | grilla de catálogo (`arq-grid` sin `columns`), `layout/gutter` a los lados | dos columnas |
| Galería | fotos lado a lado a sangre, `ratio/square` | una debajo de otra |
| Texto + imagen | texto (un tercio, hasta `layout/measure`) e imagen (dos tercios, a sangre, `ratio/landscape`) | texto y debajo la imagen a sangre, a `space/gap/xl` |
| Mosaico | flechas a `space/gap/lg` del carrusel; fotos a `space/gap/md` | sin flechas; fotos a `space/gap/sm-md` |
| Todos | `space/section/xl` abajo | ídem |

## Pendientes

- `TODO` (diseño) Medidas sin token: fotos de la galería 700 × 684 (`ratio/square`), texto 330 (`layout/measure`), imagen 933 × 684 (`ratio/landscape`) y alto del mosaico 684 / 440 (70svh, como la galería de ambiente de la ficha).
- `TODO` (diseño) Resumen de la card: faltan las una o dos características fijas que suma Final (p. ej. la potencia) y si van en una segunda línea.
- `TODO` (datos) Imágenes de los acabados y `alt` de las fotos.
