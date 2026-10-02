<!-- Convertido del .docx (Descargas/estructura-base-de-datos.md.docx). Las 11 capturas no se copiaron al repo: queda su epígrafe. -->

# Macroled ARQ

# Estructura de la base de datos

Versión 5 · 1 de octubre de 2026

La pestaña Propuesta alimenta el catálogo mediante una sola colección en Typesense, con un documento por SKU. Este documento explica cómo se relacionan los datos y qué contenido utiliza cada pantalla. Distingue las decisiones confirmadas, los campos que ya existen y las propuestas aún pendientes.

**Demo interactiva:** https://claude.ai/artifact/GzQaRMJupRJfbnwJBuZJH8 (abrir con la sesión de Claude iniciada). Tiene una pestaña por pantalla y un interruptor para mostrar u ocultar qué columna alimenta cada elemento. Para verla sin cuenta de Claude, el mismo archivo se puede publicar como index.html en GitHub Pages u otro hosting estático.

## La unidad de carga es el SKU

Cada fila representa una variante real. Los SKU con el mismo PRODUCT_GROUP_ID forman un producto; los grupos con el mismo COLLECTION_ID forman una colección. Los datos compartidos se repiten de forma idéntica en las filas correspondientes.

| **Nivel** | **Ejemplo** | **Qué representa** |
| --- | --- | --- |
| Colección | kanu | Kanu reúne productos Jardín y Pared. |
| Grupo | kanu-jardin | Kanu Jardín tiene su card y su ficha de producto. |
| SKU | KANU-J-500-12W-N-WW | Una combinación concreta de color, altura y otras características. |

*[Captura: image2, no incluida en el repo]*

Productos: 8 SKU de Kanu en la base, 2 cards en el listado, una por PRODUCT_GROUP_ID. Imagen y swatches del SKU predeterminado y del grupo.

## Tres campos con funciones diferentes

PRODUCT_GROUP_ID identifica el producto que hay que consultar. PRODUCT_NAME es el nombre visible. VARIANT_ATTRIBUTES indica qué columnas se utilizan para elegir sus variantes; no contiene los valores disponibles ni reemplaza al identificador del grupo.

Ejemplo: VARIANT_ATTRIBUTES = «Color de carcasa, Altura». Las opciones Negro, Verde, 50 cm o 90 cm se obtienen de los SKU del grupo. Solo se ofrecen combinaciones que existen en la base.

## Alcance actual

Se documentan Productos, Colecciones, Ficha de producto, Ficha de colección, Comparativa, Mega Menu y la navegación lateral de Productos. Home se deja para después y será mayormente fijo en código. Las contradicciones de los datos técnicos quedan fuera de esta etapa y no se corrigen.

## Referencias

Base: Google Sheets «Macroled ARQ - Base de datos», pestaña Propuesta. Diseño: Figma «Macroled ARQ», página baja / media. Antecedente: documento de estructura del 1 de octubre de 2026. Las capturas son de una demo local (demo-macroled-arq.html), con una pestaña por pantalla. Kanu usa sus ocho SKU reales; los demás grupos son ejemplos marcados en naranja para probar la navegación y sus agrupaciones no están confirmadas. Los recuadros grises ocupan el lugar de las fotos y las etiquetas azules indican qué columna alimenta cada elemento.

# Identificación y contenido compartido

