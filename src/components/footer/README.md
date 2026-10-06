# footer · `<arq-footer>`

Footer de Macroled Arq, último elemento de todas las páginas, full width. Marca (logo, bajada y legal) y tres columnas de links: Productos, Información y Redes.

- Figma: [788-3104](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=788-3104) · ficha `doc/footer` (`1442:4213`)

```html
<arq-footer>
  <span slot="tagline">Diseño lumínico para la arquitectura contemporánea.</span>

  <h2 slot="productos-title">Productos</h2>
  <arq-footer-link slot="productos" href="/arq/productos/interior">Interior</arq-footer-link>
  <arq-footer-link slot="productos" href="/arq/productos/exterior">Exterior</arq-footer-link>
  <arq-footer-link slot="productos" href="/arq/productos/lamparas-y-artefactos">Lámparas y Artefactos</arq-footer-link>
  <arq-footer-link slot="productos" href="/arq/productos?view=colecciones">Colecciones</arq-footer-link>

  <h2 slot="informacion-title">Información</h2>
  <arq-footer-link slot="informacion" href="/arq/contacto">Contacto</arq-footer-link>
  <arq-footer-link slot="informacion" href="/arq/descargas">Descargas</arq-footer-link>

  <h2 slot="redes-title">Redes</h2>
  <arq-footer-link slot="redes" href="https://www.instagram.com/…" target="_blank"
    show-icon icon="instagram" label="Macroled Arq en Instagram">Instagram</arq-footer-link>
  <arq-footer-link slot="redes" href="https://www.youtube.com/…" target="_blank"
    show-icon icon="youtube" label="Macroled Arq en YouTube">YouTube</arq-footer-link>
</arq-footer>
```

Las rutas son de ejemplo: las definitivas van en `docs/urls.md`.

## Props y slots

| Figma | Slot | Contenido |
| --- | --- | --- |
| (bajada de la marca) | `tagline` | texto. Sin texto, no se muestra |
| (títulos de columna) | `productos-title` · `informacion-title` · `redes-title` | un `<h2>` por columna |
| Productos | `productos` | `<arq-footer-link>`, en orden |
| Información | `informacion` | `<arq-footer-link>`, en orden |
| Redes | `redes` | `<arq-footer-link show-icon icon="…" target="_blank" label="…">` |
| Breakpoint | — | media query: hasta 767 px es Mobile |

- **Títulos de columna:** un `<h2>` por columna en el HTML de la página (AGENTS.md: los encabezados van en el HTML). El componente les da `role/body-strong` con `::slotted()` y nombra cada `<nav>` con su texto.
- **En el componente:** el logo (`<arq-logo size="compact">`, link a `/arq`) y el legal "© <año> Macroled Arq." (en mayúsculas por estilo). El año sale de `new Date().getFullYear()`.
- **Cantidad de links libre** en cada columna. Si se suma una sección, va una columna nueva en el componente, no más links en otra.
- **Redes:** `target="_blank"` (footer-link suma `rel="noopener"`) y `label` con el nombre completo ("Macroled Arq en Instagram").
- **Accesibilidad:** `<footer>` con cada columna como `<nav>` nombrada con el texto de su `<h2>` (`aria-label`: un `aria-labelledby` no cruza del Shadow DOM al DOM de la página) y una lista (`role="list"`); cada footer-link es un `listitem`.
- Aplica su propio `layout/gutter` (componente de borde a borde): la página no le suma margen lateral.

## Layout

| | Desktop | Mobile |
| --- | --- | --- |
| Armado | marca a la izquierda (logo, bajada, legal) y columnas a la derecha | marca, columnas y legal apilados, a `space/gap/xl` |
| Columnas | ancho de su contenido, separadas `space/gap/xl` | tres de igual ancho; un link largo se parte en líneas |
| Padding | `space/section/sm` arriba y abajo, `layout/gutter` a los lados | ídem (valores Mobile) |

## Tokens

| Parte | Token |
| --- | --- |
| Fondo | `color/surface/default` |
| Borde superior | `border/default` en `color/border/subtle` |
| Bajada | `color/text/secondary` · `role/body` |
| Legal | `color/text/tertiary` · `role/body-sm` |
| Títulos de columna | `color/text/primary` · `role/body-strong`, con `space/gap/sm` abajo |
| Gap marca | `space/gap/md` |
| Gap entre links | `space/gap/sm` |
| Gap entre columnas | `space/gap/xl` |

## Pendientes

- `TODO` (diseño): en el set cada columna mide 200 fijos y la bajada 240 fijos, sin token. En código toman el ancho de su contenido. En Mobile la bajada queda en una línea (en Figma, dos) y el footer mide 20 menos.
- Información: Contacto y Descargas (la página Glosario pasó a llamarse Descargas, decisiones.md 2026-10-06 · Descargas). `TODO` (Figma): el set todavía muestra Glosario (Desktop: Contacto y Glosario; Mobile: Contacto, Descargas y Glosario).
