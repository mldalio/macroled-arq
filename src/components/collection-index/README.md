# collection-index · `<arq-collection-index>`

Lista de colecciones del Home, debajo de «Diseño que inspira». El nombre activo lleva líneas arriba y abajo; su foto está a la derecha. No está en Figma: adapta una referencia de lista + foto a los tokens de Arq, sin trama de fondo.

```html
<arq-collection-index></arq-collection-index>
```

Los nombres salen de la columna `familia` de las luminarias publicadas (`getFamilies` en `src/data/catalog.js`), en orden alfabético. La foto es el ambiente 1 del primer grupo de esa familia; si no hay, la de estudio. Cada nombre abre `/arq/productos?family=`.

Pasar el mouse o enfocar un nombre cambia la foto. El primero arranca visible. En táctil, el primer toque muestra la foto y el segundo abre el listado. Con `prefers-reduced-motion` el cambio es instantáneo.

## Props y slots

| Atributo / slot | Contenido |
| --- | --- |
| slot por defecto | lo arma el componente: un `<a href>` por familia, con un `<img>` y el nombre |
| slot `action` | botón opcional debajo de la lista |

## Tokens

| Parte | Token |
| --- | --- |
| Nombres | `role/display-sm`. Activo: `color/text/primary` y líneas `border/strong` en `color/border/strong`. Resto: `color/text/tertiary` |
| Foto | `ratio/landscape` (5:4), `object-fit: cover`, fondo `color/surface/subtle` |
| Cambio de foto | `motion/duration/slow` |
| Columnas | `space/gap/4xl`. En Mobile la foto queda arriba |

`TODO` (diseño): no hay set en Figma ni token propio del bloque.
