# Planes de animación

Planes escritos con el skill improve-animations (auditoría de Contacto y Descargas, 2026-10-15). Cada plan es autocontenido: dice qué cambiar, con el código actual y los valores exactos, y cómo comprobarlo. Se ejecutan en una rama por plan (o juntos 001 y 002) y, al terminar, se marca el estado acá y en el plan.

| # | Plan | Severidad | Estado |
| --- | --- | --- | --- |
| 001 | [Con reduced motion, filter-panel y download-modal funden](001-paneles-fundido-reduced-motion.md) | MEDIUM | DONE |
| 002 | [Con reduced motion, el fundido de los desplegables y de la primera carga se queda](002-fundidos-base-reduced-motion.md) | LOW | DONE |
| 003 | [Token `motion/duration/panel` en lugar de `slow × 1,25`](003-token-motion-duration-panel.md) | LOW | DONE |
| 004 | [«Copiado» del sku con un fundido corto](004-sku-copiado-fundido.md) | LOW | DONE |

## Orden recomendado

1. **001 y 002** juntos: son la misma regla de DESIGN.md §6 (con reduced motion quedan los fundidos) y no dependen de nada.
2. **003**: necesita cambiar una variable en Figma. Si se hace antes que 001, el plan 001 sigue valiendo igual (usa `--panel-slow`, que 003 solo redefine).
3. **004**: independiente; es una mejora chica.

## Lo que la auditoría dejó como está

- Sin `ease-in`, sin `transition: all`, sin `scale(0)` y sin keyframes en UI que se dispara seguido.
- Menú de input Select, form-message, error de input y faq-item: ya siguen DESIGN.md §6 (aprobados el 2026-10-15).
- El mega-menú anima el alto con `grid-template-rows`, como el search-sheet: está en la excepción abierta del 2026-10-14 («revisar si se adopta o se cambia a transform»). Es una decisión de diseño, no un plan.
- Escala al apretar botones y chips, animar el «N productos» y escalonar filas de la tabla: descartados (decisiones.md, 2026-10-15).