| **Campo** | **Uso y regla** |
| --- | --- |
| SKU | Código de la variante y vínculo con sus características, imágenes y archivos. |
| PRODUCT_GROUP_ID | Agrupa variantes. ID permanente en minúscula con guiones; sirve también como slug de la ficha. |
| PRODUCT_NAME | Título final de la card y de la ficha. Igual en todos los SKU del grupo; no se construye concatenando otros campos. |
| COLLECTION_ID | Relaciona los grupos de una colección. ID permanente y slug de su ficha. |
| COLLECTION_NAME | Nombre visible de la colección y de los enlaces hacia ella. Igual en toda la colección. |
| APPLICATION | Aplicación del grupo, por ejemplo Jardín o Pared. Lista cerrada; escribir siempre igual, sin espacios de más. Vacío en lámparas y artefactos. |
| ENVIRONMENT | Interior o Exterior. Ubica el grupo en el mega menú y en el lateral de Productos. Igual en todos los SKU del grupo. |
| PRODUCT_TYPE | Luminaria, Lámpara o Artefacto. Separa las secciones Lámparas y Artefactos de las luminarias. Igual en todos los SKU del grupo. |
| COLLECTION_APPLICATIONS | Fórmula con las aplicaciones únicas de la colección, ordenadas alfabéticamente y separadas por coma. Limpia espacios antes de comparar, para no repetir una aplicación. Se muestra en la card de Colecciones y en el mega menú. No se edita a mano. |
| IS_GROUP_DEFAULT | Checkbox. Un TRUE por grupo para elegir su SKU inicial y su imagen representativa. |
| IS_COLLECTION_DEFAULT | Checkbox. Un TRUE por colección para consultar su documento representante y usar su IMG_MAIN cuando falta IMG_COLLECTION. |
| VARIANT_ATTRIBUTES | Define los selectores de la ficha de producto, por ejemplo «Color de carcasa, Altura». Nombres exactos de las columnas, separados por comas y en el orden de los selectores. Igual en todos los SKU del grupo. Se elige a partir de VARIANT_CANDIDATES. |
| VARIANT_CANDIDATES | Columna de ayuda, por fórmula. Lista las columnas técnicas (de Tension proveedor a Instalacion) cuyos valores cambian entre los SKU del grupo; las celdas vacías no cuentan. Sirve para elegir VARIANT_ATTRIBUTES. No se sincroniza con Typesense. |

## Textos editoriales existentes

| **Campo** | **Página y sección** |
| --- | --- |
| PRODUCT_STORY_TEXT | Ficha de producto, sección Descripción. Título y características editoriales en una celda. Compartido por grupo. |
| PRODUCT_INSPIRATION_TEXT | Ficha de producto, sección Inspiración. Compartido por grupo. |
| COLLECTION_INTRO_TEXT | Ficha de colección, presentación junto al título. Compartido por colección. |
| COLLECTION_DESCRIPTION_TEXT | Ficha de colección, bloque intermedio de texto e imagen. Compartido por colección. |

PRODUCT_STORY_TEXT puede usar Markdown: ## para un título y - para cada característica. El código aplica los estilos visuales. Descripcion sigue siendo el resumen técnico del SKU junto a los selectores. NOMBRE_ORIGEN se conserva como referencia y no sustituye al nombre comercial.

# Ficha de producto e imágenes

## Galería superior

Confirmado: las columnas de imágenes ya permiten construir la galería. La selección y el orden se definen en código; los campos vacíos se omiten. Si solo existe IMG_MAIN, se muestra esa imagen. No hace falta agregar una columna para configurar el orden por producto.

Orden propuesto para concretar la implementación: IMG_MAIN, IMG_AMBIENT_1, IMG_PERS_1, IMG_PERS_2, IMG_DETAIL_1 e IMG_DETAIL_2. La inclusión de FRONT, BACK, LEFT y RIGHT puede resolverse también en código. El orden final se define en código; ver «Se resuelven en código».

| **Campos existentes** | **Uso** |
| --- | --- |
| IMG_MAIN y su pareja _ON | Imagen principal del SKU. En las cards del grupo se usa el SKU predeterminado. |
| IMG_FRONT, IMG_BACK, IMG_LEFT, IMG_RIGHT | Vistas adicionales disponibles. Que exista una columna no obliga a mostrarla. |
| IMG_PERS_1 y IMG_PERS_2 | Vistas en perspectiva, opcionales en la galería superior. |
| IMG_DETAIL_1 y IMG_DETAIL_2 | Detalles del producto, opcionales en la galería superior. |
| IMG_AMBIENT_1 y su pareja _ON | Ambiente previsto para la galería superior. |
| IMG_AMBIENT_2 a IMG_AMBIENT_5 | Galería de ambientes debajo de las características técnicas. |
| IMG_AMBIENT_6 | Imagen junto a PRODUCT_STORY_TEXT. |
| IMG_AMBIENT_7 | Imagen de la sección Inspiración. |
| VIDEO_INSPIRATION | Video opcional de Inspiración. Sin video se muestra una sola imagen; no hace falta un segundo campo de imagen. |

