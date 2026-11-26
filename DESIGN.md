---
name: Padilla
description: Presupuestos y taller de un herrero, con cara de etiqueta técnica de lata de antióxido.
colors:
  bg: "#E2E5E6"
  surface: "#EEF0F1"
  card: "#FFFFFF"
  ink: "#17191A"
  muted: "#545B60"
  conv: "#4D5458"
  line: "#CBD0D2"
  line-strong: "#9AA1A5"
  band: "#8A2E21"
  on-band: "#FFF4F0"
  on-band-mute: "#F2CFC7"
  accent: "#8A2E21"
  accent-dark: "#5E1D14"
  accent-soft: "#F6E4E0"
  accent-ink: "#FFFFFF"
  slab: "#17191A"
  slab-soft: "#2A2F32"
  on-slab: "#F4F5F6"
  wa: "#15803D"
  good: "#166534"
  good-bg: "#DCEFE2"
  warn: "#7A4E00"
  warn-bg: "#FBEFC9"
  err: "#B42318"
  err-bg: "#FDE3E0"
  dark-bg: "#111315"
  dark-surface: "#1A1D1F"
  dark-card: "#202426"
  dark-ink: "#EDEFF0"
  dark-muted: "#A2AAAF"
  dark-line: "#33393C"
  dark-line-strong: "#4A5256"
  dark-band: "#7A281C"
  dark-accent: "#E0664C"
  dark-accent-ink: "#1A0906"
  dark-slab: "#0B0C0D"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 110"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 850
    lineHeight: 1.2
    letterSpacing: "0.015em"
    fontVariation: "'wdth' 82"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    lineHeight: 1.2
    fontVariation: "'wdth' 88"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.38
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 750
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 92"
  data:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 850
    lineHeight: 1.1
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 82"
  total:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 900
    lineHeight: 1.05
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 82"
rounded:
  panel: "6px"
  control: "8px"
  field: "10px"
  pill: "999px"
spacing:
  hair: "4px"
  tight: "6px"
  base: "8px"
  stack: "10px"
  gutter: "12px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "42px"
  button-ghost:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "42px"
  button-wa:
    backgroundColor: "{colors.wa}"
    textColor: "{colors.card}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "42px"
  header-band:
    backgroundColor: "{colors.band}"
    textColor: "{colors.on-band}"
    typography: "{typography.display}"
    padding: "16px 14px 14px"
  panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "12px"
  step-chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    height: "38px"
  step-chip-active:
    backgroundColor: "{colors.band}"
    textColor: "{colors.on-band}"
    rounded: "{rounded.control}"
    height: "38px"
  option-pressed:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "8px 10px"
  total-slab:
    backgroundColor: "{colors.slab}"
    textColor: "{colors.on-slab}"
    typography: "{typography.total}"
    padding: "9px 12px"
  nav-item-active:
    backgroundColor: "{colors.card}"
    textColor: "{colors.accent}"
    height: "46px"
---

# Design System: Padilla

## Overview

**Creative North Star: "La etiqueta de la lata de antióxido"**

Cada pantalla se lee como la etiqueta técnica de una lata de convertidor: arriba, una banda de rojo óxido a sangre con el nombre de la pantalla en mayúsculas anchas; abajo, sobre un fondo gris convertidor, paneles blancos limpios, sin bordes ni reglas; la regla negra gruesa queda solo para la ficha técnica de cada perfil en el Plan de corte. La ficha técnica manda: barras, kilos, pesos y sobra se leen de un vistazo, en números angostos y tabulares.

Es una herramienta de taller para el celular, con sol fuerte y un pulgar. Por eso la densidad es alta pero ordenada (gutter de 12 px, separaciones de 6 a 10 px), los controles miden 38 a 46 px de alto y el contraste es de imprenta: casi negro sobre blanco, blanco sobre óxido. Una sola familia tipográfica (Archivo, variable en ancho) hace todo el trabajo: se ensancha para el título de la banda y se angosta para tablas y números.

El mundo reemplaza a "Taller Táctil": nada de panel gris con acento naranja ni de tarjetas con relieve de juguete (borde inferior duro desplazado). La profundidad es una sombra corta y suave; la estructura la dan las reglas, no los bordes.

