# download-card · `<arq-download-card>`

Tarjeta de descarga de un archivo general. En Descargas: «Catálogo Macroled ARQ 2026». Toda la tarjeta es un link que descarga el archivo. No confundir con download-item (fila del modal de descargas) ni con family-card (link a otra ficha).

- Figma: [2496-8095](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2496-8095) (Componentes › 7 · Cards y bloques)

```html
<arq-download-card href="/archivos/catalogo-2026.pdf" show-description>
  <img slot="image" src="/img/catalogo-portada.jpg" alt="" loading="lazy">
  <span slot="title">Catálogo Macroled ARQ 2026</span>
  <span slot="description">Un catálogo por familia de producto</span>
</arq-download-card>
```

## Props

| Figma | Atributo | Prop JS | Valores |
| --- | --- | --- | --- |
| Title | slot `title` | — | Texto del título (es el texto del link) |
| Description | slot `description` | — | Bajada |
| Show description | `show-description` | `showDescription` | booleano. En Figma viene activada; en código va desactivada por defecto (atributo de presencia) |
| — (imagen) | slot `image` | — | `<img>` de la portada, `alt=""` (el título da el nombre del link). Sin imagen, fondo `color/surface/subtle` |
| — | `href` | `href` | Archivo. Del mismo sitio lleva `download`; de otro dominio se abre en otra pestaña |

- **No son props:** State=Hover y State=Focus (CSS, `src/base/card-link.css`).
- Link estirado: el `<a>` envuelve solo el título y su `::after` cubre la tarjeta.

## Tokens

| Parte | Token |
| --- | --- |
| Imagen | ratio/landscape (5:4), fondo `color/surface/subtle`, la portada contenida |
| Título | `role/heading-3` en `color/text/primary` + `icon/download` de `icon/lg` en `color/icon/primary`, gap `space/gap/sm-md` |
| Bajada | `role/body` en `color/text/secondary`, a `space/gap/xs` del título |
| Imagen → textos | `space/gap/md` |
| Hover | `border/default` en `color/border/hover` sobre la imagen |
| Foco | anillo `border/strong` en `color/border/focus`, separado 2 px |
| Ancho | el de su columna (en Descargas, `layout/measure-wide`) |
