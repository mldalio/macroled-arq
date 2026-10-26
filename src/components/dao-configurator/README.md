# dao-configurator · `<arq-dao-configurator>`

Configurador de la colección Daö, en la pestaña Configurador de la ficha. Arma un producto en tres pasos numerados: 1 Aro (con Módulos y Color), 2 Cabezal (con su Color) y 3 Lámpara (con el Color del frente). Los pasos van apareciendo a medida que se elige: arranca el 1 y cada elección abre el siguiente, con un fundido y un leve ascenso (`motion/duration/base`; con movimiento reducido, solo el fundido). Una ficha de cabezal o de lámpara abre con su paso ya a la vista. Desde 768 px los pasos se desplazan con la página y el resultado queda fijo a la derecha (`sticky`, debajo del navbar); en Mobile va debajo. Las opciones son option-group Type=Cards (option-tile Type=Card: título y, según el paso, subtítulo; el color lleva el swatch dentro de la caja; la palabra es siempre «Color»). Los datos salen de Typesense (`src/data/dao-config.js`). No tiene set en Figma: sigue el demo `arq_nosotros/dao_config`, con option-group, option-tile y swatch de la ficha.

```html
<arq-dao-configurator data-sku="DAO-E-X1-N"></arq-dao-configurator>
```

## Atributos

| Atributo | Contenido |
| --- | --- |
| `data-sku` | SKU de la ficha. Esa pieza abre elegida (aro, cabezal, lámpara o frente) y el resto del armado es compatible con ella. Al cambiar el atributo, vuelve a esa pieza |

## Comportamiento

- Cada elección depende de la anterior: el cabezal sale de `cabezales_compatibles` del aro y la lámpara, de `lamparas_compatibles` del cabezal (o del aro, si no lleva cabezal). Si la lámpara tiene `frentes_compatibles` (PAR11-C-5W-DIM-36G-WW), el paso 3 suma «Color del frente» (abre el del color del aro, o el de la ficha si es un frente) y una nota avisa que el frente y el panal son accesorios requeridos. El color del cabezal sale de los cabezales que listan los aros del mismo grupo y módulos (cada aro lista el cabezal de su propio color); sin elegirlo, sigue al color del aro.
- «Ver ficha» abre la ficha del SKU cuando el catálogo tiene ese grupo. Sin grupo, se ve el nombre y el código, sin link.
- Bornera y panal no se muestran: todavía no tienen SKU en la base (`TODO` en `src/data/dao-config.js`).
- Estados: «Cargando configurador…», «No hay piezas de Daö para armar.», «No se pudo cargar el configurador. Probá de nuevo en unos minutos.».

## Pendientes

- `TODO` (diseño) No está en Final. Las fotos usan 5:4 (`ratio/landscape`), el más cercano al 4:3 del demo.