Las vistas con columna _ON utilizan esa versión al activar Iluminar. Si falta, conservan la imagen base. Las imágenes editoriales compartidas pueden repetir la misma URL en todos los SKU del grupo; no se duplican los archivos alojados.

## Variantes y otras familias

Los selectores usan VARIANT_ATTRIBUTES y disponibilidad dinámica. Al elegir una combinación válida se actualizan descripción técnica, imágenes específicas, características y descargas del SKU. Los textos editoriales del grupo permanecen iguales.

Cómo elegir VARIANT_ATTRIBUTES: VARIANT_CANDIDATES muestra todo lo que cambia dentro del grupo, y se eligen solo los atributos que decide el cliente (color, altura o tamaño, a veces temperatura de color). Lo que es consecuencia de esa elección, como peso, corrientes, flujo o potencia cuando depende de la medida, queda como spec del SKU y se actualiza solo.

Ejemplo: en Kanu Pared, VARIANT_CANDIDATES lista Tension salida, corrientes, Potencia, máximos por circuito, Flujo Luminoso, Tamaño, Altura, Peso y Color de carcasa, porque el SKU de 50 cm es de 15W. Igual se elige «Color de carcasa, Altura»: identifica cada SKU sin ambigüedad (Negro 35, Verde 35, Terracota 35, Negro 50) y la potencia ya queda definida por la altura.

*[Captura: image3, no incluida en el repo]*

Ficha de Kanu Jardín con Verde seleccionado. Verde solo existe en 50 cm, así que 90 cm queda deshabilitado; con Negro se habilitan las dos alturas.

«Otras familias» y «Explora la colección» consultan grupos con el mismo COLLECTION_ID y excluyen el grupo actual. Se muestra una card por grupo, con PRODUCT_NAME. No se necesita una lista manual de referencias para esta relación.

*[Captura: image4, no incluida en el repo]*

«Otras familias» en la ficha de Kanu Jardín: el otro grupo de la colección, sin lista manual.

## Características y descargas

Las secciones del acordeón, sus etiquetas y las columnas del glosario se definen en código. Los datos vienen del SKU. Las columnas actuales de archivos son IES, CAD, MANUAL y FOTOMETRIA; sus valores son URLs. La ficha técnica se genera por código, sin columna de archivo. Si un archivo falta, se oculta su descarga.

*[Captura: image7, no incluida en el repo]*

Glosario de Kanu Jardín filtrado por Verde. Los filtros son los atributos de VARIANT_ATTRIBUTES y siguen la lógica de los selectores: como Verde solo existe en 50 cm, 90 cm queda deshabilitado.

# Colecciones y ficha de colección

## Dos listados con distinta unidad

| **Pantalla** | **Una card por** | **Título e imagen** |
| --- | --- | --- |
| Colecciones | COLLECTION_ID | COLLECTION_NAME e IMG_COLLECTION. Si falta la imagen propia, IMG_MAIN del SKU con IS_COLLECTION_DEFAULT. |
| Ficha de colección | PRODUCT_GROUP_ID dentro de la colección | PRODUCT_NAME e IMG_MAIN del SKU con IS_GROUP_DEFAULT. |

Los IDs permiten consultar y enlazar; no se muestran como títulos. IS_COLLECTION_DEFAULT no reemplaza a IS_GROUP_DEFAULT: la ficha de colección necesita un representante de cada grupo, no un solo SKU para todas las cards.

En Colecciones, IMG_COLLECTION_ON permite la versión encendida de la card. Si falta, se conserva IMG_COLLECTION; si se usa la imagen del representante, se toma su IMG_MAIN_ON o, si falta, IMG_MAIN. Colecciones no lleva botón Comparar.

