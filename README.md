# INT161 — Guide และโจทย์ฝึกปฏิบัติ

เอกสารอ่านเป็น `.md` และแนวเฉลยเป็น `.js` ปกติ เปิดอ่านใน editor ได้ออฟไลน์

เริ่มที่ [GUIDE.md](GUIDE.md) → [ติดตั้ง/เปิดตัวอย่าง](START-HERE.th.md) → [โจทย์จริง Week08](questions/week08-original.md)

| แบบ | Guide วิธีทำ | เฉลย JavaScript ที่ route ใช้จริง |
| --- | --- | --- |
| 1C เพิ่มสินค้า | [01 Create](questions/six-tasks/01-create-product.md) | [01-create-product.js](reference-app/src/solutions-$id/01-create-product.js) |
| R1 รายการแบรนด์ | [02 Brands](questions/six-tasks/02-read-brands.md) | [02-read-brands.js](reference-app/src/solutions-$id/02-read-brands.js) |
| R2 รายการสินค้า + Pagination/DTO | [03 Products](questions/six-tasks/03-read-products.md) | [03-read-products.js](reference-app/src/solutions-$id/03-read-products.js) |
| R3 รายละเอียดสินค้า + JOIN/DTO | [04 Detail](questions/six-tasks/04-read-product-detail.md) | [04-read-product-detail.js](reference-app/src/solutions-$id/04-read-product-detail.js) |
| 1U แก้ไขสินค้า | [05 Update](questions/six-tasks/05-update-product.md) | [05-update-product.js](reference-app/src/solutions-$id/05-update-product.js) |
| 1D ลบสินค้า | [06 Delete](questions/six-tasks/06-delete-product.md) | [06-delete-product.js](reference-app/src/solutions-$id/06-delete-product.js) |

handler ใช้ service/repository/mapper ร่วมกันเพื่อคงโครงสร้าง template ของอาจารย์ Guide แต่ละข้อลิงก์ไปทุกชั้นที่ต้องอ่าน/แก้

โจทย์มาจากใบงานอาจารย์ ส่วนเฉลยและการจัดกลุ่ม6ข้อเขียนเพิ่มโดยผู้ช่วย ไม่ใช่เฉลยที่อาจารย์รับรอง และยังไม่ใช่ข้อสอบกลางภาคที่ไม่ได้แจก ดู [ที่มาและสิ่งที่เพิ่ม](questions/SOURCES.md)

- [กรอบสอบตามประกาศ](EXAM.md)
- [เอกสารเสริมที่ติดป้ายชัดเจน](SUPPLEMENTS.md)
- [ผลตรวจและข้อจำกัด](docs/VALIDATION.md)

ไม่มีเว็บ/HTML และไม่ต้องเปิด server เพื่ออ่านเอกสาร ต้องเตรียม Node/MySQL และ `npm ci` ขณะมีอินเทอร์เน็ตเฉพาะเมื่อต้องการรันโค้ด `node_modules` ไม่รวมใน ZIP
