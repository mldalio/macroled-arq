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
- **Un paso abierto a la vez.** Dentro de un paso, cada grupo aparece cuando se eligió el anterior; un grupo con una sola opción se elige solo. Al elegir el aro quedan marcados su módulo y su color predeterminados (los de la foto: el primero y Negro) y «Continuar» se habilita; lo mismo el color del cabezal, que arranca en el del aro.
- **Cambiar el aro después:** con el cabezal ya elegido, cambiar el color o los módulos del aro no toca el color de los cabezales ni lo demás elegido; solo otro modelo de aro hace volver a elegirlos.
- **Cabezales por módulo:** un aro de 2 o 3 módulos lleva un cabezal por módulo. Si hay más de un cabezal posible (Daö: común y direccionable), cada uno va en una caja con su cantidad entre − y + (icon-button Outline), y se pueden combinar (1 + 1). Arriba, «Un cabezal por módulo, podés combinarlos.» y, en la punta opuesta, la cuenta («0 de 2 elegidos», en `color/text/tertiary`; completa, en `color/text/primary`). El + suma de a uno; con todos los módulos cubiertos, + en otro le pasa uno. Lo elegido es la cantidad y el color, no la caja: la caja con cantidad va en `color/border/default` (no `color/border/strong`; la que no tiene, en `color/border/subtle`) y los − / + llevan borde `color/border/default` (`--arq-icon-button-border`), así el negro queda en el color elegido y en el número. Debajo, su color (de entrada, el del aro): cada cabezal puede ir de un color. «Continuar» se habilita cuando suman los módulos. Con un solo módulo, o un solo cabezal posible (Mini Daö), se elige como antes, con un color para todos.
- **Lámpara:** una opción por modelo; las que solo cambian el ángulo (PAR11 Dim to warm 24° y 12°) son una, y debajo se elige el «Ángulo», como los módulos del aro, con el primero ya marcado (otro modelo conserva el ángulo si lo tiene). El estado sigue guardando el SKU.
- **Lámpara con frente (PAR11):** elegida, aparece un aviso en una caja `color/surface/soft` (ícono `alert` en `color/text/warning`, «Accesorios requeridos:» en `role/body-compact-medium` y el texto en `role/body-compact`) y debajo el grupo «Color del frente» (el frente siempre va: se elige su color), con cada frente en una card horizontal: su foto a la izquierda (option-tile Type=Card con slot `media`) y su color como nombre.
- Si un cambio arrastra lo elegido en un paso posterior (otro aro, otro cabezal), ese paso se vuelve a elegir o confirmar.
- **Al terminar:** el armado reemplaza a los pasos: el título del armado con «Cambiar» en la punta opuesta (no se achica: en Mobile el título se reparte el resto), las especificaciones, las piezas (cantidad, nombre con link a su ficha y SKU) y «Descargar configuración» (button Filled), en tres bloques a `space/gap/2xl`: el armado (título y especificaciones a `space/gap/lg`), las piezas (título y lista a `space/gap/sm`; entre piezas, `space/gap/md`) y la descarga. En Desktop la descarga va al final; en Mobile sube debajo de las especificaciones, para que se vea sin desplazar. Sin resumen condensado de los pasos: lo mismo está en el armado. «Cambiar» vuelve a los tres pasos, plegados con su resumen (el foco va al primero), y esconde el armado; «Ver resumen» o confirmar un paso vuelve al armado.
- **Paso hecho (plegado):** toda la fila (número, título, resumen y «Cambiar») es un solo botón, como el título de un desplegable: se abre tocando cualquier parte. Hover `color/surface/faint` (el de accordion-item) en toda la fila, que se asoma `space/padding/sm-md` a los lados (el texto no se mueve), y el subrayado de «Cambiar» pasa de 1 a 2 px dibujándose de izquierda a derecha. Foco: anillo de `color/border/focus`. «Cambiar» es texto dentro del botón; el nombre accesible es «Cambiar: Aro, Daö x2 negro». Los pasos pendientes no son clickeables.
- **«Descargar configuración»:** abre un PDF en una pestaña nueva, como la ficha técnica (`src/pdf/configuracion.js`; emite `arq:configuration` y main.js lo genera). Mientras se genera, el botón queda en Loading («Generando…»).
- **Título del armado:** una frase, con el modelo de aro como único nombre propio y lo demás en minúscula, sin repetir «Daö»: «Mini Daö Trimless x3 negro con cabezal blanco», «Daö x2 negro con cabezal negro y cabezal direccionable blanco». El color del cabezal va siempre; las cantidades, no (están en Piezas). Es también el título de la hoja para imprimir.
- **Panel de la derecha:** solo las fotos de las piezas, fijo y sin scroll. Empieza vacío (cuadro en blanco) y suma una foto por pieza a medida que se elige (aro, cada cabezal, lámpara y frente). Un cabezal que va en más de un módulo no repite la foto: lleva su cantidad en un count-badge al principio del epígrafe: «[2] × Daö Cabezal negro». Cada pieza va en una tarjeta de `color/surface/subtle`. Las tarjetas se reparten el alto: 1 foto ocupa todo, 2 van en fila y de 3 a 6 en dos columnas. En Mobile las fotos van arriba de los pasos, en un recuadro de al menos 5:4 del ancho que se reparte igual (con 1 a 4 fotos no cambia de alto: sumar una no corre los pasos); cada tarjeta mide al menos 5:4 de su columna, así que con 5 o 6 fotos crece una fila en lugar de achatarse. Vacío no se muestra (como en Desktop): aparece al elegir el aro.
- La columna de pasos se desplaza sin barra a la vista (rueda, touch y teclado).
- **Animación:** un paso que se abre y el resumen entran con un fundido y un leve ascenso (`motion/duration/base`, `motion/easing/out`; con movimiento reducido, solo el fundido). La hoja del modal entra y sale como compare-picker (`motion/duration/panel`).
- **Fotos:** las tarjetas se reutilizan. Una nueva entra recién cuando su foto cargó: aparece y crece desde `motion/scale/enter` (`motion/duration/slow`, `motion/easing/out`). Si cambia la foto de una pieza (otro color), la nueva se funde sobre la anterior (`motion/duration/slow`, `motion/easing/illumination-image`). Las que cambian de lugar o de tamaño se deslizan hasta el nuevo (FLIP con `transform`, `motion/duration/panel`, `motion/easing/standard`). El count-badge late un poco al cambiar la cantidad. Con movimiento reducido, solo fundidos de `motion/duration/fade`.
- **Diálogo modal nativo:** el foco queda adentro, Esc y la cruz lo cierran, el foco vuelve a quien lo abrió y la página de atrás no se desplaza (`src/base/scroll-lock.js`). Siempre en Light.

