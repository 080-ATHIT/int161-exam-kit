# 07 — Exception Handling

## Flow

validation/business error → throw AppError → Express5 async error forwarding → error middlewareท้ายapp →HTTPและJSON

```js
throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
```

AppErrorของkitใช้constructor(message,status,code) และproperty status/code ถ้าคัดลอกAppErrorจากโจทย์W6ที่ใช้statusCode/errorCode ต้องใช้handlerให้ตรงกัน อย่าผสมpropertyจากคนละชุด

## Error middleware

ต้องมี4arguments `(err, req, res, next)` ติดหลังroutes และnot-found middleware ถ้าheadersถูกส่งแล้วให้next(err) ไม่ส่งresponseซ้ำ

| Error | HTTPของkit | code |
| --- | --- | --- |
| validation | 400 | VALIDATION_ERROR |
| JSONแตก | 400 | INVALID_JSON |
| productไม่มี | 404 | PRODUCT_NOT_FOUND |
| ER_DUP_ENTRY /1062 | 409 | DUPLICATE_KEY |
| ER_NO_REFERENCED_ROW_2 /1452 | 400 | FOREIGN_KEY_NOT_FOUND |
| ER_ROW_IS_REFERENCED_2 /1451 | 409 | RESOURCE_IN_USE |
| errorที่ไม่คาดคิด | 500 | INTERNAL_SERVER_ERROR |

ต้องไม่ส่งSQL,stack,password,err.sqlMessageไปclient ใช้ข้อความอังกฤษที่ตรงสเปกและไม่เปิดเผยข้อมูลระบบ

## รูปJSONต่างกันตามโจทย์

```json
{"success":false,"error":{"code":"PRODUCT_NOT_FOUND","message":"Product not found"},"timestamp":"2026-10-21T00:00:00.000Z"}
```

ด้านบนเป็นตัวอย่างW8-likeของkit ส่วนW6ใช้ `{status:'error',error:{code,message}}` และsuccessเป็น `{status:'success',data:...}` เปลี่ยนhelperและhandlerทั้งคู่ ดู [W6 response JS](../recipes/w6-response.js)

เวลาในตัวอย่างเป็นตัวอย่างเท่านั้น โค้ดต้องสร้างtimestampจริง ไม่hardcode

## ลองให้ผิดเพื่อเช็ก

GET idไม่มี→404; POSTskuซ้ำ→409; brand_idไม่มี→400; ลบแถวถูกFKอ้างอิง→409; ส่งJSONแตก→400 ทุกกรณีต้องเป็นJSONและstatusถูก ไม่ใช่200ที่มีข้อความerror

ดู [AppError](../src/middlewares-$id/app-error.js), [handler](../src/middlewares-$id/error-handler.js), [วิธีเลือกresponse](../recipes/README.md)
