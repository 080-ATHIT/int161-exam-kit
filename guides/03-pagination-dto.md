# Pagination, DTO และ JOIN

## Pagination

kit กำหนด page เริ่ม 1, limit เริ่ม 10 สูงสุด 100 รับ string ตัวเลขจำนวนเต็มบวกเท่านั้น หากส่งผิดหรือส่งซ้ำตอบ 400 ตัวอย่าง page=1.5, page=0, page=abc, limit=0, page=1&page=2

```js
const limit = Math.min(requestedLimit, 100);
const offset = (page - 1) * limit;
const totalPages = Math.ceil(total / limit);
```

ต้องคำนวณ offset หลัง cap limit ใช้ ORDER BY ที่แน่นอน และ COUNT ใช้ filter เดียวกับรายการ กรณีไม่มีข้อมูล total=0, data=[], totalPages=0 ห้าม fallback เป็นจำนวนอื่นด้วย `||` หน้าเกินสุดท้ายยัง 200 พร้อม [] และ total จริง

kit ไม่มี search/filter; ถ้าโจทย์เพิ่ม ต้องแก้ทั้ง list และ count ให้ตรงกัน นโยบายไม่ส่ง page/limit คือยังแบ่งหน้าด้วย default หากโจทย์ต้องคืนทั้งหมดเมื่อไม่มี query ใช้ `recipes/optional-pagination.js` แล้วแยก SQL แบบไม่มี LIMIT ให้ครบ ไม่ใช่แก้แค่ parser

## DTO allowlist

summary มี 7 ฟิลด์: id, sku, name, brandId, category, price, status

detail มี 13 ฟิลด์: id, sku, name, brandId, brandName, category, price, ramGb, storageGb, color, stockQuantity, status, releaseDate

อย่าใช้ `{...entity}` เพราะอาจหลุด internal_cost และชื่อคอลัมน์ DB ไม่ตรง API DTO แปลง snake_case → camelCase ด้วย mapping ชัดเจน เช็ก null ก่อน mapper เพื่อให้ missing เป็น 404

mysql2 มักคืน DECIMAL เป็น string จึงใช้ `Number(entity.price)` ใน DTO ตาม contract นี้ DATE ใช้ dateStrings เพื่อรักษาวันเดิม releaseDate เป็น YYYY-MM-DD หรือ null; timestamp ของ envelope เป็น ISO UTC ไม่ใช่ DATE

## JOIN

products มี brand_id แต่ detail ต้อง brandName จึงต้อง JOIN brands แล้ว alias `b.name AS brand_name` ห้ามเดาหรือ hardcode ชื่อ brand

ถ้าใช้ LEFT JOIN ต้องกำหนดว่าค่าไม่มี brand เป็น null หรือ error ตามโจทย์ ใน kit FK บังคับ brand และใช้ INNER JOIN
