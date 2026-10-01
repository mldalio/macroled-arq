# breadcrumb · `<arq-breadcrumb>`

Migas de pan: `Colecciones / Kanu / Kanu Jardín`. Contiene [`<arq-breadcrumb-item>`](../breadcrumb-item/README.md).

- Figma: [1244-12667](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-12667) · ficha `doc/breadcrumb-item` (`1424:2126`)

```html
<arq-breadcrumb>
  <arq-breadcrumb-item href="/arq/colecciones" show-separator>Colecciones</arq-breadcrumb-item>
  <arq-breadcrumb-item href="/arq/colecciones/kanu" show-separator>Kanu</arq-breadcrumb-item>
  <arq-breadcrumb-item current>Kanu Jardín</arq-breadcrumb-item>
</arq-breadcrumb>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Levels | — | — | No es una prop: la cantidad de niveles es la cantidad de ítems (3 · 2 en Figma, libre en código) |

- El último ítem va con `current` (sin separador); los demás con `show-separator`.
- **Accesibilidad:** `<nav aria-label="Migas de pan">` con una lista (`role="list"`); cada ítem es un `listitem`. No es un `<ol>` porque un `<ol>` solo admite `<li>` como hijos directos (axe lo marca como error).

## Tokens

| Parte | Token |
| --- | --- |
| Gap entre ítems | `space/gap/sm` (el mismo que entre label y "/") |

## Pendientes

- `TODO` Si no entra en una línea, Figma no lo define: se parte en varias líneas con el mismo gap.
