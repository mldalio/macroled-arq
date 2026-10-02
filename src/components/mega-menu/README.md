# mega-menu · `<arq-mega-menu>`

Mega menú de Productos en Desktop. Lo abre el nav-link "Productos" del navbar y va debajo de la barra, a todo el ancho.

- Figma: [841-2282](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=841-2282) · ficha `doc/mega-menu`

```html
<arq-mega-menu></arq-mega-menu>
```

```js
menu.navigation = await getNavigation(); // src/data/catalog.js
menu.images = { aplicacion: '…', lamparas: '…', colecciones: '…' };
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Tab | `tab` | `tab` | `aplicacion` · `lamparas` · `colecciones` (def. `aplicacion`) |
| — (datos) | — | `navigation` | Árbol de `getNavigation()`: secciones (Exterior, Interior, Lámparas, Artefactos) y colecciones |
| — (imagen) | — | `images` | Una URL por pestaña. Sin imagen queda `color/surface/subtle` |
| — | `label` | `label` | Nombre del tablist. Por defecto "Productos" |

- **Un solo componente:** pestañas, columnas, links y "Ver todo…" salen de los datos (descripción del set). Una pestaña sin datos no se muestra.
- **Aplicación:** columnas Exterior e Interior; **Lámparas y artefactos:** un link por producto; cada columna con título `role/heading-3`, `arq-mega-link` y su "Ver todo…" (button Underline) al pie. **Colecciones:** título, links con bajada (aplicaciones) en tres columnas y "Ver todas las colecciones".
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
- El contenido de la pestaña Aplicación tiene en Figma un alto fijo de 548: en código el alto sale de la imagen (438 × 4:5 = 548), así que coincide.
