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
