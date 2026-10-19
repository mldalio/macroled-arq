# text-block · `<arq-text-block>`

Kicker, título y bajada de una escena de Home v2, con flecha opcional. No es section-header: no tiene link de texto ni separador.

- Figma: Home v2 · componentes `2072:20657`

```html
<arq-text-block href="/arq/productos">
  <span slot="kicker">02 – Selección</span>
  <h2 slot="title">Productos destacados</h2>
  <span slot="description">Una selección de piezas para empezar a proyectar.</span>
  <span slot="link">Ver todos los productos</span>
</arq-text-block>
```

## Props

| Figma | Atributo / slot | Valores · por defecto |
| --- | --- | --- |
| kicker | slot `kicker` | etiqueta en `role/label`. Sin texto, no se muestra |
| title | slot `title` | un `<h2>`. Se estiliza con `role/display-sm` |
| description | slot `description` | bajada en `role/body`. Sin texto, no se muestra |
| — | `href` | destino de la flecha. Sin `href` no hay flecha |
| — | slot `link` | nombre accesible de la flecha (no se ve) |

TODO (diseño): el título de Home v2 es Regular 50/64 y no hay `role/*`. Se usa `role/display-sm` (48/56) en Regular. La bajada mide 340 en Figma; se usa `layout/measure` (400).
