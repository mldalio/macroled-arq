# download-file-row · `<arq-download-file-row>`

Fila de archivo del modal de descargas de la página Descargas: nombre, formato (y peso) e `icon/download`. Cada fila descarga su archivo.

- Figma: [2554-20047](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2554-20047) (en «Descargas · propuesta final», 2575:22875). Descripción: «Fila de archivo del modal de descargas: nombre, formato y peso. "Unavailable" cuando la variante no tiene ese archivo (por ejemplo, sin IES).»

```html
<arq-download-modal show-product sku="…">
  <h2 slot="title">Descargas</h2>
  <arq-download-file-row>Ficha técnica<span slot="meta">PDF</span></arq-download-file-row>
  <arq-download-file-row href="…/kanu.ies">IES<span slot="meta">IES</span></arq-download-file-row>
</arq-download-modal>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Label | slot por defecto | — | Nombre del archivo («Ficha técnica», «IES») |
| Meta | slot `meta` | — | Formato y peso («PDF, 1,2 MB»). Hoy solo el formato |
| — | `href` | `href` | URL del archivo. Sin `href` es un botón que emite `arq:download` (la ficha técnica se genera al hacer clic) |
| Availability | — | — | Solo Available: si la variante no tiene el archivo, la página no pone la fila |

- Lleva `role="listitem"` (va en la lista del modal).
- **No son props:** Hover (subraya el nombre, como download-item) y Focus (anillo de DESIGN.md §7).

## Tokens

| Parte | Token |
| --- | --- |
| Nombre · formato | `role/body-xl` en `color/text/primary` · `role/body-compact-regular` en `color/text/tertiary`, a `space/gap/xs` |
| Fila | gap `space/gap/md`, padding vertical `space/padding/md`, línea inferior `border/default` en `color/border/subtle` |
| Ícono | `icon/download` en `icon/md`, `color/icon/primary` |

## Pendientes

- `TODO` (datos): el peso del archivo no está en la base.
- `TODO` (diseño): si se quiere mostrar un archivo que falta (Availability=Unavailable), falta su dibujo en el set.
