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

  await browser.close();
  console.log(`\n${ran - fails}/${ran} ok`);
  process.exit(fails ? 1 : 0);
})();
