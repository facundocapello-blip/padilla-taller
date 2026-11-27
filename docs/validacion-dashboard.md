# Dashboard, planos y navegación

Cambios sobre la misma app: resumen de guardados/aceptados/sin respuesta/rechazados, filtros y accesos a Taller, precios, Clickie y respaldos. Se usan registros locales reales; no se inventan ingresos ni se agregan datos de demostración a la aplicación. El historial conserva hasta 30 registros.

Taller usa hasta 1200 px de ancho y los planos mantienen su proporción sin el límite anterior de 245/340 px. Las medidas verticales se rotan para no recortarse. La navegación inferior permanece disponible dentro de presupuestos nuevos y anteriores; la barra del precio se ubica encima y ajusta su posición a la altura real de navegación.

Pruebas ejecutadas:
- 17 pruebas Node aprobadas, incluidas las fórmulas y los totales anteriores.
- Dashboard en Chromium a 390×844 y 1440×1000: vacío, estados combinados, filtros con índices originales, marcado, ver todos, persistencia y accesos rápidos.
- Foco de teclado preservado y cambios de resultados anunciados.
- Reapertura de historial con navegación visible y sin superposición de barras.
- Planos usando el ancho del contenedor, proporción conservada y cotas dentro del SVG.
- Suite anterior completa de presupuesto, cortes, respaldo y funcionamiento sin conexión, en ambas resoluciones.
- Revisión independiente: hallazgo de foco corregido con regresión; navegación/planos sin incidencias significativas restantes.

Los cálculos, precios y cantidades no cambiaron en esta entrega. Los [18 casos y sus pendientes](validacion-mejoras.md) siguen vigentes. No se confirmaron estándares físicos nuevos ni precios reales.

Comandos:
```sh
node --test tests/*.test.cjs
node tests/mejoras.browser.cjs
node tests/dashboard.browser.cjs
```
