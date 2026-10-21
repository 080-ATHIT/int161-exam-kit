# R1 — อ่านรายการแบรนด์

ที่มา: [โจทย์ Week08 ที่อาจารย์แจก](../week08-original.md) ลำดับข้อในโฟลเดอร์นี้เป็นการจัดกลุ่มฝึก 1C/3R/1U/1D โดยผู้ช่วย ไม่ใช่การยืนยันลำดับหรือคะแนนข้อสอบกลางภาค

## โจทย์

`GET /brands` ภายใต้ base path คงที่ `/api/รหัสของตัวเอง` ผลที่ต้องตรวจ: 200; ไม่มีข้อมูลให้ data เป็น []

## เปิดเฉลย JavaScript

- [handler ข้อนี้](../../reference-app/src/solutions-$id/02-read-brands.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../reference-app/src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../reference-app/src/services-$id/catalog-service.js): ฟังก์ชัน `listBrands` และ validation
- [repository](../../reference-app/src/repositories-$id/catalog-repository.js): ฟังก์ชัน `listBrands` และ SQL
- [mapper](../../reference-app/src/mappers-$id/product-mapper.js): ไม่ใช้ product mapper คืนฟิลด์ brands ตามใบงาน
- [error handler](../../reference-app/src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## ทำตามลำดับ

1. route เรียก service.listBrands โดยไม่รับ body
2. repository SELECT ฟิลด์ brands ตาม response ใบงาน: id/name/country_of_origin/website/is_active/created_at
3. ORDER BY id ให้ลำดับแน่นอน
4. ส่ง array ใน success/data พร้อม timestamp ปัจจุบัน

## SQL หลัก

```sql
SELECT id,name,country_of_origin,website,is_active,created_at
FROM brands ORDER BY id;
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

เทียบชื่อฟิลด์ brands กับต้นฉบับ อย่าเปลี่ยนเป็น camelCase ทุก resource โดยอัตโนมัติ

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
