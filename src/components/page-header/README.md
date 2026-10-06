# page-header · `<arq-page-header>`

Encabezado de la página: breadcrumb, título (el único `<h1>`) y bajada. Type=List en Productos, Colecciones, Descargas y Contacto; Type=Detail en páginas que dependen de otra (Comparativa), con Volver y una acción. Va después del navbar y antes del contenido; uno solo por página.

- Figma: [1244-4016](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4016) · ficha `doc/page-header` (`1424:1703`)

```html
<!-- Type=List -->
<arq-page-header show-breadcrumb show-description>
  <arq-breadcrumb slot="breadcrumb">
    <arq-breadcrumb-item href="/arq" show-separator>Inicio</arq-breadcrumb-item>
    <arq-breadcrumb-item current>Productos</arq-breadcrumb-item>
  </arq-breadcrumb>
  <h1 slot="title">Productos</h1>
  <span slot="description">Luminarias para interior y exterior. Cada modelo cuenta con ficha técnica y archivos IES para especificar.</span>
</arq-page-header>

<!-- Type=Detail -->
<arq-page-header type="detail" show-back back-href="/arq/productos" show-description show-action>
  <span slot="back">Volver a productos</span>
  <h1 slot="title">Comparativa</h1>
  <span slot="description">…</span>
  <arq-button slot="action" data-arq-print>Imprimir comparación</arq-button>
</arq-page-header>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Title | slot `title` | — | un `<h1>` con el título |
| Description | slot `description` | — | bajada de 1 o 2 líneas |
| Type | `type` | `type` | `list` · `detail` (def. `list`) |
| Show breadcrumb | `show-breadcrumb` + slot `breadcrumb` | `showBreadcrumb` | booleano. Un `<arq-breadcrumb>` con los niveles que correspondan a la página |
| Show description | `show-description` | `showDescription` | booleano (Productos: sí · Colecciones: no) |
| Show back | `show-back` + `back-href` + slot `back` | `showBack` · `backHref` | booleano, solo Detail. Label del link en el slot (por ejemplo "Volver a productos") |
| Show action | `show-action` + slot `action` | `showAction` | booleano, solo Detail. Un `<arq-button>` (Filled, en Figma con `icon/download`) |
| Breakpoint | — | — | media query: hasta 767 px es Mobile |

- **Los Show… vienen en `true` en Figma; en código, sin el atributo la parte no se ve** (AGENTS.md). Una parte con su atributo pero sin contenido tampoco se ve.
- **El `<h1>` va en el HTML de la página** (`<h1 slot="title">`), no dentro del Shadow DOM (AGENTS.md: los encabezados van en el HTML). El componente le da `role/display` y el color con `::slotted()`, sin margen y por encima de los estilos de Webflow. Es el único `<h1>` de la página.
- **Volver** es `<arq-button type="underline" show-leading-icon>` con `chevron-left` y sin subrayado en reposo. Es un link real a `back-href` (no `history.back()`): funciona si se entra directo a la página.
- **Acción:** la página pasa su `<arq-button>`. En Mobile ocupa todo el ancho.
- Es un `<div>`, no un `<header>`: dentro del Shadow DOM podría tomarse como el banner de la página.
- **Aplica su propio `layout/gutter`** como padding lateral (como navbar y footer, DESIGN.md §5): la sección que lo contiene no le suma margen.

## Layout

| Type | Desktop | Mobile |
| --- | --- | --- |
| List | breadcrumb y título a la izquierda; bajada abajo a la derecha hasta `layout/measure` | todo apilado, ancho completo |
| Detail | Volver arriba; título y bajada en una columna de hasta `layout/measure-wide`; acción abajo a la derecha | Volver, título y bajada, y la acción a ancho completo |

Un título largo se parte en varias líneas.

## Tokens

| Parte | Token |
| --- | --- |
| Padding lateral | `layout/gutter` |
| Padding superior · inferior | List: `space/section/sm` · `space/section/xs`. Detail: `space/section/xs` · `space/section/sm` |
| Breadcrumb → título | `space/gap/lg` |
| Título → bajada (Detail) | `space/gap/md` |
| Volver → título → acción (Detail) | `space/gap/xl-2xl` |
| Título | `color/text/primary` · `role/display` |
| Bajada | `color/text/secondary` · `role/body-lg` · ancho máximo `layout/measure` (List) o `layout/measure-wide` (Detail), en Desktop |
