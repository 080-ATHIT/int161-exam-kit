# 08 — Complete Code Template

โค้ดในบทนี้คือโครงที่รันได้ในsrc ไม่ใช่โจทย์ให้ทำเพิ่ม อ่านคอมเมนต์ADAPTแล้วเปลี่ยนตามสเปก ดู [GUIDE](../GUIDE.md) สำหรับลำดับแก้โครงและ [START-HERE](../START-HERE.th.md) เพื่อเปิดserver

ไฟล์.jsที่ลิงก์เป็นsourceรันจริง codeblocksเป็นสำเนาให้อ่านต่อเนื่อง ไม่คัดลอกทั้งบทมารวมเป็นไฟล์เดียว คงimportsและชื่อfolderให้ตรง

ใช้DB_MODE=practiceเปิดโครงเดิม หรือDB_MODE=examพร้อมDB_NAME/STUDENT_ID/STUDENT_NAME/STUDENT_KEYเป็นค่าจริงครบเพื่อเชื่อมฐานโจทย์โดยไม่สร้าง/resettable ใช้[schemaตัวอย่าง](../sql/schema.sql)เฉพาะโหมดpractice โหมดexamปรับSQL/requiredfields/DTOตามโจทย์ก่อน

## src/configs-$id/settings.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/configs-$id/settings.js)

```js
function port(value, fallback) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value)) || Number(value)<1 || Number(value)>65535) throw new Error('Port must be an integer from 1 to 65535');
  return Number(value);
}
export function loadSettings(env = process.env) {
  // ADAPT 1: .env ระบุ DB ของโจทย์, mode และ identity ของตัวเอง ห้าม commit password
  const dbMode = env.DB_MODE || 'practice';
  if (!['practice','exam'].includes(dbMode)) throw new Error('DB_MODE must be practice or exam');
  if (dbMode === 'exam') {
    // ห้ามใช้fallbackหรือprofileตัวอย่างไปส่งสอบ ข้อความerrorระบุชื่อfieldเท่านั้น
    const placeholders = new Set(['demo001','your_actual_id','demo student','your name','fictional-key','key_from_spec']);
    for (const field of ['DB_NAME','STUDENT_ID','STUDENT_NAME','STUDENT_KEY']) {
      const value = env[field];
      if (typeof value !== 'string' || !value.trim() || placeholders.has(value.trim().toLowerCase())) {
        throw new Error(`Exam mode requires an actual value for ${field}`);
      }
    }
  }
  const database = env.DB_NAME || 'int161_practice_catalog';
  const testDatabase = env.TEST_DB_NAME || 'int161_practice_tests';
  for (const name of [database,testDatabase]) if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(name)) throw new Error('Invalid database identifier');
  const studentId = env.STUDENT_ID || 'demo001';
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(studentId)) throw new Error('STUDENT_ID must be a static identifier, not a route parameter or path');
  return {dbMode,host:env.DB_HOST || '127.0.0.1',port:port(env.DB_PORT,3306),user:env.DB_USER || 'root',password:env.DB_PASSWORD || '',database,testDatabase,
    appPort:port(env.PORT,3000),studentId,name:env.STUDENT_NAME || 'Demo Student',key:env.STUDENT_KEY || 'fictional-key'};
}
```

## src/configs-$id/db-config.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/configs-$id/db-config.js)

```js
import mysql from 'mysql2/promise';
export function createDb(config) {
  return mysql.createPool({host:config.host,port:config.port,user:config.user,password:config.password,database:config.database,
    connectionLimit:5,waitForConnections:true,timezone:'Z',dateStrings:['DATE']});
}
```

## src/configs-$id/database-mode.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/configs-$id/database-mode.js)

```js
// ADAPT: DB_MODE=practice ใช้ฐานตัวอย่าง; DB_MODE=exam ใช้ DB_NAME ตามโจทย์โดยไม่สร้าง/resetฐาน
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

export async function assertAppDatabase(db, config) {
  if (config.dbMode === 'practice') return assertPracticeDatabase(db);
  if (config.dbMode !== 'exam') throw new Error('DB_MODE must be practice or exam');
  // อ่านอย่างเดียว: การสร้าง/นำเข้า schema ข้อสอบทำตามไฟล์ SQL ของอาจารย์เอง
  await db.query('SELECT 1');
}
```

## src/app.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/app.js)

