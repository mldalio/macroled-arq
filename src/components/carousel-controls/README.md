# carousel-controls · `<arq-carousel-controls>`

Flechas anterior / siguiente para un carrusel con scroll horizontal (mosaico de Colección, proyectos del Home). Solo en Desktop: en Mobile no se muestran, porque el carrusel se desliza y la imagen siguiente asoma como indicador.

- Figma: [1410-17825](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1410-17825) · ficha `doc/carousel-controls` (`1452:6289`)

```html
<div class="…encabezado del bloque…">
  <arq-section-header type="title"><h2 slot="title">Proyectos</h2></arq-section-header>
  <arq-carousel-controls for="proyectos"></arq-carousel-controls>
</div>
<div id="proyectos"> … tarjetas con overflow-x: auto y scroll-snap … </div>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Position | `position` | `position` | `start` · `middle` · `end` (def. `start`). Con `for`, se calcula sola |
| — | `for` | `for` | id del contenedor con scroll, en el DOM de la página |
| — | `label-prev` · `label-next` | `labelPrev` · `labelNext` | nombres accesibles (def. "Anterior" · "Siguiente") |

## Comportamiento

- **Con `for`:** cada flecha hace `scrollBy` de un ancho visible del carrusel y el snap lo alinea. Position se calcula con el `scrollLeft` (y al cambiar el tamaño del carrusel o de lo que tiene adentro, como una foto que carga): Start deshabilita la anterior, End la siguiente. Si todo el contenido entra, las dos quedan deshabilitadas.
- **Sin `for`:** Position queda como esté en el atributo y las flechas emiten `arq:prev` y `arq:next` (para un carrusel que se maneje de otra forma).
- **Foco:** si la flecha que tiene el foco se deshabilita (al llegar a una punta), el foco pasa a la otra.
- **`aria-controls`:** se pone con `ariaControlsElements` (un id del DOM de la página no se puede referenciar desde el Shadow DOM). En navegadores que no lo soportan, no se pone.
- **Movimiento reducido:** con `prefers-reduced-motion: reduce` el salto es instantáneo.
- Las flechas son dos `<arq-icon-button size="large">` (`icon/arrow-left`, `icon/arrow-right`); deshabilitada = `disabled` nativo.
- Van a la derecha del section-header del carrusel.

## Tokens

| Parte | Token |
| --- | --- |
| Gap entre flechas | `space/gap/sm` |
| Botón | icon-button Large: `space/padding/sm-md` + `icon/xl` (48 × 48) |
| Ícono · deshabilitado | `color/icon/primary` · `color/icon/disabled` |

## Pendientes

- El contenedor con scroll (snap y peek) no es parte del componente: lo arma la página (en Colección, el mosaico de `arq-coleccion`; DESIGN.md §12: carousel se resuelve en código). En la demo hay un carrusel de prueba con CSS de la demo.
