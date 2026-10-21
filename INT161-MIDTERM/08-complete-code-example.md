# 08 — Complete Code Example

บทนี้รวมโค้ดตัวอย่างที่ใช้งานจริงในrepoเพื่ออ่านตามrequestได้ครบ โค้ดเป็นแนวเฉลยผู้ช่วย ไม่ใช่เฉลยอาจารย์ ข้อมูลฝึกเป็นสมมติและนโยบายเพิ่มแสดงใน [SOURCES](../questions/SOURCES.md)

ไฟล์ .js/.mjs ที่ลิงก์ด้านล่างเป็นไฟล์รันจริง ส่วนcode blocksเป็นสำเนาเพื่ออ่าน ไม่ใช่ไฟล์ที่ต้องคัดลอกทั้งบทมารันเป็นไฟล์เดียว ต้องคงชื่อไฟล์/importและlayerให้ครบ

## วิธีรันก่อนอ่าน

ใช้[START-HERE](../START-HERE.th.md): npm ci → ตั้ง.env → npm run db:init → npm run doctor → npm start จากนั้นใช้ [catalog.http](../requests/catalog.http) POST/GET/PUT/DELETE

schemaอยู่ที่ [schema.sql](../reference-app/sql/schema.sql) และdependencies/scriptsอยู่ใน [package.json](../package.json) serverตัวอย่างตรวจฐานฝึกprefix+markerก่อนเปิดport ห้ามนำserverนี้ไปชี้ฐานสอบโดยตรง ดู [วิธีใส่teacher template](../guides/05-template.md)

## ตามเส้นทาง6ข้อ

[Guideรายข้อและลิงก์ทุกlayer](../README.md) ครอบคลุมCreate/Readbrands/Readlist/ReadDetail/Update/Delete โค้ดยังมีidentity/branddetailจากWeek08 และtag/compositekeyที่ผู้ช่วยเพิ่มแยกไว้ใน [SUPPLEMENTS](../SUPPLEMENTS.md)

## reference-app/src/configs-$id/settings.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/configs-$id/settings.js)

```js
function port(value, fallback) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value)) || Number(value)<1 || Number(value)>65535) throw new Error('Port must be an integer from 1 to 65535');
  return Number(value);
}
export function loadSettings(env = process.env) {
  const database = env.DB_NAME || 'int161_practice_catalog';
  const testDatabase = env.TEST_DB_NAME || 'int161_practice_tests';
  for (const name of [database,testDatabase]) if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(name)) throw new Error('Invalid database identifier');
  const studentId = env.STUDENT_ID || 'demo001';
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(studentId)) throw new Error('STUDENT_ID must be a static identifier, not a route parameter or path');
  return {host:env.DB_HOST || '127.0.0.1',port:port(env.DB_PORT,3306),user:env.DB_USER || 'root',password:env.DB_PASSWORD || '',database,testDatabase,
    appPort:port(env.PORT,3000),studentId,name:env.STUDENT_NAME || 'Demo Student',key:env.STUDENT_KEY || 'fictional-key'};
}
```

## reference-app/src/configs-$id/db-config.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/configs-$id/db-config.js)

```js
import mysql from 'mysql2/promise';
export function createDb(config) {
  return mysql.createPool({host:config.host,port:config.port,user:config.user,password:config.password,database:config.database,
    connectionLimit:5,waitForConnections:true,timezone:'Z',dateStrings:['DATE']});
}
```

## reference-app/src/app.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/app.js)

```js
import express from 'express';
import {createCatalogRepository} from './repositories-$id/catalog-repository.js';
import {createCatalogService} from './services-$id/catalog-service.js';
import {createCatalogRouter} from './routes-$id/catalog-route.js';
import {errorHandler} from './middlewares-$id/error-handler.js';
import {AppError} from './middlewares-$id/app-error.js';
export function createApp({db,studentId,name,key}) {
 if(!/^[A-Za-z0-9_-]{1,32}$/.test(studentId))throw new Error('Invalid static student ID');
 const app=express();app.disable('x-powered-by');app.use(express.json());
 const repo=createCatalogRepository(db),service=createCatalogService(repo);
 app.use(`/api/${studentId}`,createCatalogRouter(service,{studentId,name,key}));
 app.use((req,res,next)=>next(new AppError('Endpoint not found',404,'ENDPOINT_NOT_FOUND')));
 app.use(errorHandler);
 return app;
}
```