**Key Characteristics:**
- Banda de encabezado en rojo óxido a sangre, una por pantalla.
- Paneles blancos sin borde ni regla, radio 10 px, sombra corta y suave. La regla de 4 px queda solo en la ficha técnica por perfil.
- Archivo variable: ancha (110 %) en el título, angosta (80 a 88 %) en datos y títulos de panel.
- Números siempre tabulares; totales en una losa casi negra fija abajo.
- Sombra corta y suave; ninguna sombra dura desplazada.
- Siempre clara (pedido de Padilla: se lee mejor al sol). No sigue el modo oscuro del celular; los tokens `dark-*` quedan sin uso.

## Colors

Una paleta de etiqueta industrial: un solo color con voz (rojo óxido), grises de convertidor y tinta casi negra; los verdes, ámbares y rojos de estado sólo aparecen cuando hay algo que avisar.

### Primary
- **Rojo Óxido** (`band` / `accent`): la banda de encabezado de cada pantalla, el paso activo, el botón principal, la opción elegida, el ítem activo de la navegación y el dato "caliente" de la ficha técnica (la sobra). En oscuro, la banda baja a Óxido Quemado (`dark-band`) y el acento sube a Óxido Encendido (`dark-accent`) para que se lea sobre gris carbón.
- **Óxido Hondo** (`accent-dark`): borde del botón principal y tinte de su sombra corta.
- **Óxido Lavado** (`accent-soft`): fondo de estados suaves del acento (ángulo activo, chips tenues).
- **Blanco de Banda** (`on-band`) y **Rosa de Banda** (`on-band-mute`): título y subtítulo sobre la banda.

### Secondary
- **Verde WhatsApp** (`wa`): sólo el botón de enviar por WhatsApp. No se usa como acento general.

### Neutral
- **Gris Convertidor Claro** (`bg`): fondo de toda la app.
- **Gris Imprimación** (`surface`): interior de campos, pistas de controles segmentados y pie de panel.
- **Blanco Etiqueta** (`card`): paneles, tarjetas de trabajo, botones fantasma.
- **Tinta de Etiqueta** (`ink`): texto principal y la regla de 4 px de la ficha técnica.
- **Gris Leyenda** (`muted`): subtítulos, unidades, rótulos de campo.
- **Gris Convertidor** (`conv`): piezas de barra en el gráfico de corte (alterna con `ink`).
- **Hilo** (`line`) y **Hilo Marcado** (`line-strong`): divisores finos de la ficha técnica y bordes de campos y controles.
- **Losa** (`slab`, `slab-soft`, `on-slab`): barra fija de total y tarjeta de total.

### Estados
- **Bien** (`good` sobre `good-bg`), **Ojo** (`warn` sobre `warn-bg`), **Error** (`err` sobre `err-bg`): avisos, retazos guardados, precios de ejemplo, campos inválidos.

### Named Rules
**The Banda a Sangre Rule.** El rojo óxido a sangre vive en una sola franja por pantalla: la banda de encabezado, de borde a borde, con margen negativo sobre el gutter. No se repite como fondo de paneles ni de secciones.

**The Un Solo Óxido Rule.** Dentro del contenido, el óxido marca sólo lo que está elegido, lo que es la acción principal o el dato que hay que mirar (sobra). Si todo es óxido, nada es óxido.

**The Divergencia Rule.** El contrato pedía `#4D5458` para lo secundario; el build usa `muted` para texto y deja `conv` para el gráfico de barras. Manda el build.

## Typography

**Display Font:** Archivo (con system-ui, -apple-system, Segoe UI, Roboto, Arial)
**Body Font:** Archivo (misma familia)
**Label/Mono Font:** Archivo angosta con cifras tabulares (no hay monoespaciada)

**Character:** Una sola familia variable que actúa de dos maneras, como en una etiqueta impresa: ancha y pesada en mayúsculas para nombrar, angosta y apretada para medir. El eje de ancho (62 % a 125 %, archivo propio `archivo.woff2`) es la herramienta principal de jerarquía, junto con el peso.

### Hierarchy
- **Display** (900, 19 px, interlínea 1.05, ancho 110 %, mayúsculas): sólo el título de la banda de encabezado.
- **Headline** (850, 16.5 px, ancho 82 %, mayúsculas): títulos de panel ("PLAN DE CORTE", "MODELO VISUAL 2D"). La cabecera de perfil en la ficha técnica sube a 900 y ancho 80 %.
- **Title** (800, 14 px, ancho 88 %): subtítulos dentro de panel; nombres de trabajo en la grilla, en mayúsculas con 850.
- **Body** (500, 15 px, interlínea 1.38): texto corrido y ayudas. Subtítulos de banda y `small` a 12.5 px, ancho 92 a 95 %.
- **Label** (750, 11.5 px, espaciado .06em, mayúsculas, ancho 92 %): rótulos de campo y de sección. En la ficha técnica y la barra fija baja a 10.5 px con .07em.
- **Data** (850, 18 px, ancho 82 %, tabular): cifras de la ficha técnica. Los visores de stepper usan 900, 18 px, ancho 85 %.
- **Total** (900, 21 px, ancho 82 %, tabular): total en la barra fija; en la tarjeta de total sube a 28 px.

