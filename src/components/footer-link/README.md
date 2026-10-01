# footer-link · `<arq-footer-link>`

Link del footer. Show icon agrega un ícono a la izquierda, solo en la columna Redes (Instagram, YouTube).

- Figma: [788-2930](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-2930) · ficha `doc/footer-link` (`1442:4534`)

```html
<arq-footer-link href="/arq/productos">Productos</arq-footer-link>
<arq-footer-link href="https://www.instagram.com/…" target="_blank" show-icon icon="instagram">Instagram</arq-footer-link>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Label | slot por defecto | — | texto corto, igual al nombre de la página de destino |
| Show icon | `show-icon` | `showIcon` | booleano · ícono a la izquierda (def. apagado, como en Figma) |
| Icon | `icon` | `icon` | nombre de `src/base/icons.js` (def. `instagram`; en Redes: `instagram`, `youtube`) |
| — | `href` | `href` | destino del link |
| — | `target` | `target` | con `_blank` suma `rel="noopener"` |

- Solo dentro de footer. El footer lo pone en un `<li>` de la lista de cada columna.
- Hover, Pressed y Focus no son props: `:hover`, `:active`, `:focus-visible`.
- El ícono usa el color del texto (`currentColor`) en todos los estados.

## Tokens

| Parte | Token |
| --- | --- |
| Texto Default · Hover · Pressed | `color/text/secondary` · `color/text/primary` · `color/text/tertiary` |
| Subrayado Hover | `border/default` en `color/border/strong`, debajo del ícono y del label |
| Gap | `space/gap/sm` |
| Ícono | `icon/md` |
| Texto | `role/body` |
| Foco | `border/strong` en `color/border/focus`, separado 2 px (DESIGN.md §7) |

## Pendientes

- Sin transición en hover ("transición corta" en la ficha): no hay tokens de movimiento.
- En Figma el ícono queda en `color/icon/primary` aunque el texto cambie; en código sigue al texto (`currentColor`, DESIGN.md §8).
