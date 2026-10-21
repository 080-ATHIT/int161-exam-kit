# ผลตรวจ Template

รุ่น2.0.0 ตรวจบนmacOS, Node26.5.1 และMySQL9.7.1ในเครื่อง

- npm test: 21/21 รวมguardโหมดexamและการปฏิเสธdb:initในโหมดexam
- สำเนาteacher template: shared API contractsผ่าน8/8
- เปิดsrc/server.jsจริงทั้งpractice/examได้HTTP200 โดยใช้ฐานตัวอย่างเดียวกันเพื่อตรวจstartup (ยังไม่ใช่การตรวจschemaข้อสอบอื่น)

- srcเป็นโครงAPIที่เปิดได้ด้วยnpm start; controllers/service/repository/mapperแยกชัดเจน
- testsตรวจCRUD persistence, DTO/types/JOIN/date, pagination, exception, unchangedupdate, string/compositekey และrequestsกับMySQLจริง
- DB_MODE=practiceตรวจprefix+markerก่อนเปิดAPI; DB_MODE=examต้องระบุDB_NAME/STUDENT_IDเอง ตรวจconnectivityอย่างเดียว ไม่สร้าง/resetฐาน
- db:initและtestsอัตโนมัติปฏิเสธDB_MODE=exam; ชุดtestเป็นของschemaตัวอย่าง ไม่ใช่runnerตัดสินข้อสอบที่แก้schemaแล้ว
- ตรวจสำเนาteacherZIPในdirectoryชั่วคราวและตรวจsourceZIPที่แตกใหม่โดยบล็อกnetworkภายนอกแต่อนุญาตlocalhost
- เอกสาร.md; โค้ด.jsปกติ; ไม่มีHTML/โฟลเดอร์questions/แบบฝึกหัดเพิ่มเติม

ต้องเตรียมdependenciesไว้ก่อนใช้ออฟไลน์ ยังไม่ได้รับรองWindowsหรือMySQLทุกรุ่น Postmancollectionตรวจโครงสร้าง แต่ไม่ได้เปิดGUIทดสอบ การทำงานกับschemaและcontractข้อสอบต้องปรับและตรวจตามโจทย์จริง
