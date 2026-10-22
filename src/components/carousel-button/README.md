# carousel-button · `<arq-carousel-button>`

Botón anterior / siguiente de los carruseles de Productos destacados y Proyectos. Cuadrado con chevron. No confundir con icon-button (lo usa carousel-controls del mosaico de Colección).

- Figma: [2387-8532](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2387-8532)

```html
<arq-carousel-button direction="previous">Anterior</arq-carousel-button>
<arq-carousel-button direction="next">Siguiente</arq-carousel-button>
<arq-carousel-button direction="previous" disabled>Anterior</arq-carousel-button>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Direction | `direction` | `direction` | `previous` · `next` (def. `previous`) |
| Background | `background` | `background` | `outline` · `frosted` (def. `outline`) |
| State=Disabled | `disabled` | `disabled` | booleano · atributo `disabled` nativo en el `<button>` interno |
| — (nombre accesible) | slot por defecto | — | Qué hace el botón ("Anterior", "Siguiente"). Queda oculto visualmente |

- Hover, Pressed y Focus no son props: `:hover`, `:active` y `:focus-visible`.
- `el.focus()` enfoca el `<button>` interno. Deshabilitado, el clic no se propaga.
- En la Home lo arma `<arq-carousel-controls buttons="carousel">`.

## Cuándo se usa

- **Outline** (por defecto): fondos lisos. Hoy, los carruseles de Destacados y Proyectos de la Home (`arq-carousel-controls buttons="carousel"`).
- **Frosted**: sobre fotos o capas con transparencia. Hoy, los Recomendados del buscador (`arq-search-sheet`): solo aparecen al pasar el mouse sobre la fila de tarjetas o con foco de teclado, y cada dirección solo si queda contenido de ese lado (por eso no se usa Disabled). Más adelante, sobre las fotos del hero y de las galerías de la ficha, probablemente con menos opacidad y más minimalista; **todavía no está en uso ahí**.

## Tokens

| Parte | Token |
| --- | --- |
| Lado | `layout/carousel-button` |
| Borde | `border/default` en `color/border/disabled` |
| Fondo Default · Disabled (outline) | `color/surface/default` · sin relleno (`color/surface/transparent`), el borde sigue en `color/border/disabled` |
| Background=Frosted | fondo `color/overlay/frosted` (blanco al 60 %) con `blur/backdrop-soft` (4) y borde fino `color/border/subtle` (en hover, `color/border/default`). Es el que se nota sobre fotos (buscador). `TODO`: en un contenedor Dark el chevron (`color/icon/primary`) pasa a claro y se pierde sobre el blanco |
| Chevron de Frosted | `icon/xl` (24), más grande que el de Outline (`icon/md`) |
| Chevron | `icon/md` · `color/icon/primary` (Disabled: `color/icon/disabled`) |
| Hover · Pressed | `color/surface/hover` · `color/surface/selected` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |
