const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(process.env.PADILLA_HTML||path.join(__dirname,'../index.html'),'utf8');
const core=html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const geometry=html.slice(html.indexOf('function tMarcas(m){'),html.indexOf('/* Texto de marcas para el taller'));
const model=html.slice(html.indexOf('function tModelPieces(m){'),html.indexOf('function tModelSVG('));
const ctx={module:{exports:{}},console};vm.createContext(ctx);
// Use the real geometry shared by the UI and quote calculator, without a DOM.
vm.runInContext(core+'\nconst tClamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,Math.round(v)));\n'+geometry+model,ctx);
const {JOBS,defaults,compute,DEFAULT_CONFIG,rejaCuts}=ctx.module.exports;
const job=JOBS.find(j=>j.id==='reja');
const input=overrides=>({...defaults(job),...job.std({uso:'porton'}),uso:'porton',apertura:'corredizo',ancho:3000,alto:2000,cant:1,...overrides});
const quote=i=>compute(job,i,DEFAULT_CONFIG,{}, {},{usarComision:true},[],{},{});
const rails=i=>Array.from(rejaCuts(i)).filter(c=>c.parte.endsWith(' riel'));

test('a new sliding gate uses one 6m angle rail with a pending price',()=>{
 const i=input(), r=quote(i), rail=r.mats.find(m=>m.key==='angulo');
 assert.ok(rail,'the standard rail must be the 1 x 1/8 angle');
 assert.equal(rail.qty,1);assert.equal(rail.est,true);
 assert.deepEqual(rails(i).map(c=>[c.perfil,c.len,c.qty]),[['angulo',6000,1]]);
});
test('a custom rail changes only this quote and both cutting paths agree',()=>{
 const i=input({pRiel:'ang_114_18',rielAuto:false,largoRiel:7500,cant:2}),r=quote(i);
 assert.equal(r.mats.find(m=>m.key==='ang_114_18').qty,3);
 assert.deepEqual(rails(i).map(c=>[c.perfil,c.len,c.qty]),[['ang_114_18',6000,2],['ang_114_18',1500,2]]);
 ctx.fixture={...i,type:'porton',corredizo:true,pMarco:i.pBast,pInt:i.material,pExtra:i.pTrav};
 const pieces=vm.runInContext('tModelPieces(fixture)',ctx).filter(c=>/riel$/i.test(c.parte));
 assert.deepEqual(Array.from(pieces,c=>[c.perfil,c.len,c.qty]),[['ang_114_18',6000,2],['ang_114_18',1500,2]]);
 assert.deepEqual(rails(input()).map(c=>[c.perfil,c.len,c.qty]),[['angulo',6000,1]]);
});
test('automatic rail follows width, including lengths over 6m and interior dimensions',()=>{
 assert.deepEqual(rails(input({ancho:4000})).map(c=>[c.len,c.qty]),[[6000,1],[2000,1]]);
 assert.deepEqual(rails(input({ancho:3000,medInt:true})).map(c=>[c.len,c.qty]),[[6000,1],[160,1]]);
 assert.equal(quote(input({ancho:4000})).mats.find(m=>m.key==='angulo').qty,2);
});
test('a real saved rail price removes the pending flag',()=>{
 const r=compute(job,input(),DEFAULT_CONFIG,{angulo:21000},{},{},[],{},{});
 const rail=r.mats.find(m=>m.key==='angulo');assert.ok(rail);assert.equal(rail.price,21000);assert.equal(rail.est,false);
});
test('three 4m rails require three stock bars, despite their combined length being 12m',()=>{
 const r=quote(input({ancho:2000,cant:3}));
 assert.equal(r.mats.find(m=>m.key==='angulo').qty,3);
});
test('the existing default quotes retain their totals',()=>{
 const expected={reja:[343000,291000],puertitas:[343000,291000],soldadura:[130000,110000],pintura:[251000,214000],mosquitero:[95000,81000],bacha:[80000,80000],inodoro:[80000,80000],luz:[80000,80000],colgar:[80000,80000],pared:[134000,114000],otro:[80000,80000]};
 for(const j of JOBS){const i={...defaults(j),...(j.std?j.std(defaults(j)): {})},r=compute(j,i,DEFAULT_CONFIG,{},{},{},[],{},{});
 assert.deepEqual([r.conCom.total,r.sinCom.total],expected[j.id],j.id);}
});
