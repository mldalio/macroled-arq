# download-modal · `<arq-download-modal>`

Modal de descargas de la ficha: la ficha técnica (download-item Featured) y los archivos del SKU elegido. Lo abren los botones de Descargas de la ficha y el ícono de descarga de cada fila del glosario.

- Figma: [1375-4948](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1375-4948) · ficha `doc/download-modal`

```html
<arq-download-modal id="descargas">
  <h2 slot="title">Descargas</h2>
  <arq-download-item emphasis="featured">Ficha técnica</arq-download-item>
  <arq-download-item href="https://…/kanu.ies">IES</arq-download-item>
</arq-download-modal>
```

```js
boton.addEventListener('click', () => modal.show(boton));
modal.addEventListener('arq:download', () => generarFichaTecnica(sku)); // la ficha técnica
```

## Props

| Figma | Atributo / slot | Prop JS | Valores |
| --- | --- | --- | --- |
| Title | slot `title` | — | `<h2>` con "Descargas" (también es el nombre del diálogo) |
| — (opciones) | slot por defecto | — | `arq-download-item`. El Featured va arriba solo; los Default, en una lista |
| — | `open` | `open` | booleano. Mejor `show(opener)` y `close()` |
| Breakpoint | — | — | Media query: hasta 767 px es Mobile |

- **Diálogo modal nativo** (`<dialog>` + `showModal()`): el foco queda adentro (arranca en cerrar), Esc, el scrim o la X lo cierran y el foco vuelve al botón que lo abrió.
- **Posición** (decisión 2026-10-02 · download-modal): Desktop en la esquina inferior derecha, a `layout/gutter` de los bordes y de ancho `layout/filter-panel`. Mobile abajo, a `layout/gutter` de los bordes y ocupando el ancho; el alto es el de su contenido.
- Siempre con scrim (`color/overlay/scrim`).

## Tokens

| Parte | Token |
| --- | --- |
| Ancho (Desktop) | `layout/filter-panel` (560, el mismo que filter-panel) |
| Separación de los bordes | `layout/gutter` |
| Fondo · borde | `color/surface/default` · `border/default` en `color/border/default` |
| Padding · gap encabezado–opciones | `space/padding/xl-2xl` · `space/gap/2xl` |
| Título | `role/heading-1` en `color/text/primary` |
| Featured–lista | `space/gap/md` |
| Cerrar | icon-button Size=Large con `icon/close` |
| Scrim | `color/overlay/scrim` |
