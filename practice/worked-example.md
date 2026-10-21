# ตัวอย่างดัดแปลง: products → books

โจทย์นี้แต่งเพื่อสาธิตการแก้ template ไม่ใช่โจทย์อาจารย์ ดูโค้ดครบใน practice/worked-example/ และผลทดสอบใน tests/worked-example.test.js

## Contract ที่เปลี่ยน

| เดิม | ใหม่ |
| --- | --- |
| /api/demo001/products | /api/demo002/books |
| id INT AUTO_INCREMENT | book_code VARCHAR(32) PRIMARY KEY |
| sku,name,price | book_code,title,daily_fee |
| detail มี brandName และสเปกสินค้า | detail code,title,fee,author |
| summary 7 ฟิลด์ | summary code,title,fee |
| success:true + timestamp | status:success ไม่มี timestamp |
| DELETE204 ว่าง | DELETE200 data:{code,deleted:true} |

การเปลี่ยน string key ต้องแก้ทั้ง route, validator, INSERT และ SELECT ไม่ใช่เปลี่ยนชื่อ id อย่างเดียว

```diff
- const id = numericId(req.params.id);
- const id = result.insertId;
- SELECT ... FROM products WHERE id=?
+ const code = bookCode(req.params.code);
+ const code = data.book_code;
+ SELECT ... FROM books WHERE book_code=?
```

## 1. Schema

```sql
CREATE TABLE books (
 book_code VARCHAR(32) PRIMARY KEY,
 title VARCHAR(150) NOT NULL,
 author VARCHAR(100) NOT NULL,
 daily_fee DECIMAL(10,2) NOT NULL
);
```

ทำเฉพาะฐานฝึกที่แยกไว้ เทสต์สร้างตารางนี้ใน TEST_DB_NAME หลังตรวจ marker แล้ว ลบเฉพาะแถวที่ test สร้าง

## 2. Repository → service → mapper → route

เปิด `practice/worked-example/repository.js`: find รับ code string, create อ่านกลับด้วย book_code, update WHERE book_code ไม่ใช้ insertId หรือ numericId และมี ORDER BY / COUNT

เปิด `service.js`: บังคับ title/author/fee ตรวจ string PK แยกจาก numeric product ID การ update ยึด code ใน URL ไม่เปลี่ยนตาม body ตรวจว่ามีแถวก่อนจึงยอมรับการส่งค่าเดิม

เปิด `mapper.js`: สร้าง allowlist ใหม่ code/title/fee และ author เฉพาะ detail แปลง DECIMAL เป็น number ไม่เหลือฟิลด์ product

เปิด `app.js`: base คงที่ demo002; ส่ง success และ error แบบ W6 ทั้งคู่ DELETE200 มี body; pagination ยังคง default1/10/max100 แบบ kit

## 3. รันตัวอย่าง

หลังเตรียม MySQL และ npm ci แล้ว:

```sh
node --env-file-if-exists=.env --test tests/worked-example.test.js
```

test เปิด app ชั่วคราวบน port ว่าง ตรวจ POST201 → DB row → duplicate409 → PUTค่าเดิม200 → list DTO → DELETE200 → missing404 แล้วปิด app และลบแถวที่สร้าง ตัวอย่างนี้ไม่มี server ถาวร ใช้ factory ในเทสต์เพื่อให้เห็นการประกอบครบ อ่าน `tests/worked-example.test.js` เป็นลำดับ request ที่ใช้จริง

## 4. ลองทำซ้ำด้วยมือ

สร้าง entry ของตัวเองที่ import createBooksApp และ createDb แล้วเปิด port เหมือนคู่มือ template ใช้ฐานฝึกที่ตรวจ marker แล้ว ส่ง body `{book_code:'BK01',title:'API Practice',author:'Demo',daily_fee:2.5}` ตรวจว่า response code เป็น string และ fee เป็น number จากนั้นไปโจทย์ independent-task โดยไม่คัดลอก books ทั้งชุด
