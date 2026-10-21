# D — ลบสินค้า

ที่มา: [โจทย์ Week08 ที่อาจารย์แจก](../week08-original.md) ลำดับข้อในโฟลเดอร์นี้เป็นการจัดกลุ่มฝึก 1C/3R/1U/1D โดยผู้ช่วย ไม่ใช่การยืนยันลำดับหรือคะแนนข้อสอบกลางภาค

## โจทย์

`DELETE /products/:id` ภายใต้ base path คงที่ `/api/รหัสของตัวเอง` ผลที่ต้องตรวจ: ลบ204ไม่มีbody; ไม่พบ404

## เปิดเฉลย JavaScript

- [handler ข้อนี้](../../reference-app/src/solutions-$id/06-delete-product.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../reference-app/src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../reference-app/src/services-$id/catalog-service.js): ฟังก์ชัน `removeProduct` และ validation
- [repository](../../reference-app/src/repositories-$id/catalog-repository.js): ฟังก์ชัน `findProduct / removeProduct` และ SQL
- [mapper](../../reference-app/src/mappers-$id/product-mapper.js): ไม่ส่ง DTO เมื่อ204
- [error handler](../../reference-app/src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## ทำตามลำดับ

1. ตรวจ id และเช็กว่ามีแถว ถ้าไม่มีตอบ PRODUCT_NOT_FOUND404
2. DELETE WHERE id=? ตรวจ affectedRows เพื่อรับกรณีแถวหายก่อนลบ
3. ตอบ res.status(204).end() ไม่ json() และไม่ส่งข้อความ
4. ถ้า DB ส่ง FK constraint error ให้ error middleware จัดการ ไม่ปล่อยเป็น HTML
5. GETหลังลบและDELETEซ้ำต้อง404 ถ้าโจทย์อื่นกำหนด200+JSONต้องเปลี่ยนตามสเปกนั้น

## SQL หลัก

```sql
DELETE FROM products WHERE id=?;
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

ลบเฉพาะ product ที่ตนสร้าง เก็บ response text ต้องว่าง และตรวจใน DB/GETว่าแถวหาย

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
