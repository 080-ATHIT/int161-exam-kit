# U — แก้ไขสินค้า

ที่มา: [โจทย์ Week08 ที่อาจารย์แจก](../week08-original.md) ลำดับข้อในโฟลเดอร์นี้เป็นการจัดกลุ่มฝึก 1C/3R/1U/1D โดยผู้ช่วย ไม่ใช่การยืนยันลำดับหรือคะแนนข้อสอบกลางภาค

## โจทย์

`PUT /products/:id` ภายใต้ base path คงที่ `/api/รหัสของตัวเอง` ผลที่ต้องตรวจ: แก้ไข200; id ไม่มี404; SKUชนอีกแถว409ตามนโยบายชุดฝึก

## เปิดเฉลย JavaScript

- [handler ข้อนี้](../../reference-app/src/solutions-$id/05-update-product.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../reference-app/src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../reference-app/src/services-$id/catalog-service.js): ฟังก์ชัน `updateProduct` และ validation
- [repository](../../reference-app/src/repositories-$id/catalog-repository.js): ฟังก์ชัน `findProduct / findBySku / updateProduct` และ SQL
- [mapper](../../reference-app/src/mappers-$id/product-mapper.js): detail
- [error handler](../../reference-app/src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## ทำตามลำดับ

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
