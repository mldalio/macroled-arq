# Typesense · esquema de la colección de Arq

Campos disponibles en Typesense. Los componentes y `src/data/` usan **solo** los campos de esta tabla: si un campo no está acá, no existe.

- Fuente: Google Sheets «Macroled ARQ - Base de datos», pestaña Propuesta → Typesense. Estructura y reglas de cada columna: `docs/estructura-base-de-datos.md` (versión 5, datos tentativos).
- **Un documento por SKU.** Los SKU con el mismo `PRODUCT_GROUP_ID` forman un producto (una card, una ficha); los grupos con el mismo `COLLECTION_ID` forman una colección. Los datos de grupo y de colección se repiten iguales en sus filas.
- En el front se usa solo la search-only key (ver `.env.example`).
- **Estado:** el índice ya existe pero está incompleto. Lo que hay hoy está en **Estado del índice**; las tablas siguientes son la propuesta original (versión 5) y quedan como referencia de lo que falta.

## Estado del índice (2026-10-02)

Leído con la search-only key en `typesense.coresagroup.com`, colección `macroled_arq`. **132 documentos**, uno por SKU (`id` = `sku`). El acceso desde el front está en `src/data/typesense.js`.

**Campos que existen** (los nombres mandan sobre la propuesta de abajo):

| Grupo | Campos |
| --- | --- |
| Identificación | `id`, `sku`, `product_name`, `product_type`, `familia`, `macrofamilia`, `subfamilia`, `application`, `environment`, `collection_name`, `is_group_default`, `is_collection_default`, `variant_attributes` (texto: «Color de carcasa, Altura»), `nombre_origen` |
| Textos | `description`, `product_story_text`, `product_inspiration_text`, `collection_intro_text`, `collection_description_text`, `escena_uso_sugerido` |
| Imágenes y video | `multimagen_producto`, `multimagen_ambiente`, `multimagen_detalles`, `multimagen_perspectivas`, `multimagen_vistas` (listas), `video_inspiration` |
| Descargas | `ies`, `cad`, `manual`, `fotometria` |
| Técnicos | `altura`, `angulo_apertura`, `anti_high_volt`, `certificado_lm80`, `clase_proteccion`, `color_carcasa`, `conector`, `corriente_entrada`, `corriente_irrupcion`, `corriente_salida`, `cri`, `desviacion_color`, `dimeable`, `emc`, `factor_potencia`, `flujo_luminoso`, `frecuencia`, `garantia_pack`, `garantia_proveedor`, `grupo_seguridad_fotobiologica`, `instalacion`, `largo_cable`, `lumenes_lmw`, `marca_driver`, `marca_led`, `material_cuerpo`, `material_lente`, `max_lum_b16`, `max_lum_c10`, `max_lum_c16`, `no_flicker`, `on_off_switch`, `peso`, `potencia`, `proteccion_ik`, `proteccion_ip`, `protector_spd`, `sdcm`, `tamanio`, `td_distorsion_tonal`, `temperatura_color`, `temperatura_operacion`, `tension_pack`, `tension_proveedor`, `tension_salida`, `thd`, `tiempo_arranque`, `tiempo_irrupcion`, `tipo_driver`, `tipo_led`, `tipo_montaje`, `ugr`, `vida_util` |

- **Facets** (filtros con cantidades): `familia`, `macrofamilia`, `subfamilia`, `potencia`, `temperatura_color`. No son facet: `product_type`, `environment`, `application`, `collection_name`, `is_group_default`, `proteccion_ip`, `color_carcasa`, `altura`, `variant_attributes`.
- **Con datos:** `sku` (132), `potencia` (61), `cri` y `tamanio` (58), `familia`, `macrofamilia`, `subfamilia` y `product_type` (56), `emc`, `sdcm`, `thd` y `ugr` (54), `ies` (47), `variant_attributes` (11), `nombre_origen` (4). El resto está vacío en todos los documentos, incluidos `product_name`, `description`, todas las imágenes, `color_carcasa` y `altura`. 2 documentos con `is_group_default`.
- Valores actuales: `macrofamilia` Exterior · Interior; `subfamilia` Jardín · Pared · Colgante; `familia` Tori, Douli, Kanu, Sento, Yoru, Nobu, Köen, Mini Tori; `product_type` Luminaria.

**Diferencias con la propuesta (para quien arma la base):**

