# อ่านรายละเอียดสินค้าตาม ID — คำถาม เฉลย และวิธีทำ

คำถามย่อจากงานWeek08ที่templateทำไว้แล้ว ส่วนเฉลยเป็นโค้ดของโครงนี้ ไม่ใช่โจทย์ใหม่ให้ทำเพิ่ม ลำดับ6ส่วนจัดเพื่อค้นหาโค้ด ไม่ใช่การยืนยันข้อสอบกลางภาค

## คำถาม

`GET /products/:id` ภายใต้basepathคงที่ `/api/รหัสของตัวเอง`

พัฒนา API อ่านรายละเอียดสินค้าตามid ถ้าพบตอบ200พร้อมdetailDTOที่มีbrandNameและข้อมูลสเปกสินค้า ถ้าไม่พบตอบ404

## วิธีคิดก่อนเขียน

- requestชี้สินค้าหนึ่งชิ้น จึงอ่านแถวเดียวและตรวจnot-foundก่อนmapper
- productsมีbrand_id แต่responseต้องbrandName จึงJOINbrandsและaliasเป็นbrand_name
- detailมีข้อมูลมากกว่ารายการ ต้องใช้detail mapperไม่ใช้summary
- DECIMALจากdriverอาจเป็นstring ส่วนDATEต้องรักษาวันเดิม จึงแปลงตามcontract

## วิธีทำทีละขั้น

1. numericIdตรวจreq.params.id แล้วส่งidให้getProduct
2. repositoryfindProduct SELECT JOIN brands WHERE p.id=?
3. ถ้าไม่มีแถว throw PRODUCT_NOT_FOUND404ก่อนเรียกdetail
4. detailคืน13ฟิลด์ที่ระบุ แปลงpriceเป็นnumberและreleaseDateเป็นYYYY-MM-DD/null
5. handlerส่ง200พร้อมenvelopeและtimestamp

## เฉลย JavaScript: จุดรับ request และตอบ response

โค้ดนี้ใช้จริงในtemplate โดยservice/repository/mapperที่ต้องใช้ร่วมกันอยู่ครบตามลิงก์ถัดไป ไม่ใช่handlerเดี่ยวที่รันได้โดยไม่มีlayerอื่น

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 3: validate id → SELECT JOIN → missing404 → detail DTO
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function readProductDetailHandler(service) {
  return async function (req, res) {
    return success(res, await service.getProduct(numericId(req.params.id)));
  };
}
```

## เช็กว่าคำตอบถูกอย่างไร

ใช้idที่POSTสร้างไว้ ตรวจbrandNameมาจากbrandจริง และpriceเป็นnumber จากนั้นส่งidที่ไม่มีต้อง404JSON ไม่ใช่200/nullหรือ500จากmapper

## ไฟล์ที่ใช้ร่วมกัน

- [handler ข้อนี้](../../src/controllers-$id/04-read-product-detail.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../src/services-$id/catalog-service.js): ฟังก์ชัน `getProduct` และ validation
- [repository](../../src/repositories-$id/catalog-repository.js): ฟังก์ชัน `findProduct` และ SQL
- [mapper](../../src/mappers-$id/product-mapper.js): detail
- [error handler](../../src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## จุดปรับเมื่อนำไปใช้กับข้อสอบ

1. numericId ตรวจ id เป็นจำนวนเต็มบวกก่อนส่งลง service
2. findProduct SELECT พร้อม JOIN brands ให้ได้ brand_name ไม่เดาชื่อจาก brand_id
3. ตรวจแถวไม่พบก่อนเข้า mapper แล้ว throw PRODUCT_NOT_FOUND404
4. detail mapper คืน13ฟิลด์ตามใบงาน แปลง price เป็น number และ releaseDate เป็น YYYY-MM-DD หรือ null
5. ตอบ success/data/timestamp ไม่ส่ง internal_cost หรือคอลัมน์ที่ไม่ได้กำหนด

## เฉลยส่วน SQL

```sql
SELECT p.id,p.sku,p.name,p.brand_id,b.name AS brand_name,
 p.category,p.price,p.ram_gb,p.storage_gb,p.color,
 p.stock_quantity,p.status,p.release_date
FROM products p JOIN brands b ON b.id=p.brand_id WHERE p.id=?;
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

GET id ที่สร้างเองแล้วตรวจ brandName/price/releaseDate จากนั้น GET id ที่ไม่มีต้อง404 JSON

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
