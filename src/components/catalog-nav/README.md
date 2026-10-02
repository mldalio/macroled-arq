# catalog-nav · `<arq-catalog-nav>`

Navegación de categorías de Productos y Colecciones. Un solo componente para Desktop y Mobile: incluye catalog-nav-mobile y catalog-nav-trigger, así cada link está una sola vez en el HTML (decisión 2026-10-02 · catalog-nav).

- Figma: [1035-2411](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2411) (catalog-nav) · [1207-3314](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1207-3314) (catalog-nav-mobile) · [1215-3337](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1215-3337) (catalog-nav-trigger)
- Fichas `doc/catalog-nav` (`1426:1839`), `doc/catalog-nav-mobile` (`1427:2053`) y `doc/catalog-nav-trigger` (`1427:2306`)

```html
<arq-catalog-nav label="Categorías">
  <arq-catalog-nav-group>
    <span slot="label">Interior</span>
    <arq-catalog-nav-item href="/arq/productos/…" selected>Todo interior</arq-catalog-nav-item>
    <arq-catalog-nav-item href="/arq/productos/…">Embutir</arq-catalog-nav-item>
  </arq-catalog-nav-group>
  <arq-catalog-nav-group>
    <span slot="label">Exterior</span>
    …
  </arq-catalog-nav-group>
</arq-catalog-nav>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| — (grupos) | slot por defecto | — | `arq-catalog-nav-group`, cantidad libre |
| catalog-nav-mobile · Open | `open` | `open` | booleano. Solo cuenta hasta 1023 px |
| catalog-nav-trigger · Label | — | — | Sale solo del `arq-catalog-nav-item` elegido (`selected`) |
| — | `label` | `label` | Nombre del `<nav>` para lectores de pantalla. Por defecto «Categorías» (también es el texto del encabezado si no hay ítem elegido) |

- **Desde 1024 px** (corte de los listados, AGENTS.md): sidebar con los grupos.
- **Hasta 1023 px:** encabezado con la selección actual (`<button>` con `aria-expanded`). Al tocarlo se abren los mismos grupos; todos visibles y el de la categoría actual abierto, como Figma. Al elegir un ítem, el panel se cierra.
- **Grupo abierto:** lo decide el HTML (`open` en el grupo de la categoría actual). Si ninguno viene abierto, se abre el que tiene el ítem elegido.
- **Links en el HTML del embed:** los arma la página con el árbol de navegación de `src/data/` (decisión 2026-10-02 · Navegación); así quedan indexables.
- **Ancho:** el de su columna. En Figma la columna del sidebar mide 240.

## Tokens

| Parte | Token |
| --- | --- |
| Fondo | `color/surface/default` |
| Padding lateral | `space/padding/md` |
| Mobile: bordes | `border/default` en `color/border/default` arriba y abajo |
| Mobile: encabezado | padding `space/padding/md`, gap `space/gap/md`, texto `role/body-regular` en `color/text/primary`; fondo `color/surface/faint` en Hover y abierto (el panel queda en `color/surface/default`, como el set; la ficha dice `faint`) |
| Mobile: ícono | como icon-button Size=Default (`space/padding/xs` + `icon/md`); abierto sobre `color/surface/default` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- `TODO` (listados) El ancho de la columna del sidebar (240 en Figma) no tiene token: se define al armar la grilla del listado.
- `TODO` (urls) Las URLs de categoría siguen PENDIENTES (`docs/urls.md`); la demo usa links de ejemplo.
