@AGENTS.md
@DESIGN.md

# Notas para Claude Code

Las reglas del proyecto están en AGENTS.md y el sistema de diseño en DESIGN.md (importados arriba). Este archivo solo suma lo específico de Claude.

## Figma por MCP

- Archivo: `djAb2r3otXYOjEJjHiuKnF` (Macroled-ARQ). Los node ids de cada componente están en el Anexo A de DESIGN.md.
- Antes de construir un componente, leer su set con el MCP (`get_design_context` sobre el node id), revisar sus variables (`get_variable_defs`), leer su descripción (copiada en `docs/components.md`) y su ficha `doc/<nombre>` en la página Documentación.
- El código que devuelve el MCP es una referencia: se adapta a Web Components con Shadow DOM y a los tokens `--arq-*`. Nunca copiar valores en px o hex del código generado.
- Leer solo las páginas Componentes, Final, Tokens, Documentación y Plan del proyecto. No usar baja / media ni los frames Registro · ….
- No modificar el archivo de Figma desde una tarea de código salvo que la tarea lo pida.

## Antes de terminar una tarea

- Correr `npm run build` y abrir la demo (`npm run dev`) sin errores en consola.
- Revisar el componente en Light/Dark y Desktop/Mobile.
- Si algo quedó con `TODO` (token, estilo o dato faltante), listarlo en el mensaje final.
