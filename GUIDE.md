# Guide — เอา Template นี้ไปใช้กับข้อสอบอย่างไร

โค้ดในsrcทำงานครบแล้ว ให้แก้โครงตามสเปกที่ได้รับ จุดที่ควรเปลี่ยนมีคอมเมนต์ `ADAPT` ในJS ทุกหัวข้อด้านล่างเป็นขั้นตอนปรับโครง ไม่มีโจทย์ใหม่ให้ทำ

ดู [คำถามพร้อมเฉลย/วิธีคิด/วิธีทำ](QUESTIONS-AND-ANSWERS.md) เพื่อเข้าใจว่าแต่ละส่วนของโครงตอบอะไร ก่อนปรับตามโจทย์ที่ได้รับ

## 1. จดเฉพาะค่าที่ต้องใช้จากโจทย์

method/path, ชื่อtable/columns, ชนิดPK/FK/UNIQUE, bodyที่รับ, DTOที่ส่ง, status/errorcode และpaginationpolicy ดู [Contract Sheet](guides/01-contract.md) หากต้องการตารางจด

ไม่ยึดproducts/brandsหรือ3Readของตัวอย่างเป็นชื่อข้อสอบจริง

## 2. เลือกฐานและidentity

แก้ [.env.example](.env.example) โดยcopyเป็น.envส่วนตัว ดู [START-HERE](START-HERE.th.md)

- ทดลองเปิดโครงเดิม: DB_MODE=practice + DB_NAME=int161_practice_catalog
- ใช้ฐานโจทย์: DB_MODE=exam + DB_NAMEและSTUDENT_ID/STUDENT_NAME/STUDENT_KEYที่กำหนดเองครบ โค้ดไม่สร้าง/resetฐาน ไม่ยอมใช้identityตัวอย่าง
- basepathสร้างจากSTUDENT_IDคงที่เมื่อเริ่มapp ไม่ใช้/api/:studentId

ดู [settings.js](src/configs-$id/settings.js), [db-config.js](src/configs-$id/db-config.js) และ [database-mode.js](src/configs-$id/database-mode.js)

## 3. แก้ SQL ก่อน

เปิด [catalog-repository.js](src/repositories-$id/catalog-repository.js) เทียบกับschemaจริง แล้วแก้table/column, SELECTfields, JOIN/alias, WHEREkey และINSERT/UPDATEdata

- List: ORDER BYและLIMIT/OFFSET ถ้าแบ่งหน้า
- Count: filterเดียวกับlist
- Detail: SELECTตามPKและJOINข้อมูลที่DTOต้องใช้
- Create: insertIdใช้เฉพาะauto increment; stringPKอ่านกลับด้วยkeyที่รับ
- Update: WHEREครบและตรวจexistingก่อน ไม่ใช้changedRows0เป็นnot-found
- Delete: WHEREครบ; compositekeyต้องทุกส่วน

ชื่อSQLidentifierเป็นsourcecodeที่คุณแก้เอง ไม่ดึงชื่อตารางจากrequestมาconcatenate Bindค่าผ่าน? ตัวอย่างSET?ของmysql2.queryต้องเป็นobjectที่ผ่านallowlistแล้ว

## 4. แก้ input และ business rule

เปิด [catalog-service.js](src/services-$id/catalog-service.js) เปลี่ยนproductInput/validatorให้ตรงชื่อbody, required/optional/null/defaults และชนิดfieldจริง

จากนั้นแก้ruleของcreate/update/remove: เช็กnot-found, uniquefieldชนกับแถวอื่น, FKที่โจทย์ต้องตรวจ และชื่อerrorcode ห้ามใช้numericIdกับstringPKเช่นNA

PUTตัวอย่างใช้fullbody หากโจทย์เป็นpartialต้องปรับvalidationและการรวมค่าเอง ไม่ทิ้งfieldเดิมโดยไม่ตั้งใจ

## 5. แก้ DTO/envelope

