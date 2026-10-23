# dao-configurator · `<arq-dao-configurator>`

Configurador de la colección Daö, en la pestaña Configurador de la ficha. Arma un producto eligiendo aro, módulos, terminación, cabezal y lámpara. Los datos salen de Typesense (`src/data/dao-config.js`). No tiene set en Figma: sigue el demo `arq_nosotros/dao_config`, con option-group, option-tile y swatch de la ficha.

```html
<arq-dao-configurator data-sku="DAO-E-X1-N"></arq-dao-configurator>
```

## Atributos

| Atributo | Contenido |
| --- | --- |
| `data-sku` | SKU de la ficha. Esa pieza abre elegida (aro, cabezal, lámpara o frente) y el resto del armado es compatible con ella. Al cambiar el atributo, vuelve a esa pieza |

## Comportamiento

- Cada elección depende de la anterior: el cabezal sale de `cabezales_compatibles` del aro y la lámpara, de `lamparas_compatibles` del cabezal (o del aro, si no lleva cabezal). Si la lámpara tiene `frentes_compatibles` (PAR11-C-5W-DIM-36G-WW: blanco y negro), se elige el frente. Sin esa lista, no hay frente. Abre el del color del aro, o el de la ficha si la ficha es un frente.
- «Ver ficha» abre la ficha del SKU cuando el catálogo tiene ese grupo. Sin grupo, se ve el nombre y el código, sin link.
- Bornera y panal no se muestran: todavía no tienen SKU en la base (`TODO` en `src/data/dao-config.js`).
- Estados: «Cargando configurador…», «No hay piezas de Daö para armar.», «No se pudo cargar el configurador. Probá de nuevo en unos minutos.».

## Pendientes

- `TODO` (diseño) No está en Final. Las fotos usan 5:4 (`ratio/landscape`), el más cercano al 4:3 del demo.