*[Captura: image6, no incluida en el repo]*

Colecciones: una card para Kanu con COLLECTION_NAME y COLLECTION_APPLICATIONS. Sin IMG_COLLECTION cargada, usa la IMG_MAIN del SKU con IS_COLLECTION_DEFAULT.

## Qué muestra la card de cada grupo

Confirmado: las cards identifican los grupos y pueden resumir en qué varían. VARIANT_ATTRIBUTES indica qué campos consultar y sus opciones se obtienen reuniendo los valores únicos de los SKU del grupo. El diseño puede usar swatches para color y texto para altura u otros atributos.

El resumen de la card sale de VARIANT_ATTRIBUTES, y el código puede añadir una o dos características fijas útiles, como la potencia, aunque no varíen. No se agrega una columna nueva; ver «Se resuelven en código».

## Imágenes de la ficha de colección

Las imágenes de la ficha de colección y su orden se eligen explícitamente por colección, con las columnas de referencia. Las URLs pueden reutilizar los mismos archivos que usan los grupos o apuntar a escenas con varios productos. No se propone reunir automáticamente todas las imágenes de todos los SKU.

| **Campo** | **Ubicación** |
| --- | --- |
| COLLECTION_GALLERY_IMAGES | Primera galería, debajo de las cards. Lista ordenada de URLs, una por línea. |
| COLLECTION_DESCRIPTION_IMAGE | Imagen única junto a COLLECTION_DESCRIPTION_TEXT. |
| COLLECTION_INSPIRATION_IMAGES | Mosaico o galería final. Lista ordenada de URLs, una por línea. |

Los tres campos ya existen en Propuesta, cada uno junto a una columna de referencia: COLLECTION_GALLERY_REFS, COLLECTION_DESCRIPTION_REF y COLLECTION_INSPIRATION_REFS. En la referencia se escribe grupo y columna, por ejemplo kanu-jardin:IMG_AMBIENT_2 (una por línea en las galerías), y la columna de imagen calcula la URL desde el SKU predeterminado de ese grupo. Si cambia el SKU predeterminado, cambian también estas imágenes. Typesense solo necesita las columnas de imagen; las de referencia son una ayuda de carga. Sus valores son iguales en todos los SKU de la colección. IMG_COLLECTION sigue siendo la imagen de la card del listado de Colecciones; no sustituye estas tres ubicaciones.

*[Captura: image8, no incluida en el repo]*

Ficha de colección de Kanu. Textos de ejemplo tomados del Figma. Cada card resume en qué varía el grupo (alturas y potencias reunidas de sus SKU) y cada imagen muestra la referencia grupo:columna de la que sale.

Recomendación: al mostrar una galería, omitir vacíos y URLs repetidas dentro de ella. Una misma foto sí puede reutilizarse en la ficha de producto y en la de colección. El representante permite leer los datos compartidos de colección, pero sus ambientes particulares no pasan automáticamente a ser los de toda la colección.

# Comparativa y filtros

## Comparativa por grupos

Confirmado: cada columna de la Comparativa representa un PRODUCT_GROUP_ID. En su cabecera se muestran los selectores definidos por VARIANT_ATTRIBUTES. El límite de productos comparados y la disposición de los selectores se resuelven en código.

Regla recomendada: cada grupo mantiene un SKU seleccionado. Al entrar, usar IS_GROUP_DEFAULT; al cambiar un selector, resolver una combinación existente y actualizar todas las características de esa columna. Así se comparan productos configurados sin mezclar datos de distintas variantes.

Conviene permitir elegir todos los atributos necesarios para identificar la variante. Si hay demasiados, se puede compactar o desplegar el panel; ocultar atributos sin otra forma de elegirlos dejaría combinaciones inaccesibles. Si dos SKU comparten todas las opciones declaradas, la selección es ambigua y debe revisarse antes de publicar.

## Dos tipos de filtros

