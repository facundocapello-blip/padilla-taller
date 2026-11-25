# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Padilla, herrero independiente. Usa la app solo, en el celular, en el taller o en la obra: recibe pedidos por Clickie, los presupuesta y después calcula cuántas barras comprar y cómo cortarlas.

## Product Purpose

Reemplazar el cuaderno de cuentas a mano. Presupuestar trabajos de herrería, pintura y del hogar (con y sin comisión de Clickie) y, en el Taller, pasar de las medidas de cada abertura a la lista de compra del corralón, el plan de corte y el stock de retazos. Éxito: menos barras compradas de más, menos cuentas a mano, presupuestos que salen rápido por WhatsApp.

## Positioning

Está hecha con el oficio de Padilla adentro: aberturas con nombre de cuaderno (PF1, PTA1), sus recetas de perfiles, cortar primero los largos, retazos que se guardan y se vuelven a usar en la próxima obra.

## Operating Context

- Celular, a veces con sol fuerte y manos sucias; uso con el pulgar.
- Pedidos que llegan por Clickie; presupuestos y planillas se mandan por WhatsApp.
- Barras de 6 m de caño estructural, planchuela, redondo; compra en corralón.
- Cuaderno cuadriculado con croquis y sumas en mm (ver `docs/superpowers/specs/2026-11-25-cuaderno/`).

## Capabilities and Constraints

- Un solo `index.html` sin build ni dependencias; PWA offline (`sw.js`, `manifest.webmanifest`).
- Datos en localStorage del dispositivo; copia de seguridad como texto `PRESU:`.
- Pantallas: Presupuestar, Taller (1. Cortes, 2. Plan y compra, 3. Retazos), Precios, Ajustes.
- Textos en castellano rioplatense simple, sin jerga.

## Brand Commitments

- El nombre "Padilla" se mantiene (confirmado). Todo lo demás del look actual se puede reemplazar.

## Evidence on Hand

- Fotos del cuaderno real en `docs/superpowers/specs/2026-11-25-cuaderno/`.
- Precios del catálogo son de referencia ("nov 2026"), no de un proveedor real.
- No hay testimonios ni clientes nombrados: no inventarlos.

## Product Principles

1. El cuaderno es la vara: si es más lento que hacerlo a mano, falló.
2. Un pulgar, una mano: lo importante se alcanza y se lee sin zoom.
3. Números en mm y barras siempre visibles y exactos; nada se redondea en silencio.
4. Habla como Padilla, no como un sistema.
