# INT161 Exam Kit

ชุดฝึก Node.js ESM + Express 5 + MySQL พร้อมคู่มือภาษาไทยอ่านออฟไลน์

เริ่มที่ [START-HERE.th.md](START-HERE.th.md) หรือเปิด [คู่มือ HTML](docs/offline-guide.html) หลังดาวน์โหลดลงเครื่อง

- ตัวอย่าง CRUD จริง: `reference-app/src/` แยก route → service → repository และ mapper
- [แนวทำข้อสอบและ Contract Sheet](guides/01-contract.md)
- [CRUD ทีละชั้น](guides/02-crud.md), [Pagination / DTO / JOIN](guides/03-pagination-dto.md)
- [Exception / คีย์แบบอื่น](guides/04-errors-keys.md)
- [ดัดแปลง teacher template](guides/05-template.md)
- [แก้ปัญหา / เตรียมออฟไลน์ / ส่งงาน](guides/06-offline.md)
- [วิธีใช้ recipes](recipes/README.md)
- [ตัวอย่างเปลี่ยนโจทย์](practice/worked-example.md), [โจทย์ฝึกทำเอง](practice/independent-task.md)
- [ผลตรวจจริงและข้อจำกัด](docs/VALIDATION.md)

ตัวอย่างนี้สร้างเพื่อฝึก ไม่ใช่ข้อสอบจริงหรือเฉลยที่อาจารย์รับรอง ใช้ข้อมูลสมมติทั้งหมด ไม่รวมเอกสารรายวิชาและ ZIP ของอาจารย์ใน repo นี้

ต้องติดตั้ง Node >=22.9 และ MySQL ที่เปิดใช้งานแล้ว เตรียม `npm ci` ขณะยังใช้อินเทอร์เน็ตได้ `node_modules` ไม่รวมใน ZIP; ไฟล์ `package-lock.json` อย่างเดียวไม่ทำให้ติดตั้งออฟไลน์ได้
