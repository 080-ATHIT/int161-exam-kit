import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSettings} from '../reference-app/src/configs-$id/settings.js';
import {createDb} from '../reference-app/src/configs-$id/db-config.js';
import {initializePractice,assertPracticeDatabase} from '../scripts/db-lib.mjs';
import {createBooksApp} from '../practice/worked-example/app.js';
test('adapted books example persists string PK, fee DTO, no-op PUT and W6 DELETE200',async()=>{
 const cfg=loadSettings();cfg.database=cfg.testDatabase;await initializePractice(cfg);
 const db=createDb(cfg);let server;const code=`BK${Date.now()}`;
 try{
  await assertPracticeDatabase(db);
  await db.query('CREATE TABLE IF NOT EXISTS books (book_code VARCHAR(32) PRIMARY KEY,title VARCHAR(150) NOT NULL,author VARCHAR(100) NOT NULL,daily_fee DECIMAL(10,2) NOT NULL)');
  server=createBooksApp(db).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const base=`http://127.0.0.1:${server.address().port}/api/demo002/books`;
  const req=async(path='',method='GET',data)=>{const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});return {status:r.status,body:await r.json()};};
  const input={book_code:code,title:'Practice',author:'Demo',daily_fee:2.5};
  let r=await req('','POST',input);assert.equal(r.status,201);assert.deepEqual(r.body,{status:'success',data:{code,title:'Practice',author:'Demo',fee:2.5}});
  const [[stored]]=await db.query('SELECT * FROM books WHERE book_code=?',[code]);assert.equal(stored.title,'Practice');
  assert.equal((await req('','POST',input)).status,409);
  r=await req('/'+code,'PUT',input);assert.equal(r.status,200);
  r=await req('?page=1&limit=100');assert.deepEqual(Object.keys(r.body.data[0]),['code','title','fee']);assert.equal(typeof r.body.data[0].fee,'number');assert.ok(r.body.pagination.total>=1);
  assert.equal((await req('?page=0')).status,400);
  r=await req('/'+code,'DELETE');assert.equal(r.status,200);assert.deepEqual(r.body.data,{code,deleted:true});
  assert.equal((await req('/'+code)).status,404);
 }finally{if(server)await new Promise(r=>server.close(r));await db.query('DELETE FROM books WHERE book_code=?',[code]);await db.end();}
});