### Named Rules
**The Ancho y Angosto Rule.** Ancho por encima de 100 % sólo en el título de la banda. Todo lo que es número, medida, código de pieza o texto dentro de gráficos va angosto (80 %) y con cifras tabulares.

**The Mayúscula que Nombra Rule.** Las mayúsculas nombran (pantalla, panel, trabajo, rótulo); nunca van en texto corrido ni en botones.

## Layout

Una columna de 600 px como máximo, centrada, con gutter de 12 px y separación vertical de 10 px entre bloques; el fondo de la página reserva abajo lugar para la navegación fija (102 px más el área segura). El orden de cada pantalla es fijo: banda de encabezado, controles de paso (segmentos de 2 o 3 en grilla de columnas iguales, 6 px de separación), paneles-etiqueta y, en pantallas con total, una losa fija entre el contenido y la navegación.

El ritmo de espacios sale de 4, 6, 8, 10 y 12 px; los paneles rellenan a 12 px y sus cabeceras y pies a 10 × 12 px. La grilla de trabajos es de 2 columnas y pasa a 3 desde 540 px; los campos pares pasan a 2 columnas desde 460 px. En escritorio la app sigue siendo una columna de celular centrada.

## Elevation & Depth

Sistema casi plano. La estructura la dan los hilos y el contraste entre fondo gris y panel blanco; la sombra es corta, suave y sólo despega el panel del fondo. Al tocar, un control baja 1 px y pierde la sombra.

### Shadow Vocabulary
- **Apenas** (`--shadow`: `0 1px 2px rgba(23,25,26,.1)`): chips de paso inactivos, controles chicos.
- **Despegue** (`--lift`: `0 1px 2px rgba(23,25,26,.08), 0 4px 10px -6px rgba(23,25,26,.18)`): paneles, tarjetas de trabajo, ítems.
- **Botón óxido** (`0 1px 2px rgba(94,29,20,.35)`): botón principal y el + del stepper.
- **Losa** (`0 -6px 16px -8px rgba(0,0,0,.4)`): barra fija de total sobre el contenido.

### Named Rules
**The Sombra Corta Rule.** Ninguna sombra desplazada y sin difuminar ("relieve de juguete"). Si una sombra tiene radio de desenfoque cero, está mal.

## Shapes

Esquinas apenas redondeadas, de chapa cortada: 6 px en paneles y tarjetas, 8 px en botones y chips de paso, 10 px en campos y pistas de segmento, 999 px sólo en píldoras (insignias, chips de acción en la banda, interruptores). Los paneles no tienen borde perimetral: sólo una regla de 4 px arriba (3 px en ítems de lista). La ficha técnica se arma con hilos de 1 px, sin cajas.

## Components

### Header Band
- **Carácter:** la etiqueta de la lata; dice dónde estás.
- **Forma:** a sangre (margen negativo de 12 px a los costados y arriba), relleno 16 × 14 × 14 px, sin radio.
- **Contenido:** título Display en `on-band`, subtítulo de contexto en `on-band-mute`. Los chips y la flecha de volver van translúcidos en blanco (fondo 12 a 14 %, borde 28 %), sin sombra.

### Buttons
- **Forma:** 8 px de radio, 42 px de alto (34 px en `sm`), 800 de peso, ancho 95 %.
- **Principal:** fondo `accent`, texto `accent-ink`, borde `accent-dark`, sombra Botón óxido.
- **Fantasma:** fondo `card`, borde 1.5 px `line-strong`, sin sombra.
- **WhatsApp:** fondo `wa`, texto blanco, sin sombra.
- **Al tocar:** baja 1 px. Foco: contorno 2 px `accent` separado 2 px.

