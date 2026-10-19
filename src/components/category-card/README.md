# category-card · `<arq-category-card>`

Tarjeta de categoría del Home (Interior, Exterior, Lámparas y artefactos…): imagen, nombre y flecha. Toda la tarjeta lleva al listado filtrado. No confundir con line-card (editorial del Home) ni family-card (otras familias en la ficha).

- Figma: [1036-2461](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2461) · ficha `doc/category-card` (`1452:5984`)

```html
<arq-category-card href="/arq/productos">
  <img slot="image" src="…" alt="" loading="lazy">
  <span slot="name">Interior</span>
</arq-category-card>
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Name | slot `name` | — | texto del nombre: es el nombre accesible del link |
| (imagen) | slot `image` | — | `<img>` (sin texto encima). `alt=""` si el nombre ya la describe |
| — | `href` | `href` | destino: Productos filtrado por la categoría (las URLs de categoría están PENDIENTES, `docs/urls.md`) |
| — | `overlay` | `overlay` | Home v2: nombre y flecha sobre la foto. Sin el atributo, el nombre va debajo |
| — | slot `description` | — | bajada sobre la foto. En overlay aparece en hover (Desktop), junto a un zoom leve de la imagen |
| State | — | — | Hover y Focus por CSS sobre toda la tarjeta |
| Breakpoint | — | — | media query: hasta 767 px es Mobile |

## Link estirado

Patrón común de las tarjetas (`src/base/card-link.css`, `docs/decisiones.md` · Tarjetas con link estirado): el `<a>` envuelve solo el nombre, así el nombre accesible es corto ("Interior"), y su `::after` cubre la tarjeta, así toda la tarjeta es clickeable.

- **Hover** (solo con mouse): borde `border/default` en `color/border/hover` sobre la imagen, hacia adentro, y la imagen hace zoom (`scale(1.05)`) dentro del recorte. La tarjeta no cambia de tamaño. Duración `motion/duration/slow`. `TODO` (diseño): no hay token de escala y Figma no muestra el zoom. El cursor es el de enlace (`pointer`).
- **Focus:** anillo de DESIGN.md §7 alrededor de toda la tarjeta.
- **Entrada al hacer scroll:** cuando la tarjeta entra en pantalla sube `space/gap/2xl` y aparece (una sola vez), escalonada con `motion/duration/fast` por tarjeta entre sus hermanas. Sin JS o con `prefers-reduced-motion: reduce` se ve quieta. `TODO` (diseño): no está en Figma.

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Imagen | `ratio/portrait` (7:10; en el set 411 × 600, sin token) | `ratio/portrait-soft` (4:5) |
| Imagen → nombre | `space/gap/lg` | `space/gap/md` |
| Ancho | el de su columna (FILL) | el de su columna; en el Home va en un carrusel de tarjetas de 280 |
| Alto máximo de la imagen | `100svh` − 2 × `space/section/xl` (mín. `50svh`); al tope se recorta | sin tope |

El tope hace que la sección entre en una pantalla aunque el viewport sea muy ancho (`docs/decisiones.md`, 2026-10-05 · Home: alturas y meta).

La flecha va pegada al nombre (`space/gap/sm`). Un nombre largo se parte en líneas y la flecha queda a su lado. `TODO` (diseño): en el set, Hover y Focus siguen con la flecha a la derecha.

## Tokens

| Parte | Token |
| --- | --- |
| Imagen (sin imagen) | `color/surface/subtle` |
| Nombre | `color/text/primary` · `role/heading-3` |
| Flecha | `icon/arrow-right` · `icon/md` · `color/icon/primary`, a `space/gap/sm` del nombre |
| Hover | `border/default` en `color/border/hover` (imagen) |
| Cursor de hover (Dark local) | `border/default` en `color/border/strong` · `radius/pill` · fondo `color/surface/transparent` · `color/text/primary` · `role/body-sm-medium` |
| Foco | `border/strong` en `color/border/focus` |
