import test from 'node:test';
import assert from 'node:assert/strict';
import {w6Success,w6ErrorHandler} from '../recipes/w6-response.js';
import {parseOptionalPagination} from '../recipes/optional-pagination.js';
import {AppError} from '../src/middlewares-$id/app-error.js';
const response=()=>({status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
test('W6 recipe preserves status/data/error shape and hides internal errors',()=>{
 const res=response();w6Success(res,{message:'Deleted'},200);assert.deepEqual(res.body,{status:'success',data:{message:'Deleted'}});
 w6ErrorHandler(new AppError('Missing',404,'TAG_NOT_FOUND'),{},res,()=>{});assert.equal(res.code,404);assert.deepEqual(res.body,{status:'error',error:{code:'TAG_NOT_FOUND',message:'Missing'}});
 w6ErrorHandler(new Error('SQL password'),{},res,()=>{});assert.ok(!JSON.stringify(res.body).includes('SQL password'));
});
test('optional pagination policy is explicit and still validates provided fields',()=>{
 assert.equal(parseOptionalPagination({}),null);
 assert.deepEqual(parseOptionalPagination({page:'2'}),{page:2,limit:10,offset:10});
 assert.throws(()=>parseOptionalPagination({limit:''}));
});
test('string/composite SQL recipes run on actual marked MySQL with both keys',async()=>{
 const {findTag,findProductTag}=await import('../recipes/string-composite-repository.js');
 const {loadSettings}=await import('../src/configs-$id/settings.js');
 const {createDb}=await import('../src/configs-$id/db-config.js');
 const {initializePractice,assertPracticeDatabase}=await import('../scripts/db-lib.mjs');
 const cfg=loadSettings();cfg.database=cfg.testDatabase;await initializePractice(cfg);const db=createDb(cfg);
 try{await assertPracticeDatabase(db);assert.equal((await findTag(db,'NA')).code,'NA');assert.deepEqual(await findProductTag(db,1,'DEMO'),{product_id:1,tag_code:'DEMO'});assert.equal(await findProductTag(db,1,'NA'),null);assert.equal(await findTag(db,'MISSING_RECIPE_KEY'),null);}finally{await db.end();}
});
