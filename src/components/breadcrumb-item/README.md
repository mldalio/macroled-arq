# breadcrumb-item · `<arq-breadcrumb-item>`

Un nivel del breadcrumb: label (link) y separador "/" opcional. No se usa suelto: siempre dentro de [`<arq-breadcrumb>`](../breadcrumb/README.md).

- Figma: [1053-4430](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1053-4430) · ficha `doc/breadcrumb-item` (`1424:2126`)

```html
<arq-breadcrumb-item href="/arq/colecciones" show-separator>Colecciones</arq-breadcrumb-item>
<arq-breadcrumb-item current>Kanu Jardín</arq-breadcrumb-item>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | nombre de la sección, en caja normal (la mayúscula la pone `role/label`) |
| Show separator | `show-separator` | `showSeparator` | booleano · "/" después del label. **En Figma viene en `true`; en código, sin el atributo no hay separador.** Se pone en todos los ítems menos el último |
| State=Current | `current` | `current` | booleano · página actual: `color/text/primary`, sin link y sin separador (aunque tenga `show-separator`), con `aria-current="page"` |
| — | `href` | `href` | destino del link. Sin `href` (o con `current`) el label es texto |

- State=Hover es `:hover`, solo en dispositivos con mouse (`@media (hover: hover)`): el label pasa a `color/text/primary`.
- Es un ítem de lista (`role="listitem"` por `ElementInternals`) del `<ol>` de `<arq-breadcrumb>`. El "/" queda oculto para lectores de pantalla.
- Foco del link con el anillo de DESIGN.md §7.

## Tokens

| Parte | Token |
| --- | --- |
| Label Default · separador | `color/text/tertiary` |
| Label Hover · Current | `color/text/primary` |
| Gap label–separador | `space/gap/sm` |
| Texto | `role/label` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- Hover a `color/text/primary` sigue la ficha `doc/breadcrumb-item`; en el set de Figma Hover está igual que Default (diseño corrige Figma).
- `TODO` Un label que no entra: Figma no lo define. Se corta con puntos suspensivos.
- Sin transición en hover ("transición corta" en la ficha): no hay tokens de movimiento.
