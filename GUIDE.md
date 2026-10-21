# Guide ใช้เอกสารและเฉลย INT161

## 1. เริ่มจากโจทย์และกรอบสอบ

อ่าน [ประกาศสอบ](EXAM.md) และ [ต้นฉบับ Week08 ที่ตัดข้อมูลเฉพาะบุคคล](questions/week08-original.md) ก่อน ใบงาน Week08 มี8endpoints เมื่อนับ student-info, brands list/detail และ products5endpoints

ผู้ช่วยเลือก6endpointsให้เข้ากรอบฝึก 1C/3R/1U/1D: POST products, GET brands, GET products, GET products/:id, PUT products/:id, DELETE products/:id ส่วน GET student-info และ GET brands/:id ยังอยู่ในโค้ด/ใบงานเป็นส่วนประกอบที่ต้องอ่านเพิ่ม ไม่ถือว่าไม่ออกสอบ

## 2. เปิดโจทย์คู่กับ JS ตามข้อ

1. [Create](questions/six-tasks/01-create-product.md): validation → INSERT → SELECT →201
2. [Read brands](questions/six-tasks/02-read-brands.md): SELECT list →200
3. [Read products](questions/six-tasks/03-read-products.md): page/limit → COUNT/LIMIT/OFFSET → summary DTO
4. [Read detail](questions/six-tasks/04-read-product-detail.md): JOIN →404เมื่อไม่พบ → detail DTO
5. [Update](questions/six-tasks/05-update-product.md): ตรวจแถว/ซ้ำ → UPDATE →อ่านกลับ200 แม้ค่าเดิม
6. [Delete](questions/six-tasks/06-delete-product.md): ตรวจแถว → DELETE →204ว่าง

แต่ละ .md มีโจทย์, ลิงก์เฉลย .js, วิธีทำทีละชั้น, SQL หลัก, request และผลที่ต้องตรวจ เฉลย JS ไม่ได้อยู่ใน HTML และไม่ต้องใช้ skill เพื่อเปิดหรือแก้

## 3. อ่านโค้ดเป็นลำดับ

[app.js](reference-app/src/app.js) → [routes](reference-app/src/routes-$id/catalog-route.js) → handlerใน solutions-$id → [service](reference-app/src/services-$id/catalog-service.js) → [repository](reference-app/src/repositories-$id/catalog-repository.js) → [mapper](reference-app/src/mappers-$id/product-mapper.js)

error จาก service/DB ส่งไป [error-handler.js](reference-app/src/middlewares-$id/error-handler.js) จุดเดียว ไม่ส่ง SQL/stack/password กลับ client

## 4. เมื่อโจทย์เปลี่ยน ต้องแก้ตรงไหน

จด method/path/key/body/DTO/status/pagination ก่อนเริ่ม ดู [Contract Sheet](guides/01-contract.md) แล้วแก้ตามลำดับ schema → SQL → validation/service → DTO → route/handler → request/assertions

- SQL/table/PK/FK: repository
- ฟิลด์รับเข้า/เงื่อนไข: service
- ฟิลด์ออก/ชื่อcamelCase/number/date/null: mapper
- path/status/body: route/handler/response helper
- page/limit/default/cap: pagination middleware + SQL + metadata
- DB error/404/409/400: AppError และ error middleware

ชื่อ folder `-$id` ในตัวอย่างเป็นชื่อตาม template ถ้าอาจารย์ให้เปลี่ยนเป็นรหัสตัวเอง ให้แก้ชื่อ folder และ import ทุกแห่งด้วย

[วิธีย้ายเข้า template และเปิด port](guides/05-template.md) — อย่าคัดลอก handlerเดี่ยวแล้วคิดว่ารันได้ ต้องมีทุก layer ที่ import และตั้ง entry/start ให้ครบ

## 5. ลองและเตรียมออฟไลน์

[ติดตั้งและเปิดโค้ด](START-HERE.th.md), [requests](requests/catalog.http), [ก่อนตัดเน็ตและส่ง LEB2](guides/06-offline.md)

เปิด .md/.js จากเครื่องได้ทันทีโดยไม่ใช้ server แต่การรัน API ต้องมี Node/dependencies/MySQL พร้อมแล้ว เตรียมทั้งหมดในช่วงที่อนุญาตให้ใช้เน็ต ใช้บัญชี LEB2 ของตัวเองรับส่งตามประกาศ

## 6. อะไรที่ผู้ช่วยเพิ่ม

ดู [SOURCES.md](questions/SOURCES.md) และ [SUPPLEMENTS.md](SUPPLEMENTS.md) ทุกตัวอย่างแต่งเพิ่มแยกจากโจทย์อาจารย์ ชุดฝึกใช้ seedสมมติ ไม่ใช่ SQL/ข้อมูลข้อสอบเดิม ดังนั้นจำนวนข้อมูล/ชื่อสินค้า/brand จะแตกต่างจากใบงาน การผ่าน testไม่ใช่การรับรองว่าได้คะแนนข้อสอบจริง
