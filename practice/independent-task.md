# โจทย์ฝึกทำเอง: Departments

โจทย์นี้แต่งเพิ่มเพื่อฝึก ไม่ใช่โจทย์อาจารย์ ไม่มี implementation เฉลยใน repo ให้ใช้ template เปล่าและคู่มือ โดยเริ่มจาก Contract Sheet

## Schema และ contract

สร้าง departments: dept_code VARCHAR(12) PRIMARY KEY, dept_name VARCHAR(100) NOT NULL UNIQUE, budget DECIMAL(10,2) NOT NULL DEFAULT 0 และ internal_note TEXT nullable ที่ห้ามส่งผ่าน API

base path เป็นค่าคงที่ /api/รหัสของคุณ ใช้ response `{status:'success',data:...}` และ error `{status:'error',error:{code,message}}`

1. POST /departments รับ dept_code,dept_name,budget; code ห้ามว่างและคง string, budget number>=0 สูงสุด99999999.99 สองตำแหน่ง ตอบ201 detail; duplicate code หรือ name409
2. GET /departments?page=1&limit=5 ค่าเริ่ม1/5 สูงสุด20 ตรวจ invalid/duplicatequery400; list DTO code,name; pagination มี total/page/limit/totalPages/hasNextPage/hasPrevPage
3. GET /departments/:code detail DTO code,name,budget; missing404
4. GET /departments/:code/summary ส่งเฉพาะ code,name; missing404
5. PUT /departments/:code รับ dept_name,budget เปลี่ยน PK ไม่ได้ ค่าเดิม200; missing404; duplicate name409
6. DELETE /departments/:code ตอบ200 JSON data เป็น `{code,deleted:true}`; missing404

## ตรวจว่าทำเองได้

เริ่มโดยปิดโค้ด products/books แล้วเขียน SQL/mapper/service/route เอง เช็ก code=CS01 ไม่กลายเป็น NaN, priceเป็นnumber, internal_noteไม่หลุด, countตรงทุกหน้า, budget0ไม่หาย และ PUTค่าเดิมไม่404 สร้างอย่างน้อย7แถวเพื่อมีหน้าที่สอง ลบข้อมูลที่ตนสร้างแล้วตรวจในDB

เก็บ request และผลที่คาดหวังเองให้ครบ6ข้อ หากติด ให้ดูคู่มือเฉพาะหัวข้อแล้วกลับมาเขียนใหม่ บันทึกจุดที่ยังต้องเปิดตัวอย่าง การตรวจข้อนี้ต้องทำโดยผู้เรียน ยังไม่ได้รับรองว่าผ่านจาก automated tests ของ kit