เปิด [product-mapper.js](src/mappers-$id/product-mapper.js) เปลี่ยนsummary/detailallowlists, snake_case→ชื่อAPI, number/date/nullตามตัวอย่างresponse

หากDTOต้องbrandNameหรือชื่อจากอีกตาราง ต้องแก้JOIN/aliasในrepositoryด้วย ไม่hardcodeชื่อ และไม่spreadentityทั้งก้อน

เปิด [api-response.js](src/mappers-$id/api-response.js) ปรับenvelope/timestamp/pagination; ถ้าโจทย์ใช้status/dataดู [w6-response.js](recipes/w6-response.js) แล้วเปลี่ยนerrorhandlerให้เข้าคู่

## 6. เลือก controller ให้ตรงแต่ละข้อ

| งาน | Guideปรับโครง | จุดรับreq/ส่งres |
| --- | --- | --- |
| Create | [01](guides/operations/01-create-product.md) | [controller](src/controllers-$id/01-create-product.js) |
| Read list | [02](guides/operations/02-read-brands.md) | [controller](src/controllers-$id/02-read-brands.js) |
| Read + Pagination/DTO | [03](guides/operations/03-read-products.md) | [controller](src/controllers-$id/03-read-products.js) |
| Read detail | [04](guides/operations/04-read-product-detail.md) | [controller](src/controllers-$id/04-read-product-detail.js) |
| Update | [05](guides/operations/05-update-product.md) | [controller](src/controllers-$id/05-update-product.js) |
| Delete | [06](guides/operations/06-delete-product.md) | [controller](src/controllers-$id/06-delete-product.js) |

เปิด [catalog-route.js](src/routes-$id/catalog-route.js) เปลี่ยนmethod/path/paramsและmiddlewareให้ตรง ใส่queryParserเฉพาะrouteที่ต้องแบ่งหน้า controllerเรียกserviceไม่เขียนSQLซ้ำ

ถ้าDELETE204ให้.end()ว่าง ถ้า200ให้JSONตามโจทย์ ไม่ส่งbodyกับ204

## 7. แก้ Pagination และ Exception

[pagination.js](src/middlewares-$id/pagination.js): defaultpage/limit/maxlimit/invalidpolicyตามโจทย์ คำนวณoffsetหลังnormalize ใช้limitเดียวกับSQLและmetadata ตัวอย่างdefault1/10,max100เป็นค่าของโครงที่แก้ได้

[error-handler.js](src/middlewares-$id/error-handler.js): status/errorcode/message/envelopeต้องตรงโจทย์ จัดการ1062duplicate,1452FKไม่มี,1451resourceถูกอ้างอิง และไม่เผยSQL/stack/password

## 8. ถ้าต้องส่งใน template อาจารย์

ใช้ [แผนที่ย้ายไฟล์](guides/05-template.md) คงpackage/dependencies/ชื่อfolderและรูปแบบส่งที่อาจารย์กำหนด เอาเฉพาะsourceที่ใช้จริงไปประกอบ ไม่copyเอกสาร/tests/scriptsทั้งหมดใส่โดยอัตโนมัติ

โครงนี้ใช้ExpressESM/mysql2ตามตระกูลtemplate ไม่เพิ่มframework การเปลี่ยนชื่อfolder -$id เป็นรหัสตัวเองต้องแก้importด้วย

## 9. ตรวจงานที่แก้แล้ว

แก้requestsให้ตรงbaseURL/body/fieldsของตัวเอง ลองCreate→Read→Update→Deleteกับแถวที่ตนสร้าง ตรวจHTTP/body/type/persistence/404/duplicate/FK/หน้าเกินตามสเปก

`npm test` ใช้ตรวจโครงตัวอย่างในDB_MODE=practice ไม่ใช่runnerประเมินข้อสอบที่แก้schemaแล้ว ให้ใช้runnerที่อาจารย์แจกและassertionsตามโจทย์ใหม่

ดู [errorและก่อนส่ง](guides/06-offline.md) และ[สรุป9บท](INT161-MIDTERM) เมื่อต้องทบทวน
