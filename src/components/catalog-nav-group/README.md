# catalog-nav-group · `<arq-catalog-nav-group>`

Grupo desplegable de catalog-nav: una macrofamilia (Interior, Exterior, Lámparas, Artefactos, Colecciones) con su lista de `arq-catalog-nav-item`.

- Figma: [1035-2410](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2410) · ficha `doc/catalog-nav-group` (`1426:2110`)

```html
<arq-catalog-nav-group open>
  <span slot="label">Interior</span>
  <arq-catalog-nav-item href="…" selected>Todo interior</arq-catalog-nav-item>
  <arq-catalog-nav-item href="…">Embutir</arq-catalog-nav-item>
</arq-catalog-nav-group>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot `label` | — | Nombre de la macrofamilia (`role/body-xl`) |
| Open | `open` | `open` | booleano. Figma lo trae en True; en código lo decide el HTML (el grupo de la categoría actual) o catalog-nav |
| Selected | `selected` | `selected` | booleano: el grupo de la categoría actual. Sin cambio visual; lo pone catalog-nav |
| — (ítems) | slot por defecto | — | `arq-catalog-nav-item`, cantidad libre |

- **Comportamiento** (`src/base/disclosure.js`): el encabezado es un `<button>` con `aria-expanded`; la lista (`role="list"`) queda en el HTML aunque esté cerrada. La acción del usuario emite `arq:toggle` con `{ open }`.
- **Ícono:** `chevron-down` cerrado y `chevron-up` abierto, con las medidas de icon-button Size=Default (24, ícono 16), parte del botón. Hover `color/surface/hover`.
- Siempre dentro de `arq-catalog-nav`.

## Tokens

| Parte | Token |
| --- | --- |
| Línea inferior | `border/default` en `color/border/subtle` |
| Padding vertical · gap encabezado–lista | `space/padding/md` · `space/gap/md` |
| Label | `role/body-xl`; abierto `color/text/primary`, cerrado `color/text/secondary` |
| Lista | sangría `space/padding/lg`; abajo `space/padding/md` + `space/padding/xs` |
| Riel | línea izquierda `border/default` en `color/border/subtle`; los ítems van pegados |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |

## Pendientes

- La ficha `doc/catalog-nav-group` todavía muestra el diseño anterior (`role/label`, +/–, línea superior). Manda el set.
