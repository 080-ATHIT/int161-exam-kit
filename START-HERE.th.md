# เริ่มตรงนี้: INT161

เป้าหมายคืออ่านสเปกแล้วแก้ template ของอาจารย์ได้ด้วยตัวเอง ใช้ kit นี้ฝึกก่อนสอบและเป็นเอกสารออฟไลน์ตามกติกาที่อาจารย์อนุญาต

## 1. เตรียมเครื่องขณะมีอินเทอร์เน็ต

ต้องมี Git, Node >=22.9 และ MySQL เปิดอยู่ repo เป็น private ต้องใช้บัญชีที่มีสิทธิ์เข้าถึง

```sh
git clone https://github.com/Phakinza007/int161-exam-kit.git
cd int161-exam-kit
npm ci
cp .env.example .env
```

แก้ `.env` ให้ตรง MySQL ของเครื่อง: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` ห้าม commit ไฟล์นี้ ชื่อฐานฝึกใช้ `int161_practice_catalog` และ `TEST_DB_NAME=int161_practice_tests` หากบัญชีไม่มีสิทธิ์ CREATE DATABASE ให้ผู้ดูแลสร้างฐานเฉพาะสำหรับฝึกก่อน และดูคำอธิบาย marker ในคู่มือออฟไลน์ อย่าใส่ฐานงานจริง

```sh
npm run db:init
npm run doctor
npm start
```

เปิด `http://127.0.0.1:3000/api/demo001/products?page=1&limit=10` อีก terminal รัน `npm test` (สร้างฐานทดสอบแยกและเขียน/ลบเฉพาะข้อมูลฝึก) `Ctrl+C` หยุด server

`doctor` ตรวจอย่างเดียว ไม่สร้างฐาน `db:init` สร้างฐานฝึกที่ยังไม่มีพร้อม marker; ถ้าฐานชื่อเดียวกันมีอยู่แต่ไม่มี marker จะปฏิเสธ ไม่ต้องเติม marker ลงฐานที่ไม่รู้ที่มา ให้เลือกชื่อฝึกใหม่ที่ยังไม่มี เช่น `int161_practice_my_catalog`

## 2. อ่านตามลำดับนี้

1. [GUIDE.md](GUIDE.md) และ [กรอบสอบ](EXAM.md)
2. [โจทย์ Week08 จริง](questions/week08-original.md) แล้วเปิด guide/js ทั้ง6ข้อจาก README
3. [ย้ายไป template](guides/05-template.md) และ [เตรียมก่อนตัดเน็ต](guides/06-offline.md)
4. หากต้องการอ่านเพิ่ม ดู [ส่วนเสริมที่ผู้ช่วยเพิ่ม](SUPPLEMENTS.md)

อ่านสรุปอย่างเดียวไม่พอ ต้องลอง POST → GET → PUT → DELETE และดูแถวใน MySQL จริง

## 3. ไฟล์ที่หยิบใช้

- `requests/catalog.http`: เปิดด้วย REST Client ที่ติดตั้งไว้แล้ว หรืออ่านแล้วใช้ curl
- `requests/curl.sh`: ชุด smoke ที่สร้างและลบเฉพาะ product ของตัวเอง รัน `sh requests/curl.sh`
- `requests/postman.json`: import เป็น collection; ไม่ต้องใช้ cloud account เพื่อส่ง localhost requests
- `recipes/`: ตัวอย่าง response W6, pagination แบบเลือกใช้ และคีย์ string/composite อ่าน import และปรับ path ให้ตรงโครงงาน
- `GUIDE.md`: คู่มือ Markdown เปิดอ่านใน editor ได้โดยไม่ต้องเปิด server

## 4. ขอบเขตสอบจากประกาศ

ทฤษฎี 52 ข้อ 50 คะแนน เวลา 1 ชั่วโมง ปิดหนังสือ ใช้ดินสอ ครอบคลุมทุกหัวข้อบรรยาย ภาคปฏิบัติ 6 ข้อ: 1 Create, 3 Read, 1 Update, 1 Delete เน้น CRUD, DTO, Pagination, Exception Handling คะแนนดิบ 110 คิดเต็ม 100

อนุญาตเอกสาร hard/soft copy และเตรียมดาวน์โหลดภายในช่วง 15 นาทีก่อนสอบตามประกาศ ระหว่างสอบห้ามอินเทอร์เน็ต รับส่งผ่าน LEB2 ตรวจคำสั่งอาจารย์ล่าสุดและบัญชีให้พร้อม การอนุญาต GitHub ก่อนสอบไม่ได้หมายถึงเชื่อม GitHub ระหว่างสอบ

Week08 เป็นแนวฝึก INT161; Week09 INT261 Java/Spring ไม่ใช่ชุดอ้างอิงของ kit นี้
