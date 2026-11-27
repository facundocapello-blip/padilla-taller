# SDD ledger — plan: docs/superpowers/plans/2026-11-26-mejoras-padilla.md

Baseline: branch work, checkout cloud aislado existente. Cambios previos: index.html, archivo.woff2, tests/riel.test.cjs y docs/validacion-riel.md; preservar.
Autorización: avanzar con todo, ejecución inline, sin pedir nuevas preferencias visuales. B/D consultados por herramienta async.
Pre-flight: tareas1/2 comparten jobCuts y cálculo de pendientes; tarea3 reutiliza estado completo y LS; tarea4 verifica todo. No conflictos.
Ruling: utilidades de skill no están instaladas localmente; se mantiene este ledger y se ejecutan comandos equivalentes directamente.

Task 1: complete — core tests RED→GREEN; geometría/Roma/puertitas/compra/pendientes verificados.
Task 2: complete — Chromium 390×844 y 1440×1000, selector, dibujo, perfiles, mm y transferencia.
Task 3: complete — copia JSON/texto legado, validación, cancelación, rollback y fallo persistente.
Task 4: complete — 15/15 pruebas Node y ambos recorridos Chromium; reporte de 18 casos calculado.
Final review: independiente por /root/review; 6 hallazgos reproducidos, corregidos y con regresiones verdes.
Final: fixed P1 importación ejecutable — validación de opciones/perfiles/IDs y escape, RED→GREEN.
Final: fixed P1 compra de piezas mayores que barra — cálculo por pieza compartido, RED→GREEN.
Final: fixed P1 precios sin fuente segura — catálogo pendiente hasta precio propio y mensaje estimado, RED→GREEN.
Final: fixed P2 referencia de obra incorrecta — limpiar/restaurar sourceQuote junto a cortes, RED→GREEN.
Final: fixed P2 pendientes en exportaciones — estándares y materiales/herrajes viajan en listas e impresión, verificado.
Final: fixed P2 copia congelada tras rollback fallido — capturar cambios vivos y conservar borrador recuperable, RED→GREEN.
Verificación adicional: el HTML del ZIP no vinculaba manifest/service worker. Se restauró instalación PWA con assets existentes y caché de Archivo; prueba de recarga sin red y fuente offline RED→GREEN.
Ruling: mantener checkout/branch work y no publicar ni integrar; preferencia previa del usuario. No se crearon copias alternativas de la app ni worktrees.
Pendiente externo: cantidades del portón 2 hojas, holguras y tiempos reales de puertitas; preguntas async sin respuesta. La aplicación los identifica como pendientes. También verificar encuentros del zócalo y medida de rulemanes.
Deferred minors: ninguno de la revisión.
