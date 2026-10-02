# family-card · `<arq-family-card>`

Tarjeta de otra familia (grupo) de la misma colección, en la ficha: lleva a la ficha de esa familia. Default en "Otras familias de la colección"; Large en "Explora la colección", que va en una sección con Dark local. No confundir con category-card ni line-card (Home).

- Figma: [1094-5766](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1094-5766) · ficha `doc/family-card` (`1463:10124`)

```html
<arq-family-card href="/arq/producto/kanu-pared">
  <img slot="image" src="…/estudio.jpg" alt="" loading="lazy">
  <h3 slot="name">Kanu Pared</h3>
</arq-family-card>

<section data-arq-theme="dark"> <!-- Explora la colección -->
  <arq-family-card href="…" size="large">…</arq-family-card>
</section>
```

## Props y slots

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Name | slot `name` | — | `<h3>` con el nombre de la familia: es lo que lleva el link |
| — (imagen) | slot `image` | — | `<img>`: la misma de la product-card del grupo (estudio, luz apagada), `alt=""` |
| Size | `size` | `size` | `default` · `large`. Por defecto `default` |
| — | `href` | `href` | Ficha de esa familia |

- **No son props:** State=Hover y State=Focus (CSS, `src/base/card-link.css`): borde `color/border/hover` en la imagen y anillo de foco alrededor de la tarjeta. Sin subrayado del nombre (como el set; la descripción lo pedía y se corrigió).
- **Imagen:** proporción del sistema (decisión 2026-10-02 · family-card): `ratio/square` en Default y `ratio/portrait` en Large. Se corrigió el alto en las 6 variantes del set. `alt=""` porque el nombre lo da el link (la ficha pide alt con el nombre; se leería dos veces).
- **Ancho:** el de su columna. Con más tarjetas de las que entran van en un carrusel horizontal (patrón de la página: `overflow-x: auto`, `scroll-snap`, gap `space/gap/sm`); el ancho de cada tarjeta lo pone la página.

## Tokens

| Parte | Token |
| --- | --- |
| Gap imagen–nombre | `space/gap/md` |
| Imagen | `ratio/square` (Default) · `ratio/portrait` (Large); placeholder `color/surface/subtle` |
| Nombre | Default `role/body-lg-medium` en `color/text/secondary`; Large `role/heading-3` en `color/text/primary` |
| Hover | `border/default` en `color/border/hover` sobre la imagen |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- `TODO` (ficha) Ancho de cada tarjeta en el carrusel (200 y 328 en Figma, sin token): se define al armar la Ficha.
