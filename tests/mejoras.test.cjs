const {test}=require('node:test'),assert=require('node:assert/strict');
const api=require('./load-app.cjs')();
const {JOBS,defaults,compute,DEFAULT_CONFIG,clientMessage,shoppingList}=api;
const job=id=>JOBS.find(j=>j.id===id);
const inputs=(id,over={})=>({...defaults(job(id)),...(job(id).std?job(id).std({uso:over.uso||'ventana'}):{}),...over});
const quote=(id,over={},prices={},opts={},extra=[])=>compute(job(id),inputs(id,over),DEFAULT_CONFIG,prices,{},opts,extra,{},{});

test('core: sliding gate contains the specified base and Roma hardware as pending prices',()=>{
 const r=quote('reja',{uso:'porton',apertura:'corredizo',ancho:3000,alto:2000,cerradura:true});
 for(const [key,qty] of [['cano_12040',1],['rueda_roma120',2],['guia_roma84',1],['ruleman_roma84',2]]){const m=r.mats.find(x=>x.key===key);assert.ok(m,key);assert.equal(m.qty,qty,key);assert.equal(m.est,true,key);assert.equal(m.price,0,key);}
 const cuts=api.jobCuts('reja',inputs('reja',{uso:'porton',apertura:'corredizo',ancho:3000,alto:2000}));
 assert.ok(cuts.some(c=>c.perfil==='cano_12040'&&c.len===3000&&c.qty===1));
 assert.ok(cuts.some(c=>c.parte.includes('barrote')&&c.len===1840));
 assert.match(clientMessage(r,DEFAULT_CONFIG,{}),/estimado/i);
 assert.ok(r.pendingStandards.length>0);
});
test('core: quotation purchase quantities come from actual cuts for every bar profile',()=>{
 const i=inputs('reja',{ancho:1200,alto:1000,cant:3});const r=quote('reja',i);
 const wanted=api.barPurchases(api.jobCuts('reja',i));
 for(const m of r.mats.filter(x=>x.unit==='barra 6 m'))assert.equal(m.qty,wanted[m.key],m.key);
 const custom=quote('reja',i,{}, {cutRetazos:[{perfil:'redondo_916',len:6000,id:'r1'}]});
 assert.ok(custom.mats.find(m=>m.key==='redondo_916').qty<r.mats.find(m=>m.key==='redondo_916').qty);
});
test('core: under-grill doors generate their own frame and leaf cuts, not grille bars',()=>{
 const cuts=api.jobCuts('puertitas',inputs('puertitas'));
 assert.deepEqual(Array.from(cuts,c=>[c.perfil,c.len,c.qty]),[['angulo',800,2],['angulo',600,2],['ang_78_18',400,4],['ang_78_18',600,4]]);
 const r=quote('puertitas');assert.equal(r.mats.find(m=>m.key==='bisagra_80').qty,4);assert.equal(r.mats.find(m=>m.key==='pasador_ch').qty,3);
 assert.ok(r.pendingStandards.some(s=>/horas/i.test(s)));
});
test('core: estimated extras stay pending in the quote and shopping list until priced',()=>{
 const r=quote('otro',{}, {},{},[{key:'guia_roma84',qty:1}]);
 assert.equal(r.mats.find(m=>m.key==='guia_roma84').est,true);assert.match(shoppingList(r),/sin ref. segura/);assert.match(clientMessage(r,DEFAULT_CONFIG,{}),/confirmar/i);
 const priced=quote('otro',{}, {guia_roma84:25000},{},[{key:'guia_roma84',qty:1}]);assert.equal(priced.mats.find(m=>m.key==='guia_roma84').est,false);
});
test('core: unknown door clearance and two-leaf gate fasteners remain explicit pending standards',()=>{
 assert.ok(quote('reja',{uso:'puerta'}).pendingStandards.some(s=>/holgura/i.test(s)));
 assert.ok(quote('reja',{uso:'porton',apertura:'doble'}).pendingStandards.some(s=>/pasador/i.test(s)));
});
test('backup: valid legacy data is accepted and malformed data rejected without mutation',()=>{
 const old={cfg:{valor_hora:17500},prices:{angulo:19000},favs:[],hist:[],customMats:{}};
 assert.equal(api.validateBackup(old).prices.angulo,19000);assert.deepEqual(old.prices,{angulo:19000});
 for(const bad of [null,[],{}, {cfg:[]},{prices:{angulo:-1}},{favs:{}},{hist:[null]},{taller:{cuts:'bad'}},JSON.parse('{"cfg":{"__proto__":{"x":true}}}')])assert.throws(()=>api.validateBackup(bad));
});
test('core: catalog prices without a per-item verified source are pending, including obra materials',()=>{
 const r=quote('reja',{uso:'porton',apertura:'corredizo',ancho:3000,alto:2000});
 assert.ok(r.mats.filter(m=>m.qty>0).every(m=>m.est),'built-in prices must not appear confirmed');
 const obra=api.computeObra({reja_mo:{qty:1,lvl:'medio'}},DEFAULT_CONFIG,{}, {},{});
 assert.ok(obra.mats.every(m=>m.est));assert.match(api.obraMessage(obra,DEFAULT_CONFIG,true),/estimad/i);
});
test('backup: imported field values and raw record identifiers cannot contain executable markup',()=>{
 const door=inputs('puertitas');door.hojas='<img src=x onerror="window.executed=true">';
 assert.throws(()=>api.validateBackup({cfg:{},taller:{sourceQuote:{jobId:'puertitas',inputs:door}}}));
 assert.throws(()=>api.validateBackup({cfg:{},taller:{cuts:[{id:'" onmouseover="alert(1)',perfil:'angulo',len:800,qty:2}]}}));
 assert.throws(()=>api.validateBackup({cfg:{},favs:[{jobId:'reja',inputs:inputs('reja'),opts:{opcion1:{incluye:'not-an-array'}}}]}));
});

test('core: overlength pieces have the same purchase estimate in quote and workshop and warn in shopping list',()=>{
 const i=inputs('reja',{ancho:6000,alto:1000,medInt:true});const r=quote('reja',i);
 assert.equal(r.mats.find(m=>m.key==='planchuela').qty,9);
 assert.equal(api.tPlan(r.cuts,6000,3,[]).find(g=>g.perfil==='planchuela').buyBars,9);
 assert.match(shoppingList(r),/empalm|6000|revisar/i);
});
