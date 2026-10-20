# project-slide · `<arq-project-slide>`

Slide del carrusel de proyectos de Home v2. Activo = slide central (sin velo). Inactivo = laterales con velo. Reemplazar la foto en cada instancia.

- Figma: [2153-20656](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2153-20656)

```html
<arq-project-slide active>
  <img slot="image" src="…" alt="Comedor con colgantes Douli" loading="lazy">
</arq-project-slide>
```

## Props y slots

| Figma | Atributo / slot | Valores · por defecto |
| --- | --- | --- |
| Estado | `active` | presencia = Activo (sin velo). Sin atributo = Inactivo |
| image | slot `image` | `<img>`. Sin foto se ve `color/bg/subtle` |

No confundir con collection-tile (nombre y flecha sobre la foto) ni project-mosaic (mosaico fijo).
