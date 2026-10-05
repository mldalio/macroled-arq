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
| State | — | — | Hover y Focus por CSS sobre toda la tarjeta |
| Breakpoint | — | — | media query: hasta 767 px es Mobile |

## Link estirado

Patrón común de las tarjetas (`src/base/card-link.css`, `docs/decisiones.md` · Tarjetas con link estirado): el `<a>` envuelve solo el nombre, así el nombre accesible es corto ("Interior"), y su `::after` cubre la tarjeta, así toda la tarjeta es clickeable.

- **Hover** (solo con mouse): borde `border/default` en `color/border/hover` sobre la imagen, hacia adentro (no cambia el tamaño).
- **Focus:** anillo de DESIGN.md §7 alrededor de toda la tarjeta.

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Imagen | `ratio/portrait-soft` (4:5) | `ratio/portrait-soft` (4:5) |
| Imagen → nombre | `space/gap/lg` | `space/gap/md` |
| Ancho | el de su columna (FILL) | el de su columna; en el Home va en un carrusel de tarjetas de 280 |
| Alto máximo de la imagen | `100svh` − 2 × `space/section/xl` (mín. `50svh`); al tope se recorta | sin tope |

El tope hace que la sección entre en una pantalla aunque el viewport sea muy ancho (`docs/decisiones.md`, 2026-10-05 · Home: alturas y meta).

Un nombre largo se parte en líneas; la flecha queda a la derecha.

## Tokens

| Parte | Token |
| --- | --- |
| Imagen (sin imagen) | `color/bg/subtle` |
| Nombre | `color/text/primary` · `role/heading-3` |
| Flecha | `icon/arrow-right` · `icon/md` · `color/icon/primary` |
| Hover | `border/default` en `color/border/hover` (imagen) |
| Foco | `border/strong` en `color/border/focus` |
