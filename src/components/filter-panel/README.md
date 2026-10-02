# filter-panel · `<arq-filter-panel>`

Panel de filtros técnicos de Productos y Colecciones. Se abre desde el botón Filtrar de catalog-toolbar. Desktop: panel lateral derecho de `layout/filter-panel` sobre el scrim. Mobile: pantalla completa, sin scrim.

- Figma: [1225-13576](https://www.figma.com/design/djAb2r3otXYOjEJjHiuKnF/Macroled-ARQ?node-id=1225-13576) · ficha `doc/filter-panel` (`1433:2483`)

```html
<arq-filter-panel unit="productos">
  <h2 slot="title">Filtrar</h2>
  <arq-filter-row open>
    <span slot="label">Potencia</span>
    <arq-checkbox size="large" show-label name="potencia" value="8">8 W</arq-checkbox>
  </arq-filter-row>
  …
</arq-filter-panel>
```

```js
filtrar.addEventListener('click', () => panel.show(filtrar));
panel.addEventListener('arq:filters', (e) => (panel.count = contar(e.detail.filters))); // src/data/
panel.addEventListener('arq:apply', (e) => aplicar(e.detail.filters));
```

## Props

| Figma | Atributo / slot | Prop JS | Valores · por defecto |
| --- | --- | --- | --- |
| Title | slot `title` | — | `<h2>` con "Filtrar" (encabezado en el HTML de la página). También es el nombre del diálogo |
| Summary · Show summary | — | — | Se arma solo: "3 filtros activos". Sin filtros no se muestra |
| Show applied | — | — | Los filter-chip salen de los checkbox marcados. Sin filtros no se muestran |
| — | `open` | `open` | booleano. Mejor `show()` y `close()` |
| — (resultado) | `count` | `count` | Lo calcula la página: "Ver 4 productos". Sin valor: "Ver productos" |
| — | `unit` | `unit` | `productos` · `colecciones` ("Ver 1 colección"). Por defecto `productos` |
| — (filas) | slot por defecto | — | `arq-filter-row` |
| Breakpoint | — | — | Media query: hasta 767 px es Mobile |

- **Métodos:** `show(opener)` abre (el foco vuelve a `opener` al cerrar), `close()` cierra descartando, `apply()` aplica y cierra, `clear()` es "Borrar todo". `filters` devuelve lo marcado: `{ name: [values] }`.
- **Eventos:** `arq:filters { filters }` en cada cambio (para recalcular `count`, también al descartar); `arq:apply { filters }` al tocar "Ver N".
- **Cuándo se aplica** (decisión 2026-10-02 · filter-panel): con el panel abierto el listado no cambia, solo el número del botón. "Ver N productos" aplica y cierra. La X, el scrim o Esc descartan los cambios y vuelven a lo marcado al abrir.
- **Diálogo modal nativo** (`<dialog>` + `showModal()`): el foco queda adentro (arranca en cerrar), Esc y el scrim cierran, y el foco vuelve al botón que lo abrió.
- **Chips:** tocar uno desmarca su opción y el foco pasa al chip siguiente, al anterior o a cerrar. "Borrar todo" desmarca todo sin cerrar.
- El cuerpo (las filas) tiene scroll propio; encabezado, chips y footer quedan fijos.

## Tokens

| Parte | Token |
| --- | --- |
| Ancho (Desktop) | `layout/filter-panel` (560); Mobile ocupa toda la pantalla |
| Fondo · borde (Desktop) | `color/surface/default` · `border/default` en `color/border/default` |
| Scrim (Desktop) | `color/overlay/scrim`; en Mobile no hay |
| Padding · gap entre bloques | Desktop `space/padding/xl-2xl` · `space/gap/lg`; Mobile `space/padding/lg` arriba y abajo, `layout/gutter` a los lados · `space/gap/xl` |
| Título · Summary | `role/heading-1` en `color/text/primary` · `role/body` en `color/text/secondary`, gap `space/gap/xs` |
| Chips | filter-chip con wrap, gap `space/gap/sm` |
| Footer | button Underline "Borrar todo" + button Filled "Ver N"; en Mobile el Filled ocupa el resto, gap `space/gap/lg` |
| Cerrar | icon-button Size=Large con `icon/close` |

## Pendientes

- `TODO` (datos) Qué atributos y valores muestra cada listado: los facets de Typesense (`docs/typesense-schema.md`, columnas técnicas pendientes) y el archivo de etiquetas de `src/data/`.
- `TODO` (catalog-toolbar) El botón Filtrar con la cantidad de filtros aplicados (Show count) se arma con catalog-toolbar.
- La página de atrás puede seguir con scroll mientras el panel está abierto: el componente no toca `body` (AGENTS.md).
