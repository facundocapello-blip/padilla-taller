# Taller: recetas propias, aberturas del frente y stock de retazos que se actualiza solo

Fecha: 2026-11-25 · Estado: **pendiente de aprobación**

## Por qué

Padilla (herrero, recibe pedidos por Clickie) hoy calcula a mano en un cuaderno: dibuja el croquis del frente,
separa cada abertura (PF1, PF2 = paños fijos; PTA1, PTA2 = puertas), suma milímetros por perfil
(80x40, 40x20, 50x50, planchuela 1¼ × ⅛) y divide por 6 m para saber cuántas barras comprar.
Ver `2026-11-25-cuaderno/cuentas-por-perfil.jpg` y `2026-11-25-cuaderno/croquis-frente.jpg`.

En un audio (22/11) pidió, con sus palabras:
- "Siempre uso los mismos materiales": rejas con planchuela y redondo 9/16; puerta reja con bastidor de caño 40x40.
- Cortar primero los largos y con los sobrantes los chicos (para aprovechar la barra de 6 m).
- Que los sobrantes se guarden en una base ("que haga el stock") y que en el próximo pedido la app avise que los tiene.
- Ver el plano de forma visual con medidas y ángulos de corte, y una planilla de cortes para armar.

El módulo Taller (`index.html`, funciones `t*`, estado `T` en localStorage `presu_taller`) ya resuelve:
optimizador mayor-a-menor por perfil (`tPack`/`tPackOne`), uso de retazos antes que barras nuevas (`tPlan`),
plano 2D (`tModelSVG`), planilla imprimible (`tPrintHTML`), cortes a 45°, multi-abertura (`T.models`).

## Lo que falta (alcance de este trabajo)

1. **Recetas propias por tipo de abertura.** Hoy `T_MODEL_DEF` arranca con `pMarco:"cano_4040", pInt:"cano_2020",
   pExtra:"planchuela"` para todo tipo, y `T_MODELS` (línea ~3450) tiene reja / portón / marco / mesa / rack.
   - Agregar tipos **"Paño fijo"** y **"Puerta"** a `T_MODELS`, con su despiece en `tModelPieces`
     (paño fijo: marco + barrotes/parantes interiores + travesaños; puerta: bastidor + interior + travesaños; ancho×alto).
   - Cada tipo guarda **qué perfil va en cada rol** (marco/bastidor, interior, extra). Valores iniciales:
     - Reja: marco planchuela 1¼ × ⅛, barrotes redondo 9/16 (`redondo_916`).
     - Puerta reja: bastidor caño 40x40, interior redondo 9/16, extra planchuela.
     - Paño fijo y puerta de frente: marco 80x40, interior 40x20, extra planchuela (según el cuaderno).
   - Cuando él cambia un perfil de un rol, la app ofrece "Guardar como mi receta para <tipo>" y desde ahí
     todo modelo nuevo de ese tipo arranca así. Recetas en `T.recetas` (persisten con `saveT`, entran en el backup).
2. **Stock de retazos que se actualiza solo.**
   - Nuevo botón en el Plan de corte: **"Terminé de cortar"**. Al tocarlo:
     - Quita de `T.retazos` los retazos que el plan usó (`g.retUsed`). Hoy nunca se descuentan (bug: el stock miente).
     - Ofrece guardar de una todos los sobrantes ≥ `T.minSob` de las barras nuevas (lista con tildes, todas marcadas),
       en vez del "+ Retazo" uno por uno.
     - Guarda la obra en `T.obras` si no estaba.
   - Al cargar un pedido nuevo, si el plan usa retazos, el resumen lo dice claro: "Usás 2 retazos que ya tenés: 80x40 de 4000 mm…".
3. **Prueba con el trabajo real del cuaderno.** Cargar PF1 (2640×1530), PF2 (1160×1530), PTA1 (puerta ~1300×2400)
   con sus perfiles y comparar barras por perfil contra las cuentas a mano de la foto. La app debe dar igual o menos barras.

## Fuera de alcance (después)

- B: pasar directo del texto de Clickie a las aberturas del Taller (necesita las recetas de este trabajo).
- C: seguimiento post-aceptación (seña, agenda, cobros) y guardado fuera del celular.
- Historial limitado a 30, precios fijos "nov 2026": anotados, no se tocan acá.

## Enfoques considerados

- **A (elegido): mejorar el Taller con recetas + stock automático.** Es lo que pidió en el audio y reemplaza el cuaderno.
- B: Clickie → cortes automático. Más cómodo pero sin recetas calcularía con perfiles equivocados.
- C: post-aceptación. Útil, no lo pidió.

## Restricciones

- Todo sigue en un solo `index.html` sin build ni dependencias; PWA offline (subir versión de `CACHE` en `sw.js`).
- Celular primero, textos en castellano rioplatense simple, sin jerga.
- No romper datos guardados: migrar `T` con valores por defecto como ya se hace (`T={...T_DEF,...}`).
- Backup/restore (línea ~3072) debe incluir `T.recetas`.

## Decisiones dejadas al que implementa

- Despiece exacto de paño fijo y puerta (descuentos de marco, separación de barrotes), siguiendo el estilo de `tModelPieces`.
- Dónde se editan las recetas (dentro del modelo, o una sección "Mis recetas" en Ajustes del Taller).
- Si "Terminé de cortar" también marca todas las piezas como hechas (`T.done`).

## Pendiente de Padilla (no bloquea)

Confirmar qué perfil va en cada parte de PF y PTA. Los valores iniciales son editables, así que se puede avanzar.