Los filtros técnicos de Productos consultan características como potencia, color o temperatura de color. Las columnas que pueden filtrarse y su presentación se definen en código. Una card representa un grupo que tiene al menos un SKU que cumple los filtros.

Cuando el SKU predeterminado no cumple el filtro, la card muestra el primer SKU del grupo que lo cumple, en el orden de la hoja, y la ficha abre con esa combinación.

Los filtros de navegación que imitan Mega Menu son otro tema y se tratan en la sección «Mega Menu y navegación de Productos». No se confunden con el panel de filtros técnicos.

# Mega Menu y navegación de Productos

## Un solo árbol, tres formas de mostrarlo

Propuesta: el mega menú, el lateral de Productos y Colecciones y el menú mobile muestran el mismo árbol de navegación. El árbol se define una vez en código: pestañas, columnas, títulos, orden y opciones. Cada opción es un filtro sobre campos de la base, por ejemplo Exterior > Jardín = ENVIRONMENT Exterior y APPLICATION Jardín.

La base aporta los valores; el código decide la presentación. Las opciones sin productos en la base se ocultan solas, y el conteo de cada página sale de agrupar por PRODUCT_GROUP_ID los SKU que cumplen el filtro. La pestaña Colecciones se genera completa desde la base, con una línea por COLLECTION_ID.

*[Captura: image9, no incluida en el repo]*

Mega menú, pestaña Aplicación. Cada opción muestra el filtro que ejecuta. Exterior no muestra Aplicar, Artefactos ni Lámparas porque en la demo no hay productos con esos valores.

*[Captura: image10, no incluida en el repo]*

Mega menú, pestaña Colecciones, generada desde COLLECTION_NAME y COLLECTION_APPLICATIONS.

## Lateral y mobile

En Productos y Colecciones, el lateral muestra el mismo árbol en acordeones: Interior, Exterior, Lámparas, Artefactos y Colecciones. Lámparas y Artefactos son secciones separadas, no una sola. La sección donde está el usuario queda abierta y su opción marcada. En mobile no hay lateral: se muestra solo la sección actual, con su título y sus opciones; para cambiar de sección se usa el menú principal.

*[Captura: image11, no incluida en el repo]*

Productos en Exterior > Jardín. El lateral es el árbol del mega menú; el título y el conteo salen de la opción elegida.

*[Captura: image12, no incluida en el repo]*

La misma página en mobile: solo la sección Exterior.

## Campos de navegación

ENVIRONMENT y PRODUCT_TYPE ya están en Propuesta, a la derecha de APPLICATION. Kanu está completo (Exterior, Luminaria); el resto del catálogo se completa junto con sus agrupaciones. Son campos de grupo: iguales en todos los SKU del grupo.

| **Campo** | **Valores y uso** |
| --- | --- |
| ENVIRONMENT | Interior o Exterior. Primer nivel de la pestaña Aplicación y secciones Interior y Exterior del lateral. |
| PRODUCT_TYPE | Luminaria, Lámpara o Artefacto. Separa Lámparas y Artefactos de las luminarias, tanto en el mega menú como en el lateral. |
| APPLICATION | Ya existe. Segundo nivel bajo Interior y Exterior: Jardín, Bañadores, Aplicar, Pared, Embutir, Suspensión. Vacío en lámparas y artefactos. |

*[Captura: image13, no incluida en el repo]*

Sección Lámparas con PRODUCT_TYPE = Lámpara. Mientras no haya una agrupación propia, cada opción del lateral es un producto.

## Pendiente: agrupación de lámparas y artefactos

No está definido si lámparas y artefactos necesitan un segundo nivel, por ejemplo por formato (MR11, MR16 PRO, Tira LED), o si funcionan como una colección. Hoy son dos lámparas que se usan con productos de embutir; una incluye anillo y panel de abeja y la otra no.

Por ahora se agrega solo PRODUCT_TYPE: alcanza para las secciones Lámparas y Artefactos y para listar sus productos. Si más adelante se necesita agruparlas, se suma un campo de grupo (por ejemplo LAMP_FORMAT) sin cambiar el resto de la estructura.

