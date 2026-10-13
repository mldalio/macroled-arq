# mega-menu · `<arq-mega-menu>`

Mega menú de Productos en Desktop. Lo abre el nav-link "Productos" del navbar y va debajo de la barra, a todo el ancho.

- Figma: [841-2282](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=841-2282) · ficha `doc/mega-menu`

```html
<arq-mega-menu></arq-mega-menu>
```

```js
menu.navigation = await getNavigation(); // src/data/catalog.js
menu.images = { 'por-espacio': '…', lamparas: '…', colecciones: '…' };
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Tab | `tab` | `tab` | `por-espacio` · `lamparas` · `colecciones` (def. `por-espacio`) |
| — (datos) | — | `navigation` | Árbol de `getNavigation()`: secciones (Exterior, Interior, Lámparas, Artefactos) y colecciones |
| — (imagen) | — | `images` | Una URL por pestaña. Sin imagen queda `color/surface/subtle` |
| — | `label` | `label` | Nombre del tablist. Por defecto "Productos" |

- **Un solo componente:** pestañas, columnas, links y "Ver todo…" salen de los datos (descripción del set). Una pestaña sin datos no se muestra.
- **Por espacio:** columnas Exterior e Interior; **Lámparas y artefactos:** un link por producto; cada columna con título `role/heading-3` y `arq-mega-link` Size=Large (la pestaña Colecciones usa Size=Default; el set solo tiene esos dos tamaños) y su "Ver todo…" (button Underline) al pie. **Colecciones:** título, links con bajada (aplicaciones) en tres columnas y "Ver todas las colecciones".
- **Pestañas:** `arq-tab` en un `role="tablist"` (SingleSelect): ← → cambian de pestaña, Inicio / Fin. Cada panel es `role="tabpanel"`.
- **No se abre solo:** lo muestra y lo oculta el navbar (`hidden`).

## Tokens

| Parte | Token |
| --- | --- |
| Fondo · línea inferior | `color/surface/default` · `border/default` en `color/border/subtle` |
| Pestañas | padding `space/gap/md` arriba y `layout/gutter` a los lados, gap `space/gap/xl`, línea `color/border/subtle` |
| Contenido | padding `space/gap/xl` × `layout/gutter`, gap `space/gap/md`; columnas con gap `space/gap/xl` |
| Imagen | `layout/mega-menu-image` (token nuevo, 438) de ancho, `ratio/portrait-soft`; fondo `color/surface/subtle` |

## Pendientes

- `TODO` (datos) De dónde salen las imágenes de cada pestaña.
- `TODO` (diseño) El set de Figma ya cambió más que el nombre de la pestaña: títulos de columna en `role/heading-1` (el código usa `role/heading-3`), Colecciones en 4 columnas (el código reparte en 3) y un panel «imagen · preview hover» que muestra el nombre del link señalado. Sin implementar: se pidió solo el nombre de la pestaña y los tamaños del mega-link.
- La imagen mide `layout/mega-menu-image` = 420 en Figma (antes 438): el código lo toma del token, ya sincronizado.