## reference-app/src/server.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/server.js)

```js
import {loadSettings} from './configs-$id/settings.js';
import {createDb} from './configs-$id/db-config.js';
import {createApp} from './app.js';
import {assertPracticeDatabase} from '../../scripts/db-lib.mjs';
const config=loadSettings(),db=createDb(config);
try {
 await assertPracticeDatabase(db);
 const server=createApp({db,...config}).listen(config.appPort,'127.0.0.1',()=>console.log(`Reference API: http://127.0.0.1:${config.appPort}/api/${config.studentId}`));
 server.on('error',async err=>{console.error('Start failed:',err.code||'SERVER_ERROR');await db.end();process.exitCode=1;});
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(async()=>{await db.end();process.exit();}));
} catch(err){console.error('Start failed:',err.code||err.message);await db.end();process.exitCode=1;}
```

## reference-app/src/routes-$id/catalog-route.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/routes-$id/catalog-route.js)

```js
import express from 'express';
import {numericId} from '../services-$id/catalog-service.js';
import {queryParser} from '../middlewares-$id/pagination.js';
import {success} from '../mappers-$id/api-response.js';
import {createProductHandler} from '../solutions-$id/01-create-product.js';
import {readBrandsHandler} from '../solutions-$id/02-read-brands.js';
import {readProductsHandler} from '../solutions-$id/03-read-products.js';
import {readProductDetailHandler} from '../solutions-$id/04-read-product-detail.js';
import {updateProductHandler} from '../solutions-$id/05-update-product.js';
import {deleteProductHandler} from '../solutions-$id/06-delete-product.js';
// Express 5 ส่ง rejected Promise จาก async handler เข้า error middleware ได้
export function createCatalogRouter(service,identity) {
 const router=express.Router();
 router.get('/student-info',(req,res)=>success(res,{studentId:identity.studentId,name:identity.name,secretKey:identity.key}));
 router.get('/brands',readBrandsHandler(service));
 router.get('/brands/:id',async(req,res)=>success(res,await service.getBrand(numericId(req.params.id))));
 router.delete('/brands/:id',async(req,res)=>{await service.removeBrand(numericId(req.params.id));res.status(204).end();});
 router.get('/products',queryParser,readProductsHandler(service));
 router.get('/products/:id',readProductDetailHandler(service));
 router.post('/products',createProductHandler(service));
 router.put('/products/:id',updateProductHandler(service));
 router.delete('/products/:id',deleteProductHandler(service));
 // ตัวอย่าง string key: ไม่ใช้ Number(req.params.code)
 router.get('/tags',async(req,res)=>success(res,await service.listTags()));
 router.get('/tags/:code',async(req,res)=>success(res,await service.getTag(req.params.code)));
 router.post('/tags',async(req,res)=>success(res,await service.createTag(req.body),201));
 router.put('/tags/:code',async(req,res)=>success(res,await service.updateTag(req.params.code,req.body)));
 router.delete('/tags/:code',async(req,res)=>{await service.removeTag(req.params.code);res.status(204).end();});
 // Composite key = product_id + tag_code: ต้องส่งครบทั้งคู่
 router.get('/products/:id/tags',async(req,res)=>success(res,await service.listProductTags(numericId(req.params.id))));
 router.post('/products/:id/tags',async(req,res)=>success(res,await service.createProductTag(numericId(req.params.id),req.body),201));
 router.delete('/products/:id/tags/:code',async(req,res)=>{await service.removeProductTag(numericId(req.params.id),req.params.code);res.status(204).end();});
 return router;
}
```

## reference-app/src/solutions-$id/01-create-product.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/solutions-$id/01-create-product.js)

```js
// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Create: validate/allowlist → INSERT → SELECT detail DTO → 201
import {success} from '../mappers-$id/api-response.js';

