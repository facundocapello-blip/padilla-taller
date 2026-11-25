# Taller: recetas propias y stock de retazos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que Padilla tenga recetas de perfiles por tipo de abertura (incl. Paño fijo y Puerta) y que el stock de retazos se actualice solo al tocar "Terminé de cortar".

**Architecture:** Todo en `index.html` (sin build). Lógica nueva en funciones `t*` puras y testeables (`tTypeDef`, `tLeftovers`, `tFinishCutting`, `tRetUsedText`); la UI solo las llama. Los retazos usados se identifican por `id` (hoy `tPack` solo ve largos). Tests con Playwright cargando `index.html` y evaluando las funciones globales.

**Tech Stack:** HTML/JS vanilla, localStorage (`presu_taller`), Playwright (ya instalado) para tests en `tests/taller.test.js`.

**Spec:** `docs/superpowers/specs/2026-11-25-taller-recetas-y-stock-design.md`

## Global Constraints

- Un solo `index.html`, sin build ni dependencias; PWA offline: subir `CACHE` en `sw.js` a `padilla-taller-v2`.
- Celular primero, textos en castellano rioplatense simple, sin jerga.
- No romper datos guardados: `T` se migra con `{...T_DEF,...}`; `T.recetas` debe ser objeto aunque falte o venga roto.
- Backup/restore (`taller:T`, ~línea 3072) debe incluir y normalizar `T.recetas`.
- Valores iniciales: Reja = marco `planchuela`, interior `redondo_916`; Puerta reja = bastidor `cano_4040`, interior `redondo_916`, extra `planchuela`; Paño fijo y Puerta = marco `cano_8040`, interior `cano_4020`, extra `planchuela`.
- Sobrante se guarda si `sobra >= T.minSob`.

## Review Focus

- Dos retazos del mismo perfil y largo: al terminar se quita solo el que el plan usó (por `id`), no ambos.
- Tocar "Terminé de cortar" dos veces no duplica sobrantes ni descuenta dos veces.
- Datos viejos / backup sin `recetas` (o `recetas` = array/null): no rompe, queda `{}`.
- Receta que apunta a un perfil que ya no existe en el catálogo: el modelo nuevo arranca con el valor por defecto del tipo, no con un perfil fantasma.
- Obra sin sobrantes ≥ `minSob` o sin retazos usados: "Terminé de cortar" igual funciona (sin lista vacía rota); sobrante exactamente igual a `minSob` entra.

---

### Task 1: Recetas por tipo y tipos Paño fijo / Puerta

**Files:**
- Modify: `index.html` (`T_MODEL_DEF`/`T_DEF`/migración ~3303-3315, `T_MODELS` ~3450, `tModelPieces` ~3459, `tModelSVG` rama `marco` ~3615, `tModelCardHTML` ~3692, handlers `tmtype` ~4168 y `data-tact` ~4215, restore ~3072)
- Create: `tests/taller.test.js`

**Interfaces:**
- Produces: `T.recetas: {[typeId]:{pMarco,pInt,pExtra}}`; `tTypeDef(id: string) -> object` (def del tipo + receta válida); `tRecetaDiffiere(m) -> boolean`; ids de tipo nuevos `"pano"`, `"puerta"`, `"puertareja"`.

- [ ] **Step 1: Test que falla** en `tests/taller.test.js` (helper `open()` que carga `index.html` con localStorage limpio y devuelve `page`):
  - `tModelPieces({...tTypeDef("pano"),ancho:2640,alto:1530,hojas:2})` → H `2640×2`, V `1530×2`, parante `1450×1`, todos `perfil:"cano_8040"` salvo parante `cano_4020`.
  - `tModelPieces({...tTypeDef("pano"),ancho:1160,alto:1530,hojas:1})` → solo marco: `1160×2` y `1530×2`.
  - `tModelPieces({...tTypeDef("puerta"),ancho:1300,alto:2400})` incluye marco `1300×2`, `2400×2` en `cano_8040`.
  - `tTypeDef("puertareja")` → `pMarco:"cano_4040",pInt:"redondo_916",pExtra:"planchuela"`; `tTypeDef("reja")` → `pMarco:"planchuela",pInt:"redondo_916"`.
  - Receta: tras `T.recetas.pano={pMarco:"cano_4040",pInt:"cano_2020",pExtra:"planchuela"}`, `tTypeDef("pano").pMarco==="cano_4040"`; con `pMarco:"no_existe"` cae a `"cano_8040"`.
  - Migración: con `localStorage.presu_taller` = `{"recetas":[]}` y recarga, `Array.isArray(T.recetas)===false && typeof T.recetas==="object"`.
