# เอาโครงนี้ใส่ template อาจารย์

โค้ดที่ใช้จริงอยู่srcแล้ว นำไปประกอบในprojectที่อาจารย์กำหนดโดยเทียบทีละไฟล์ ไม่จำเป็นต้องเอาเอกสาร/tests/scripts/SQLตัวอย่างทั้งหมดไปส่ง

| จากชุดนี้ | วางในteacher project | แก้ก่อนใช้ |
| --- | --- | --- |
| src/configs-$id/ | src/configs-$id/ | .env/DB/identity/mode |
| src/routes-$id/ | src/routes-$id/ | method/path/middleware |
| src/controllers-$id/ | src/controllers-$id/หรือcontrollerเดิม | params/body/status |
| src/services-$id/ | src/services-$id/ | validation/business rule |
| src/repositories-$id/ | src/repositories-$id/ | table/columns/key/JOIN/SQL |
| src/mappers-$id/ | src/mappers-$id/ | DTO/envelope/types |
| src/middlewares-$id/ | src/middlewares-$id/ | pagination/error contract |
| src/app.js, src/server.js | src/ | ประกอบimportsและentrypoint |

ถ้าอาจารย์ให้renamefolderเป็นรหัสตนเอง ให้เปลี่ยนชื่อและimportทุกแห่ง ชื่อcontrollers-$idเป็นการแยกhandlerของโครงนี้ จะยุบไปไว้routeเดิมได้แต่ต้องแก้importsให้ครบ

## Entryและpackage

server.jsของรุ่นนี้พึ่งเฉพาะsrcและpackages ไม่importscriptนอกsrc เปิดได้ด้วยstartcommand:

```json
{"type":"module","scripts":{"start":"node --env-file-if-exists=.env src/server.js"}}
```

อย่าทับpackage.jsonทั้งไฟล์ถ้าอาจารย์มีscripts/dependenciesอื่น ให้รวมเฉพาะส่วนที่ต้องใช้ คงexpress/mysql2/http-statusและlockfileที่เตรียมแล้ว

## ต่อฐานโจทย์

ตั้งDB_MODE=exam, DB_NAME/STUDENT_ID/STUDENT_NAME/STUDENT_KEYเป็นค่าจริงครบ โหมดนี้SELECT1ตรวจการเชื่อมต่อ ไม่ต้องมีmarkerและไม่สร้าง/seed/resettable ตรวจSQL/NOTNULL/FK/DTOและinputให้ตรงก่อนยิงrequestเขียนข้อมูล

ใช้SQLอาจารย์ตามคำสั่ง ไม่ใช้sql/schema.sqlของตัวอย่างแทนโดยอัตโนมัติ ไม่ใช้db:initหรือtestของโครงกับฐานสอบ

## ตรวจว่าใส่โครงในtemplateได้

```sh
npm run verify:template -- --template /absolute/path/midterm-exam-esm-template.zip
```

คำสั่งนี้ใช้เฉพาะตอนตรวจโครงตัวอย่าง: แตกZIPเป็นสำเนาชั่วคราว คัดลอกsrc/app/server/configs/routes/controllers/services/repositories/mappers/middlewares เพิ่มscripts.startเฉพาะในสำเนาโดยคงscripts/dependenciesอื่น แล้วตรวจAPIcontractsและรันnpm startจริงเพื่อGETstudent-info/productsกับฐานฝึก ไม่ทับprojectต้นฉบับ ไม่ตรวจว่าschema/สเปกที่แก้ใหม่ถูกทุกกรณี
