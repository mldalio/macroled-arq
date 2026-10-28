# compatible-products · `<arq-compatible-products>`

Sección de productos compatibles de la ficha de Daö («Accesorios y lámparas compatibles») y de la lámpara («Accesorio requerido»): una grilla de [search-card](../search-card/README.md) (imagen cuadrada y nombre) con lo que se arma con el producto de la ficha. Cada tarjeta lleva a la ficha de esa pieza.

> **Sin set en Figma todavía.** El diseño de referencia (`AccessoriesSection`, 2256:28229) es de una ficha desactualizada. `TODO` (diseño): set, ficha `doc/compatible-products` y espaciado propio de la sección.

```html
<arq-compatible-products>
  <h2 slot="title">Productos compatibles</h2>
</arq-compatible-products>
```

```js
section.items = [{ name: 'Daö Embutir', href: '/arq/producto/dao-embutir?sku=…', image: 'https://…' }];
```

| Atributo / slot / prop | Valores |
| --- | --- |
| slot `title` | `<h2>` de la sección (`role/heading-2`); lo escribe la página |
| slot `action` | Acción a la derecha del título. En la ficha de Daö, «Configura tu Daö» |
| `items` (prop JS) | Lista de `{ name, href, image, finishes, meta }`. `finishes`: `[{ name, src }]`, swatches a la derecha del nombre; `meta`: texto debajo del nombre (módulos). Sin `href` la tarjeta no es un link; sin `image` queda el recuadro `color/surface/subtle` |

- Sin items la sección no se muestra.
- **Grilla:** 5 columnas desde 1440 px (Large), 4 de 1024 a 1439 px, y hasta 1023 px las que entran a `layout/card-min`; gap `space/gap/lg`, margen lateral `--page-gutter`. Las tarjetas son search-card Size=Large (nombre en `role/body-xl`, 20 px), con los acabados del grupo y, en los aros, la cantidad de módulos debajo del nombre.
- **Qué incluye:** `compatibleProducts()` de `src/data/dao-config.js` usa las relaciones del configurador (aro ← cabezal ← lámpara ← frente: `cabezales_compatibles`, `lamparas_compatibles`, `frentes_compatibles`). Ficha de aro o cabezal: los demás aros, cabezales y lámparas con los que se arma, sin frentes (título «Accesorios y lámparas compatibles»). Ficha de la lámpara: solo su frente, un accesorio requerido (título «Accesorio requerido»). El frente no lleva sección. Una tarjeta por grupo (colores y módulos son variantes de la misma ficha); el grupo del propio SKU no entra. Orden: aros, cabezales, lámparas.
- Hoy se ven todos, requeridos u opcionales. `TODO` (diseño): etiqueta «Requerido» / «Opcional» cuando se defina.
- `<arq-ficha-producto>` la muestra en la colección Daö y en las lámparas `PAR11-`, y recibe el título por los slots `compatible-title` y `accessory-title` del embed.
