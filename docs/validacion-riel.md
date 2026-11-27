# Validación del riel editable

Base: index.html y archivo.woff2 del ZIP adjunto. Modificación de esta entrega: riel de piso del portón corredizo.

Precios de catálogo, sin precios propios ni retoques de horas o cantidades. Valor hora $17.500; Clickie 15%; viaje $20.000; recargo de materiales 10%; imprevistos 5%; redondeo $1.000; sin IVA. Los importes con precios pendientes son orientativos.

| Caso | Clickie | Directo | Bisagras | Cerraduras | Pasadores | Barras de 6 m presupuestadas |
|---|---:|---:|---|---:|---:|---|
| Reja o portón · 1200×1000 mm | $343.000 | $291.000 | 0 | 0 | 0 | 2 × Planchuela 1 1/4 x 1/4; 2 × Hierro redondo 9/16" |
| Puertitas bajo parrilla · 800×600 mm | $343.000 | $291.000 | 4 | 0 | 3 | 1 × Hierro ángulo 1 x 1/8; 1 × Hierro ángulo 7/8 x 1/8 |
| Soldadura / arreglo (valores iniciales) | $130.000 | $110.000 | 0 | 0 | 0 | 0 |
| Pintar (valores iniciales) | $251.000 | $214.000 | 0 | 0 | 0 | 0 |
| Mosquitero · 1200×1000 mm | $95.000 | $81.000 | 0 | 0 | 0 | 0 |
| Bacha o canilla (valores iniciales) | $80.000 | $80.000 | 0 | 0 | 0 | 0 |
| Inodoro / depósito (valores iniciales) | $80.000 | $80.000 | 0 | 0 | 0 | 0 |
| Enchufes y luces (valores iniciales) | $80.000 | $80.000 | 0 | 0 | 0 | 0 |
| Colgar y amurar (valores iniciales) | $80.000 | $80.000 | 0 | 0 | 0 | 0 |
| Arreglo de pared (valores iniciales) | $134.000 | $114.000 | 0 | 0 | 0 | 0 |
| Otro trabajo (valores iniciales) | $80.000 | $80.000 | 0 | 0 | 0 | 0 |
| Puerta 1 hoja · 900×2000 mm | $618.000 | $525.000 | 4 | 1 | 0 | 2 × Caño estructural 40x40 (1,6 mm); 2 × Hierro redondo 9/16"; 1 × Planchuela 1 1/4 x 1/4 |
| Puerta 2 hojas, 1 fija · 900×2000 mm | $693.000 | $589.000 | 4 | 1 | 0 | 3 × Caño estructural 40x40 (1,6 mm); 2 × Hierro redondo 9/16"; 1 × Planchuela 1 1/4 x 1/4 |
| Puerta 2 hojas que abren · 900×2000 mm | $742.000 | $631.000 | 8 | 1 | 2 | 3 × Caño estructural 40x40 (1,6 mm); 2 × Hierro redondo 9/16"; 1 × Planchuela 1 1/4 x 1/4 |
| Corredizo · 3000×2000 mm · riel automático 6000 mm | $1.115.000 | $948.000 | 0 | 1 | 0 | 2 × Caño estructural 40x40 (1,6 mm); 8 × Hierro redondo 9/16"; 2 × Planchuela 1 1/4 x 1/4; 1 × Hierro ángulo 1 x 1/8 |
| Corredizo · 4000×2000 mm · riel manual 7500 mm, ángulo 1 1/4×1/8 | $1.432.000 | $1.218.000 | 0 | 1 | 0 | 3 × Caño estructural 40x40 (1,6 mm); 11 × Hierro redondo 9/16"; 3 × Planchuela 1 1/4 x 1/4; 2 × Hierro ángulo 1 1/4 x 1/8 |

## Comprobaciones

- 6 pruebas automatizadas con Node: riel estándar, largo y perfil propios, geometría interior, metrajes mayores de 6 m, cantidad real de barras, precio propio y regresión de los 11 trabajos.
- Chromium en pantalla de 390×844: largo automático, edición manual, cambio y restauración de perfil, transferencia a Taller, guardado tras recarga y normalización del precio pendiente; sin errores de JavaScript.
- El plan del riel manual de 7500 mm conserva 6000 + 1500 mm. Los tramos se unen en obra; no se pierde el excedente.

## Alcance pendiente

El portón corredizo todavía conserva el resto del cálculo anterior: faltan el zócalo 120×40×1,6, las ruedas Roma 120 y la guía Roma art. 84 con sus dos rulemanes. Estos totales NO validan aún el estándar completo del punto A.

También quedan pendientes B, C y las confirmaciones D del pedido. Las barras de los demás perfiles conservan el cálculo de compra existente (metraje más 10%); Taller puede dar otra cantidad por la distribución de cortes, disco y retazos configurados. Para el riel se usa el optimizador de Taller con barra de 6000 mm, disco de 3 mm y sin descontar retazos.