```js
// ADAPT: base path คงที่ตามรหัสใน .env; เปลี่ยน resource/router เมื่อโจทย์ใช้ตารางอื่น
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

## src/server.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/server.js)

```js
import {loadSettings} from './configs-$id/settings.js';
import {createDb} from './configs-$id/db-config.js';
import {createApp} from './app.js';
import {assertAppDatabase} from './configs-$id/database-mode.js';
const config=loadSettings(),db=createDb(config);
try {
 await assertAppDatabase(db,config);
 const server=createApp({db,...config}).listen(config.appPort,'127.0.0.1',()=>console.log(`Template API: http://127.0.0.1:${config.appPort}/api/${config.studentId}`));
 server.on('error',async err=>{console.error('Start failed:',err.code||'SERVER_ERROR');await db.end();process.exitCode=1;});
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(async()=>{await db.end();process.exit();}));
} catch(err){console.error('Start failed:',err.code||err.message);await db.end();process.exitCode=1;}
```

## src/routes-$id/catalog-route.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/routes-$id/catalog-route.js)

```js
// ADAPT: เปลี่ยน method/path ให้ตรงข้อสอบ; controllers รับreq/res, serviceถือbusinesslogic
import express from 'express';
import {numericId} from '../services-$id/catalog-service.js';
import {queryParser} from '../middlewares-$id/pagination.js';
import {success} from '../mappers-$id/api-response.js';
import {createProductHandler} from '../controllers-$id/01-create-product.js';
import {readBrandsHandler} from '../controllers-$id/02-read-brands.js';
import {readProductsHandler} from '../controllers-$id/03-read-products.js';
import {readProductDetailHandler} from '../controllers-$id/04-read-product-detail.js';
import {updateProductHandler} from '../controllers-$id/05-update-product.js';
import {deleteProductHandler} from '../controllers-$id/06-delete-product.js';
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

## src/controllers-$id/01-create-product.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/controllers-$id/01-create-product.js)

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Create: validate/allowlist → INSERT → SELECT detail DTO → 201
import {success} from '../mappers-$id/api-response.js';

export function createProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.createProduct(req.body), 201);
  };
}
```

## src/controllers-$id/02-read-brands.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/controllers-$id/02-read-brands.js)

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 1: SELECT brands ORDER BY id → 200 array
import {success} from '../mappers-$id/api-response.js';

export function readBrandsHandler(service) {
  return async function (req, res) {
    return success(res, await service.listBrands());
  };
}
```

## src/controllers-$id/03-read-products.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/controllers-$id/03-read-products.js)

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 2: queryParser must run first; list + COUNT → summary DTO + pagination
import {success, metadata} from '../mappers-$id/api-response.js';

export function readProductsHandler(service) {
  return async function (req, res) {
    const {items, total} = await service.listProducts(req.pagination);
    return success(res, items, 200, metadata(total, req.pagination));
  };
}
```

## src/controllers-$id/04-read-product-detail.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/controllers-$id/04-read-product-detail.js)

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 3: validate id → SELECT JOIN → missing404 → detail DTO
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function readProductDetailHandler(service) {
  return async function (req, res) {
    return success(res, await service.getProduct(numericId(req.params.id)));
  };
}
```

## src/controllers-$id/05-update-product.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/controllers-$id/05-update-product.js)

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Update: find first, full-body validation, UPDATE then read back; unchanged values200
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function updateProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.updateProduct(numericId(req.params.id), req.body));
  };
}
```

## src/controllers-$id/06-delete-product.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/controllers-$id/06-delete-product.js)

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Delete: find404 or DELETE; 204 has NO JSON body
import {numericId} from '../services-$id/catalog-service.js';

export function deleteProductHandler(service) {
  return async function (req, res) {
    await service.removeProduct(numericId(req.params.id));
    return res.status(204).end();
  };
}
```

## src/services-$id/catalog-service.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/services-$id/catalog-service.js)

