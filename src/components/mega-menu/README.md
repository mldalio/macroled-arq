# mega-menu · `<arq-mega-menu>`

Mega menú de Productos en Desktop. Lo abre el nav-link "Productos" del navbar y va debajo de la barra, a todo el ancho.

- Figma: [841-2282](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=841-2282) · frames [2295-23636](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2295-23636), [2295-23691](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2295-23691) y [2295-23730](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=2295-23730) (diseño final) · ficha `doc/mega-menu`

```html
<arq-mega-menu></arq-mega-menu>
```

```js
menu.navigation = await getNavigation(); // src/data/catalog.js
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Tab | `tab` | `tab` | `por-espacio` · `lamparas-y-artefactos` · `colecciones` (def. `por-espacio`) |
| — (datos) | — | `navigation` | Árbol de `getNavigation()`: secciones (Interior, Exterior, Lámparas, Artefactos) y colecciones, con la foto de cada link |
| — (foto inicial) | — | `images` | Opcional: `{ pestaña: url }` pisa la foto inicial del preview de esa pestaña |
| — | `label` | `label` | Nombre del tablist. Por defecto "Productos" |

- **Un solo componente:** pestañas, columnas, links y "Ver todo…" salen de los datos. Una pestaña sin datos no se muestra.
- **Por espacio:** columnas Interior y Exterior; **Lámparas y artefactos:** un link por producto. Cada columna con título `role/heading-1`, `arq-mega-link` y su "Ver todo…" (button Underline con ↗) al pie; los dos "Ver todo…" quedan alineados abajo. **Colecciones:** título, links con bajada en cuatro columnas y "Ver todas las colecciones".
- **Preview:** a la derecha, la foto del link con el mouse encima o con el foco, con eyebrow (`role/label`) y nombre (`role/heading-2`) en `color/text/inverse` sobre un degradado. Por espacio: "Interior · Colgante"; Colecciones: "Línea Interior". Al cambiar de pestaña muestra el primer link. Sin foto: `color/surface/subtle`, sin texto. Es decorativo (`aria-hidden`). En Tablet (768–1023 px) no se muestra: las columnas toman todo el ancho, con `layout/gutter` a los dos lados (`TODO` diseño: el set no tiene Tablet).
- **Pestañas:** `arq-tab` en un `role="tablist"` (SingleSelect): ← → cambian de pestaña, Inicio / Fin. Cada panel es `role="tabpanel"`.
- **No se abre solo:** lo muestra y lo oculta el navbar (`hidden`).

## Tokens

| Parte | Token |
| --- | --- |
| Fondo · línea inferior | `color/surface/default` · `border/default` en `color/border/subtle` |
| Pestañas | padding `space/gap/md` arriba y `layout/gutter` a los lados, gap `space/gap/xl`, línea `color/border/subtle` |
| Contenido | padding `space/padding/2xl` (a la izquierda `layout/gutter`); columnas a `space/gap/2xl`; título → links `space/gap/xl-2xl`; "Ver todo…" a `space/gap/xl` como mínimo |
| Colecciones | título → grilla, columnas y "Ver todas…" a `space/gap/xl` |
| Preview | `layout/mega-menu-image` de ancho, `ratio/portrait-soft` como mínimo (se estira con el contenido); padding `space/padding/xl-2xl`, gap `space/gap/sm`; fondo `color/surface/subtle` |

## Pendientes

- `TODO` (datos) Qué foto muestra el preview de una categoría (Embutir, Jardín…): por ahora, la del primer producto de la categoría con foto (contexto; si no, estudio). Colecciones y productos usan su propia foto de contexto.
- `TODO` (diseño) El degradado del preview (transparente 45 % → negro 70 %) es un relleno suelto del frame, no un estilo: se copia como excepción, igual que `hero/scrim`.
- `TODO` (Dark) El texto del preview usa `color/text/inverse` como el frame; con la página en Dark (Iluminar) ese token se oscurece sobre la foto.
- En el frame 2295:23730 la pestaña «Lámparas y artefactos» está oculta; en los otros dos frames está. Se mantiene: se oculta sola si no hay lámparas ni artefactos.
