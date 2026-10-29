# collection-index · `<arq-collection-index>`

Lista de colecciones del Home, debajo de «Diseño que inspira». El nombre activo lleva líneas arriba y abajo; su foto está a la derecha. No está en Figma: adapta una referencia de lista + foto a los tokens de Arq, sin trama de fondo.

```html
<arq-collection-index>
  <arq-button slot="action" type="outline" href="/arq/productos" data-arq-menu="colecciones">Ver todas las colecciones</arq-button>
</arq-collection-index>
```

En la Home, «Ver todas las colecciones» abre el menú de Productos en la pestaña Colecciones (en Mobile, el submenú). No hay página de todas las colecciones.

Los nombres son las familias destacadas de la Home: Yoru, Afo, Sento, Höshi, Kanu y Köen, en ese orden (`getFamilies` en `src/data/catalog.js`). Höshi y Köen se escriben así en la tira; el link sigue con el nombre de la base. Salen de la columna `familia`; si una no está en la base, no se muestra. La foto es el ambiente 1 del primer grupo de esa familia; si no hay, la de estudio. Yoru, Afo, Sento, Hoshi, Kanu y Koen usan una foto elegida. Hoshi se encuadra desde arriba, para que se vea el cielorraso. Afo se encuadra desde abajo, para que se vea la base. Cada nombre abre `/arq/productos?family=`. El menú sigue mostrando todas las familias, en orden alfabético.

Pasar el mouse o enfocar un nombre cambia la foto. El primero arranca visible. En táctil, el primer toque muestra la foto y el segundo abre el listado. Con `prefers-reduced-motion` el cambio es instantáneo.

## Props y slots

| Atributo / slot | Contenido |
| --- | --- |
| slot por defecto | lo arma el componente: un `<a href>` por familia, con un `<img>` y el nombre |
| slot `action` | botón opcional debajo de la lista. En la Home: «Ver todas las colecciones» |

## Tokens

| Parte | Token |
| --- | --- |
| Nombres | `role/display-sm`. Activo: `color/text/primary` y líneas `border/strong` en `color/border/strong`. Resto: `color/text/tertiary` |
| Foto | `ratio/landscape` (5:4), `object-fit: cover`, fondo `color/surface/subtle` |
| Cambio de foto | `motion/duration/slow` |
| Columnas | `space/gap/4xl`. En Mobile la foto queda arriba |

`TODO` (diseño): no hay set en Figma ni token propio del bloque.