- [ ] **Step 2:** `node tests/taller.test.js` → FAIL (`tTypeDef is not defined`).
- [ ] **Step 3: Implementar.** `T_DEF.recetas:{}` y normalización (objeto no-array) en init y en restore. `T_MODELS`: reja pasa a `pMarco:"planchuela",pInt:"redondo_916"`; agregar `pano` (ancho 1200, alto 1500, hojas 1, travesanos 1, ang "45", 8040/4020/planchuela), `puerta` (ancho 900, alto 2000, sep 300, travesanos 2, 8040/4020/planchuela) y `puertareja` (sep 120, 4040/redondo_916/planchuela), labels "Paño fijo", "Puerta", "Puerta reja". `tModelPieces`: `pano` con la misma lógica que `marco` (parantes `B-80` pInt, travesaños `A-80` pInt); `puerta`/`puertareja`: bastidor H `A×2` y V `B×2` (pM), barrotes `ceil(A/sep)-1` de `B-80` (pI), travesaños `A-80` (pE), mínimo 100 mm. `tModelSVG`: `pano` usa la rama `marco`; puertas usan la rama genérica. `tTypeDef(id)`: `{...T_MODEL_DEF,...tpl.def,type:id}` pisado por `T.recetas[id]` solo para las claves cuyo perfil exista en `tPerfiles()`. Handler `tmtype` usa `tTypeDef`. En `tModelCardHTML`: campo "Paños ancho" y etiqueta "Paños alto" también para `pano`; campo "Barrotes c/" para `puerta`/`puertareja`; dentro de "Perfiles del modelo", botón `data-tact="saverec"` "Guardar como mi receta para {tipo}" visible solo si `tRecetaDiffiere(T.model)`; `saverec` guarda `T.recetas[type]={pMarco,pInt,pExtra}` y avisa con toast "Receta guardada: los próximos {tipo} arrancan así".
- [ ] **Step 4:** `node tests/taller.test.js` → PASS.
- [ ] **Step 5: Commit** `feat(taller): recetas por tipo, paño fijo y puerta`.

---

### Task 2: Stock automático — "Terminé de cortar"

**Files:**
- Modify: `index.html` (`tPack`/`tPlan` ~3381-3416, `renderTaller` ~3863 y paso 2 ~3987-4056, handlers ~4186-4250, restore ~3072), `index.html` CSS mínimo si hace falta
- Test: `tests/taller.test.js`

**Interfaces:**
- Consumes: `T.retazos[{id,perfil,len,fromWork?}]`, `tPlan`, `tGroupBars`.
- Produces: `tPack` acepta `retazos` como números o `{id,len}` y marca cada barra de retazo con `retId`; `tLeftovers(plan, minSob) -> [{perfil,len,n}]` (solo barras nuevas, `floor(sobra)`, `sobra>=minSob`, agrupadas por perfil+len); `tFinishCutting(plan, keep: {perfil,len,n}[]) -> {usados:number, guardados:number}` (muta `T`); `tRetUsedText(plan,pmap) -> string`; `T.lastFinish={workId,usedRets:[{id,perfil,len}]}`.