export function createProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.createProduct(req.body), 201);
  };
}
```

## reference-app/src/solutions-$id/02-read-brands.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/solutions-$id/02-read-brands.js)

```js
// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Read 1: SELECT brands ORDER BY id → 200 array
import {success} from '../mappers-$id/api-response.js';

export function readBrandsHandler(service) {
  return async function (req, res) {
    return success(res, await service.listBrands());
  };
}
```

## reference-app/src/solutions-$id/03-read-products.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/solutions-$id/03-read-products.js)

```js
// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Read 2: queryParser must run first; list + COUNT → summary DTO + pagination
import {success, metadata} from '../mappers-$id/api-response.js';

export function readProductsHandler(service) {
  return async function (req, res) {
    const {items, total} = await service.listProducts(req.pagination);
    return success(res, items, 200, metadata(total, req.pagination));
  };
}
```

## reference-app/src/solutions-$id/04-read-product-detail.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/solutions-$id/04-read-product-detail.js)

```js
// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Read 3: validate id → SELECT JOIN → missing404 → detail DTO
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function readProductDetailHandler(service) {
  return async function (req, res) {
    return success(res, await service.getProduct(numericId(req.params.id)));
  };
}
```

## reference-app/src/solutions-$id/05-update-product.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/solutions-$id/05-update-product.js)

```js
// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Update: find first, full-body validation, UPDATE then read back; unchanged values200
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function updateProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.updateProduct(numericId(req.params.id), req.body));
  };
}
```

## reference-app/src/solutions-$id/06-delete-product.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/solutions-$id/06-delete-product.js)

```js
// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Delete: find404 or DELETE; 204 has NO JSON body
import {numericId} from '../services-$id/catalog-service.js';

