import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile} from 'node:fs/promises';
import {loadSettings} from '../src/configs-$id/settings.js';
import {createDb} from '../src/configs-$id/db-config.js';
import {initializePractice,assertPracticeDatabase} from '../scripts/db-lib.mjs';
import {createApp} from '../src/app.js';
test('curl sample executes against real DB and cleans up its own created row',async()=>{
 const cfg=loadSettings();cfg.database=cfg.testDatabase;await initializePractice(cfg);const db=createDb(cfg);let server;
 try{
  await assertPracticeDatabase(db);server=createApp({db,studentId:'demo001',name:'Demo',key:'fake'}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  const {stdout}=await promisify(execFile)('sh',['requests/curl.sh'],{env:{...process.env,BASE_URL:`http://127.0.0.1:${server.address().port}/api/demo001`},timeout:15000});assert.match(stdout,/CRUD smoke passed/);
 }finally{if(server)await new Promise(r=>server.close(r));await db.end();}
});
test('Postman collection is standalone and deletes only captured productId',async()=>{
 const c=JSON.parse(await readFile('requests/postman.json','utf8'));assert.equal(c.item.length,7);
 const create=c.item.find(x=>x.request.method==='POST');assert.ok(JSON.stringify(create.event).includes('productId'));
 assert.ok(c.item.find(x=>x.request.method==='DELETE').request.url.endsWith('/{{productId}}'));
});
