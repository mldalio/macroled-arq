# compare-slot · `<arq-compare-slot>`

Lugar de producto en compare-bar. compare-header Compact usa `compare-product` Size=Compact, no compare-slot.

- Figma: [1233-3656](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1233-3656) · ficha `doc/compare-slot`

```html
<arq-compare-slot sku="KANU-J-500-12W-N-WW" image="…/kanu.jpg">
  <span slot="name">Kanu Jardín</span>
  <span slot="meta">Exterior · Jardín</span>
</arq-compare-slot>
<arq-compare-slot></arq-compare-slot>                     <!-- Empty -->
<arq-compare-slot size="compact" image="…">…</arq-compare-slot>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Name | slot `name` | — | Nombre del producto (`role/label`) |
| Meta | slot `meta` | — | Tipo o aplicación (`role/body-sm`) |
| Size | `size` | `size` | `default` · `compact`. Por defecto `default` |
| State | `filled` | `filled` | Lo pone el componente: Filled si tiene nombre, Empty si no |
| — (foto) | `image` | `image` | URL de la imagen del producto |
| — | `sku` | `sku` | Identifica el producto en `arq:remove` |
| — | `empty-label` | `emptyLabel` | Texto de Empty. Por defecto "Agregar producto" |

- **Quitar** (icon-button con `icon/close`, "Quitar Kanu Jardín") emite `arq:remove { sku }`. En Compact no hay quitar: se quita desde "Borrar todo".
- **Compact:** solo la miniatura; el nombre queda para lectores de pantalla.
- Toma el ancho de su columna, hasta `layout/compare-slot`.

## Tokens

| Parte | Token |
| --- | --- |
| Foto Default | `layout/compare-thumb` (48 × 48, token nuevo), fondo `color/surface/subtle`; Empty con `icon/plus` |
| Miniatura Compact | `layout/compare-thumb-sm` (28, token nuevo) de ancho, `ratio/portrait` |
| Ancho máximo | `layout/compare-slot` (400, token nuevo) |
| Gap | `space/gap/sm-md`; nombre–meta `space/gap/xs` |
| Textos | nombre `role/label` en `color/text/primary`; meta y "Agregar producto" `role/body-sm` en `color/text/secondary` |
