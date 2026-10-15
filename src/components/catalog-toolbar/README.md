# catalog-toolbar · `<arq-catalog-toolbar>`

Barra sobre la grilla de Productos y Colecciones: cantidad de resultados, toggle Iluminar, divider vertical y botón Filtrar.

- Figma: [1244-4058](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1244-4058) · ficha `doc/catalog-toolbar` (`1427:2499`)

```html
<arq-catalog-toolbar count="11" unit="productos" for="filtros" show-iluminar></arq-catalog-toolbar>
<arq-filter-panel id="filtros">…</arq-filter-panel>
```

```js
panel.addEventListener('arq:apply', (e) => (toolbar.count = aplicar(e.detail.filters))); // la página
```

## Props

| Figma | Atributo | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Count | `count` | `count` | Número de resultados. Se muestra con su sustantivo: "1 producto", "11 productos" |
| — | `unit` | `unit` | `productos` · `colecciones`. Por defecto `productos` |
| State | `state` | `state` | `default` · `scroll`. Por defecto `default`. Lo pone el listado al desplazarse |
| — | `name` | `name` | Nombre de la página («Interior»). Solo se ve con `state="scroll"` |
| Show iluminar | `show-iluminar` | `showIluminar` | booleano. En Figma viene en `true`; en código hay que escribirlo |
| — | `for` | `for` | `id` del `arq-filter-panel` que abre Filtrar |
| button · Show count | `filter-count` | `filterCount` | Filtros aplicados. Con `for` se actualiza solo al aplicar |
| Breakpoint | — | — | Media query: hasta 767 px es Mobile |

- **Count** va en un `aria-live="polite"`: se anuncia cuando la página lo cambia al filtrar.
- **Filtrar:** button Outline con `icon/filter`. Con filtros aplicados muestra la cantidad (Show count) y pasa a `icon/filter-off`; para lectores de pantalla dice "Filtrar, 3 filtros activos" y que abre un diálogo (`aria-haspopup="dialog"`, `aria-controls` al panel). Con `for` abre el panel y el foco vuelve al botón al cerrarlo. Sin `for`, emite `arq:filter-open`.
- **Iluminar** (decisión 2026-10-02 · catalog-toolbar): pone `data-arq-theme="dark"` en `<html>` (toda la página pasa a Dark y las product-card a sus imágenes encendidas) y no se recuerda: al recargar o volver a la página arranca apagado. Si se entra a un producto con Iluminar encendido, la ficha llega iluminada (`handOffTheme` de `src/base/theme.js`, en `sessionStorage` por 10 s). El toggle sigue a `<html>` si otro lo cambia. La ficha tiene su propio Iluminar (navbar, hero y foto) y no usa esta preferencia.
- **State=Scroll:** la barra queda fija al desplazarse el listado. Pasa a padding vertical `space/padding/sm` y suma a la izquierda el nombre de la página (`name`, role/body-lg en `color/text/primary`) y un divider vertical antes de la cantidad, a `space/gap/lg`. El nombre repite el `<h1>` del page-header (que sigue siendo el título indexable); `arq-catalog-listing` lo copia de ahí. Si no entra, se corta con «…». Sin `name`, Scroll no suma nada.
- **TODO (Figma):** el set no tiene State=Scroll en Mobile y el nombre no entra junto a las acciones en 350: hasta 767 px no se muestra.
- El divider va en la misma fila que el toggle: mide 20 (el alto del toggle), como el set.

## Tokens

| Parte | Token |
| --- | --- |
| Líneas | `border/default` en `color/border/subtle` arriba y abajo (el set; la ficha dice solo abajo) |
| Padding vertical | `space/padding/md` (alto 70 con el botón) |
| Count | `role/body` en `color/text/secondary`, en una línea |
| Nombre (Scroll) | `role/body-lg` en `color/text/primary` · divider Vertical Subtle · gap `space/gap/lg` |
| Padding vertical en Scroll | `space/padding/sm` |
| Gap entre acciones | `space/gap/xl` en Desktop, `space/gap/lg` en Mobile (el set; la ficha dice `lg` en los dos) |
| Toggle · divider · Filtrar | toggle (Show label) · divider Vertical Subtle · button Outline |