- `TODO` **Falta `product_group_id`** (y `collection_id`): es el vínculo con el CMS y el slug de la ficha (AGENTS.md · Datos). Sin él no se pueden armar fichas, cards por grupo ni selectores de variante.
- `TODO` Imágenes: el índice usa listas `multimagen_*` en lugar de las columnas `img_*`. Falta definir qué posición de cada lista es cada foto (estudio, contexto, luz encendida, galería).
- `TODO` Navegación: ¿`macrofamilia` reemplaza a `environment` y `subfamilia` a `application`? ¿`familia` es la colección? Hasta confirmarlo, `src/data/` no los usa como tales.
- `TODO` `variant_attributes` llega como texto, no como lista: `src/data/attributes.js` lo separa por comas y traduce cada columna a su campo.
- `TODO` Tipos: los técnicos llegan como texto con unidad (`12W`, `10*60cm`, `-`). Para filtros por rango harían falta números.
- No hay `sheet_order` (orden de la hoja).

## Nombres de campo

- Los nombres los define el índice (ver Estado del índice): no siempre siguen una regla (`Color de carcasa` → `color_carcasa`, `Descripcion` → `description`).
- `VARIANT_ATTRIBUTES` trae los nombres de columna tal como están en la hoja («Color de carcasa, Altura»), como texto. `src/data/attributes.js` los traduce a campos.
- Las etiquetas visibles («Color», «Altura», «Flujo luminoso») no salen de los nombres de campo: viven en un único archivo de `src/data/`, junto con las secciones del acordeón, los filtros, las filas de la comparativa y las columnas del glosario.

## Identificación y navegación

| Columna en Sheets | Campo | Tipo | Facet | Nivel | Uso |
| --- | --- | --- | --- | --- | --- |
| SKU | `sku` | string | — | SKU | Código de la variante. Identificador opaco (puede tener espacios o paréntesis) |
| PRODUCT_GROUP_ID | `product_group_id` | string | sí | grupo | Agrupa variantes. Slug de la ficha |
| PRODUCT_NAME | `product_name` | string | — | grupo | Título de la card y de la ficha |
| COLLECTION_ID | `collection_id` | string | sí | colección | Slug de la ficha de colección |
| COLLECTION_NAME | `collection_name` | string | — | colección | Nombre visible de la colección (breadcrumb, cards, mega menú) |
| APPLICATION | `application` | string | sí | grupo | Jardín, Bañadores, Aplicar, Pared, Embutir, Colgante. Vacío en lámparas y artefactos |
| ENVIRONMENT | `environment` | string[] | sí | grupo | Interior, Exterior o los dos (lámparas). Ver `docs/decisiones.md`, 2026-10-02 · Navegación |
| PRODUCT_TYPE | `product_type` | string | sí | grupo | Luminaria, Lámpara o Artefacto |
| COLLECTION_APPLICATIONS | `collection_applications` | string[] | — | colección | Aplicaciones de la colección (bajada del mega-link y de la card de colección) |
| IS_GROUP_DEFAULT | `is_group_default` | bool | sí | SKU | Un `true` por grupo: SKU inicial y card del grupo |
| IS_COLLECTION_DEFAULT | `is_collection_default` | bool | sí | SKU | Un `true` por colección: documento representante |
| VARIANT_ATTRIBUTES | `variant_attributes` | string[] | — | grupo | Campos de los selectores de variante, en orden |
| — | `sheet_order` | int32 | — | SKU | **Propuesto, no es una columna:** número de fila en la hoja, lo escribe la sincronización. Hace falta para "el primer SKU del grupo en el orden de la hoja" |

## Textos

| Columna en Sheets | Campo | Tipo | Nivel | Uso |
| --- | --- | --- | --- | --- |
| Descripcion | `description` | string | SKU | Resumen técnico junto a los selectores. Cambia con la variante |
| PRODUCT_STORY_TEXT | `product_story_text` | string | grupo | Ficha, sección Descripción. Markdown limitado: `##` título y `-` características |
| PRODUCT_INSPIRATION_TEXT | `product_inspiration_text` | string | grupo | Ficha, sección Inspiración |
| COLLECTION_INTRO_TEXT | `collection_intro_text` | string | colección | Ficha de colección, junto al título |
| COLLECTION_DESCRIPTION_TEXT | `collection_description_text` | string | colección | Ficha de colección, bloque texto + imagen |
| NOMBRE_ORIGEN | — | — | — | Referencia interna. No se muestra |

