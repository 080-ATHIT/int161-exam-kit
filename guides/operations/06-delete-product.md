# ลบสินค้าตาม ID — คำถาม เฉลย และวิธีทำ

คำถามย่อจากงานWeek08ที่templateทำไว้แล้ว ส่วนเฉลยเป็นโค้ดของโครงนี้ ไม่ใช่โจทย์ใหม่ให้ทำเพิ่ม ลำดับ6ส่วนจัดเพื่อค้นหาโค้ด ไม่ใช่การยืนยันข้อสอบกลางภาค

## คำถาม

`DELETE /products/:id` ภายใต้basepathคงที่ `/api/รหัสของตัวเอง`

พัฒนา API ลบสินค้าตามid ลบสำเร็จตอบ204 No Contentโดยไม่มีresponse body หากไม่พบidตอบ404

## วิธีคิดก่อนเขียน

- ลบผิดWHEREอาจกระทบหลายแถว จึงvalidateidและbindWHEREให้ครบ
- ต้องแยกแถวไม่มีออกจากการลบสำเร็จ ตรวจexistingและaffectedRows
- 204หมายถึงไม่มีbody ห้ามส่งJSONแม้เป็นข้อความsuccess
- ถ้าข้อมูลยังถูกFKอ้างอิงให้จัดการconstraint error ไม่ลบข้อมูลสัมพันธ์อื่นโดยพลการ

## วิธีทำทีละขั้น

1. controllerแปลงreq.params.idด้วยnumericId
2. servicegetProductตรวจexistingก่อน
3. repositoryDELETE WHERE id=?และคืนaffectedRows
4. ถ้าแถวหายก่อนลบให้throw404; FKerrorปล่อยไปmiddlewareกลาง
5. ลบสำเร็จres.status(204).end()

## เฉลย JavaScript: จุดรับ request และตอบ response

โค้ดนี้ใช้จริงในtemplate โดยservice/repository/mapperที่ต้องใช้ร่วมกันอยู่ครบตามลิงก์ถัดไป ไม่ใช่handlerเดี่ยวที่รันได้โดยไม่มีlayerอื่น

```js
// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Delete: find404 or DELETE; 204 has NO JSON body
import {numericId} from '../services-$id/catalog-service.js';

export function deleteProductHandler(service) {
  return async function (req, res) {
    await service.removeProduct(numericId(req.params.id));
    return res.status(204).end();
  };
}
```

## เช็กว่าคำตอบถูกอย่างไร

ลบเฉพาะidที่ตนสร้าง ตรวจstatus204และrawbodyว่าง จากนั้นGETidเดิมและDELETEซ้ำต้อง404 ถ้าโจทย์จริงกำหนด200พร้อมJSONให้เปลี่ยนcontrollerตามสเปกนั้น

## ไฟล์ที่ใช้ร่วมกัน

- [handler ข้อนี้](../../src/controllers-$id/06-delete-product.js): ส่วน req/res ที่ route ใช้จริง
- [route](../../src/routes-$id/catalog-route.js): จุด mount handler และ middleware
- [service](../../src/services-$id/catalog-service.js): ฟังก์ชัน `removeProduct` และ validation
- [repository](../../src/repositories-$id/catalog-repository.js): ฟังก์ชัน `findProduct / removeProduct` และ SQL
- [mapper](../../src/mappers-$id/product-mapper.js): ไม่ส่ง DTO เมื่อ204
- [error handler](../../src/middlewares-$id/error-handler.js): แปลง error เป็น status/code/message

ไฟล์ handler ไม่ใช่คำตอบทั้งหมดเพียงไฟล์เดียว ต้องอ่าน service/repository/mapper ที่ลิงก์ไว้ด้วย ทุกไฟล์เป็น .js ปกติ แยกชั้นเหมือน teacher template ไม่มีตัวสร้างโค้ดหรือ framework เพิ่ม

## จุดปรับเมื่อนำไปใช้กับข้อสอบ

1. ตรวจ id และเช็กว่ามีแถว ถ้าไม่มีตอบ PRODUCT_NOT_FOUND404
2. DELETE WHERE id=? ตรวจ affectedRows เพื่อรับกรณีแถวหายก่อนลบ
3. ตอบ res.status(204).end() ไม่ json() และไม่ส่งข้อความ
4. ถ้า DB ส่ง FK constraint error ให้ error middleware จัดการ ไม่ปล่อยเป็น HTML
5. GETหลังลบและDELETEซ้ำต้อง404 ถ้าโจทย์อื่นกำหนด200+JSONต้องเปลี่ยนตามสเปกนั้น

## เฉลยส่วน SQL

```sql
DELETE FROM products WHERE id=?;
```

## วิธีลองและเช็ก

เตรียมเครื่องตาม [START-HERE](../../START-HERE.th.md), เปิด `npm start` แล้วใช้ [request ตัวอย่าง](../../requests/catalog.http) เปลี่ยน productId เป็นค่าที่ POST คืนมา

ลบเฉพาะ product ที่ตนสร้าง เก็บ response text ต้องว่าง และตรวจใน DB/GETว่าแถวหาย

รัน `npm test` เพื่อตรวจทั้งระบบกับ MySQL ฐานฝึก ห้ามรันชุดเขียน/ลบของ kit ชี้ไปฐานสอบจริง ก่อนส่งตรวจ base path/body/status/DTO อีกครั้งตามโจทย์ที่ได้รับในวันสอบ
