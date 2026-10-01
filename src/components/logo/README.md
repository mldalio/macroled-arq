# logo · `<arq-logo>`

Logotipo de Macroled Arq (MACROLED + ARQ). Siempre es link a la home de Arq.

- Figma: [751-4307](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=751-4307) · ficha `doc/logo` (`1440:3214`)

```html
<arq-logo></arq-logo>
<arq-logo size="small"></arq-logo>
<arq-logo size="compact" href="/arq"></arq-logo>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Size | `size` | `size` | `default` · `small` · `compact` (def. `default`) |
| — | `href` | `href` | destino del link (def. `/arq`) |

- **Default** en navbar desktop · **Small** en navbar mobile · **Compact** en el footer y donde el espacio es mínimo. Se elige el Size; no se escala a mano.
- Tamaños: 181 × 16 · 158 × 13,97 · 117 × 10,34. Es el mismo dibujo escalado.
- **Color:** `currentColor`, que por defecto es `color/text/primary`: en modo Dark se invierte solo. Un contenedor puede pisar `color` del elemento.
- **Accesibilidad:** el link lleva `aria-label="Macroled Arq, inicio"` y el SVG queda oculto para lectores de pantalla. Foco con el anillo de DESIGN.md §7.

## Tokens

| Parte | Token |
| --- | --- |
| Color | `color/text/primary` (por `currentColor`) |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- Los anchos van en px dentro de `logo.css`: son medidas del archivo del logo, no del sistema (excepción anotada en `docs/decisiones.md`).
- `TODO` (navbar) Sobre el hero (navbar Theme=Transparent) el logo toma el color inverso. Se define al construir el navbar.
