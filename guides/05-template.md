# ดัดแปลงไป teacher template

reference-app เป็นตัวอย่างให้ศึกษา ไม่ใช่ไฟล์พร้อมส่ง ต้องใช้ template ที่อาจารย์แจกในวันสอบและแก้ ID/schema/contract จากโจทย์จริง ไม่รัน script ทับ project สอบอัตโนมัติ

## แผนที่ไฟล์

| Kit | ใส่ที่ teacher src | หน้าที่ |
| --- | --- | --- |
| configs-$id/settings.js, db-config.js | configs-$id/ | env และ pool |
| solutions-$id/*.js | solutions-$id/ | handler แยกตาม6ข้อ |
| routes-$id/catalog-route.js | routes-$id/ | endpoints |
| services-$id/catalog-service.js | services-$id/ | validation/business |
| repositories-$id/catalog-repository.js | repositories-$id/ | SQL |
| mappers-$id/product-mapper.js, api-response.js | mappers-$id/ | DTO/envelope |
| middlewares-$id/*.js | middlewares-$id/ | error/pagination |
| app.js | src/app.js | ประกอบ layers |

คัดลอกโดยอ่านทีละไฟล์ ลบหรือเลิก import placeholder เดิมที่ไม่ได้ใช้ folder `-$id` ใน kit เป็นชื่อตัวอักษรจริง หากอาจารย์ให้แทนด้วยรหัสตัวเอง ต้อง rename แล้วแก้ import ทุกแห่งให้ตรงกัน `.js` extension ต้องมีใน ESM และ package.json ต้อง type:module

## Entry point ต้องแก้ด้วย

`app.js` ของ kit export factory จึงไม่เปิด port ด้วยตัวเอง สร้าง `src/server.js` ใน template ดังนี้ (หลังตรวจ config และสิทธิ์ DB ตามโจทย์):

```js
import {createApp} from './app.js';
import {loadSettings} from './configs-$id/settings.js';
import {createDb} from './configs-$id/db-config.js';
const config=loadSettings();
const db=createDb(config);
await db.query('SELECT 1');
createApp({db,studentId:config.studentId,name:config.name,key:config.key})
  .listen(config.appPort,'127.0.0.1');
```

ตั้ง start เป็น `node --env-file-if-exists=.env src/server.js` ใน teacher package.json รักษา dependency ของอาจารย์ไว้ จากนั้นแก้ schema, repository, service, mapper, routes ให้ตรงข้อสอบทั้งหมด

server.js ของ reference-app ตรวจ marker ฐานฝึกและ import script นอก src ห้ามคัดลอกตัวนั้นตรง ๆ เข้า template สอบ ตัวอย่าง entry ด้านบนไม่พึ่ง marker และเชื่อม DB ที่ตั้งไว้จริง จึงต้องตรวจ DB_NAME ให้ถูกก่อนทำ request ที่แก้ข้อมูล ไม่ใช้ db:init หรือ npm test ของ kit กับฐานสอบ

## สิ่งที่ต้องเปลี่ยนทุกครั้ง

1. static STUDENT_ID, name/key ที่โจทย์ของตัวเองกำหนดใน .env เท่านั้น
2. DB config / SQL schema / table / columns / PK / FK / UNIQUE
3. input และ validation รวม partial/full PUT
4. list/detail DTO, aliases, type number/date/null
5. envelope, status, pagination policy และ endpoint ทั้งหมด
6. requests และ assertions ตามสเปก ไม่ใช้ expected output เก่าทั้งชุด

## ตรวจ migration โดยไม่แตะ project จริง

```sh
npm run verify:template -- --template /absolute/path/midterm-exam-esm-template.zip
```

สคริปต์แตก ZIP ใน temp directory เท่านั้น ตรวจ dependency family ของ template แล้วคัดลอก source ที่ระบุในตาราง (app + configs/routes/services/repositories/mappers/middlewares/solutions) จาก kit เข้า src ของ temp template ใช้ node_modules ที่ติดตั้งแล้วและรัน contract tests ชุดเดียวกันกับ MySQL ฐานฝึก ไม่ใช่เครื่องมือทำข้อสอบอัตโนมัติ และไม่พิสูจน์ว่า schema/โจทย์ในวันสอบเหมือนชุดฝึก