## Datos y compatibilidad

- Salen de Typesense (`src/data/dao-config.js`, `getDaoConfigurator()`, una sola carga). El cabezal sale de `cabezales_compatibles` del aro y la lámpara de `lamparas_compatibles` del cabezal (o del aro, si no lleva cabezal).
- **Color del cabezal:** cada aro lista el cabezal de su propio color, así que se juntan los de todos los colores del aro (mismo grupo y módulos); sin elegirlo, sigue al color del aro.
- **Frente:** si la lámpara tiene `frentes_compatibles` (PAR11-C-5W-DIM-36G-WW), el paso 3 suma el aviso de accesorios requeridos y el grupo «Frente» (ver Flujo).
- Lámparas: el subtítulo es el ángulo de apertura y la temperatura de color («24°, intermedio · 1800K a 2700K»), que es lo que distingue las dos Dim to warm.
- El rol de cada pieza (aro, cabezal, lámpara, frente) sale de quién la lista, no de `categoria` (las filas de PAR11 la traen vacía).
- Bornera y panal no se muestran como pieza: todavía no tienen SKU en la base (`TODO` en `src/data/dao-config.js`).
- `daoFixed()` y el parámetro `fixed` de `resolveDao()` (limitar lo que se puede elegir a lo compatible con la pieza de la ficha) quedaron sin uso desde que el configurador arranca siempre en el aro.
- Estados: «Cargando configurador…», «No hay piezas de Daö para armar.», «No se pudo cargar el configurador. Probá de nuevo en unos minutos.».

## Opciones

option-group Type=Cards y option-tile Type=Card (ver sus README): caja de 1 px en `color/border/subtle`; la elegida, en `color/border/strong`. Título en `role/body-regular`, subtítulo en `role/body-compact` y `color/text/secondary`, y el color lleva el swatch dentro de la caja.

## Pendientes

- `TODO` (diseño): el modal, el paso plegado, el armado final, el panel de fotos y la hoja del PDF no están en Figma.
- `TODO` (diseño): el contador de cabezales (cajas con − / + y color), el count-badge del epígrafe, el aviso de accesorios requeridos y el ícono `alert` no están en Figma.
- `TODO` (token): no hay `color/icon/warning`; el ícono del aviso usa `color/text/warning`.
- `TODO` (datos): algunas fotos traen una línea oscura de 1 o 2 px en el borde superior del PNG (`DAO-C-N_HERO_ON`, `DAO-CD-N_HERO_ON`, `DAO-E-DF-B_HERO_ON`; revisión del 2026-10-29). Es de la imagen: hay que corregir el archivo.
- `TODO` (datos): la imagen final del producto armado (hoy se muestran las fotos de las piezas); las fotos de la lámpara y del frente de PAR11 salen rotas en los datos.
- `TODO` (diseño): las fotos usan 5:4 (`ratio/landscape`).
