# C — เพิ่มสินค้า

ที่มา: [โจทย์ Week08 ที่อาจารย์แจก](../week08-original.md) ลำดับข้อในโฟลเดอร์นี้เป็นการจัดกลุ่มฝึก 1C/3R/1U/1D โดยผู้ช่วย ไม่ใช่การยืนยันลำดับหรือคะแนนข้อสอบกลางภาค

## โจทย์

`POST /products` ภายใต้ base path คงที่ `/api/รหัสของตัวเอง` ผลที่ต้องตรวจ: 201; SKU ซ้ำ409; input ผิด400; FK ไม่มี400

## เปิดเฉลย JavaScript

- [handler ข้อนี้](../../reference-app/src/solutions-$id/01-create-product.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../reference-app/src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../reference-app/src/services-$id/catalog-service.js): ฟังก์ชัน `createProduct` และ validation
- [repository](../../reference-app/src/repositories-$id/catalog-repository.js): ฟังก์ชัน `createProduct / findBySku / findProduct` และ SQL
- [mapper](../../reference-app/src/mappers-$id/product-mapper.js): detail
- [error handler](../../reference-app/src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## ทำตามลำดับ

1. รับ body เป็น snake_case จากโจทย์ เช่น sku/name/brand_id/category/price รวมรายละเอียดสเปกโทรศัพท์
2. service.productInput ตรวจชนิดและเลือกฟิลด์ที่อนุญาต ไม่ส่ง req.body ทั้งก้อนลงฐาน
3. เช็ก SKU ซ้ำ จากนั้น INSERT ด้วย parameter binding และอ่าน result.insertId
4. SELECT ใหม่พร้อม JOIN brands เพื่อคืน detail DTO แล้วตอบ201
5. UNIQUE ใน DB ยังต้องมี เพราะการเช็กก่อน INSERT อย่างเดียวกัน request พร้อมกันไม่ได้

## SQL หลัก

```sql
INSERT INTO products SET ?;
-- mysql2.query รับ [data] โดย data ผ่าน allowlist แล้ว
```

## Body สำหรับลอง

```json
{"sku":"PRACTICE-NEW-001","name":"Practice Phone","brand_id":1,"category":"FLAGSHIP","price":29900,"ram_gb":8,"storage_gb":256,"color":"Black","stock_quantity":10,"status":"AVAILABLE","release_date":"2026-01-01"}
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

ส่ง body เดิมซ้ำต้อง409 ไม่ใช่500 เก็บ data.id ที่ได้ไว้ใช้กับข้อ detail/update/delete

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
