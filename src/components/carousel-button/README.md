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
| State=Disabled | `disabled` | `disabled` | booleano · atributo `disabled` nativo en el `<button>` interno |
| — (nombre accesible) | slot por defecto | — | Qué hace el botón ("Anterior", "Siguiente"). Queda oculto visualmente |

- Hover, Pressed y Focus no son props: `:hover`, `:active` y `:focus-visible`.
- `el.focus()` enfoca el `<button>` interno. Deshabilitado, el clic no se propaga.
- En la Home lo arma `<arq-carousel-controls buttons="carousel">`.

## Tokens

| Parte | Token |
| --- | --- |
| Lado | `layout/carousel-button` |
| Borde | `border/default` en `color/border/disabled` |
| Fondo Default · Disabled | `color/surface/default` · `color/surface/subtle` |
| Chevron | `icon/md` · `color/icon/primary` (Disabled: `color/icon/disabled`) |
| Hover · Pressed | `color/surface/hover` · `color/surface/selected` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |
