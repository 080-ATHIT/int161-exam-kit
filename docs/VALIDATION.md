# ผลตรวจและข้อจำกัด

วันที่ 21 ตุลาคม 2026 บน macOS, Node 26.5.1, MySQL server 9.7.1 (local)

- Unit/guard/API/recipes/worked example ใช้ node:test และ MySQL จริง ฐานเฉพาะ int161_practice_tests ที่มี marker
- ตรวจ CRUD กับแถวในฐานจริง, DTO allowlist/types, JOIN, date-only, pagination default/cap/invalid/zero, duplicate/FK, unchanged update, malformed JSON และ string/composite key
- Worked example เปลี่ยน resource/schema/key/base path/DTO/envelope และตรวจ persistence จริง
- `npm test`: 21/21 ผ่าน รวม curl smoke จริงและ recipes SQL บน MySQL หลังรีวิวแก้ให้ test files ทำงานทีละไฟล์ ตรวจซ้ำบน TEST_DB_NAME ใหม่ที่ยังไม่มี เพื่อกันการแย่ง CREATE DATABASE ในครั้งแรก
- `npm run verify:template -- --template /path/to/midterm-exam-esm-template.zip`: 8/8 shared API contracts ผ่านบนสำเนา template ชั่วคราว รักษา package.json อาจารย์ไว้
- `npm run package:kit` แล้ว `npm run verify:offline`: แตก ZIP ไป directory ใหม่ ใช้ dependency ที่ติดตั้งในเครื่องไว้แล้ว ผ่าน 21/21 โดย sandbox-exec บล็อก outbound ภายนอกแต่อนุญาต localhost; ตรวจ TCP ไป IP ภายนอกได้ EPERM/EACCES จริง ไม่ได้ปิดอินเทอร์เน็ตทั้งเครื่อง
- ตรวจ server.js entry จริง: เปิดพอร์ตและ GET static base path ได้ HTTP200 พร้อม products10รายการ
- Fresh review: ไม่มี critical; แก้ test initialization race และลำดับ db:init ก่อน doctor แล้ว ไม่มี minor ค้าง
- สแกน source ที่ track: ไม่พบ credential signatures, .env จริง หรือ node_modules; ข้อมูล identity เป็นสมมติ
- Postman collection ตรวจโครงสร้างเท่านั้น ยังไม่ได้เปิดใน Postman GUI; curl และ .http เป็นตัวเลือกอ่าน/ส่ง request ในเครื่อง
- รุ่น1.1.0 ใช้คู่มือ .md และเฉลย .js ปกติ เอา HTML/build-guide ออก ตรวจลิงก์เอกสารในเครื่อง และรัน integration suite ผ่าน handler6ข้อที่แยกใหม่
- โจทย์จริงมาจาก Week08/Week06; การจัด6ข้อและแนวเฉลยเป็นงานผู้ช่วยเพิ่ม ดู questions/SOURCES.md

ผู้เรียนยังไม่ได้ลอง independent-task ด้วยตัวเอง ผล automated tests ไม่ใช่การรับรองว่าทำข้อสอบได้หรือว่าจะผ่านโจทย์ใหม่

MySQL 9.7.1 คือรุ่นที่ตรวจจริง ยังไม่ได้รันทดสอบทุก MySQL version หรือบน Windows เครื่องสอบควรลองก่อนวันสอบ kit ใช้ SQL ทั่วไป แต่ผลการเชื่อมต่อ/สิทธิ์/SQL mode ขึ้นกับเครื่อง
