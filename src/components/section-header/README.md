# section-header · `<arq-section-header>`

Encabezado de un bloque dentro de una página (categorías, productos destacados, proyectos, FAQ del Home). No es el encabezado de la página: para eso está page-header. Un `<h2>` por bloque.

- Figma: [1036-2448](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1036-2448) · ficha `doc/section-header` (`1452:5492`)

```html
<arq-section-header type="link" href="/arq/productos">
  Productos destacados
  <span slot="link">Ver todos los productos</span>
</arq-section-header>

<arq-section-header type="description">
  Diseño que inspira
  <span slot="description">Proyectos donde la luminaria forma parte de la arquitectura, no un agregado.</span>
</arq-section-header>

<arq-section-header type="stacked" href="/arq/contacto">
  Preguntas frecuentes
  <span slot="description">¿No encontrás lo que buscás? Nuestro equipo técnico te acompaña en cada etapa del proyecto.</span>
  <span slot="link">Escribinos</span>
</arq-section-header>
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Title | slot por defecto | — | texto del título; el componente lo pone en su `<h2>` |
| Description | slot `description` | — | bajada (Type=Description y Stacked). Sin texto, no se muestra |
| Type | `type` | `type` | `link` · `description` · `title` · `stacked` (def. `link`) |
| — (link del button) | `href` | `href` | destino del link. Sin `href` no hay link |
| — (Label del button) | slot `link` | — | def. "Ver todo". Mejor un texto con contexto: "Ver todos los productos" |
| Breakpoint | — | — | media query: hasta 767 px es Mobile |

- **El título y la bajada van como texto**, sin `<h2>` ni `<p>` propios: el componente los envuelve en su `<h2>` y su `<p>` dentro del Shadow DOM, así no toman los estilos de Webflow. El texto queda en el HTML (indexable).
- **Link:** `<arq-button type="underline" show-underline show-icon icon="arrow-right">` con el `href`. Aparece en Type=Link y Stacked cuando hay `href`.
- Es un `<div>`, no un `<header>`: dentro del Shadow DOM un `<header>` podría anunciarse como el encabezado de toda la página.
- No se usa dos veces seguidas ni para el título de la página.

## Regla para armar páginas: el link en Mobile

En Mobile (hasta 767 px), **Type=Link no muestra su link** (`display: none`): el encabezado queda solo con el título, como Type=Title. La página tiene que poner un `<arq-button>` al final del bloque, después del contenido (carrusel, grilla), con el mismo destino y el mismo texto. Así está en el Home de Figma:

```html
<section>
  <arq-section-header type="link" href="/arq/productos">
    Productos destacados
    <span slot="link">Ver todos los productos</span>
  </arq-section-header>
  … grilla …
  <!-- solo Mobile: lo oculta el CSS de la página desde 768 px -->
  <arq-button type="outline" href="/arq/productos">Ver todos los productos</arq-button>
</section>
```

El tipo y la visibilidad de ese button los define la página según su pantalla en Figma (Final). Type=Stacked sí muestra su link en Mobile.

## Layout

| Type | Desktop | Mobile |
| --- | --- | --- |
| Link | fila: título a la izquierda, link abajo a la derecha | solo título |
| Description | fila: título a la izquierda, bajada abajo a la derecha hasta `layout/measure` | título y bajada apilados, ancho completo |
| Title | solo título | solo título |
| Stacked | título, bajada y link apilados | igual |

Un título largo se parte en varias líneas; el link no se achica.

## Tokens

| Parte | Token |
| --- | --- |
| Título | `color/text/primary` · `role/heading-2` |
| Bajada | `color/text/secondary` · `role/body-lg` · ancho máximo `layout/measure` (Desktop, Type=Description) |
| Gap título–bajada | `space/gap/sm-md` |
| Gap textos–link (y entre columnas en Desktop) | `space/gap/lg` |
| Link | button Underline (`color/action/primary`, `role/body-regular`) con `icon/arrow-right` |
