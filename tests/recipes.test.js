import test from 'node:test';
import assert from 'node:assert/strict';
import {w6Success,w6ErrorHandler} from '../recipes/w6-response.js';
import {parseOptionalPagination} from '../recipes/optional-pagination.js';
import {AppError} from '../reference-app/src/middlewares-$id/app-error.js';
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
