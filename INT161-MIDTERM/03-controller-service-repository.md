# 03 — Controller, Service, Repository

## ใครรับผิดชอบอะไร

| ชั้น | รับผิดชอบ | ไฟล์จริง |
| --- | --- | --- |
| app/router | base path, method, middleware, ประกอบ dependencies | [catalog-route.js](../src/routes-$id/catalog-route.js) |
| controller/handler | อ่าน req เรียกservice ส่ง HTTP status/body | [เฉลย6ข้อ](../src/controllers-$id) |
| service | validation, business rule, not-found, เลือกDTO | [catalog-service.js](../src/services-$id/catalog-service.js) |
| repository | querySQLและคืนข้อมูล/ผลกระทบจากDB | [catalog-repository.js](../src/repositories-$id/catalog-repository.js) |
| mapper | เลือกฟิลด์/แปลงชื่อและชนิดข้อมูล | [product-mapper.js](../src/mappers-$id/product-mapper.js) |
| error middleware | แปลงerrorเป็นHTTPและJSONที่ตรงcontract | [error-handler.js](../src/middlewares-$id/error-handler.js) |

controllerไม่ได้จำเป็นต้องมีfolderชื่อcontroller ในโครงนี้ใช้ controllers-$id เพื่อให้หาจุดรับreq/ส่งresได้ง่าย นี่เป็นการจัดไฟล์ของผู้ช่วย ไม่ใช่ข้อบังคับชื่อfolderใหม่จากอาจารย์

## ตามหนึ่ง request ให้ครบ

PUT /products/12 → routerเลือกhandler → numericIdตรวจ12 → serviceตรวจว่ามีแถว/validatebody/SKUซ้ำ → repository UPDATE WHERE id=? → SELECTกลับพร้อมJOIN → mapperสร้างdetailDTO → handlerตอบ200

ถ้าไม่พบแถว service throw AppError404 ถ้าDBเจอ FKผิด errorhandlerแปลง400 ไม่มี layerใดส่งresซ้ำ

## ทำไมส่ง db/service เป็นargument

`createCatalogRepository(db)` รับpool, `createCatalogService(repo)` รับrepository และ handlerรับservice ทำให้เห็นการประกอบตรงๆ ทดสอบกับฐานฝึกได้และไม่ต้องเปิดpoolใหม่ทุกrequest ใช้ poolที่ประกอบตอนเริ่มapp

## เปลี่ยนโจทย์แล้วแก้ที่ไหน

เปลี่ยนtable/column/keyที่repository เปลี่ยนbusinessvalidationที่service เปลี่ยนresponsefieldsที่mapper และเปลี่ยนpath/statusที่route/handler อย่า search-replaceคำว่าidเป็นcodeทั้งproject เพราะstring PK, insertId และ WHEREต้องเปลี่ยนวิธีคิดด้วย

ก่อนย้ายไฟล์ดู [แผนที่ teacher template](../guides/05-template.md) ต้องแก้ importทุกแห่งให้ตรงชื่อfolderจริง
