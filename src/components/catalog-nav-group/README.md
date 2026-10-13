# catalog-nav-group · `<arq-catalog-nav-group>`

Grupo desplegable de catalog-nav: una macrofamilia (Interior, Exterior, Lámparas, Artefactos, Colecciones) con su lista de `arq-catalog-nav-item`.

- Figma: [1035-2410](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1035-2410) · ficha `doc/catalog-nav-group` (`1426:2110`)

```html
<arq-catalog-nav-group open selected>
  <span slot="label">Interior</span>
  <arq-catalog-nav-item href="…" selected>Todo interior</arq-catalog-nav-item>
  <arq-catalog-nav-item href="…">Embutir</arq-catalog-nav-item>
</arq-catalog-nav-group>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot `label` | — | Nombre de la macrofamilia (`role/label`) |
| Open | `open` | `open` | booleano. Figma lo trae en True; en código lo decide el HTML (el grupo de la categoría actual) o catalog-nav |
| Selected | `selected` | `selected` | booleano. El grupo guarda la categoría actual: catalog-nav lo usa para abrirlo y para el texto del encabezado Mobile. Si el HTML solo marca un `arq-catalog-nav-item` como `selected`, el grupo se marca solo; si se marca el grupo a mano, se respeta. Figma no dibuja diferencia entre Selected=False y True |
| — (ítems) | slot por defecto | — | `arq-catalog-nav-item`, cantidad libre |

- **Comportamiento** (`src/base/disclosure.js`): el encabezado es un `<button>` con `aria-expanded`; la lista (`role="list"`) queda en el HTML aunque esté cerrada. La acción del usuario emite `arq:toggle` con `{ open }`.
- **Ícono +/–:** medidas de icon-button Size=Default (24, ícono 16), parte del botón. Hover `color/surface/hover`.
- Siempre dentro de `arq-catalog-nav`.
- `TODO` (diseño) El set de Figma ya no coincide con este README: la etiqueta es `role/body-xl` (aquí `role/label`), la línea del grupo va abajo (aquí arriba), la lista lleva una guía lateral (`rail`, `border/default` en `color/border/subtle`) con los ítems en `role/body-compact` y 12 de sangría. No se tocó: solo se pidió mover Selected al grupo.

## Tokens

| Parte | Token |
| --- | --- |
| Línea superior | `border/default` en `color/border/subtle` |
| Padding vertical · gap encabezado–lista | `space/padding/md` · `space/gap/md` |
| Label | `role/label`; abierto `color/text/primary`, cerrado `color/text/secondary` |
| Gap entre ítems | `space/gap/sm-md` (el del set; la ficha dice `space/gap/sm`) |
| Abajo de la lista | `space/padding/md` + `space/padding/xs` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px |