### Chips (pasos y opciones)
- **Pasos:** chips en grilla, fondo `card`, texto `muted`, 38 px de alto, ancho 86 %; el activo va en `band` con texto `on-band`, sin sombra.
- **Opciones y preajustes:** fondo `surface`, borde `line-strong`; elegido en `accent` lleno.
- **Segmentos dentro de pista** (Auto/Claro/Oscuro): pista `surface` de 10 px de radio; el elegido va en `card`.

### Cards / Containers
- **Corner Style:** 6 px.
- **Background:** `card`.
- **Shadow Strategy:** Despegue.
- **Border:** sólo regla superior de 4 px en `ink`; en paneles abiertos, el total y el destacado, la regla pasa a `band`; en ítems en carrito, a `accent`.
- **Internal Padding:** 12 px; cabecera y pie 10 × 12 px con hilo de 1.5 px.

### Inputs / Fields
- **Style:** fondo `surface`, borde 1.5 px `line-strong`, 10 px de radio, 600 de peso.
- **Stepper:** visor a la izquierda con el número en 900 angosto y la unidad en `muted`; − fantasma con borde `ink` y + en óxido, agrupados a la derecha para el pulgar.
- **Focus:** contorno 2 px `accent`; cursor y controles nativos en `accent`.
- **Error:** borde `err` y fondo `err-bg`, mensaje en `err` 12.5 px.

### Navigation
- **Style:** barra fija abajo en `card`, hilo superior `line`, 4 columnas iguales, ítems de 46 px con ícono de trazo de 20 px y rótulo 11.5 px ancho 92 %.
- **Activo:** texto y trazo en `accent`, peso 850 y trazo 2.2, sin fondo.

### Ficha técnica (firma)
La franja por perfil del Plan de corte: cabecera con regla de 4 px `ink` y el nombre del perfil en mayúsculas angostas 900; debajo, cuatro columnas iguales (BARRAS · KILOS · PESOS · SOBRA) separadas por hilos de 1 px, con rótulo Label 10.5 px y cifra Data. La sobra va en `accent`. Debajo, cada barra se dibuja como piezas alternadas `conv` / `ink` con medidas angostas en blanco.

### Losa de total
Barra fija sobre la navegación, fondo `slab`, rótulo Label en gris claro, total en Total y la acción principal a la derecha. Es el único bloque oscuro en modo claro.

## Do's and Don'ts

### Do:
- **Do** abrir cada pantalla con la banda de rojo óxido a sangre y el título en mayúsculas anchas (900, ancho 110 %).
- **Do** armar paneles blancos sin borde, con regla superior de 4 px en `ink` y 6 px de radio.
- **Do** escribir toda cifra, medida y código de pieza en Archivo angosta (80 a 85 %) con cifras tabulares.
- **Do** reservar el óxido para lo elegido, la acción principal y el dato a mirar.
- **Do** usar sólo las sombras `--shadow` y `--lift` (y la del botón óxido); al tocar, bajar 1 px.
- **Do** mantener controles de 38 a 46 px de alto, al alcance del pulgar.

### Don't:
- **Don't** volver al relieve de juguete: nada de sombras duras desplazadas sin desenfoque bajo botones, chips o tarjetas.
- **Don't** poner bordes perimetrales a los paneles ni radios de 12 a 16 px.
- **Don't** usar el óxido como fondo de paneles o secciones fuera de la banda.
- **Don't** sumar una segunda familia tipográfica ni una monoespaciada: el ancho de Archivo hace ese trabajo.
- **Don't** usar el verde WhatsApp ni los colores de estado como acento decorativo.


## Menos información (2026-11-26)

Pedido de Padilla: "que no haya tanta información" y que sea más intuitiva.
- Inicio: título "Padilla", una pregunta ("¿Qué trabajo vas a presupuestar?") y los trabajos como lista de un solo panel (ícono, nombre, pista corta). Sin filtro de rubros (está en Ajustes), sin chip de tarifa, "Pegar pedido de Clickie" como un renglón debajo.
- Presupuesto: pasos cortos ("Medidas · Materiales · Precio"); el aviso de Clickie solo en el paso 1; en Precio, el desglose, mercado y kilos van dentro de "Cómo se arma el precio"; copiar y WhatsApp viven solo en la barra fija.
- Taller: título "Taller"; sin chips de piezas (el plano ya las rotula); "Agregar cortes a mano" plegado; plano plegado en Plan y compra; bajo cada barra solo "Sobra N mm"; la planilla se manda por WhatsApp y el texto completo queda plegado.
- Encabezados de sección en minúscula normal; mayúsculas solo en la banda y en la ficha técnica.
