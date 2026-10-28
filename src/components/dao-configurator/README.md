# dao-configurator · `<arq-dao-configurator>`

Configurador de la colección Daö, en un **modal a pantalla completa**. Se abre desde el botón «Configura tu Daö» de la ficha, en la punta opuesta al título «Accesorios y lámparas compatibles», y se arma paso por paso, como las páginas de compra de Apple. No tiene set en Figma todavía (`TODO` diseño).

```html
<arq-dao-configurator></arq-dao-configurator>
```

```js
configurator.show(sku, botón);   // abre; el foco vuelve al botón al cerrar
configurator.close();
```

`<arq-ficha-producto>` lo crea una vez y abre con el botón `.config-cta`. El SKU que recibe `show()` hoy no se usa: el configurador siempre arranca en el aro, sin nada elegido (`TODO`: si más adelante se quiere adelantar la pieza de la ficha).

## Flujo

- **Tres pasos numerados:** 1 Aro (modelo, módulos y color), 2 Cabezal (modelo y color, solo si el aro lleva cabezal) y 3 Lámpara (modelo y, si lo trae, color del frente). La palabra es siempre «Color».
- **Un paso abierto a la vez.** Dentro de un paso, cada grupo aparece cuando se eligió el anterior; un grupo con una sola opción se elige solo. «Continuar» está deshabilitado hasta que todo lo del paso esté elegido. Los pasos hechos se pliegan en una línea de resumen con «Cambiar»; los pendientes muestran solo el título, atenuado.
- Si un cambio arrastra lo elegido en un paso posterior (otro aro, otro cabezal), ese paso se vuelve a elegir o confirmar.
- **Al terminar:** los tres pasos se condensan arriba en un bloque chico con un «Cambiar»; debajo aparecen el nombre del armado, las especificaciones, las piezas (cantidad, nombre con link a su ficha y SKU) y «Imprimir configuración» (button Filled). «Cambiar» vuelve a desplegar los tres pasos (cada uno con su «Cambiar») y esconde el armado; «Ver resumen» o confirmar un paso vuelve al resumen.
- **Panel de la derecha:** solo las fotos de las piezas, fijo y sin scroll. Empieza vacío (cuadro en blanco) y suma una foto por pieza a medida que se elige (aro, cabezal, lámpara y frente). Cada pieza va en una tarjeta de `color/surface/subtle`. Las tarjetas se reparten el alto: 1 foto ocupa todo, 2 van en fila y 3 o 4 en 2 × 2. En Mobile las fotos van arriba de los pasos, en 5:4.
- La columna de pasos se desplaza sin barra a la vista (rueda, touch y teclado).
- **Animación:** un paso que se abre y el resumen entran con un fundido y un leve ascenso (`motion/duration/base`, `motion/easing/out`; con movimiento reducido, solo el fundido). La hoja del modal entra y sale como compare-picker (`motion/duration/panel`).
- **Diálogo modal nativo:** el foco queda adentro, Esc y la cruz lo cierran, el foco vuelve a quien lo abrió y la página de atrás no se desplaza (`src/base/scroll-lock.js`). Siempre en Light.

## Datos y compatibilidad

- Salen de Typesense (`src/data/dao-config.js`, `getDaoConfigurator()`, una sola carga). El cabezal sale de `cabezales_compatibles` del aro y la lámpara de `lamparas_compatibles` del cabezal (o del aro, si no lleva cabezal).
- **Color del cabezal:** cada aro lista el cabezal de su propio color, así que se juntan los de todos los colores del aro (mismo grupo y módulos); sin elegirlo, sigue al color del aro.
- **Frente:** si la lámpara tiene `frentes_compatibles` (PAR11-C-5W-DIM-36G-WW), el paso 3 suma «Color del frente» y una nota avisa que el frente y el panal son accesorios requeridos.
- Lámparas: el subtítulo es el ángulo de apertura y la temperatura de color («24°, intermedio · 1800K a 2700K»), que es lo que distingue las dos Dim to warm.
- El rol de cada pieza (aro, cabezal, lámpara, frente) sale de quién la lista, no de `categoria` (las filas de PAR11 la traen vacía).
- Bornera y panal no se muestran como pieza: todavía no tienen SKU en la base (`TODO` en `src/data/dao-config.js`).
- `daoFixed()` y el parámetro `fixed` de `resolveDao()` (limitar lo que se puede elegir a lo compatible con la pieza de la ficha) quedaron sin uso desde que el configurador arranca siempre en el aro.
- Estados: «Cargando configurador…», «No hay piezas de Daö para armar.», «No se pudo cargar el configurador. Probá de nuevo en unos minutos.».

## Opciones

option-group Type=Cards y option-tile Type=Card (ver sus README): caja de 1 px en `color/border/subtle`; la elegida, en `color/border/strong`. Título en `role/body-regular`, subtítulo en `role/body-compact` y `color/text/secondary`, y el color lleva el swatch dentro de la caja.

## Pendientes

- `TODO` (diseño): el modal, el paso plegado y condensado, el panel de fotos y la hoja del PDF no están en Figma.
- `TODO`: «Imprimir configuración» abre hoy una hoja simple para imprimir o guardar como PDF (con `window.open`). Falta el PDF real con pdfmake y los estilos de la ficha técnica (`src/pdf/`).
- `TODO` (datos): la imagen final del producto armado (hoy se muestran las fotos de las piezas); las fotos de la lámpara y del frente de PAR11 salen rotas en los datos.
- `TODO` (diseño): las fotos usan 5:4 (`ratio/landscape`).
