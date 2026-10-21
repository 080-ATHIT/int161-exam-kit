import test, {before,after} from 'node:test';
import assert from 'node:assert/strict';
import {loadSettings} from '../src/configs-$id/settings.js';
import {createDb} from '../src/configs-$id/db-config.js';
import {initializePractice,assertPracticeDatabase} from '../scripts/db-lib.mjs';
const {createApp}=await import(process.env.KIT_VERIFY_APP_URL || new URL('../src/app.js',import.meta.url).href);

let db,server,base; const made=[],tags=[];
const prefix=`T${Date.now()}${process.pid}`;
const body=(suffix='A')=>({sku:`${prefix}-${suffix}`,name:'Test Phone',brand_id:1,category:'PHONE',price:1250.5,ram_gb:8,storage_gb:128,color:'Blue',stock_quantity:2,status:'AVAILABLE',release_date:'2026-02-28'});
async function request(path,method='GET',data) {
 const res=await fetch(base+path,{method,headers:data===undefined?{}:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});
 const text=await res.text();return {status:res.status,text,json:text?JSON.parse(text):null};
}
before(async()=>{
 const settings=loadSettings(); settings.database=settings.testDatabase;
 await initializePractice(settings);db=createDb(settings);await assertPracticeDatabase(db);
 server=createApp({db,studentId:'demo001',name:'Demo Student',key:'fictional-key'}).listen(0,'127.0.0.1');
 await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject);});
 base=`http://127.0.0.1:${server.address().port}/api/demo001`;
});
after(async()=>{
 if(db){
  for(const id of made){await db.query('DELETE FROM product_tags WHERE product_id=?',[id]);await db.query('DELETE FROM products WHERE id=?',[id]);}
  for(const code of tags)await db.query('DELETE FROM tags WHERE code=?',[code]);
 }
 if(server)await new Promise(resolve=>server.close(resolve));
 if(db)await db.end();
});
test('static identity, not-found and ISO envelope',async()=>{
 const r=await request('/student-info');assert.equal(r.status,200);
 assert.deepEqual(r.json.data,{studentId:'demo001',name:'Demo Student',secretKey:'fictional-key'});
 assert.match(r.json.timestamp,/^\d{4}-\d{2}-\d{2}T.*Z$/);
 const missing=await request('/missing');assert.equal(missing.status,404);assert.equal(missing.json.success,false);
});
test('brands list/detail and missing record',async()=>{
 assert.ok((await request('/brands')).json.data.length>=2);
 assert.equal((await request('/brands/1')).json.data.name,'Example Devices');
 assert.equal((await request('/brands/99999999')).status,404);
});
test('pagination defaults, final/empty pages, capped limit and bad/duplicate queries',async()=>{
 const r=await request('/products');assert.equal(r.status,200);assert.equal(r.json.pagination.limit,10);
 const {total}=r.json.pagination;assert.ok(total>=23);assert.equal(r.json.data.length,10);
 const end=await request(`/products?page=${Math.ceil(total/10)}&limit=10`);assert.equal(end.json.pagination.hasNextPage,false);
 const empty=await request('/products?page=99999&limit=10');assert.deepEqual(empty.json.data,[]);assert.equal(empty.json.pagination.total,total);
 assert.equal((await request('/products?page=2&limit=500')).json.pagination.limit,100);
 for(const q of ['page=0','page=','page=1.5','page=2abc','limit=-1','page=1&page=2','limit=0','limit=1&limit=2'])assert.equal((await request('/products?'+q)).status,400,q);
 const dto=r.json.data[0];assert.deepEqual(Object.keys(dto),['id','sku','name','brandId','category','price','status']);assert.equal(typeof dto.price,'number');
});
test('CRUD persists, includes JOIN/date types, allows unchanged update and refuses duplicates',async()=>{
 const data=body();const c=await request('/products','POST',{...data,internal_cost:1,id:999999});assert.equal(c.status,201);made.push(c.json.data.id);
 const id=c.json.data.id;assert.notEqual(id,999999);
 const [[stored]]=await db.query('SELECT sku,internal_cost FROM products WHERE id=?',[id]);assert.equal(stored.sku,data.sku);assert.equal(stored.internal_cost,null);
 let r=await request('/products/'+id);assert.equal(r.status,200);assert.equal(r.json.data.brandName,'Example Devices');assert.equal(r.json.data.releaseDate,'2026-02-28');assert.equal(r.json.data.price,1250.5);
 assert.equal(Object.keys(r.json.data).length,13);
 assert.equal((await request('/products/'+id,'PUT',data)).status,200,'unchanged update');
 assert.equal((await request('/products','POST',data)).status,409);
 const other=await request('/products','POST',body('B'));assert.equal(other.status,201);made.push(other.json.data.id);
 assert.equal((await request('/products/'+id,'PUT',body('B'))).status,409);
 const u=await request('/products/'+id,'PUT',{...data,name:'Changed',price:0});assert.equal(u.status,200);assert.equal((await request('/products/'+id)).json.data.name,'Changed');
 const d=await request('/products/'+id,'DELETE');assert.equal(d.status,204);assert.equal(d.text,'');
 assert.equal((await request('/products/'+id)).status,404);assert.equal((await request('/products/'+id,'DELETE')).status,404);
 assert.equal((await request('/products/99999999','PUT',data)).status,404);
});
test('validation and database FK errors use exact status and public codes',async()=>{
 for(const bad of [{...body(),name:' '},{...body(),price:-1},{...body(),price:'12.00'},{...body(),price:1.234},{...body(),release_date:'2026-02-30'},{...body(),stock_quantity:-1},null,[]])assert.equal((await request('/products','POST',bad)).status,400);
 const r=await request('/products','POST',{...body('FK'),brand_id:99999999});assert.equal(r.status,400);assert.equal(r.json.error.code,'FOREIGN_KEY_NOT_FOUND');
 const fk=await request('/brands/1','DELETE');assert.equal(fk.status,409);assert.equal(fk.json.error.code,'RESOURCE_IN_USE');assert.ok(!fk.text.includes('DELETE FROM'));
});
test('string and composite keys preserve values and distinguish duplicate/not-found/FK',async()=>{
 const code=prefix.slice(0,25);tags.push(code);
 assert.equal((await request('/tags','POST',{code,label:'Custom'})).status,201);
 assert.equal((await request('/tags/'+code)).json.data.code,code);
 assert.equal((await request('/tags/NA')).json.data.code,'NA');
 assert.equal((await request('/tags','POST',{code,label:'Duplicate'})).status,409);
 const c=await request('/products','POST',body('TAG'));made.push(c.json.data.id);const id=c.json.data.id;
 assert.equal((await request(`/products/${id}/tags`,'POST',{tagCode:code})).status,201);
 assert.equal((await request(`/products/${id}/tags`,'POST',{tagCode:code})).status,409);
 assert.equal((await request(`/products/${id}/tags`,'POST',{tagCode:'MISSING'})).status,400);
 assert.equal((await request(`/products/${id}/tags`)).json.data[0].code,code);
 assert.equal((await request('/products/'+id,'DELETE')).status,409);
 assert.equal((await request(`/products/${id}/tags/${code}`,'DELETE')).status,204);
 assert.equal((await request(`/products/${id}/tags/${code}`,'DELETE')).status,404);
});
test('zero-result metadata survives the real MySQL route and JSON serialization',async()=>{
 const conn=await db.getConnection();let emptyServer;
 try {
  await assertPracticeDatabase(conn);await conn.beginTransaction();
  await conn.query('DELETE FROM product_tags');await conn.query('DELETE FROM products');
  emptyServer=createApp({db:conn,studentId:'empty',name:'Demo',key:'fake'}).listen(0,'127.0.0.1');
  await new Promise(resolve=>emptyServer.once('listening',resolve));
  const r=await fetch(`http://127.0.0.1:${emptyServer.address().port}/api/empty/products`);const data=await r.json();
  assert.equal(r.status,200);assert.deepEqual(data.data,[]);
  assert.deepEqual(data.pagination,{total:0,page:1,limit:10,totalPages:0,hasNextPage:false,hasPrevPage:false});
 }finally{if(emptyServer)await new Promise(resolve=>emptyServer.close(resolve));await conn.rollback();conn.release();}
});
test('malformed JSON gets a JSON error without Express HTML or a stack',async()=>{
 const r=await fetch(base+'/products',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});
 assert.equal(r.status,400);const data=await r.json();assert.equal(data.error.code,'INVALID_JSON');assert.equal(data.success,false);
});
test('teacher NOT NULL schema accepts supplied request bodies and rejects missing specs with 400',async()=>{
 const conn=await db.getConnection();let strictServer;
 try{
  await assertPracticeDatabase(conn);
  await conn.query('CREATE TEMPORARY TABLE brands AS SELECT * FROM brands');
  await conn.query(`CREATE TEMPORARY TABLE products (id INT PRIMARY KEY AUTO_INCREMENT,sku VARCHAR(50) UNIQUE,name VARCHAR(150),brand_id INT,category VARCHAR(50),price DECIMAL(10,2),ram_gb INT NOT NULL,storage_gb INT NOT NULL,color VARCHAR(50) NOT NULL,stock_quantity INT,status VARCHAR(30),release_date DATE)`);
  strictServer=createApp({db:conn,studentId:'strict',name:'Demo',key:'fake'}).listen(0,'127.0.0.1');await new Promise(r=>strictServer.once('listening',r));
  const url=`http://127.0.0.1:${strictServer.address().port}/api/strict/products`;
  const send=(path,method,data)=>fetch(url+path,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const {readFile}=await import('node:fs/promises');
  const http=await readFile('requests/catalog.http','utf8');const samples=http.split('\n').filter(x=>x.startsWith('{')).map(x=>JSON.parse(x));assert.equal(samples.length,2);
  let created=await send('','POST',samples[0]);assert.equal(created.status,201,'provided .http POST must work with NOT NULL specs');const {data}=await created.json();
  let updated=await send('/'+data.id,'PUT',samples[1]);assert.equal(updated.status,200);
  const collection=JSON.parse(await readFile('requests/postman.json','utf8'));
  for(const item of collection.item.filter(x=>['POST','PUT'].includes(x.request.method))){
   const sample=JSON.parse(item.request.body.raw);sample.sku='STRICT-'+item.request.method;
   const response=await send(item.request.method==='PUT'?'/'+data.id:'',item.request.method,sample);assert.equal(response.status,item.request.method==='POST'?201:200,'Postman body');
  }
  for(const field of ['ram_gb','storage_gb','color'])for(const value of [undefined,null]){
   const input={...body('STRICT'),[field]:value};const r=await send('','POST',input);assert.equal(r.status,400,field);assert.equal((await r.json()).error.code,'VALIDATION_ERROR');
  }
 }finally{
  if(strictServer)await new Promise(r=>strictServer.close(r));
  await conn.query('DROP TEMPORARY TABLE IF EXISTS products');await conn.query('DROP TEMPORARY TABLE IF EXISTS brands');conn.release();
 }
});