- [ ] **Step 1: Tests que fallan:**
  - Plan con retazos `[{id:"a",perfil:"cano_8040",len:4000},{id:"b",perfil:"cano_8040",len:4000}]` y un corte `3900×1` → exactamente una barra con `retazo:true` y `retId` ∈ {a,b}; `tFinishCutting` deja en `T.retazos` solo el otro.
  - `tLeftovers`: barra nueva con sobra 2500 y `minSob` 300 → `[{perfil,len:2500,n:1}]`; sobra exactamente 300 entra; sobra 299 no; barras de retazo nunca.
  - `tFinishCutting(plan, tLeftovers(...))` agrega retazos con `fromWork===T.workId`, setea `T.lastFinish`, marca `T.done` de todas las barras del plan y agrega la obra a `T.obras` si no estaba (por nombre, sin duplicar si ya estaba).
  - Segunda llamada con el mismo `workId` → no hace nada (`{usados:0,guardados:0}`), `T.retazos` sin cambios.
  - Sin sobrantes ≥ `minSob` y sin retazos usados: `tFinishCutting(plan,[])` no tira error y devuelve ceros.
  - Con `T.lastFinish` activo, `renderTaller()` sigue mostrando la misma cantidad de barras (el plan no cambia tras descontar el stock).
  - `tRetUsedText` → `"Usás 2 retazos que ya tenés: …"` (plural/singular, incluye nombre del perfil y `N mm`); vacío si no se usa ninguno.
- [ ] **Step 2:** `node tests/taller.test.js` → FAIL.
- [ ] **Step 3: Implementar.** `tPlan` pasa los retazos como objetos `{id,len}`; `tPack` los normaliza (números siguen valiendo para `tTips`) y copia `retId`. `renderTaller`: `activeRets` suma `T.lastFinish.usedRets` cuando `T.lastFinish.workId===T.workId` (así el plan no cambia al descontar). `tFinishCutting` es idempotente por `workId`; no usa DOM. UI paso 2: banner `good` con `tRetUsedText` sobre "Qué comprar" (y también en paso 1 sobre el botón "Ver plan"); al final del Plan de corte, botón `data-tact="finish"` "Terminé de cortar" que abre una tarjeta inline (`S.tFin`) con la lista de `tLeftovers` (checkbox tildado, "Caño … · 2500 mm × 2"), botones "Guardar y terminar" / "Cancelar"; si ya terminó (`lastFinish.workId===workId`) muestra "✓ Obra terminada, el stock ya está al día" en vez del botón. Al confirmar: `tFinishCutting` con lo tildado, toast "Listo: quité N retazos usados y guardé M sobrantes". Decisión: sí marca `T.done`.
- [ ] **Step 4:** `node tests/taller.test.js` → PASS.
- [ ] **Step 5: Commit** `feat(taller): "Terminé de cortar" actualiza el stock de retazos`.

---

### Task 3: Prueba con el cuaderno + PWA

**Files:**
- Modify: `sw.js:1`, `README.md` (una línea sobre recetas/stock)
- Test: `tests/taller.test.js`

- [ ] **Step 1: Test** con las aberturas del cuaderno (`pano` PF1 2640×1530 `hojas:2`, `pano` PF2 1160×1530 `hojas:1`, `puerta` PTA1 1300×2400) cargadas como `T.cuts` vía `tModelPieces`: imprime barras por perfil de `tPlan` y las compara contra el cálculo a mano (suma de mm ÷ 6000, redondeado hacia arriba, por perfil con las piezas del modelo). Falla si la app da **más** de `manual + 1` barras (el manual no cuenta disco ni encastre, así que `manual` es piso teórico); el reporte final debe informar los números reales.
- [ ] **Step 2:** `node tests/taller.test.js` → PASS (o ajustar y documentar la diferencia).
- [ ] **Step 3:** `CACHE = "padilla-taller-v2"` en `sw.js`.
- [ ] **Step 4:** Revisión visual con Playwright (celular 390×844): paso 1 con Paño fijo, paso 2 con "Terminé de cortar" abierto; sin errores de consola.
- [ ] **Step 5: Commit** `test(taller): caso del cuaderno + subir cache PWA`.