Los textos editoriales también van en el CMS para que estén en el HTML (`docs/decisiones.md`, 2026-10-02 · Textos editoriales).

## Imágenes y video (URLs)

| Columna en Sheets | Campo | Tipo | Nivel | Uso |
| --- | --- | --- | --- | --- |
| IMG_MAIN · IMG_MAIN_ON | `img_main` · `img_main_on` | string | SKU | Imagen principal; `_on` con Iluminar |
| IMG_AMBIENT_1 · IMG_AMBIENT_1_ON | `img_ambient_1` · `img_ambient_1_on` | string | SKU | Ambiente de la galería superior |
| IMG_PERS_1 · IMG_PERS_2 | `img_pers_1` · `img_pers_2` | string | SKU | Perspectivas (galería superior) |
| IMG_DETAIL_1 · IMG_DETAIL_2 | `img_detail_1` · `img_detail_2` | string | SKU | Detalles (galería superior) |
| IMG_FRONT · IMG_BACK · IMG_LEFT · IMG_RIGHT | `img_front` · `img_back` · `img_left` · `img_right` | string | SKU | Vistas disponibles; su uso en la galería se define en código |
| IMG_AMBIENT_2 a IMG_AMBIENT_5 | `img_ambient_2` … `img_ambient_5` | string | grupo | Galería de ambiente |
| IMG_AMBIENT_6 | `img_ambient_6` | string | grupo | Imagen junto a la Descripción |
| IMG_AMBIENT_7 | `img_ambient_7` | string | grupo | Inspiración |
| VIDEO_INSPIRATION | `video_inspiration` | string | grupo | Video opcional de Inspiración |
| IMG_COLLECTION · IMG_COLLECTION_ON | `img_collection` · `img_collection_on` | string | colección | Card del listado de Colecciones |
| COLLECTION_GALLERY_IMAGES | `collection_gallery_images` | string[] | colección | Primera galería de la ficha de colección (una URL por línea en la hoja) |
| COLLECTION_DESCRIPTION_IMAGE | `collection_description_image` | string | colección | Imagen junto a `collection_description_text` |
| COLLECTION_INSPIRATION_IMAGES | `collection_inspiration_images` | string[] | colección | Galería final de la ficha de colección |

- Campo vacío = la imagen no se muestra.
- `TODO` (orden): orden y selección de la galería superior. Propuesta del documento: main, ambient_1, pers_1, pers_2, detail_1, detail_2.

### Imágenes de product-card

Cuatro imágenes por producto (DESIGN.md §8): estudio y contexto, con la luz apagada y encendida. Diseño no definió todavía qué columna es la foto de estudio y cuál la de contexto (mismo encuadre, `ratio/portrait`).

| Imagen | Campo |
| --- | --- |
| Estudio, luz apagada | TODO |
| Contexto, luz apagada | TODO |
| Estudio, luz encendida | TODO |
| Contexto, luz encendida | TODO |

Las cards de Colecciones usan las mismas cuatro imágenes (`docs/decisiones.md`, 2026-10-02 · Cards). De dónde salen para una colección se define en la base: `TODO`.

## Descargas (URLs)

| Columna en Sheets | Campo | Tipo | Nivel | Uso |
| --- | --- | --- | --- | --- |
| IES | `ies` | string | SKU | Descarga IES |
| CAD | `cad` | string | SKU | Descarga CAD 2D/3D |
| MANUAL | `manual` | string | SKU | Descarga Manual |
| FOTOMETRIA | `fotometria` | string | SKU | Descarga Fotometría |

Si un campo está vacío, su descarga no se muestra. La ficha técnica no tiene columna: se genera en el front (`docs/decisiones.md`, 2026-10-02 · Ficha técnica en PDF).

## Características técnicas

`TODO`: el documento las nombra como rango («de Tension proveedor a Instalacion») sin listarlas. Para cada columna falta: nombre, campo, tipo (número o texto, por ejemplo «12W»), si es facet (filtro) y a qué sección del acordeón, fila de la comparativa y columna del glosario va.

## No se sincronizan

`VARIANT_CANDIDATES`, `COLLECTION_GALLERY_REFS`, `COLLECTION_DESCRIPTION_REF` y `COLLECTION_INSPIRATION_REFS` (columnas de ayuda de la hoja).

## Contrato de conversión

`TODO` (con la sincronización): checkboxes como `true` / `false` (no texto), listas (coma o una por línea) como arrays sin espacios de más, celdas vacías como campo ausente.
