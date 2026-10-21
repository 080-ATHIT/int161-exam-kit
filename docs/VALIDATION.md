# ผลตรวจและข้อจำกัด

วันที่ 21 ตุลาคม 2026 บน macOS, Node 26.5.1, MySQL server 9.7.1 (local)

- Unit/guard/API/recipes/worked example ใช้ node:test และ MySQL จริง ฐานเฉพาะ int161_practice_tests ที่มี marker
- ตรวจ CRUD กับแถวในฐานจริง, DTO allowlist/types, JOIN, date-only, pagination default/cap/invalid/zero, duplicate/FK, unchanged update, malformed JSON และ string/composite key
- Worked example เปลี่ยน resource/schema/key/base path/DTO/envelope และตรวจ persistence จริง
- การตรวจ teacher template และ ZIP ออฟไลน์: รอขั้นตอนก่อน release บันทึกผลจริงที่นี่

ผู้เรียนยังไม่ได้ลอง independent-task ด้วยตัวเอง ผล automated tests ไม่ใช่การรับรองว่าทำข้อสอบได้หรือว่าจะผ่านโจทย์ใหม่

MySQL 9.7.1 คือรุ่นที่ตรวจจริง ยังไม่ได้รันทดสอบทุก MySQL version หรือบน Windows เครื่องสอบควรลองก่อนวันสอบ kit ใช้ SQL ทั่วไป แต่ผลการเชื่อมต่อ/สิทธิ์/SQL mode ขึ้นกับเครื่อง