export function deleteProductHandler(service) {
  return async function (req, res) {
    await service.removeProduct(numericId(req.params.id));
    return res.status(204).end();
  };
}
```

## reference-app/src/services-$id/catalog-service.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/services-$id/catalog-service.js)

```js
import {AppError} from '../middlewares-$id/app-error.js';
import {summary,detail} from '../mappers-$id/product-mapper.js';
const fail=message=>{throw new AppError(message);};
function text(value,name,max) {
  if(typeof value!=='string'||!value.trim()||value.trim().length>max)fail(`${name} must be non-empty text (max ${max})`);
  return value.trim();
}
export function numericId(value) {
  if(typeof value!=='string'||!/^\d+$/.test(value)||!Number.isSafeInteger(Number(value))||Number(value)<1)fail('id must be a positive integer');
  return Number(value);
}
function integer(value,name,{nullable=false}={}) {
  if(nullable&&value==null)return null;
  if(!Number.isSafeInteger(value)||value<0||value>2147483647)fail(`${name} must be a non-negative integer`);
  return value;
}
function dateOnly(value) {
  if(value==null)return null;
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1000-01-01'||value>'9999-12-31')fail('release_date must be YYYY-MM-DD');
  const date=new Date(value+'T00:00:00Z');
  if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)fail('release_date must be a valid calendar date');
  return value;
}
export function productInput(body) {
  if(!body||typeof body!=='object'||Array.isArray(body))fail('JSON body must be an object');
  const sku=text(body.sku,'sku',50),name=text(body.name,'name',150),category=text(body.category,'category',50);
  const brand_id=integer(body.brand_id,'brand_id');if(brand_id<1)fail('brand_id must be positive');
  const price=body.price;
  if(typeof price!=='number'||!Number.isFinite(price)||price<0||price>99999999.99||Number(price.toFixed(2))!==price)fail('price must be a number >= 0 with at most 2 decimal places');
  return {sku,name,brand_id,category,price,ram_gb:integer(body.ram_gb,'ram_gb',{nullable:true}),storage_gb:integer(body.storage_gb,'storage_gb',{nullable:true}),
    color:body.color==null?null:text(body.color,'color',50),stock_quantity:integer(body.stock_quantity ?? 0,'stock_quantity'),
    status:body.status===undefined?'AVAILABLE':text(body.status,'status',30),release_date:dateOnly(body.release_date)};
}
function tagCode(value){const code=text(value,'code',32);if(!/^[A-Za-z0-9_-]+$/.test(code))fail('tag code accepts letters, digits, underscore and hyphen');return code;}
const required=(value,message,code)=>{if(!value)throw new AppError(message,404,code);return value;};
export function createCatalogService(repo) {
  const getProduct=async id=>required(await repo.findProduct(id),'Product not found','PRODUCT_NOT_FOUND');
  const getBrand=async id=>required(await repo.findBrand(id),'Brand not found','BRAND_NOT_FOUND');
  const getTag=async code=>required(await repo.findTag(code),'Tag not found','TAG_NOT_FOUND');
  return {
    listBrands:()=>repo.listBrands(),
    getBrand,
    async removeBrand(id){await getBrand(id);if(!await repo.removeBrand(id))throw new AppError('Brand not found',404,'BRAND_NOT_FOUND');},
    async listProducts(pagination){const [items,total]=await Promise.all([repo.listProducts(pagination),repo.countProducts()]);return {items:items.map(summary),total};},
    async getProduct(id){return detail(await getProduct(id));},
    async createProduct(body){const data=productInput(body);if(await repo.findBySku(data.sku))throw new AppError('SKU already exists',409,'DUPLICATE_KEY');const id=await repo.createProduct(data);return detail(await getProduct(id));},
    async updateProduct(id,body){await getProduct(id);const data=productInput(body);const other=await repo.findBySku(data.sku);if(other&&other.id!==id)throw new AppError('SKU already exists',409,'DUPLICATE_KEY');await repo.updateProduct(id,data);return detail(await getProduct(id));},
    async removeProduct(id){await getProduct(id);if(!await repo.removeProduct(id))throw new AppError('Product not found',404,'PRODUCT_NOT_FOUND');},
    listTags:()=>repo.listTags(),
    async getTag(code){return getTag(tagCode(code));},
    async createTag(body){const data={code:tagCode(body?.code),label:text(body?.label,'label',100)};await repo.createTag(data);return getTag(data.code);},
    async updateTag(code,body){code=tagCode(code);await getTag(code);await repo.updateTag(code,text(body?.label,'label',100));return getTag(code);},
    async removeTag(code){code=tagCode(code);await getTag(code);if(!await repo.removeTag(code))throw new AppError('Tag not found',404,'TAG_NOT_FOUND');},
    async listProductTags(id){await getProduct(id);return repo.listProductTags(id);},
    async createProductTag(id,body){await getProduct(id);const code=tagCode(body?.tagCode);await repo.createProductTag(id,code);return {productId:id,tagCode:code};},
    async removeProductTag(id,code){await getProduct(id);code=tagCode(code);if(!await repo.removeProductTag(id,code))throw new AppError('Product/tag pair not found',404,'PRODUCT_TAG_NOT_FOUND');},
  };
}
```

## reference-app/src/repositories-$id/catalog-repository.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/repositories-$id/catalog-repository.js)

```js
// ตาราง/คอลัมน์เป็น source code ที่แก้ตาม schema; ? ใช้กับค่าข้อมูล
const PRODUCT_SELECT = `SELECT p.id,p.sku,p.name,p.brand_id,b.name AS brand_name,
 p.category,p.price,p.ram_gb,p.storage_gb,p.color,p.stock_quantity,p.status,p.release_date
 FROM products p JOIN brands b ON b.id=p.brand_id`;
