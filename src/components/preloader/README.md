# preloader · `<arq-preloader>`

Pantalla de entrada. Fondo blanco, el logo de Macroled ARQ y una línea del mismo ancho que se completa de izquierda a derecha. No hay set en Figma.

En las páginas tapa el sitio hasta que cargaron las imágenes, los videos y los textos (la fuente y lo que traen los componentes del catálogo). En la demo de componentes, sin `page`, la línea se recorre sola.

```html
<arq-preloader open page></arq-preloader>
<arq-preloader open></arq-preloader>
```

## Props

| Atributo | Prop JS | Valores |
| --- | --- | --- |
| `open` | `open` | presencia: se ve. Al sacarlo, funde y desaparece |
| `page` | `page` | presencia: no se va hasta que la página cargó |

- **Fondo:** siempre blanco. El componente se marca `data-arq-theme="light"`, así sigue en blanco si la página está en Dark.
- **Logo:** el mismo dibujo que `<arq-logo>` Size=Default (181 × 16). No es link.
- **Línea:** debajo del logo, a `space/gap/lg`, del mismo ancho y de `border/default` en el color del texto. Crece con `transform: scaleX`.
- **`page`:** la línea marca la parte ya cargada. Espera las imágenes que no son `loading="lazy"`, los videos con contenido (un banner `aria-hidden` no) hasta tener un frame, la fuente y los componentes con `aria-busy` (listado, ficha, colección, comparativa, descargas). Los destacados de la Home no traban: se ven sus cards de carga. Después funde. Si un recurso no responde, a los 20 s se muestra la página igual.
- **Sin `page`:** la línea se recorre en `motion/duration/shimmer` con `motion/easing/out`, espera `motion/duration/panel` y emite `arq:done`.
- Con `prefers-reduced-motion` la línea no se anima. En `page` igual se espera a que cargue.
- «Cargando» queda solo para lectores de pantalla. Mientras está, el resto de la página no se puede usar.

## Tokens

| Parte | Token |
| --- | --- |
| Fondo | `color/surface/default` del Light local |
| Logo y línea | `color/text/primary` |
| Separación | `space/gap/lg` |
| Grosor | `border/default` |
| Avance en la página | `motion/duration/base`, `motion/easing/out` |
| Recorrido de la vista | `motion/duration/shimmer`, `motion/easing/out` |
| Salida | `motion/duration/fade` |

## Pendientes

- `TODO` (diseño): no hay token para el tope de 20 s.
- Va primero en cada embed de `src/pages/`. En Webflow hay que volver a pegar el embed. `dist/arq.css` tapa la página antes de que cargue el script.
