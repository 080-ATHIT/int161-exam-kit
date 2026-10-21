# วิธีปรับ template: 04-read-product-detail

## ไฟล์ที่ใช้ร่วมกัน

- [handler ข้อนี้](../../src/controllers-$id/04-read-product-detail.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../src/services-$id/catalog-service.js): ฟังก์ชัน `getProduct` และ validation
- [repository](../../src/repositories-$id/catalog-repository.js): ฟังก์ชัน `findProduct` และ SQL
- [mapper](../../src/mappers-$id/product-mapper.js): detail
- [error handler](../../src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## แก้ตามโจทย์ที่ได้รับ

1. numericId ตรวจ id เป็นจำนวนเต็มบวกก่อนส่งลง service
2. findProduct SELECT พร้อม JOIN brands ให้ได้ brand_name ไม่เดาชื่อจาก brand_id
3. ตรวจแถวไม่พบก่อนเข้า mapper แล้ว throw PRODUCT_NOT_FOUND404
4. detail mapper คืน13ฟิลด์ตามใบงาน แปลง price เป็น number และ releaseDate เป็น YYYY-MM-DD หรือ null
5. ตอบ success/data/timestamp ไม่ส่ง internal_cost หรือคอลัมน์ที่ไม่ได้กำหนด

## SQL หลัก

```sql
SELECT p.id,p.sku,p.name,p.brand_id,b.name AS brand_name,
 p.category,p.price,p.ram_gb,p.storage_gb,p.color,
 p.stock_quantity,p.status,p.release_date
FROM products p JOIN brands b ON b.id=p.brand_id WHERE p.id=?;
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

GET id ที่สร้างเองแล้วตรวจ brandName/price/releaseDate จากนั้น GET id ที่ไม่มีต้อง404 JSON

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
