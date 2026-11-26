/* Tests del Taller. Correr: node tests/taller.test.js (usa Playwright ya instalado). */
const { chromium } = require("playwright");
const assert = require("assert");
const path = require("path");
const URL = "file://" + path.resolve(__dirname, "../index.html");

let browser, fails = 0, ran = 0;
async function open(seed) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(String(e)));
  if (seed) await page.addInitScript(s => { if (!localStorage.getItem("__seeded")) { localStorage.setItem("presu_taller", s); localStorage.setItem("__seeded", "1"); } }, JSON.stringify(seed));
  await page.goto(URL);
  page.errs = errs;
  return page;
}
async function test(name, fn) {
  ran++;
  try { await fn(); console.log("ok   ", name); }
  catch (e) { fails++; console.log("FAIL ", name, "\n     ", e.message.split("\n")[0]); }
}
const pcs = (page, m) => page.evaluate(m => tModelPieces(m).map(p => ({ k: p.key, perfil: p.perfil, len: p.len, qty: p.qty })), m);

(async () => {
  browser = await chromium.launch();

  await test("paño fijo con parante (PF1)", async () => {
    const p = await open();
    const r = await p.evaluate(() => tModelPieces({ ...tTypeDef("pano"), ancho: 2640, alto: 1530, hojas: 2 }).map(x => [x.key, x.perfil, x.len, x.qty]));
    assert.deepStrictEqual(r.filter(x => x[0].startsWith("marco")), [["marco_h", "cano_8040", 2640, 2], ["marco_v", "cano_8040", 1530, 2]]);
    assert.deepStrictEqual(r.find(x => x[0] === "par"), ["par", "cano_4020", 1450, 1]);
  });
  await test("paño fijo sin división (PF2) es solo marco", async () => {
    const p = await open();
    const r = await p.evaluate(() => tModelPieces({ ...tTypeDef("pano"), ancho: 1160, alto: 1530, hojas: 1 }).map(x => [x.key, x.len, x.qty]));
    assert.deepStrictEqual(r, [["marco_h", 1160, 2], ["marco_v", 1530, 2]]);
  });
  await test("puerta: bastidor 80x40", async () => {
    const p = await open();
    const r = await p.evaluate(() => tModelPieces({ ...tTypeDef("puerta"), ancho: 1300, alto: 2400 }).filter(x => x.key.startsWith("marco")).map(x => [x.key, x.perfil, x.len, x.qty]));
    assert.deepStrictEqual(r, [["marco_h", "cano_8040", 1300, 2], ["marco_v", "cano_8040", 2400, 2]]);
  });
  await test("recetas iniciales de reja y puerta reja", async () => {
    const p = await open();
    const r = await p.evaluate(() => [tTypeDef("puertareja"), tTypeDef("reja")].map(d => [d.pMarco, d.pInt, d.pExtra]));
    assert.deepStrictEqual(r, [["cano_4040", "redondo_916", "planchuela"], ["planchuela", "redondo_916", "planchuela"]]);
  });
  await test("receta guardada se usa; perfil inexistente cae al default", async () => {
    const p = await open();
    const r = await p.evaluate(() => {
      T.recetas.pano = { pMarco: "cano_4040", pInt: "cano_2020", pExtra: "planchuela" };
      const a = tTypeDef("pano").pMarco;
      T.recetas.pano = { pMarco: "no_existe", pInt: "cano_2020", pExtra: "planchuela" };
      return [a, tTypeDef("pano").pMarco, tTypeDef("pano").pInt];
    });
    assert.deepStrictEqual(r, ["cano_4040", "cano_8040", "cano_2020"]);
  });
  await test("datos viejos: recetas roto queda {}", async () => {
    for (const bad of [[], null, "x", undefined]) {
      const p = await open(bad === undefined ? { barra: 6000 } : { recetas: bad });
      const r = await p.evaluate(() => [typeof T.recetas, Array.isArray(T.recetas), T.recetas === null]);
      assert.deepStrictEqual(r, ["object", false, false]);
    }
  });
  await test("restore de backup normaliza recetas", async () => {
    const p = await open();
    const r = await p.evaluate(() => { T = tNormalizeT({ ...T_DEF, recetas: [1] }); return Array.isArray(T.recetas) || T.recetas === null; });
    assert.strictEqual(r, false);
  });
  await test("tRecetaDiffiere y guardar receta", async () => {
    const p = await open();
    const r = await p.evaluate(() => {
      T.model = tTypeDef("pano"); const a = tRecetaDiffiere(T.model);
      T.model.pMarco = "cano_4040"; const b = tRecetaDiffiere(T.model);
      return [a, b];
    });
    assert.deepStrictEqual(r, [false, true]);
  });

  /* ---- Task 2: stock automático ---- */
  const setup = (page, o) => page.evaluate(o => {
    T = tNormalizeT({ ...T_DEF, workId: "w1", obra: "Casa", ...o.T });
    const perf = tPerfiles(), pmap = Object.fromEntries(perf.map(p => [p.key, p]));
    S.tPmap = pmap;
    return true;
  }, o);
  const cut = (len, qty = 1, perfil = "cano_8040") => ({ id: "c" + len, perfil, parte: "", ang: "90", len, qty });

  await test("plan marca qué retazo usó (por id) y se quita solo ese", async () => {
    const p = await open();
    await setup(p, { T: { cuts: [cut(3900)], retazos: [{ id: "a", perfil: "cano_8040", len: 4000 }, { id: "b", perfil: "cano_8040", len: 4000 }] } });
    const r = await p.evaluate(() => {
      const plan = tPlan(T.cuts, T.barra, T.disco, tActiveRets());
      const used = plan[0].retUsed.map(b => b.retId);
      const res = tFinishCutting(plan, []);
      return { used, res, left: T.retazos.map(x => x.id) };
    });
    assert.strictEqual(r.used.length, 1);
    assert.strictEqual(r.res.usados, 1);
    assert.deepStrictEqual(r.left, r.used[0] === "a" ? ["b"] : ["a"]);
  });
  await test("tLeftovers: >= minSob, solo barras nuevas, agrupa", async () => {
    const p = await open();
    await setup(p, { T: { minSob: 300, cuts: [cut(3497, 2), cut(5697), cut(5698)] } });
    const r = await p.evaluate(() => tLeftovers(tPlan(T.cuts, T.barra, T.disco, []), T.minSob));
    assert.deepStrictEqual(r, [{ perfil: "cano_8040", len: 2500, n: 2 }, { perfil: "cano_8040", len: 300, n: 1 }]);
  });
  await test("tLeftovers ignora los retazos usados", async () => {
    const p = await open();
    await setup(p, { T: { cuts: [cut(3000)], retazos: [{ id: "a", perfil: "cano_8040", len: 4000 }] } });
    const r = await p.evaluate(() => tLeftovers(tPlan(T.cuts, T.barra, T.disco, tActiveRets()), 300));
    assert.deepStrictEqual(r, []);
  });
  await test("terminar: guarda sobrantes, marca hecho, guarda obra; segunda vez no hace nada", async () => {
    const p = await open();
    await setup(p, { T: { cuts: [cut(3497, 2)] } });
    const r = await p.evaluate(() => {
      const plan = tPlan(T.cuts, T.barra, T.disco, tActiveRets());
      const a = tFinishCutting(plan, tLeftovers(plan, T.minSob));
      const snap = JSON.stringify(T.retazos);
      const b = tFinishCutting(plan, tLeftovers(plan, T.minSob));
      return { a, b, same: snap === JSON.stringify(T.retazos), rets: T.retazos.map(x => [x.perfil, x.len, x.fromWork]), done: Object.keys(T.done).length, obras: T.obras.map(o => o.obra), lf: T.lastFinish.workId };
    });
    assert.deepStrictEqual(r.a, { usados: 0, guardados: 2 });
    assert.deepStrictEqual(r.b, { usados: 0, guardados: 0 });
    assert.ok(r.same);
    assert.deepStrictEqual(r.rets, [["cano_8040", 2500, "w1"], ["cano_8040", 2500, "w1"]]);
    assert.ok(r.done >= 1);
    assert.deepStrictEqual(r.obras, ["Casa"]);
    assert.strictEqual(r.lf, "w1");
  });
  await test("terminar no duplica la obra si ya estaba guardada", async () => {
    const p = await open();
    await setup(p, { T: { cuts: [cut(3000)], obras: [{ id: "o", obra: "casa", date: 1, cuts: [] }] } });
    const n = await p.evaluate(() => { tFinishCutting(tPlan(T.cuts, T.barra, T.disco, []), []); return T.obras.length; });
    assert.strictEqual(n, 1);
  });
  await test("terminar sin sobrantes ni retazos no rompe", async () => {
    const p = await open();
    await setup(p, { T: { cuts: [cut(5990)] } });
    const r = await p.evaluate(() => { const pl = tPlan(T.cuts, T.barra, T.disco, []); return [tLeftovers(pl, T.minSob), tFinishCutting(pl, [])]; });
    assert.deepStrictEqual(r, [[], { usados: 0, guardados: 0 }]);
  });
  await test("tras terminar el plan no cambia (retazos usados se recuerdan)", async () => {
    const p = await open();
    await setup(p, { T: { cuts: [cut(3900)], retazos: [{ id: "a", perfil: "cano_8040", len: 4000 }] } });
    const r = await p.evaluate(() => {
      const sum = () => { const pl = tPlan(T.cuts, T.barra, T.disco, tActiveRets()); return [pl[0].newBars.length, pl[0].retUsed.length]; };
      const before = sum(); tFinishCutting(tPlan(T.cuts, T.barra, T.disco, tActiveRets()), []);
      return { before, after: sum(), stock: T.retazos.length };
    });
    assert.deepStrictEqual(r.before, [0, 1]);
    assert.deepStrictEqual(r.after, [0, 1]);
    assert.strictEqual(r.stock, 0);
  });
  await test("tRetUsedText", async () => {
    const p = await open();
    await setup(p, { T: { cuts: [cut(3900), cut(3800)], retazos: [{ id: "a", perfil: "cano_8040", len: 4000 }, { id: "b", perfil: "cano_8040", len: 4100 }] } });
    const r = await p.evaluate(() => {
      const pm = S.tPmap, t2 = tRetUsedText(tPlan(T.cuts, T.barra, T.disco, tActiveRets()), pm);
      const t1 = tRetUsedText(tPlan([T.cuts[0]], T.barra, T.disco, tActiveRets()), pm);
      const t0 = tRetUsedText(tPlan(T.cuts, T.barra, T.disco, []), pm);
      return [t2, t1, t0];
    });
    assert.ok(/^Usás 2 retazos que ya tenés: .*4000 mm.*4100 mm/.test(r[0]), r[0]);
    assert.ok(/^Usás 1 retazo que ya tenés: .*de 4000 mm|^Usás 1 retazo que ya tenés: .*de 4100 mm/.test(r[1]), r[1]);
    assert.strictEqual(r[2], "");
  });

  /* ---- Task 3: el trabajo del cuaderno (cuentas a mano de la foto) ---- */
  const barras = (page, cuts) => page.evaluate(cuts => tPlan(cuts.map(c => ({ ...c, parte: "", ang: "90" })), 6000, 3, []).map(g => [g.perfil, g.buyBars]), cuts);
  await test("cuaderno: PF1+PF2 en 80x40 (a mano 15250 mm = 3 barras)", async () => {
    const p = await open();
    const r = await barras(p, [{ perfil: "cano_8040", len: 2640, qty: 2 }, { perfil: "cano_8040", len: 1530, qty: 3 }, { perfil: "cano_8040", len: 1160, qty: 2 }, { perfil: "cano_8040", len: 1530, qty: 2 }]);
    console.log("      app:", JSON.stringify(r));
    assert.ok(r[0][1] <= 3);
  });
  await test("cuaderno: PTA a mano 20000 mm = 4 barras", async () => {
    const p = await open();
    const r = await barras(p, [{ perfil: "cano_8040", len: 2400, qty: 4 }, { perfil: "cano_8040", len: 1300, qty: 6 }, { perfil: "cano_8040", len: 2600, qty: 1 }]);
    console.log("      app:", JSON.stringify(r));
    assert.ok(r[0][1] <= 4);
  });
  await test("cuaderno: PF1, PF2 y PTA1 armados con los modelos nuevos", async () => {
    const p = await open();
    const r = await p.evaluate(() => {
      const ms = [{ ...tTypeDef("pano"), label: "PF1", ancho: 2640, alto: 1530, hojas: 2 }, { ...tTypeDef("pano"), label: "PF2", ancho: 1160, alto: 1530 }, { ...tTypeDef("puerta"), label: "PTA1", ancho: 1300, alto: 2400 }];
      const cuts = ms.flatMap(m => tModelPieces(m).map(x => ({ perfil: x.perfil, len: x.len, qty: x.qty, parte: x.parte, ang: x.ang })));
      return tPlan(cuts, 6000, 3, []).map(g => [g.perfil, g.buyBars]);
    });
    console.log("      app:", JSON.stringify(r));
    assert.ok(r.length >= 2 && r.every(x => x[1] >= 1));
  });
  await test("sin errores de JS al abrir y renderizar el Taller (3 pasos, panel de terminar)", async () => {
    const p = await open();
    await p.evaluate(() => { go("taller"); });
    for (const step of [1, 2, 3]) { await p.evaluate(s => { T.step = s; if (s === 2) { T.cuts = [{ id: "x", perfil: "cano_8040", parte: "", ang: "90", len: 3497, qty: 2 }]; T.retazos = [{ id: "r", perfil: "cano_8040", len: 4000 }]; T.cuts.push({ id: "y", perfil: "cano_8040", parte: "", ang: "90", len: 3900, qty: 1 }); } renderTaller(); }, step); }
    await p.evaluate(() => { T.step = 2; S.tFin = { off: {} }; renderTaller(); });
    assert.ok(await p.locator("[data-tfinck]").count() >= 1);
    await p.click('[data-tact="finishok"]');
    assert.ok(await p.locator("text=Obra terminada").count() >= 1);
    assert.deepStrictEqual(p.errs, []);
  });

  /* ---- Reparto exacto de barrotes ---- */
  await test("repartoLuz: 1160 interior, luz 120, barrote 20", async () => {
    const p = await open();
    const r = await p.evaluate(() => repartoLuz(1160, 120, 20));
    assert.strictEqual(r.n, 8);
    assert.ok(Math.abs(r.luz - 111.11) < 0.05, r.luz);
    assert.deepStrictEqual(r.marcas.slice(0, 3), [111, 242, 373]);
    assert.strictEqual(r.marcas.length, 8);
    assert.ok(r.luz <= 120);
  });
  await test("repartoLuz: espacio menor que la luz → 0 barrotes", async () => {
    const p = await open();
    const r = await p.evaluate(() => [repartoLuz(100, 120, 20), repartoLuz(0, 120, 20), repartoLuz(-5, 120, 20)]);
    r.forEach(x => { assert.strictEqual(x.n, 0); assert.deepStrictEqual(x.marcas, []); });
  });
  await test("repartoLuz: la luz nunca pasa la máxima y n es el mínimo", async () => {
    const p = await open();
    const bad = await p.evaluate(() => { const out = []; for (let W = 150; W <= 3000; W += 37) for (const L of [80, 100, 120]) for (const t of [12, 14.3, 20]) { const r = repartoLuz(W, L, t); const prev = r.n > 0 ? (W - (r.n - 1) * t) / r.n : 0; if (r.luz > L + 1e-9 || (r.n > 0 && prev <= L)) out.push([W, L, t, r.n, r.luz]); } return out; });
    assert.deepStrictEqual(bad, []);
  });
  await test("espVisto y catálogo de Padilla", async () => {
    const p = await open();
    const r = await p.evaluate(() => [espVisto("redondo_916"), espVisto("planchuela"), espVisto("cano_2020"), espVisto("cano_4020"), espVisto("no_existe"), CATALOG.planchuela.n, !!CATALOG.cuadrado_12, espVisto("cuadrado_12")]);
    assert.deepStrictEqual(r.slice(0, 5), [14.3, 6.35, 20, 20, 20]);
    assert.ok(/1 1\/4 x 1\/4/.test(r[5]), r[5]);
    assert.strictEqual(r[6], true);
    assert.strictEqual(r[7], 12);
  });

  await test("Taller reja: barrotes del reparto exacto, medida exterior", async () => {
    const p = await open();
    const r = await p.evaluate(() => { const m = { ...tTypeDef("reja"), ancho: 1200, alto: 1000, sep: 120 }; const pz = tModelPieces(m); const b = pz.find(x => x.key === "barrote"); const exp = repartoLuz(1200 - 2 * espVisto(m.pMarco), 120, espVisto(m.pInt)); return { qty: b.qty, n: exp.n, len: b.len, mk: tMarcas(m) }; });
    assert.strictEqual(r.qty, r.n);
    assert.strictEqual(r.len, Math.round(1000 - 2 * 6.35));
    assert.strictEqual(r.mk.n, r.n);
    assert.ok(r.mk.luz <= 120);
  });
  await test("Taller reja con medida interior: marco = interior + 2 espesores", async () => {
    const p = await open();
    const r = await p.evaluate(() => { const m = { ...tTypeDef("puertareja"), ancho: 900, alto: 2000, sep: 120, medInt: true }; const pz = tModelPieces(m); return [pz.find(x => x.key === "marco_h").len, pz.find(x => x.key === "marco_v").len, tMarcas(m).W]; });
    assert.deepStrictEqual(r, [980, 2080, 900]);
  });
  await test("Taller portón 2 hojas: reparto por hoja", async () => {
    const p = await open();
    const r = await p.evaluate(() => { const m = { ...tTypeDef("porton"), ancho: 2400, alto: 2000, sep: 120, hojas: 2 }; const mk = tMarcas(m); const b = tModelPieces(m).find(x => x.key === "barrote"); return [mk.W, mk.n, b.qty]; });
    assert.strictEqual(r[0], 1200 - 80);
    assert.strictEqual(r[2], r[1] * 2);
  });
  await test("Taller rack: estantes con espacios iguales desde el piso", async () => {
    const p = await open();
    const r = await p.evaluate(() => tMarcas({ ...tTypeDef("rack"), alto: 1800, travesanos: 4 }));
    const t = r.t, gaps = r.marcas.map((m, i) => m - (i ? r.marcas[i - 1] : 0) - t);
    assert.strictEqual(r.marcas.length, 4);
    assert.strictEqual(r.marcas[3], 1800);
    assert.ok(Math.max(...gaps) - Math.min(...gaps) <= 1, JSON.stringify(gaps));
  });
  await test("planilla incluye las marcas de la reja", async () => {
    const p = await open();
    const t = await p.evaluate(() => { T.model = { ...tTypeDef("reja"), ancho: 1200, alto: 1000, sep: 120, label: "V1" }; T.models = []; T.modelActive = true; T.cuts = tModelPieces(T.model).map(x => ({ id: tId(), perfil: x.perfil, parte: x.parte, ang: x.ang, len: x.len, qty: x.qty })); const pm = Object.fromEntries(tPerfiles().map(x => [x.key, x])); return tPlanillaText(tPlan(T.cuts, 6000, 3, []), pm); });
    assert.ok(/Marcas/.test(t) && /luz \d+/.test(t), t);
  });

  await test("Presupuestar reja: mismos barrotes que el Taller y luz exacta en el pie", async () => {
    const p = await open();
    const r = await p.evaluate(() => { const i = { uso: "ventana", material: "redondo_916", ancho: 120, alto: 100, cant: 1, sep: 12 }; const c = rejaCuts(i).find(x => /barrote/.test(x.parte)); const g = rejaReparto(i); return { qty: c.qty, n: g.n, len: c.len, W: g.W }; });
    assert.strictEqual(r.W, 1200 - 40);
    assert.strictEqual(r.qty, r.n);
    assert.strictEqual(r.n, 8);
    assert.strictEqual(r.len, 1000 - 40);
  });
  await test("Presupuestar reja con medida interior alarga el marco", async () => {
    const p = await open();
    const r = await p.evaluate(() => rejaCuts({ uso: "ventana", material: "redondo_916", ancho: 120, alto: 100, cant: 1, sep: 12, medInt: true }).filter(x => /marco/.test(x.parte)).map(x => x.len));
    assert.deepStrictEqual(r, [1240, 1040]);
  });
  await test("Clickie: redondo 9/16 por defecto, cuadrado si lo pide", async () => {
    const p = await open();
    const r = await p.evaluate(() => [parseClickieOrder("Reja para ventana de 1,20 x 1,00").inputs.material, parseClickieOrder("Reja de barrotes cuadrados 1,20 x 1,00").inputs.material, parseClickieOrder("Reja de caño 1,20 x 1,00").inputs.material]);
    assert.deepStrictEqual(r, ["redondo_916", "cuadrado_12", "cano_2020"]);
  });

  await browser.close();
  console.log(`\n${ran - fails}/${ran} ok`);
  process.exit(fails ? 1 : 0);
})();
