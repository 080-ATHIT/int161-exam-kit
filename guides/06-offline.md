# แก้ปัญหา เตรียมออฟไลน์ และส่งงาน

## เมื่อรันไม่ได้ ให้เริ่มจากอาการ

| อาการ | ขั้นแรก |
| --- | --- |
| ECONNREFUSED | เช็กว่า MySQL เปิดและ DB_PORT ถูก |
| ER_ACCESS_DENIED_ERROR | แก้ user/password ใน .env ไม่โพสต์รหัสลงแชต |
| Unknown database | reference ใช้ npm run db:init หลังเลือกชื่อฝึกใหม่ |
| marker missing / UNSAFE_DATABASE | หยุดใช้ฐานนั้น เลือกฐานฝึกใหม่ที่ยังไม่มี |
| EADDRINUSE | ปิด process เดิมหรือเปลี่ยน PORT |
| Cannot find package | npm ci ขณะยังมีเน็ตในโฟลเดอร์ที่มี package.json |
| ERR_MODULE_NOT_FOUND | ตรวจ path, ชื่อ folder -$id, ตัวพิมพ์ใหญ่และ .js |
| 404 ทุก route | ดู /api/ค่ารหัสจริง ไม่ใช่ /api/:studentId และ entry ที่เปิด port |
| req.body undefined | Content-Type application/json และ express.json ก่อน router |
| price กลายเป็น string | เช็ก mapper Number และ assertion ชนิดข้อมูล |
| PUT ค่าเดิมได้404 | อย่าตัดสิน missing จาก changedRows |

`npm run doctor` อ่าน config ตรวจ Node/dependency/SELECT1 เท่านั้น ไม่พิมพ์ password หากบัญชีไม่มีสิทธิ์สร้างฐาน ให้จัดเตรียมบัญชีฝึกที่มีสิทธิ์หรือให้ผู้ดูแลสร้างฐานพร้อมขั้นตอน marker ของ kit อย่างรู้ที่มา วิธีง่ายสุดคือใช้ local MySQL ของตัวเองกับชื่อฝึกใหม่ที่ยังไม่มี

## ก่อนช่วงตัดอินเทอร์เน็ต

- ดาวน์โหลด repo/ZIP และเอกสารที่อนุญาต เตรียม template ตามประกาศ
- ติดตั้ง Node/MySQL/Postman หรือ extension ที่ใช้แล้ว `npm ci` ให้สำเร็จใน project ที่จะรัน
- ทดสอบ `npm start`, POST/GET/PUT/DELETE, เปิดไฟล์ .md ใน editor และเปิดไฟล์ request ในเครื่อง
- ตัดการเชื่อมต่ออินเทอร์เน็ตด้วยตัวเองแล้วลองอีกครั้ง เอกสารอยู่ local แต่ npm ci ที่ไม่มี cache ยังต้องใช้เน็ต
- การย้าย node_modules ข้าม OS/CPU/Node version ไม่รับประกัน ใช้เครื่องสอบจริงเตรียมและทดสอบ
- นำ .env ส่วนตัวไว้ในเครื่อง ไม่ใส่ลง Git/ZIP ที่แชร์

## ก่อนส่ง LEB2

อ่านข้อกำหนดชื่อ project/ZIP และไฟล์ที่ต้องส่งของอาจารย์ ตรวจว่า start command เปิด server ได้ ใช้ static ID ของตัวเอง ตรวจทุก endpoint/status/body/type แล้วรัน test runner ที่แจกอีกครั้ง ตรวจ ZIP หลังแตกในโฟลเดอร์ใหม่ว่ามี package.json, lockfile, src และ SQL ที่โจทย์ต้องการ หากต้องส่ง config ให้ทำตามข้อสอบโดยไม่แนบรหัสของระบบอื่น

`npm run package:kit` สร้าง ZIP ของชุดฝึกที่ artifacts/ ไม่ใช่ ZIP ส่งข้อสอบ อัตโนมัติจะไม่รวม .env, node_modules, .git และเอกสารต้นฉบับอาจารย์

## ข้อจำกัดการตรวจ

ผลตรวจเทคนิคของ kit ดู docs/VALIDATION.md การผ่าน automated tests ไม่เท่ากับคุณทำโจทย์เองได้ ตรวจendpointของโครงที่แก้ตามสเปกด้วยrequestและrunnerที่อาจารย์ให้ก่อนส่ง
