# tool-card · `<arq-tool-card>`

Recurso de la escena Herramientas de Home v2: imagen o placeholder, título, bajada y flecha. Toda la tarjeta es el link.

- Figma: Home v2 · componentes, Tamaño Grande `2072:20693` y Chico `2072:20702`

```html
<arq-tool-card href="/arq/descargas" size="large">
  <span slot="title">Catálogo</span>
  <span slot="subtitle">Un catálogo por familia de producto</span>
  <span slot="placeholder">Imagen del catálogo</span>
</arq-tool-card>
```

## Props

| Figma | Atributo / slot | Valores · por defecto |
| --- | --- | --- |
| Tamaño | `size` | `large` · `small` (def. `small`) |
| — | `href` | destino de la tarjeta |
| title | slot `title` | `role/body-medium` |
| subtitle | slot `subtitle` | `role/caption` |
| image | slot `image` | foto. Sin foto se ve el placeholder. En hover y foco hace zoom dentro del recorte (`motion/scale/hover`); la tarjeta no cambia de tamaño |
| placeholder | slot `placeholder` | texto sobre `color/surface/strong` |

TODO (diseño): las medidas 520×642 y 311×369 no tienen token de ratio. Las imágenes de Catálogo, Fichas y Descargas en Figma son placeholders.
