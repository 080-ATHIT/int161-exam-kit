# เลือก recipe ตาม Contract Sheet

Prerequisite ทุกชิ้น: ESM, Express5, mysql2/promise pool, schema ที่อ่านแล้ว และ database ฝึกก่อนใช้กับงานจริง อย่าคัดลอก import ที่ชี้กลับ src โดยไม่ปรับตำแหน่งไฟล์

## Response W6

ใช้เมื่อ envelope ในโจทย์เป็น status/data หรือ status/error และ DELETE200 ตรวจช่อง response/status ใน Contract Sheet ก่อนแก้

1. วาง w6Success ใน mappers-$id/api-response.js และ w6ErrorHandler ใน middlewares-$id/error-handler.js
2. ย้าย normalizeError ไปไฟล์กลาง หรือคงไว้เป็น export ใน error-handler เดิมแล้วปรับ import โดยหลีกเลี่ยง import ตัวเอง
3. เปลี่ยน route ให้เรียก helper ใหม่ ติด error handler ใหม่หลัง router; ปรับapp/routerและhelperในsrcให้เข้าคู่ ไม่มีprojectโจทย์ใหม่ที่ต้องทำเพิ่ม

```js
// route context: service.removeTag ต้องคืนค่าหลังลบสำเร็จหรือ throw
router.delete('/tags/:code',async(req,res)=>{
 await service.removeTag(req.params.code);
 return w6Success(res,{code:req.params.code,deleted:true},200);
});
```

Request DELETE /tags/คีย์ที่สร้างเอง คาด 200 `{status:'success',data:{code:...,deleted:true}}` จากนั้น GET เดิม404 หากยัง204 แปลว่า route ยังเรียก end() แบบเก่า วิธีตรวจหนึ่งขั้น: ดู raw response status/body ก่อนแก้ mapper

## Optional pagination

ใช้เฉพาะเมื่อโจทย์กำหนดว่าไม่มี page/limit ให้คืนทั้งหมด ตรวจช่อง pagination policy และ response metadata ก่อนแก้ parser → service → repository → route ให้ครบ

```js
import {parseOptionalPagination} from './optional-pagination.js';
// ใน route: parser คืน null เมื่อไม่มีทั้งสอง query เท่านั้น
const page=parseOptionalPagination(req.query);
// ใน repository: table/columns/order เป็น source code ไม่ใช่ request
const [rows]=page
 ? await db.query('SELECT id,name FROM products ORDER BY id LIMIT ? OFFSET ?',[page.limit,page.offset])
 : await db.query('SELECT id,name FROM products ORDER BY id');
// ส่ง DTO และ metadata เฉพาะตาม contract ที่โจทย์กำหนด
```

GET /products ไม่มี query ควรครบทุกแถว; ?page=2 ใช้ default limit10; ?page=0 ต้อง400 หากไม่มี query ได้10แถว แปลว่า repo ยังใช้ LIMIT เสมอ วิธีตรวจ: เทียบจำนวนกับ COUNT บนฐานที่มีมากกว่า10แถว

## String/composite repository

ใช้เมื่อ PK เป็น VARCHAR หรือมีหลายคอลัมน์ ตรวจช่อง schema/key/404 ใน Contract Sheet เปลี่ยน repository ก่อน แล้วแก้ service validator และ route params ตามชนิดคีย์

```js
import {findTag,findProductTag} from './string-composite-repository.js';
const tag=await findTag(db,'NA');
if(!tag)throw new AppError('Tag not found',404,'TAG_NOT_FOUND');
const link=await findProductTag(db,1,'DEMO');
// ต้องตรวจ null ก่อน mapper และ validate ทั้ง productId/tagCode ก่อนเรียก
```

GET /tags/NA ควรได้ data.code='NA'; คู่(1,DEMO) พบแต่(1,NA)ไม่พบ ถ้าเกิดNaNให้เลิกแปลง string keyเป็นNumber ถ้าคู่ผิดยังพบให้เช็ก WHERE ว่ามีทั้งสองคอลัมน์ วิธีตรวจหนึ่งขั้น: ส่งอีก tagCode กับ productId เดิมแล้วต้องไม่พบ

ทดสอบ recipe จริงด้วย `node --env-file-if-exists=.env --test tests/recipes.test.js` ใช้ฐานฝึกที่มี marker รวมทั้ง query บน MySQL จริง
