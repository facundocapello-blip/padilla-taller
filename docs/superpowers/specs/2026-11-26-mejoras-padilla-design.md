# Mejoras de Padilla

Autorización: el usuario pidió «avanzar con todo» sobre las seis mejoras propuestas. Implementación incremental en el HTML existente, sin una nueva ronda de aprobación de preferencias de interfaz. Las preguntas sobre estándares físicos B/D siguen pendientes; no se adivinan.

## Objetivo y restricciones
Una sola app, HTML + JS vanilla, localStorage, sin backend. Conservar Archivo, #8A2E21 y tema claro. Entradas de longitudes en mm. Mantener historial, migración cm/mm, perfiles por presupuesto y precios propios. No publicar ni cambiar configuración del entorno.

## Enfoque
Conservar funciones y controles existentes; compartir geometría y optimización entre presupuesto y Taller. Una reescritura o agregar framework aumenta el riesgo de perder datos y no aporta al flujo autorizado.

## Materiales y cortes
- Corredizo: zócalo 120×40×1,6; jambas y superior 40×40×1,6; relleno redondo 9/16 + planchuela; 2 ruedas quita y pon Roma120, 1 guía Roma84 y 2 rulemanes compatibles; riel editable; cerradura doble perno. Elementos nuevos sin precio conocido: valor inicial 0, est:true, pendiente; nunca inventar una cotización ni compatibilidad dimensional de rulemanes.
- La convención de encuentro de perfiles no está confirmada: conservar longitudes exteriores de corte como referencia y advertir «verificar encuentros antes de cortar». Mostrar el zócalo en dibujo; descontar su alto de la longitud interior de barrotes. Registrar la convención como pendiente, no como estándar confirmado.
- La guía es un herraje por unidad, no inventar un parante con sección/largo no proporcionados.
- Reutilizar rejaHojas para 2 hojas; conservar cálculos existentes de bastidor/bisagras mientras falten confirmaciones. Advertir pasador al piso pendiente en vez de asumir cantidad. Puertas: advertir holgura no definida; puertitas: horas estimadas hasta que el usuario confirme.
- Puertitas: generar cortes de ángulo del marco y bastidores con la geometría existente, más piezas de chapa informadas aparte. Transferir a Taller sin convertirlas en rejas.
- Para materiales de barra, comprar mediante el mismo tPack que Taller: barra6000/disco3/sin retazos por defecto. Ofrecer explícitamente en presupuesto el uso de retazos y ajustes de Taller; no arrastrarlos silenciosamente. Avisar al editar manualmente cantidades que el plan geométrico no cambia.

## Flujo y presentación
Inicio: Nuevo presupuesto, continuar borrador, recientes/frecuentes. Elegir trabajo en pantalla propia, herrería primero y otros rubros desplegables. Acceso a pegar Clickie en el selector. Precios de obra queda en Precios.
Tres pasos: Medidas y dibujo, Revisar materiales/horas, Compartir. Dibujo grande antes de opciones secundarias. Perfiles bajo «Cambiar perfiles», estándar visible y restaurable. Ancho/alto siempre visibles. Conservar extras y múltiples aberturas.
Resumen persistente: estimado si faltan precios (con contador y enlace al primer precio pendiente) o estándares. Mantener estados pendientes tanto en mensaje al cliente como en lista de compra/impresión, incluyendo materiales agregados a mano.
Presupuesto del cliente separado de desglose privado de costos, comisión y bolsillo; plan de corte legible y numerado por Taller.

## Respaldo
JSON descargable versionado con fecha; incluir configuración, precios, catálogo propio, frecuentes, historial, Taller y borrador. Importar JSON y mantener texto PRESU antiguo. Validar estructura, tipos y límites antes de confirmar reemplazo; datos inválidos nunca mutan almacenamiento. Confirmar restauración, hacer rollback ante fallo de almacenamiento y avisar en pantalla si guardar falla. Último respaldo visible. Ningún archivo importado se ejecuta.

## Verificación
Pruebas de núcleo para geometría, compra por cortes, pendientes/precio propio, mensajes y validación de respaldo. Pruebas reales con Chromium móvil/escritorio para recorrido, precios, transferencias, descarga/restauración, rollback y persistencia. Ejecutar un caso de cada JOB más variantes puerta/corredizo/puertitas; publicar totales y cantidades en docs/validacion-mejoras.md, distinguiendo estimaciones y pendientes.
