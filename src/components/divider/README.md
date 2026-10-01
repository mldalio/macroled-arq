# divider · `<arq-divider>`

Línea divisoria de 1 px. Horizontal para separar bloques dentro de un mismo contenedor; Vertical entre acciones de una barra (catalog-toolbar, compare-bar).

- Figma: [1244-3990](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-3990) · ficha `doc/divider` (`1440:4328`)

```html
<arq-divider></arq-divider>
<arq-divider emphasis="default"></arq-divider>
<arq-divider orientation="vertical"></arq-divider>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Orientation | `orientation` | `orientation` | `horizontal` · `vertical` (def. `horizontal`) |
| Emphasis | `emphasis` | `emphasis` | `subtle` · `default` (def. `subtle`) |

- **Horizontal:** ocupa el ancho del contenedor (FILL).
- **Vertical:** toma el alto de su contenedor **flex o grid** (`align-self: stretch`). En una fila de texto mide 20; en compare-bar llena el alto. Fuera de un contenedor flex o grid no tiene alto.
- **Subtle** por defecto; **Default** cuando el fondo pide más contraste.
- No se usa para separar secciones de página: eso lo resuelve el espaciado (`space/section/*`).
- **Accesibilidad:** Horizontal tiene `role="separator"` (como un `<hr>`). Vertical es decorativo y queda oculto para lectores de pantalla. Los dos van por `ElementInternals`, sin atributos en el HTML.

## Pendientes

- `TODO` (catalog-toolbar): en Figma el divider del toolbar mide 20, pero esa fila tiene el botón Filtrar (36), así que con `stretch` mediría 36. catalog-toolbar le tiene que dar el alto de 20 a su divider (por ejemplo, envolviéndolo en un elemento del alto de una línea de texto).

## Tokens

| Parte | Token |
| --- | --- |
| Color Subtle · Default | `color/border/subtle` · `color/border/default` |
| Grosor | `border/default` |
