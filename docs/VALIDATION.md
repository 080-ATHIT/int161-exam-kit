# ผลตรวจ Template

รุ่น2.1.0 ตรวจบนmacOS, Node26.5.1 และMySQL9.7.1ในเครื่อง

- npm test: 25/25 รวมguardโหมดexamและการปฏิเสธdb:initในโหมดexam
- สำเนาteacher template: shared API contractsผ่าน9/9 และเปิดnpm startจริงในสำเนาได้HTTP200ทั้งstudent-info/products
- เปิดsrc/server.jsจริงทั้งpractice/examได้HTTP200 โดยใช้ฐานตัวอย่างเดียวกันเพื่อตรวจstartup (ยังไม่ใช่การตรวจschemaข้อสอบอื่น)

- QUESTIONS-AND-ANSWERS.mdรวม6หน้าคำถาม/วิธีคิด/วิธีทำ/เฉลยJSและSQL ใช้sourceเดียวกับtemplate ไม่เพิ่มโจทย์ฝึกใหม่
- srcเป็นโครงAPIที่เปิดได้ด้วยnpm start; controllers/service/repository/mapperแยกชัดเจน
- Regression: POST/PUTจาก.httpและPostmanผ่านตารางชั่วคราวที่บังคับram_gb/storage_gb/color NOT NULL; missing/nullได้400แทน500; request curlส่งfieldsครบ
- Regression: verify-templateปฏิเสธserver.jsที่พัง แม้app factoryผ่าน
- testsตรวจCRUD persistence, DTO/types/JOIN/date, pagination, exception, unchangedupdate, string/compositekey และrequestsกับMySQLจริง
- DB_MODE=practiceตรวจprefix+markerก่อนเปิดAPI; DB_MODE=examต้องระบุDB_NAME/STUDENT_ID/STUDENT_NAME/STUDENT_KEYเป็นค่าจริงครบ ตรวจconnectivityอย่างเดียว ไม่สร้าง/resetฐาน
- db:initและtestsอัตโนมัติปฏิเสธDB_MODE=exam; ชุดtestเป็นของschemaตัวอย่าง ไม่ใช่runnerตัดสินข้อสอบที่แก้schemaแล้ว
- ตรวจสำเนาteacherZIPในdirectoryชั่วคราวและตรวจsourceZIPที่แตกใหม่โดยบล็อกnetworkภายนอกแต่อนุญาตlocalhost
- เอกสาร.md; โค้ด.jsปกติ; ไม่มีHTML/โฟลเดอร์questions/แบบฝึกหัดเพิ่มเติม

ต้องเตรียมdependenciesไว้ก่อนใช้ออฟไลน์ ยังไม่ได้รับรองWindowsหรือMySQLทุกรุ่น Postmancollectionตรวจโครงสร้าง แต่ไม่ได้เปิดGUIทดสอบ การทำงานกับschemaและcontractข้อสอบต้องปรับและตรวจตามโจทย์จริง