export function createCatalogRepository(db) {
  async function one(sql, values) {const [rows]=await db.query(sql,values);return rows[0] || null;}
  return {
    async listBrands(){const [rows]=await db.query('SELECT id,name,country_of_origin,website,is_active,created_at FROM brands ORDER BY id');return rows;},
    findBrand:id=>one('SELECT id,name,country_of_origin,website,is_active,created_at FROM brands WHERE id=?',[id]),
    async removeBrand(id){const [result]=await db.query('DELETE FROM brands WHERE id=?',[id]);return result.affectedRows;},
    async listProducts({limit,offset}){const [rows]=await db.query(PRODUCT_SELECT+' ORDER BY p.id LIMIT ? OFFSET ?',[limit,offset]);return rows;},
    async countProducts(){const [[{total}]]=await db.query('SELECT COUNT(*) AS total FROM products');return Number(total);},
    findProduct:id=>one(PRODUCT_SELECT+' WHERE p.id=?',[id]),
    findBySku:sku=>one('SELECT id FROM products WHERE sku=?',[sku]),
    async createProduct(data){const [result]=await db.query('INSERT INTO products SET ?',[data]);return result.insertId;},
    async updateProduct(id,data){await db.query('UPDATE products SET ? WHERE id=?',[data,id]);},
    async removeProduct(id){const [result]=await db.query('DELETE FROM products WHERE id=?',[id]);return result.affectedRows;},
    async listTags(){const [rows]=await db.query('SELECT code,label FROM tags ORDER BY code');return rows;},
    findTag:code=>one('SELECT code,label FROM tags WHERE code=?',[code]),
    async createTag(data){await db.query('INSERT INTO tags SET ?',[data]);},
    async updateTag(code,label){await db.query('UPDATE tags SET label=? WHERE code=?',[label,code]);},
    async removeTag(code){const [result]=await db.query('DELETE FROM tags WHERE code=?',[code]);return result.affectedRows;},
    async listProductTags(id){const [rows]=await db.query('SELECT t.code,t.label FROM product_tags pt JOIN tags t ON t.code=pt.tag_code WHERE pt.product_id=? ORDER BY t.code',[id]);return rows;},
    async createProductTag(id,code){await db.query('INSERT INTO product_tags(product_id,tag_code) VALUES(?,?)',[id,code]);},
    async removeProductTag(id,code){const [result]=await db.query('DELETE FROM product_tags WHERE product_id=? AND tag_code=?',[id,code]);return result.affectedRows;},
  };
}
```

## reference-app/src/mappers-$id/product-mapper.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/mappers-$id/product-mapper.js)

```js
// Allowlist: ห้าม return {...entity} เพราะคอลัมน์ภายในอาจหลุดออกไป
export function summary(entity) {
  return {id:entity.id, sku:entity.sku, name:entity.name, brandId:entity.brand_id,
    category:entity.category, price:Number(entity.price), status:entity.status};
}
export function detail(entity) {
  return {id:entity.id, sku:entity.sku, name:entity.name, brandId:entity.brand_id,
    brandName:entity.brand_name, category:entity.category, price:Number(entity.price),
    ramGb:entity.ram_gb, storageGb:entity.storage_gb, color:entity.color,
    stockQuantity:entity.stock_quantity, status:entity.status,
    releaseDate:entity.release_date == null ? null : entity.release_date instanceof Date
      ? entity.release_date.toISOString().slice(0,10) : String(entity.release_date)};
}
```

## reference-app/src/mappers-$id/api-response.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/mappers-$id/api-response.js)

```js
// ตัวอย่าง W8-like: ปรับชื่อ key/types/status ตามข้อสอบจริงเสมอ
export function success(res, data, status = 200, pagination) {
  return res.status(status).json({success:true, data,
    ...(pagination ? {pagination} : {}), timestamp:new Date().toISOString()});
}
export function metadata(total, {page,limit}) {
  return {total:Number(total),page,limit,totalPages:Math.ceil(total/limit),hasNextPage:page*limit<total,hasPrevPage:page>1};
}
```

## reference-app/src/middlewares-$id/app-error.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/middlewares-$id/app-error.js)

```js
// Error ที่แอปตั้งใจให้ client เห็น: status และ code ต้องใช้ให้ตรงกับ handler
export class AppError extends Error {
  constructor(message, status = 400, code = 'VALIDATION_ERROR') {
    super(message); this.status = status; this.code = code;
  }
}
```

## reference-app/src/middlewares-$id/pagination.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/middlewares-$id/pagination.js)

```js
import { AppError } from './app-error.js';
function positiveInteger(value, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) throw new AppError('page and limit must be positive integers');
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1) throw new AppError('page and limit must be positive integers');
  return n;
}
export function parsePagination(query = {}) {
  const page = positiveInteger(query.page, 1);
  const limit = Math.min(positiveInteger(query.limit, 10), 100);
  const offset = (page - 1) * limit;
  if (!Number.isSafeInteger(offset)) throw new AppError('Requested page is too large');
  return {page, limit, offset};
}
export function queryParser(req, res, next) {
  try { req.pagination = parsePagination(req.query); next(); } catch (err) { next(err); }
}
```

## reference-app/src/middlewares-$id/error-handler.js

[เปิดไฟล์ต้นฉบับ](../reference-app/src/middlewares-$id/error-handler.js)

```js
import { AppError } from './app-error.js';
const MYSQL_ERRORS = {
  ER_DUP_ENTRY: [409,'DUPLICATE_KEY','Resource already exists'],
  ER_NO_REFERENCED_ROW_2: [400,'FOREIGN_KEY_NOT_FOUND','Referenced record does not exist'],
  ER_ROW_IS_REFERENCED_2: [409,'RESOURCE_IN_USE','Resource is referenced by another record'],
};
export function normalizeError(err) {
  const mysql = MYSQL_ERRORS[err?.code];
  const [status, code, message] = mysql || (err instanceof AppError
    ? [err.status, err.code, err.message]
    : err?.type === 'entity.parse.failed' ? [400,'INVALID_JSON','Request body must be valid JSON']
    : [500,'INTERNAL_SERVER_ERROR','Internal server error']);
  return {status,body:{success:false,error:{code,message},timestamp:new Date().toISOString()}};
}
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const result = normalizeError(err);
  return res.status(result.status).json(result.body);
}
```

## scripts/db-lib.mjs

[เปิดไฟล์ต้นฉบับ](../scripts/db-lib.mjs)

```js
import mysql from 'mysql2/promise';
import {readFile} from 'node:fs/promises';
export const MARKER='int161-exam-kit-v1';
export function assertPracticeName(name) {
  if(typeof name!=='string'||name.length>64||!/^int161_practice_[A-Za-z0-9_]+$/.test(name)) throw new Error('Refusing writes: use a dedicated int161_practice_ database');
}
export async function assertPracticeDatabase(db) {
  const [[{name}]]=await db.query('SELECT DATABASE() AS name');
  assertPracticeName(name);
  const [rows]=await db.query('SELECT value FROM _int161_kit_marker WHERE id=1');
  if(rows[0]?.value!==MARKER) throw new Error('Refusing writes: database marker does not match this kit');
}
export async function initializePractice(config) {
  assertPracticeName(config.database);
  const admin=await mysql.createConnection({host:config.host,port:config.port,user:config.user,password:config.password,timezone:'Z'});
  try {
    const [existing]=await admin.query('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=?',[config.database]);
    if(existing.length) {
      await admin.changeUser({database:config.database});
      await assertPracticeDatabase(admin); // An existing unmarked DB is never adopted silently.
    } else {
      await admin.query(`CREATE DATABASE \`${config.database}\` CHARACTER SET utf8mb4`);
      await admin.changeUser({database:config.database});
      await admin.query('CREATE TABLE _int161_kit_marker (id INT PRIMARY KEY,value VARCHAR(80) NOT NULL)');
      await admin.query('INSERT INTO _int161_kit_marker VALUES(1,?)',[MARKER]);
    }
    const schema=await readFile(new URL('../reference-app/sql/schema.sql',import.meta.url),'utf8');
    for(const sql of schema.split(';').map(s=>s.trim()).filter(Boolean)) await admin.query(sql);
    await admin.query("INSERT IGNORE INTO brands(id,name,country_of_origin,website) VALUES (1,'Example Devices','Thailand','https://example.invalid'),(2,'Sample Mobility','Japan','https://example.invalid')");
    for(let id=1;id<=23;id++) await admin.query('INSERT IGNORE INTO products(id,sku,name,brand_id,category,price,ram_gb,storage_gb,color,stock_quantity,status,release_date,internal_cost) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [id,`DEMO-${String(id).padStart(3,'0')}`,`Demo Phone ${id}`,id%2?1:2,'PHONE',id*100,8,128,'Black',id,'AVAILABLE','2026-01-02',id*50]);
    await admin.query("INSERT IGNORE INTO tags(code,label) VALUES ('NA','Not assigned'),('DEMO','Example tag')");
    await admin.query("INSERT IGNORE INTO product_tags(product_id,tag_code) VALUES(1,'DEMO')");
    return config.database;
  } finally {await admin.end();}
}
```

