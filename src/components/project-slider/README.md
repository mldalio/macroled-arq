# project-slider · `<arq-project-slider>`

Carrusel de `scene/proyectos` de Home v2: fotos de obra con el slide Activo al centro. Las flechas son `arq-carousel-controls`.

- Figma: Home v2 `2153:20657`

```html
<arq-project-slider autoplay>
  <arq-project-slide>
    <img slot="image" src="…" alt="…" loading="lazy">
  </arq-project-slide>
  <arq-project-slide active>
    <img slot="image" src="…" alt="…" loading="lazy">
  </arq-project-slide>
  <span slot="caption">Edición de Casa FOA Buenos Aires…</span>
</arq-project-slider>
```

## Props

| Atributo | Valores |
| --- | --- |
| `autoplay` | presencia = avanza solo cada 4 s. Sin atributo, quieto |

El slide con `active` arranca al centro. Arrastrar la tira con el mouse (o el dedo) la mueve y suelta en la foto más cercana. Un clic, o Enter / Espacio con el carrusel enfocado, abre esa foto en un lightbox (flechas, Esc y el fondo lo cierran). Flechas del pie o teclas ← → cambian el Activo. El recorrido es un bucle: después de la última foto sigue la primera, y al revés, con las mismas imágenes repetidas a los lados. Las flechas no se deshabilitan.

`autoplay` avanza solo cada 4 s. Se pausa con el mouse encima, al arrastrar, con el lightbox abierto, con la pestaña oculta y con `prefers-reduced-motion`.

TODO (diseño): Home v2 no tiene frame Mobile. Hasta 767 px no se muestran las flechas. Autoplay, arrastre y lightbox no están en Figma.