```js
// ADAPT: แก้productInputให้ตรงbody/required/defaultsของโจทย์; ไม่ส่งreq.bodyตรงลงSQL
// ต่อไปแก้unique rule/not-found/ชื่อerror และเลือกsummary/detailให้ตรงแต่ละendpoint
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
// ADAPT BODY: เปลี่ยนfield/type/nullability/maxตามschemaจริง (PUTนี้ใช้full body)
export function productInput(body) {
  if(!body||typeof body!=='object'||Array.isArray(body))fail('JSON body must be an object');
  const sku=text(body.sku,'sku',50),name=text(body.name,'name',150),category=text(body.category,'category',50);
  const brand_id=integer(body.brand_id,'brand_id');if(brand_id<1)fail('brand_id must be positive');
  const price=body.price;
  if(typeof price!=='number'||!Number.isFinite(price)||price<0||price>99999999.99||Number(price.toFixed(2))!==price)fail('price must be a number >= 0 with at most 2 decimal places');
  return {sku,name,brand_id,category,price,ram_gb:integer(body.ram_gb,'ram_gb'),storage_gb:integer(body.storage_gb,'storage_gb'),
    color:text(body.color,'color',50),stock_quantity:integer(body.stock_quantity ?? 0,'stock_quantity'),
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
    async listProducts(pagination) {
      // ADAPT READ: เพิ่มfilterต้องส่งไปทั้งlistและcountด้วย
      const [items, total] = await Promise.all([
        repo.listProducts(pagination), repo.countProducts()
      ]);
      return {items: items.map(summary), total};
    },
    async getProduct(id){return detail(await getProduct(id));},
    // CREATE: ใช้insertIdเฉพาะauto increment; string PKอ่านกลับด้วยkeyที่รับมา
    async createProduct(body) {
      const data = productInput(body);
      if (await repo.findBySku(data.sku)) {
        throw new AppError('SKU already exists', 409, 'DUPLICATE_KEY');
      }
      const id = await repo.createProduct(data);
      return detail(await getProduct(id));
    },
    // UPDATE: ตรวจว่ามีแถวก่อน; ค่าเดิมยังสำเร็จ อย่าใช้changedRows0เป็น404
    async updateProduct(id, body) {
      await getProduct(id);
      const data = productInput(body);
      const other = await repo.findBySku(data.sku);
      if (other && other.id !== id) {
        throw new AppError('SKU already exists', 409, 'DUPLICATE_KEY');
      }
      await repo.updateProduct(id, data);
      return detail(await getProduct(id));
    },
    // DELETE: repoคืนaffectedRows; FKerrorให้middlewareกลางแปลง
    async removeProduct(id) {
      await getProduct(id);
      if (!await repo.removeProduct(id)) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
    },
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

## src/repositories-$id/catalog-repository.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/repositories-$id/catalog-repository.js)

```js
// ADAPT: เปลี่ยนtable/column/PK/FK/WHERE/JOINตรงschemaโจทย์; bindค่าด้วย? เสมอ
// list และ COUNT ต้องใช้filterเดียวกัน; string/composite keyอยู่ด้านล่างสำหรับหยิบใช้เมื่อจำเป็น
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

## src/mappers-$id/product-mapper.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/mappers-$id/product-mapper.js)

```js
// ADAPT: แก้allowlist/ชื่อfield/typeตามresponseโจทย์; summaryกับdetailอาจต่างกัน
// brandNameมาจากJOINalias brand_name; ถ้าเปลี่ยนSQLต้องแก้mapperให้ตรงกัน
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

## src/mappers-$id/api-response.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/mappers-$id/api-response.js)

```js
// ADAPT: เปลี่ยนenvelopeเฉพาะตามcontract: success/data/timestamp หรือ status/data
// DELETE204ไม่ผ่านhelperนี้ ใช้end(); DELETE200จึงส่งJSONตามสเปก
// ตัวอย่าง W8-like: ปรับชื่อ key/types/status ตามข้อสอบจริงเสมอ
export function success(res, data, status = 200, pagination) {
  return res.status(status).json({success:true, data,
    ...(pagination ? {pagination} : {}), timestamp:new Date().toISOString()});
}
export function metadata(total, {page,limit}) {
  return {total:Number(total),page,limit,totalPages:Math.ceil(total/limit),hasNextPage:page*limit<total,hasPrevPage:page>1};
}
```

## src/middlewares-$id/app-error.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/middlewares-$id/app-error.js)

```js
// Error ที่แอปตั้งใจให้ client เห็น: status และ code ต้องใช้ให้ตรงกับ handler
export class AppError extends Error {
  constructor(message, status = 400, code = 'VALIDATION_ERROR') {
    super(message); this.status = status; this.code = code;
  }
}
```

## src/middlewares-$id/pagination.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/middlewares-$id/pagination.js)

```js
// ADAPT: default page/limit, maxlimit และinvalid-query policyตามโจทย์ ไม่ยึดค่าตัวอย่างเสมอ
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

## src/middlewares-$id/error-handler.js

[เปิดJSและแก้ตรงไฟล์นี้](../src/middlewares-$id/error-handler.js)

```js
// ADAPT: จับคู่HTTPstatus/errorcode/message/envelopeกับโจทย์จริง รวมMySQL1062/1452/1451
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

