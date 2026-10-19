# collection-mosaic · `<arq-collection-mosaic>`

Mosaico de colecciones de Home v2 (frame 2306:23088): Kanu alta a la izquierda; Douli ancha, empezando más abajo; debajo, otra foto y Sento, que sigue más abajo. Las tarjetas son `arq-collection-tile`. El hueco es `space/5`.

- Figma: Home v2 `2063:29996`

```html
<arq-collection-mosaic>
  <arq-collection-tile slot="primary" href="/arq/coleccion/kanu">…</arq-collection-tile>
  <arq-collection-tile slot="wide" href="/arq/coleccion/douli">…</arq-collection-tile>
  <arq-collection-tile slot="stack" href="/arq/coleccion/douli">…</arq-collection-tile>
  <arq-collection-tile slot="stack" href="/arq/coleccion/sento">…</arq-collection-tile>
</arq-collection-mosaic>
```

En Mobile se apilan. Home v2 no tiene frame Mobile.

Al entrar en pantalla, las tarjetas suben y aparecen una por vez, en el orden del mosaico. Con `prefers-reduced-motion` se ven quietas.

El mosaico no sigue el padding lateral de la sección: las fotos llegan al borde y el título se queda con el margen.

No confundir con project-mosaic (fotos de proyectos, sin nombre).