## Qué falta definir

Nombres de aplicación: el mega menú dice Suspensión, el lateral de Figma dice Suspension (sin tilde) y la base usa Colgante en Douli. Hay que elegir uno para APPLICATION y usarlo igual en todas las vistas.

En el lateral de Figma, la sección Lámparas repite MR16 PRO; probablemente una de las dos sea AR111 PRO, como en el mega menú.

Productos en Interior y Exterior a la vez: si existen, ENVIRONMENT debería admitir una lista (por ejemplo «Interior, Exterior»), como COLLECTION_APPLICATIONS.

# Reglas de implementación y próximos acuerdos

## Qué queda en la hoja y qué queda en código

| **En Propuesta** | **En código** |
| --- | --- |
| IDs, nombres y pertenencia a grupo y colección. | Consultas, rutas y agrupación de resultados. |
| VARIANT_ATTRIBUTES y valores de cada SKU. | Selectores, disponibilidad y presentación de opciones. |
| Textos, URLs de imágenes, video y descargas. | Diseño, estilos, orden de vistas y omisión de campos vacíos. |
| Checkboxes de representantes. | Selección inicial y validación de un representante por entidad. |
| Características técnicas. | Secciones del acordeón, filtros disponibles y generación de ficha técnica. |

## Exportación y validación pendientes de implementar

El script transformará las filas en documentos JSON. Los checkboxes deben salir como booleanos true/false, no como cadenas. Si la entrada es CSV, deberá convertir explícitamente TRUE y FALSE. Las listas y los valores vacíos necesitan un contrato de conversión antes de implementar la sincronización. Las columnas de ayuda (VARIANT_CANDIDATES y las _REFS de imágenes de colección) no se envían a Typesense.

Validaciones propuestas: SKU único; IDs válidos y permanentes; datos de grupo y colección idénticos en sus filas; exactamente un TRUE por grupo y colección publicados; atributos que coincidan con encabezados existentes; combinaciones de variantes no ambiguas.

Las agrupaciones y representantes todavía incompletos deben señalarse antes de publicar. La validación estructural no sustituye la revisión técnica de potencias, medidas, colores o archivos. Esa revisión queda pendiente por decisión del proyecto.

## Pendientes de estructura

1. Probar los tres campos de imágenes de colección con imágenes de prueba en los SKU predeterminados de Kanu Jardín y Kanu Pared.

2. Definir las reglas del script de sincronización con Typesense.

3. Home. Se diseña más adelante y será mayormente contenido fijo en código. Falta ver si algún bloque, como productos o colecciones destacadas, conviene leerlo de la base; si es así, se agregaría un campo para marcarlos.

## Se resuelven en código

Estas decisiones no requieren cambios en la base; se definen al implementar.

Resumen de las cards de grupo: sale de VARIANT_ATTRIBUTES (por ejemplo «35 cm – 50 cm») y el código puede sumar una o dos características fijas, como la potencia.

Comparativa: cada columna es un grupo y en su cabecera aparecen los selectores de VARIANT_ATTRIBUTES, con la misma disponibilidad dinámica que la ficha. Al cambiar una variante se actualizan las características de esa columna y también la imagen, que pasa a ser la IMG_MAIN del SKU elegido. Las filas de características son una lista fija en el código, como las secciones del acordeón.

Galería superior: el código toma las columnas de imagen en el orden definido y saltea las vacías. Propuesta: IMG_MAIN, IMG_AMBIENT_1, IMG_PERS_1, IMG_PERS_2, IMG_DETAIL_1 e IMG_DETAIL_2.

Card con filtros activos: si el SKU predeterminado cumple el filtro, la card lo muestra; si no, muestra el primer SKU del grupo que lo cumple, en el orden de la hoja, y la ficha abre con esa variante. Sin filtros se usa siempre el predeterminado. Por ejemplo, con el filtro de 15 W, Kanu Pared muestra el SKU de 15 W.
