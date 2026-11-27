# Mejoras Padilla Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** completar lo definido del taller y simplificar el presupuesto sin perder datos.
**Architecture:** extender funciones puras dentro del script core; UI y persistencia en el segundo script. Mantener un HTML.
**Tech Stack:** vanilla JS, Node test runner, Chromium/Playwright existentes.
**Spec:** docs/superpowers/specs/2026-11-26-mejoras-padilla-design.md

## Global Constraints
- Misma app; Archivo, #8A2E21, tema claro; medidas en mm.
- Precios sin referencia: est:true y pendientes hasta ingresar precio propio.
- No inventar estándares B/D ni publicar/configurar entorno.
- Preservar cambios anteriores y trabajar en checkout aislado existente /workspace/padilla-taller, branch work.

## Review Focus
- Copia inválida o fallo de disco no debe perder datos existentes (tarea3).
- Materiales pendientes agregados manualmente deben advertirse al compartir (tarea1/2).
- Cortes y compra deben coincidir para varias aberturas/perfiles y uso explícito de retazos (tarea1).
- Cambiar perfiles no cambia el estándar ni migra dos veces mm (tarea2).
- Dibujo y entrada de datos no desbordan a 390px ni con zoom (tarea2/4).

### Task 1: materiales y geometría compartida
Files: index.html; tests/mejoras.test.cjs; tests/riel.test.cjs.
Interfaces: jobCuts(jobId,inputs,extraItems) -> cuts[]; barPurchases(cuts,barra=6000,disco=3,retazos=[]) -> {key:quantity}; pendientes(res)->prices/standards summary.
- [x] Escribir y ejecutar fallos para zócalo/Roma, compra por cortes, puertitas y estimados de extras.
- [x] Implementar cortes/compra compartidos, advertencias de estándares, herrajes nuevos con precio 0 estimado y mensajes de precio orientativo.
- [x] Ejecutar node --test tests/*.test.cjs y validar casos variados; actualizar expectativas solo para cambios calculados y documentados.

### Task 2: flujo móvil y claridad
Files: index.html; tests/mejoras.browser.cjs.
Interfaces: go('selector'), pending banner action, jobCuts transfer -> T.cuts.
- [x] Escribir y ejecutar comprobaciones de recorrido Nuevo/selector/medidas, perfiles plegados, dibujo y acceso a precios pendientes.
- [x] Implementar inicio/selector/3 pasos, resumen de pendientes, transferencia de puertitas y modelos de corredizo consistentes.
- [x] Verificar móvil/escritorio en Chromium, precio propio y aislamiento de perfiles; suite núcleo verde.

### Task 3: respaldo y persistencia
Files: index.html; tests/mejoras.test.cjs; tests/mejoras.browser.cjs.
Interfaces: validateBackup(data) -> normalizedData o Error; restoreBackup(data) -> success sin mutación parcial.
- [x] Pruebas fallidas para JSON válido/antiguo, formas inválidas y claves peligrosas; fallo de localStorage con rollback.
- [x] Implementar descarga/importación versionadas, fecha, borrador, texto legado y aviso de guardado fallido.
- [x] Verificar descarga e importación real, cancelación, confirmación y rechazo de copia malformada.

### Task 4: validación y revisión
Files: docs/validacion-mejoras.md; docs/superpowers/progreso-mejoras.md.
- [x] Ejecutar todas las pruebas de núcleo y navegador, revisión visual agrupada móvil/escritorio.
- [x] Calcular un caso por trabajo y variantes; registrar totales, bisagras, cerraduras, pasadores y barras, indicando pendientes.
- [x] Revisión independiente de cambios y corrección de defectos importantes con pruebas.
- [x] Entregar archivos y reporte, sin publicación.
