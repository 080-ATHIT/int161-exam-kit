import test from 'node:test';
import assert from 'node:assert/strict';
import {assertPracticeName,assertPracticeDatabase} from '../scripts/db-lib.mjs';
test('mutation guard rejects arbitrary names and missing/mismatched marker',async()=>{
 for(const name of ['mysql','mobile_distributor','int161_practice_','int161_practice_x;DROP','int161_practice_'+ 'x'.repeat(60)]) assert.throws(()=>assertPracticeName(name));
 const fake = (database, marker) => ({query:async(sql)=> sql.includes('DATABASE()')?[[{name:database}]] : [[{value:marker}]]});
 await assert.rejects(()=>assertPracticeDatabase(fake('mobile_distributor','int161-exam-kit-v1')));
 await assert.rejects(()=>assertPracticeDatabase(fake('int161_practice_tests','other-project')));
 await assert.rejects(()=>assertPracticeDatabase({query:async()=>{throw new Error('no table');}}));
 await assertPracticeDatabase(fake('int161_practice_tests','int161-exam-kit-v1'));
});
test('exam startup needs no practice marker, and fixture initialization refuses exam mode',async()=>{
 const {loadSettings}=await import('../src/configs-$id/settings.js');
 const {assertAppDatabase}=await import('../src/configs-$id/database-mode.js');
 const {initializePractice}=await import('../scripts/db-lib.mjs');
 assert.throws(()=>loadSettings({DB_MODE:'unknown'}));
 assert.throws(()=>loadSettings({DB_MODE:'exam'}));
 assert.throws(()=>loadSettings({DB_MODE:'exam',DB_NAME:'exam_db'}));
 const config=loadSettings({DB_MODE:'exam',DB_NAME:'exam_db',STUDENT_ID:'my_id',STUDENT_NAME:'Actual Student',STUDENT_KEY:'actual-assigned-key'});
 let read=false;
 const db={query:async sql=>{assert.equal(sql,'SELECT 1');read=true;return [[{ok:1}]];}};
 await assertAppDatabase(db,config);assert.equal(read,true);
 await assert.rejects(()=>assertAppDatabase(db,{dbMode:'unknown'}));
 await assert.rejects(()=>initializePractice({...config,database:'int161_practice_tests'}),/DB_MODE=practice/);
});
