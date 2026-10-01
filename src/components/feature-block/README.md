# feature-block · `<arq-feature-block>`

Bloque editorial del Home con imagen protagonista: foto grande (y una secundaria opcional) + eyebrow, título, bajada y un button. Si hay dos seguidos, se alterna Image left / Image right.

- Figma: [1036-2535](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2535) · ficha `doc/feature-block` (`1455:7570`)

```html
<arq-feature-block layout="image-right">
  <img slot="image" src="…" alt="Balizas de jardín de la colección Kanu" loading="lazy">
  <span slot="label">Colección destacada</span>
  <h2 slot="title">Kanu</h2>
  <span slot="description">Descripción de la colección destacada, su uso y los espacios para los que está pensada.</span>
  <arq-button slot="action" type="underline" show-underline show-icon icon="arrow-right" href="/arq/coleccion/kanu">Ver colección</arq-button>
  <img slot="secondary" src="…" alt="Detalle del acabado" loading="lazy">
</arq-feature-block>
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Layout | `layout` | `layout` | `image-left` · `image-right` (def. `image-left`). Misma estructura HTML |
| Title | slot `title` | — | un `<h2>` |
| Label | slot `label` | — | eyebrow. Sin contenido, no se muestra |
| Description | slot `description` | — | bajada. Sin contenido, no se muestra |
| (button) | slot `action` | — | un `<arq-button type="underline" show-underline show-icon icon="arrow-right" href>` |
| (imagen) | slot `image` | — | `<img>` con `alt` descriptivo (es contenido) |
| Show secondary image | slot `secondary` | — | `<img>` opcional. Sin contenido, no se muestra |
| Breakpoint | — | — | media query: hasta 767 px es Mobile |

- Show secondary image (en Figma, `true` por defecto) no es atributo: lo decide el HTML.
- El margen lateral lo pone la sección (no es de borde a borde).

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Imagen | 50 % del ancho, `ratio/portrait-soft` (4:5) | ancho completo, 4:5 |
| Imagen → textos | `space/gap/6xl` | `space/gap/lg` |
| Textos | a `space/gap/xl`; arriba `space/padding/xl-2xl` (Image left) o `space/padding/6xl` (Image right, desfasado como el set) | a `space/gap/md`, `space/padding/sm` arriba |
| Secundaria | debajo de los textos, en su columna (`ratio/wide`) | al final del bloque |

## Tokens

| Parte | Token |
| --- | --- |
| Imágenes (sin imagen) | `color/bg/subtle` |
| Eyebrow | `color/text/tertiary` · `role/label` |
| Título | `color/text/primary` · `role/display-sm` |
| Bajada | `color/text/secondary` · `role/body-lg` |

## Pendientes

- `TODO` (diseño): la imagen secundaria tiene alto fijo en el set (300 Desktop · 220 Mobile), sin ratio; se usa `ratio/wide` (16:10), el más cercano. DESIGN.md §5 no la lista.
- `TODO` (diseño): la bajada mide 440 fijos en el set; se usa `layout/measure` (400).
