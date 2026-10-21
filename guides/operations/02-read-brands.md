# อ่านรายการแบรนด์ — คำถาม เฉลย และวิธีทำ

คำถามย่อจากงานWeek08ที่templateทำไว้แล้ว ส่วนเฉลยเป็นโค้ดของโครงนี้ ไม่ใช่โจทย์ใหม่ให้ทำเพิ่ม ลำดับ6ส่วนจัดเพื่อค้นหาโค้ด ไม่ใช่การยืนยันข้อสอบกลางภาค

## คำถาม

`GET /brands` ภายใต้basepathคงที่ `/api/รหัสของตัวเอง`

พัฒนา API อ่านแบรนด์ทั้งหมดจากตาราง brands ตอบ200 โดย dataเป็นarray มี id, name, country_of_origin, website, is_active, created_at และenvelopeตามสเปก

## วิธีคิดก่อนเขียน

- เป็นรายการ จึงคืนarray ไม่เลือกrows[0]
- ไม่มีข้อมูลไม่ใช่resourceหาย ตอบ200พร้อม[]ได้
- DTOของbrandsในใบงานใช้snake_case จึงไม่เปลี่ยนชื่อเป็นcamelCaseโดยอัตโนมัติ
- ORDER BY idช่วยให้ลำดับแน่นอนและตรวจผลซ้ำได้

## วิธีทำทีละขั้น

1. routerเลือกreadBrandsHandler ไม่ต้องอ่านbodyหรือpaginationของproducts
2. handlerเรียกservice.listBrands
3. repository SELECTเฉพาะฟิลด์brandsและORDER BY id
4. serviceคืนarrayให้success helperครอบdata/timestamp แล้วตอบ200

## เฉลย JavaScript: จุดรับ request และตอบ response

โค้ดนี้ใช้จริงในtemplate โดยservice/repository/mapperที่ต้องใช้ร่วมกันอยู่ครบตามลิงก์ถัดไป ไม่ใช่handlerเดี่ยวที่รันได้โดยไม่มีlayerอื่น

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 1: SELECT brands ORDER BY id → 200 array
import {success} from '../mappers-$id/api-response.js';

export function readBrandsHandler(service) {
  return async function (req, res) {
    return success(res, await service.listBrands());
  };
}
```

## เช็กว่าคำตอบถูกอย่างไร

ส่งGETโดยไม่ต้องมีbody ตรวจdataเป็นarrayและชื่อฟิลด์ตรงกับcontract อย่าใช้จำนวนแบรนด์จากใบงานเป็นค่าคงที่ เพราะฐานที่ต่ออาจมีข้อมูลต่างกัน

## ไฟล์ที่ใช้ร่วมกัน

- [handler ข้อนี้](../../src/controllers-$id/02-read-brands.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../src/services-$id/catalog-service.js): ฟังก์ชัน `listBrands` และ validation
- [repository](../../src/repositories-$id/catalog-repository.js): ฟังก์ชัน `listBrands` และ SQL
- [mapper](../../src/mappers-$id/product-mapper.js): ไม่ใช้ product mapper คืนฟิลด์ brands ตามใบงาน
- [error handler](../../src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## จุดปรับเมื่อนำไปใช้กับข้อสอบ

1. route เรียก service.listBrands โดยไม่รับ body
2. repository SELECT ฟิลด์ brands ตาม response ใบงาน: id/name/country_of_origin/website/is_active/created_at
3. ORDER BY id ให้ลำดับแน่นอน
4. ส่ง array ใน success/data พร้อม timestamp ปัจจุบัน

## เฉลยส่วน SQL

```sql
SELECT id,name,country_of_origin,website,is_active,created_at
FROM brands ORDER BY id;
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

เทียบชื่อฟิลด์ brands กับต้นฉบับ อย่าเปลี่ยนเป็น camelCase ทุก resource โดยอัตโนมัติ

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
