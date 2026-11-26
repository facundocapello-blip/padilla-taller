# Reparto exacto de barrotes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Barrotes y estantes con luz libre igual en todos los espacios, con marcas para el taller.
**Architecture:** Función pura `repartoLuz(W,L,t)` + tabla de grosores `espVisto(perfil)`; Presupuestar (`rejaCuts`, `calcMulti`, dibujo) y Taller (`tModelPieces`, `tModelSVG`, planilla) la usan.
**Tech Stack:** index.html vanilla, Playwright tests en `tests/taller.test.js`.
**Spec:** `docs/superpowers/specs/2026-11-26-reparto-exacto-barrotes-design.md`

## Global Constraints
- Un solo index.html; subir `CACHE` en sw.js (v4). Textos rioplatenses.
- Luz nunca supera la máxima; n mínimo que la cumple.

## Review Focus
- Ancho interior menor que la luz máx → 0 barrotes, sin error.
- Interior activado: marco = interior + 2·espesor marco.
- Portón 2 hojas: reparto por hoja.
- Perfil desconocido en tabla de grosores → 20 mm, sin romper.
- Datos guardados viejos (sep en mm, sin `medInt`) siguen funcionando.

### Task 1: `espVisto`, `repartoLuz`, catálogo
- [ ] Tests: `repartoLuz(1160,120,20)` → `{n:8,luz:111.1..}`, marcas `[111,242,373,...]`; `repartoLuz(100,120,20)` → n 0; `espVisto("redondo_916")`=14.3, `espVisto("planchuela")`=6.35, desconocido 20; catálogo `planchuela.n` contiene "1/4 x 1/4"; `cuadrado_12` existe.
- [ ] Implementar y pasar.
### Task 2: Taller
- [ ] Tests: reja 1200 ext, marco planchuela, redondo 9/16, luz 120 → barrotes qty = n de `repartoLuz(1200−12.7,120,14.3)`; con `medInt` marco H = 1200+12.7; `tMarcas(m)` devuelve la lista; rack 1800 con 4 estantes → marcas iguales.
- [ ] Implementar (pieces, SVG en posición real, línea de marcas en la tarjeta, campo "Luz máx. (mm)" + "Medida interior", planilla con marcas).
### Task 3: Presupuestar + Clickie
- [ ] Tests: ventana 120×100 caño 20 marco, redondo 9/16 luz 12 → cortes barrote qty igual a Taller; Clickie sin material → `redondo_916`; "cuadrado" → `cuadrado_12`.
- [ ] Implementar (rejaCuts, calcMulti, dibujo/pie, campo interior, default material, parser), sw v4, commit.
