# line-card · `<arq-line-card>`

Tarjeta editorial de línea o colección para el Home: imagen, eyebrow, nombre, bajada y "Ver colección". De a dos por fila en Desktop. Toda la tarjeta es un solo link. No confundir con category-card (lleva al listado) ni family-card (ficha).

- Figma: [1036-2490](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2490) · ficha `doc/line-card` (`1452:6102`)

```html
<arq-line-card href="/arq/coleccion/douli">
  <img slot="image" src="…" alt="" loading="lazy">
  <span slot="label">Línea interior</span>
  <h3 slot="name">Douli</h3>
  <span slot="description">Descripción breve de la línea, su uso y su carácter.</span>
</arq-line-card>
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Name | slot `name` | — | un `<h3>` (el bloque ya tiene su `<h2>` en section-header). Es el nombre accesible del link |
| Label | slot `label` | — | eyebrow corto. Sin contenido, no se muestra |
| Description | slot `description` | — | 1 o 2 oraciones. Sin contenido, no se muestra |
| (imagen) | slot `image` | — | `<img>` |
| (texto del link) | slot `action` | — | def. "Ver colección" |
| — | `href` | `href` | la colección o el listado filtrado |
| State | — | — | Hover y Focus por CSS sobre toda la tarjeta |
| Breakpoint | — | — | media query: hasta 767 px es Mobile |

## Link estirado

Patrón común de las tarjetas (`src/base/card-link.css`, `docs/decisiones.md` · Tarjetas con link estirado): el `<a>` envuelve solo el `<h3>` (nombre accesible "Douli") y su `::after` cubre la tarjeta.

- **"Ver colección"** se ve como button Underline (con subrayado y `icon/arrow-right`) pero es decorativo (`aria-hidden`): no hay dos links al mismo destino.
- **Hover** (solo con mouse): borde `color/border/hover` sobre la imagen. **Focus:** anillo alrededor de toda la tarjeta.

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Imagen | `ratio/landscape` (5:4) | `ratio/square` (1:1) |
| Imagen → textos | `space/gap/lg` | `space/gap/lg` |
| Entre textos | `space/gap/md`, con `space/padding/sm` arriba | `space/gap/sm-md` |
| Antes de "Ver colección" | + `space/gap/sm` (espaciador del set) | + `space/gap/xs` |
| Bajada | hasta `layout/measure` | ancho completo |
| Alto máximo de la imagen | `100svh` − 2 × `space/section/xl` − `space/gap/6xl` (mín. `50svh`); al tope se recorta | sin tope |

El tope hace que la sección entre en una pantalla aunque el viewport sea muy ancho (`docs/decisiones.md`, 2026-10-05 · Home: alturas y meta).

## Tokens

| Parte | Token |
| --- | --- |
| Imagen (sin imagen) | `color/bg/subtle` |
| Eyebrow | `color/text/tertiary` · `role/label` |
| Nombre | `color/text/primary` · `role/heading-1` |
| Bajada | `color/text/secondary` · `role/body-lg` |
| Link | `color/action/primary` · `role/body-regular`, subrayado `border/default` en `color/border/strong` |

## Pendientes

- `TODO` (diseño): en el set la bajada mide 440 fijos y no hay token; se usa `layout/measure` (400).
