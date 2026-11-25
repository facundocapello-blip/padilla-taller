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

  await browser.close();
  console.log(`\n${ran - fails}/${ran} ok`);
  process.exit(fails ? 1 : 0);
})();
