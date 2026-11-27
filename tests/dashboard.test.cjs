const {test}=require('node:test'),assert=require('node:assert/strict');
const app=require('./load-app.cjs')();
test('dashboard: empty history has zero counts and does not invent money',()=>{
 const stats=app.dashboardStats([]);assert.deepEqual(JSON.parse(JSON.stringify(stats)),{total:0,accepted:0,pending:0,rejected:0});
});
test('dashboard: response states count independently of prices and malformed history records',()=>{
 const data=[{estado:'si',total:100000},{estado:'no',total:200000},{total:0},{estado:null,total:5000},{estado:'otra'},null,'bad'];
 const before=JSON.stringify(data);assert.deepEqual(JSON.parse(JSON.stringify(app.dashboardStats(data))),{total:5,accepted:1,pending:3,rejected:1});assert.equal(JSON.stringify(data),before);
});
