# announcement-bar · `<arq-announcement-bar>`

Línea fina arriba del navbar, en todas las páginas, con un aviso y su link («Suscribite al newsletter»).

- Figma: [2780-8595](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2780-8595) · ficha `doc/announcement-bar` (`2781:13825`)
- Link: a la sección Newsletter de la Home (`/arq#newsletter`; el cta-block lleva `id="newsletter"`).

```html
<arq-announcement-bar>
  <arq-button type="underline" compact show-icon icon="arrow-up-right" href="/arq#newsletter">Suscribite al newsletter</arq-button>
</arq-announcement-bar>
<arq-navbar>…</arq-navbar>
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Breakpoint | — | — | No es prop: media query (Desktop · Mobile) |
| — | `label` | `label` | Texto · nombre accesible de la región (opcional) |

## Comportamiento

- **Contenido por slot:** el link es un `<arq-button type="underline">` sin `show-underline` (texto simple; el subrayado aparece en hover) y con el ícono de link externo (`arrow-up-right`). El texto queda en el HTML de la página (indexable).
- **Siempre oscura:** Dark local en el `<aside>` interno (DESIGN.md §2), como compare-bar. No cambia con Iluminar ni con el Theme del navbar. El button del slot hereda el modo Dark.
- **Al hacer scroll se oculta:** va en el flujo de la página, inmediatamente antes de `<arq-navbar>`, y se va con el contenido. El navbar es sticky (también en Transparent, encima del hero) y queda pegado arriba. No escucha el scroll.
- **Mobile:** igual que Desktop; si el texto no entra, baja de línea.
- **Hero de la Home:** el hero `full-height` descuenta el alto de la barra, así barra + hero ocupan el 100 % del alto de la pantalla.
- **Impresión:** no aparece.
- **Accesibilidad:** `<aside>` (región complementaria) con `aria-label` si se pasa `label`. El foco es el del button.

## Tokens

| Parte | Token |
| --- | --- |
| Fondo | `color/surface/default` en Dark |
| Padding | `space/padding/xs` × `layout/gutter` (`--page-gutter`); alto 40 con el button |
| Link | button Underline `compact`: `role/body-compact-regular` (14/24), `color/action/primary` en Dark; subrayado `border/default` (1 px) solo en hover y pressed, más fino y más pegado al texto que en el resto de los button (arranca `space/padding/2xs` antes del borde inferior de la línea de 24) |

## Pendientes

- En Figma el texto de 14 es un override del estilo del label en la instancia de button (el set de button no tiene `compact`).
- Falta sumar la barra a las pantallas de Final.
