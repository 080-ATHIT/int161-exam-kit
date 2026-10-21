# วิธีปรับ template: 05-update-product

## ไฟล์ที่ใช้ร่วมกัน

- [handler ข้อนี้](../../src/controllers-$id/05-update-product.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../src/services-$id/catalog-service.js): ฟังก์ชัน `updateProduct` และ validation
- [repository](../../src/repositories-$id/catalog-repository.js): ฟังก์ชัน `findProduct / findBySku / updateProduct` และ SQL
- [mapper](../../src/mappers-$id/product-mapper.js): detail
- [error handler](../../src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## แก้ตามโจทย์ที่ได้รับ

1. ตรวจว่ามี id ก่อน ถ้าไม่พบ throw404
2. ชุดฝึกใช้ full body เหมือน POST: ผ่าน productInput และ allowlist
3. ถ้า SKU ถูกใช้โดยอีก id ตอบ409 แต่ SKUเดิมของตัวเองใช้ได้
4. UPDATE WHERE id=? ด้วย data ที่ตรวจแล้ว
5. SELECT กลับแล้วส่ง detail DTO200 ห้ามใช้ changedRows===0 แปลว่าไม่มีแถว เพราะการส่งค่าเดิมเป็น update ที่สำเร็จได้

## SQL หลัก

```sql
UPDATE products SET ? WHERE id=?;
-- parameters: [data, id]
```

## Body สำหรับลอง

```json
{"sku":"PRACTICE-NEW-001","name":"Practice Phone Updated","brand_id":1,"category":"FLAGSHIP","price":0,"ram_gb":8,"storage_gb":256,"color":"Black","stock_quantity":10,"status":"AVAILABLE","release_date":"2026-01-01"}
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

ส่งค่าเดิมซ้ำยัง200, price0คง0, GETซ้ำเห็นชื่อใหม่; full-body PUT และ validation ละเอียดเป็นนโยบายผู้ช่วยเพิ่ม ใบงานจริงระบุ status200/404 แต่ไม่ได้แจกแจงทุกเงื่อนไข

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
