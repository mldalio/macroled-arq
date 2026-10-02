# grid · `<arq-grid>`

Grilla de tarjetas o bloques de una página. Componente de layout, sin set en Figma: sale de las pantallas de Final (Home `1203:9716` · `1204:9952`). Las tarjetas toman el ancho de su columna (FILL).

```html
<arq-grid columns="3" mobile="carousel">…category-card…</arq-grid>       <!-- categorías del Home -->
<arq-grid columns="2">…line-card…</arq-grid>                             <!-- líneas del Home -->
<arq-grid columns="4" mobile="two-columns">…product-card…</arq-grid>     <!-- productos destacados -->
<arq-grid>…product-card…</arq-grid>                                      <!-- catálogo: auto-fill -->
```

## Props

| Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- |
| `columns` | `columns` | columnas en Desktop. Sin `columns`: `auto-fill` con `layout/card-min` y `layout/card-min-wide` desde 1600 px (DESIGN.md §2) |
| `mobile` | `mobile` | hasta 767 px: `stack` · `two-columns` · `carousel` (def. `stack`) |

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Gap | `space/gap/lg` | `stack`: `space/section/md` · `two-columns` y `carousel`: `space/gap/sm-md` |
| `carousel` | grilla de `columns` | fila con scroll horizontal y snap; la tarjeta siguiente asoma y la fila llega hasta el borde derecho de la pantalla |
| Sin `columns` | `auto-fill` (catálogo) | `auto-fill` (`layout/card-min` vale 160: dos columnas en 390) |

- **Carrusel:** el contenedor con scroll es el propio `<arq-grid>`, así `carousel-controls` lo maneja con `for="<id del arq-grid>"`. Sin barra de scroll visible. Alrededor deja `space/gap/xs` para que el anillo de foco de las tarjetas no se recorte.
- Con teclado, Tab recorre las tarjetas y el navegador desplaza el carrusel hasta la que tiene el foco.

## Pendientes

- `TODO` (diseño): no hay token para el ancho de tarjeta del carrusel mobile (280 de 350 en el Home). Se usa el 80 % del ancho de contenido de la sección.
- El carrusel con flechas en Desktop (Colección) se resuelve al armar esa página.
