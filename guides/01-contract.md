# อ่านโจทย์แล้วทำ Contract Sheet

ก่อนเขียนโค้ด แปลงแต่ละข้อเป็นตารางนี้ ใส่ค่าจากโจทย์จริง อย่ายึดค่า demo เมื่อสเปกต่างกัน

| รายการ | ตัวอย่างใน kit | ต้องเช็กในข้อสอบ |
| --- | --- | --- |
| Base path | /api/demo001 | ID ต้องเป็นค่าคงที่ ไม่ใช่ :studentId |
| List | GET /products | filter, sort, page/limit และ DTO รายการ |
| Detail | GET /products/:id | ชนิด key, JOIN, 404 |
| Create | POST /products | ฟิลด์บังคับ, UNIQUE, 201 |
| Update | PUT /products/:id | full body หรือ partial, 200, 404, duplicate |
| Delete | DELETE /products/:id | 204 ว่าง หรือ 200 JSON |
| Error | success:false,error:{code,message},timestamp | ชื่อ envelope และ code ต้องตรง |

## Response ตัวอย่าง W8-like

```json
{"success":true,"data":[],"pagination":{"total":0,"page":1,"limit":10,"totalPages":0,"hasNextPage":false,"hasPrevPage":false},"timestamp":"2026-10-21T00:00:00.000Z"}
```

นี่เป็น contract ของ kit ที่อิงแนว Week08 ต้องเทียบไฟล์สเปกของตัวเองอีกครั้ง ตัวอย่าง W6 ใช้ `status:'success'` / `status:'error'` ดู `recipes/w6-response.js`; เปลี่ยน success helper และ error handler ให้ตรงกันทั้งคู่

## นโยบาย input ของ kit

POST/PUT products รับ snake_case: `sku,name,brand_id,category,price,ram_gb,storage_gb,color` บังคับตามschemaตัวอย่าง; `stock_quantity,status,release_date` เป็นตัวเลือก PUT ใช้ full body เช่น POST ฟิลด์ที่ไม่รู้จักถูกละทิ้ง ไม่อนุญาตเขียน `id` หรือ `internal_cost` ผ่าน API

price ต้องเป็น JSON number >=0 สูงสุด 99999999.99 ทศนิยมไม่เกินสองตำแหน่ง; brand_id เป็นจำนวนเต็มบวก; stock เป็นจำนวนเต็มไม่ติดลบ; release_date เป็นวันที่จริง YYYY-MM-DD หรือ null นโยบายนี้เป็นของชุดฝึก หากโจทย์อนุญาตค่าต่างกันต้องแก้ validation

ชื่อ product/sku/category ห้ามว่างหลัง trim สถานะเริ่ม AVAILABLE stock เริ่ม 0 release_dateที่nullableเริ่มnull ส่วนram_gb/storage_gb/colorห้ามnull แยกกรณี missing/null/0 อย่าใช้ `value || default` เมื่อ 0 เป็นค่าที่ถูก

## เช็กให้เข้มกว่าตัว runner

เขียน assertion ของตัวเองตามสเปก ถ้ารันเนอร์รับ DELETE ได้ทั้ง 200/204 หรือ duplicate ได้ทั้ง 400/409 การผ่าน runner ไม่พิสูจน์ว่าตรงข้อความโจทย์ ตรวจ status/body/ชนิดข้อมูล/ชื่อ key ด้วยตาและ request เพิ่มเติม
