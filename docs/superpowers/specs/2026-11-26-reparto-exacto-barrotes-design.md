# Reparto exacto de barrotes (y estantes)

Fecha: 2026-11-26 · Pedido por Claudio (taller de Padilla) · Estado: aprobado en conversación

## Por qué
Hoy la app reparte barrotes centro a centro sobre la medida exterior (`ceil(ancho/sep)-1`), sin descontar marco ni grosor del barrote: las puntas quedan distintas (ej. 8 cm) que el medio (12 cm). En el taller se quiere **la misma luz libre en todos los espacios**, también entre el primer/último barrote y el marco, y saber dónde marcar.

## Qué se construye
- **Regla (opción A, elegida):** el número de separación es la **luz máxima**. La app pone la menor cantidad de barrotes que no se pase y reparte parejo:
  `W = interior ? ancho : ancho − 2·marco` · `n = max(0, ceil((W − L)/(L + t)))` · `luz = (W − n·t)/(n+1)` · marca k (borde cercano, desde el filo interior del marco) = `k·luz + (k−1)·t`.
- **Medida:** por defecto exterior; interruptor "es la luz interior" (entonces el marco se corta a `interior + 2·marco`).
- **Grosores vistos de frente:** del perfil. Caño = lado menor visible (20x20→20, 40x40→40, 40x20→20, 80x40→40, 30x30→30), redondo 9/16"→14,3, redondo/cuadrado 12→12, planchuela de canto → su espesor.
- **Materiales de Padilla:** planchuela **1¼" × ¼"** (espesor 6,35 mm; el ítem `planchuela` del catálogo pasa a esa medida). Barrotes **redondo 9/16"** por defecto (Presupuestar y Clickie); si el pedido dice "cuadrado", **cuadrado 12 mm** (ítem nuevo).
- **Dónde se ve:** Presupuestar (dibujo y pie "8 barrotes · luz 11,1 cm", cantidad de barrotes del cálculo y cortes), Taller (plano 2D con barrotes en su lugar real, línea de marcas, campo "Luz máx. (mm)"), planilla de corte (marcas por abertura).
- **Estantes (Rack del Taller):** mismos espacios libres entre piso y estantes y entre estantes; marcas de altura desde el piso.

## Approaches
1. **Una sola función de reparto usada por todo (elegida):** Presupuestar, plano, cortes y planilla siempre coinciden.
2. Cálculo en cada pantalla: más rápido de tocar pero puede dar números distintos para la misma reja. Descartado.

## Decisiones del que implementa (marcadas)
- Marcas redondeadas al mm desde el valor exacto (no se acumula error).
- Precio de referencia de planchuela 1¼×¼ y cuadrado 12 mm estimados (catálogo es de referencia, editable en Precios).
- Interior + portón de 2 hojas: el reparto se hace por hoja.
