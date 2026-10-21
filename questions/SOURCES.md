# ที่มาโจทย์และสิ่งที่ผู้ช่วยเพิ่ม

| ส่วน | ที่มา/สถานะ |
| --- | --- |
| กรอบ6ข้อ/110คะแนน/กติกา | ประกาศสอบที่ผู้ใช้ส่งมา เก็บใน EXAM.md |
| week08-original.md | ใบงานใน OneDrive_2026-10-21 (1).zip / Week-08 Practice Exam Simulation / exam-spec รุ่นแรก ตัด profile และใช้ identity สมมติ |
| week06-original.md | week6/express_crud_exception_assignment.md ของอาจารย์ มี5ข้อเพิ่มเติมเรื่อง error/keys |
| six-tasks/*.md | ผู้ช่วยจัดกลุ่มจาก6endpointsที่มีจริงใน Week08 ให้เข้ากรอบ1C/3R/1U/1D ไม่ใช่ลำดับข้อ/คะแนนสอบจริง |
| solutions-$id/*.js และ service/repo/mapper | แนวเฉลยผู้ช่วยเขียน ไม่ใช่ไฟล์เฉลยอาจารย์ |
| default limit10/max100, strict query validation, full-body PUT, SKU conflict on PUT, detailed validation | นโยบายผู้ช่วยเพิ่มเมื่อใบงานไม่ได้แจกแจงทุกกรณี ต้องเทียบข้อสอบจริง |
| int161_practice_* / marker / seed Demo Phones / tags | โครงช่วยฝึกและข้อมูลสมมติของผู้ช่วย ไม่ใช่ฐานSQLเดิมอาจารย์ |
| practice/books และ departments | โจทย์สมมติเสริมของผู้ช่วย ดู SUPPLEMENTS.md |

ไม่มีคะแนนแยกแต่ละข้อของการสอบจริงให้ยืนยัน และไม่กำหนดเวลา120นาทีจากใบงานซ้อมให้เป็นเวลาสอบกลางภาคโดยอัตโนมัติ

ยังไม่ได้รวมเฉลยเฉพาะ Week06 offices/employees/customers/payments โจทย์ส่วนนี้มีไว้ให้อ่านข้อกำหนดจริง ส่วน recipe/W6 response และ tags เป็นตัวอย่างเสริมที่ไม่ใช้โดเมนเดียวกับโจทย์

SQLต้นฉบับ Week08 ใช้ mobile_distributor และมีคำสั่ง DROP/TRUNCATE จึงไม่รันให้อัตโนมัติ ตัวอย่างรันในฐานฝึกแยกเท่านั้น หากใช้ SQLต้นฉบับของอาจารย์ต้องตรวจฐานเป้าหมายและข้อกำหนดฟิลด์ NOT NULL ของตนเองก่อน โค้ด kit ไม่ใช่ตัวแปลงฐานที่รองรับทุก schema
