# Exception Handling และคีย์

## เส้นทาง error

service throw AppError → Express 5 → errorHandler(err,req,res,next) → HTTP status และ JSON ที่ตรงสเปก อย่าส่ง res จาก repository

| เหตุการณ์ | kit status | code |
| --- | --- | --- |
| input ผิด / ID ผิด | 400 | VALIDATION_ERROR |
| JSON แตก | 400 | INVALID_JSON |
| ไม่พบ product | 404 | PRODUCT_NOT_FOUND |
| UNIQUE ซ้ำ | 409 | DUPLICATE_KEY |
| FK ปลายทางไม่มี | 400 | FOREIGN_KEY_NOT_FOUND |
| ลบแถวที่ถูกอ้างอิง | 409 | RESOURCE_IN_USE |
| ไม่คาดคิด | 500 | INTERNAL_SERVER_ERROR |

อย่าส่ง stack, SQL, DB credentials หรือ err.sqlMessage กลับ client error handler ต้องเป็นฟังก์ชัน 4 arguments แม้ไม่ใช้ next

## Numeric key

products.id เป็น auto increment ต้องตรวจ positive safe integer ก่อน Number ไม่ใช้ parseInt ที่ยอมรับ 12abc การสร้างอ่าน insertId

## String key

tags.code เป็น VARCHAR เช่น NA, CS_01 ต้องคง string ไม่ Number/parseInt และการสร้างอ่านกลับด้วย code ที่ส่งเข้า ไม่ใช้ insertId ตัวอย่างจริงใน routes/service/repo และสูตรสั้น `recipes/string-composite-repository.js`

## Composite key

product_tags มี PRIMARY KEY(product_id, tag_code) จึงต้อง bind ทั้งคู่ใน WHERE และ route เช่น DELETE /products/7/tags/DEMO อย่าลบด้วย product_id อย่างเดียวเพราะจะลบหลายความสัมพันธ์

## เทียบกับ Week6

W6 envelope ต่างจาก kit ใช้ `recipes/w6-response.js` แทน success/error ทั้งคู่ DELETE200 ต้องมี JSON ส่วน DELETE204 ต้องว่าง เลือกตาม Contract Sheet ไม่ทำให้ runnerผ่านอย่างเดียว
