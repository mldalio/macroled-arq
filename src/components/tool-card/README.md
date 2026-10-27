# tool-card · `<arq-tool-card>`

Recurso de la escena Herramientas de Home v2. Toda la tarjeta es el link. `type="media"` (def.) lleva imagen o placeholder. `type="index"` es una fila sin imagen: número, título, bajada y flecha.

- Figma: Home v2 · componentes, Tamaño Grande `2072:20693` y Chico `2072:20702`

```html
<arq-tool-card href="/arq/descargas" size="large">
  <span slot="title">Catálogo</span>
  <span slot="subtitle">Un catálogo por familia de producto</span>
  <span slot="placeholder">Imagen del catálogo</span>
</arq-tool-card>

<arq-tool-card type="index" href="/arq/descargas">
  <span slot="index">01</span>
  <span slot="title">Catálogo</span>
  <span slot="subtitle">Un catálogo por familia de producto</span>
</arq-tool-card>
```

## Props

| Figma | Atributo / slot | Valores · por defecto |
| --- | --- | --- |
| Tamaño | `size` | `large` · `small` (def. `small`). Solo `type="media"` |
| — | `type` | `media` (def.) · `index`. `index` no está en Figma |
| — | `href` | destino de la tarjeta |
| — | `target` | `_blank` abre el PDF en otra pestaña (`rel="noopener"`) |
| index | slot `index` | número del índice (`type="index"`), `role/label` |
| title | slot `title` | `role/body-medium` en `media`; `role/heading-3-light` en `index` |
| subtitle | slot `subtitle` | `role/caption` en `media`; `role/body` en `index` |
| image | slot `image` | foto. Sin foto se ve el placeholder. En hover y foco hace zoom dentro del recorte (`motion/scale/hover`); la tarjeta no cambia de tamaño |
| placeholder | slot `placeholder` | texto sobre `color/surface/strong` |

TODO (diseño): las medidas 520×642 y 311×369 no tienen token de ratio. Las imágenes de Catálogo, Fichas y Descargas en Figma son placeholders.
