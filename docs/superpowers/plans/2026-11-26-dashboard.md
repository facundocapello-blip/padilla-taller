# Dashboard de inicio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** hacer útil Inicio aun sin presupuestos guardados.
**Architecture:** helper puro dashboardStats en core; renderHome mantiene estado y reutiliza navegación existente.
**Tech Stack:** vanilla JS, localStorage, Node tests, Chromium/Playwright.
**Spec:** docs/superpowers/specs/2026-11-26-dashboard-design.md

## Global Constraints
Una sola app, Archivo/#8A2E21/tema claro; datos reales locales; no alterar fórmulas ni estándares.

## Review Focus
Filtrar no debe cambiar los índices usados para marcar estados; vacíos e importaciones no producen NaN; el historial limitado se etiqueta; accesos y borrador conservan datos; no mostrar ingresos ficticios.

- [x] Prueba RED: dashboardStats con vacío, estados mezclados y registros inválidos; portada con accesos y filtros en Chromium.
- [x] Implementar helper y portada, usando índices originales del historial y estados locales para filtrar/ver todos.
- [x] Verificar suite completa y vista móvil/escritorio; revisión de la implementación.
- [ ] Actualizar caché, publicar en Pages existente y verificar nueva portada pública.
