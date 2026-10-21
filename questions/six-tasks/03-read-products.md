# R2 — อ่านรายการสินค้า + Pagination + Summary DTO

ที่มา: [โจทย์ Week08 ที่อาจารย์แจก](../week08-original.md) ลำดับข้อในโฟลเดอร์นี้เป็นการจัดกลุ่มฝึก 1C/3R/1U/1D โดยผู้ช่วย ไม่ใช่การยืนยันลำดับหรือคะแนนข้อสอบกลางภาค

## โจทย์

`GET /products?page=1&limit=10` ภายใต้ base path คงที่ `/api/รหัสของตัวเอง` ผลที่ต้องตรวจ: 200; query ผิด400ตามนโยบายชุดฝึก

## เปิดเฉลย JavaScript

- [handler ข้อนี้](../../reference-app/src/solutions-$id/03-read-products.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../reference-app/src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../reference-app/src/services-$id/catalog-service.js): ฟังก์ชัน `listProducts` และ validation
- [repository](../../reference-app/src/repositories-$id/catalog-repository.js): ฟังก์ชัน `listProducts / countProducts` และ SQL
- [mapper](../../reference-app/src/mappers-$id/product-mapper.js): summary
- [error handler](../../reference-app/src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## ทำตามลำดับ

1. queryParser ตรวจ page/limit ก่อน handler แล้วเก็บ {page,limit,offset} ใน req.pagination
2. normalize limit ก่อนหา offset=(page-1)*limit ไม่ใช้ parseInt กับค่าที่มีตัวอักษรปน
3. repository SELECT รายการ ORDER BY p.id LIMIT ? OFFSET ? และ COUNT(*) ทั้งหมด
4. service map เฉพาะ summary: id,sku,name,brandId,category,price,status
5. metadata ใช้ total จริง, totalPages=Math.ceil(total/limit), hasNextPage/hasPrevPage
6. ส่ง data/pagination/timestamp; ถ้าหน้าเกินให้ [] และ total เดิม ถ้าไม่มีข้อมูล total=0 ต้องไม่ถูก fallback

## SQL หลัก

```sql
SELECT p.id,p.sku,p.name,p.brand_id,p.category,p.price,p.status
FROM products p ORDER BY p.id LIMIT ? OFFSET ?;
SELECT COUNT(*) AS total FROM products;
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

ลอง page1/page2/หน้าเกิน, total0, limit500 และ page0; default limit10/max100/reject queryผิดเป็นนโยบายที่ผู้ช่วยเพิ่มเพื่อฝึก ต้องปรับตามโจทย์จริง

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
