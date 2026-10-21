# INT161 Exam Kit — แบบออกแบบฉบับทบทวนสุดท้าย

สถานะ: ข้อเสนอเพื่อพิจารณา ยังไม่ได้รับอนุมัติให้สร้างชุดสอบ
วันที่: 21 ตุลาคม 2026
เจ้าของเป้าหมาย: ผู้ใช้ที่กำลังเตรียมสอบ INT161 และยังไม่คล่องในการเขียน API

## เป้าหมายและเหตุผล

ผู้ใช้ต้องการโหลดชุดจาก GitHub แล้วใช้ช่วยทำข้อสอบปฏิบัติได้ เป้าหมายคือเปิดสเปกใหม่แล้วรู้ว่าต้องแก้อะไร ตรวจผลได้ และส่ง project ที่ตรงโจทย์ ชุดนี้จึงต้องช่วยทั้งการค้นหา การปรับโค้ด และการตรวจความถูกต้อง การรันระบบตัวอย่างสำเร็จเป็นเพียงจุดเริ่มต้น

ผู้ใช้ขอให้รีวิวแผนจนได้ข้อเสนอที่เหมาะที่สุด รอบนี้ส่งเฉพาะแบบออกแบบและผลทบทวน ไม่สร้าง product code, project scaffold, dependencies หรือ repo ใหม่

## ข้อเท็จจริงจากผู้ใช้และไฟล์ต้นทาง

- ผู้ใช้ระบุว่าอาจารย์อนุญาตให้ install/นำชุดจาก GitHub มาใช้ได้ แต่ยังไม่มีรายละเอียดสิทธิ์การใช้เครื่องมืออื่น จึงไม่ออกแบบให้ต้องพึ่ง AI ระหว่างสอบ
- ประกาศที่ผู้ใช้ให้: ปฏิบัติเน้น CRUD, DTO, Pagination, Exception Handling จำนวน 6 ข้อ 1C/3R/1U/1D; อนุญาตเอกสาร; มีช่วงดาวน์โหลดก่อนสอบ และระหว่างสอบห้ามต่ออินเทอร์เน็ต
- อาจารย์มี template สำหรับสอบ จึงต้องคง template ที่ได้รับจริงเป็นฐานงานส่ง ไม่ถือว่าข้อสอบทุกครั้งใช้ชุดตัวอย่างของเราแทนได้
- template ที่แนบเป็น ESM มี Express ^5.2.1, mysql2 ^3.24.3, http-status ^2.1.0 และแบ่ง configs/routes/services/repositories/mappers/middlewares แบบชื่อโฟลเดอร์ลงท้าย -$id
- template ยังมี placeholder และจุดต่อไม่ครบ: base path, error middleware, pagination/view forwarding, COUNT, PUT arguments, null ก่อน mapping และ create ที่ผูกกับ key ตัวอย่าง
- ชุด W8 มี student-info, brands list/detail และ products CRUD/DTO/pagination รวม 8 endpoints จึงไม่ถือว่า endpoint ของข้อสอบจริง 6 ข้อต้องเหมือน W8
- W6 มี string PK, composite PK, foreign key และ centralized errors; W6 กับ W8 ใช้ response envelope ต่างกัน
- สเปก W8 ระบุ DELETE 204 และ duplicate 409 แต่ test runner ยอมรับ DELETE 200 และ duplicate 400 ด้วย การผ่าน runner จึงยังไม่ยืนยันว่าตรงสเปกทุกจุด
- สภาพเครื่องที่ตรวจในรอบออกแบบ: macOS/zsh, Node v26.5.1 และ mysql CLI 9.7.1 ไม่ถือว่า version ของ CLI คือ version ของ database server
- แบบฝึกบนเว็บเดิมส่วนหนึ่งเก็บข้อมูลใน memory ใช้ฝึกได้ แต่ไม่ใช้เป็นหลักฐานว่าชุดนี้ทำงานกับ MySQL จริง

แหล่งต้นทาง: INT161/inbox/midterm-2026-10-21/midterm-exam-esm-template.zip; OneDrive_2026-10-21 (1).zip (Week 08 specs, SQL และ test runner); INT161/week6/express_crud_exception_assignment.md; สไลด์และบทเรียน W1–W7 ที่อ่านไว้ก่อนหน้า ไม่มีการคัดลอกชื่อ รหัสลับ หรือข้อมูลผู้เข้าสอบคนอื่นลงตัวอย่างเผยแพร่

## ทางเลือกที่พิจารณาและข้อสรุป

1. คู่มืออย่างเดียว: เบา แต่ผู้ใช้ยังต้องประกอบโค้ดหลายส่วนเอง
2. เครื่องมือสร้าง API จาก config: สะดวกเฉพาะกรณีที่รองรับ แต่เพิ่มสิ่งที่ต้องเรียนและแก้ยากเมื่อสเปกต่างออกไป
3. โค้ดตัวอย่างพร้อมคู่มือย้ายเข้า template อาจารย์: มีจุดเริ่มที่รันได้ ชิ้นส่วนเป็น JavaScript/SQL ที่อ่านและแก้ตรง ๆ ได้ และฝึกการปรับโจทย์ได้

เลือกข้อ 3 เป็นข้อเสนอของผู้ช่วย ไม่ใช่ตัวเลือกที่ผู้ใช้เคยยืนยัน ขนาดงานเป็นหนึ่งโปรเจกต์ที่ต้องมีแบบออกแบบและแผน implementation หลังผู้ใช้อนุมัติ

## สิ่งที่ผู้ใช้ตัดสินใจแล้วและสิ่งที่ผู้ช่วยเสนอ

ผู้ใช้ตัดสินใจแล้ว: ใช้เตรียมสอบ INT161, เน้นให้คนที่ยังไม่คล่องใช้ได้, สนใจชุดที่โหลดจาก GitHub ได้ และต้องการรีวิวก่อนสร้าง

ข้อเสนอของผู้ช่วย: ใช้ JavaScript ESM และ MySQL ตามอาจารย์; macOS เป็นแพลตฟอร์มที่ต้องทดสอบก่อน; คู่มือภาษาไทย; ไม่เพิ่ม ORM, TypeScript, Docker, frontend framework, cloud services หรือระบบสร้างโค้ดทั่วไป; GitHub repo ใหม่แบบ private ในบัญชี GitHub ปัจจุบันเป็นค่าเสนอเริ่มต้น ชื่อ int161-exam-kit หากชื่อนี้ถูกใช้ให้เลือก suffix ที่ชัดเจน การสร้าง/เผยแพร่ repo ทำหลังอนุมัติแบบออกแบบแล้ว

สิ่งที่ยังต้องกรอกตอนเตรียมเครื่อง: การเชื่อมต่อ database ของผู้ใช้และข้อมูลที่อาจารย์กำหนดรายบุคคล ใช้ไฟล์ config ที่ git ignore ไม่เก็บลง repo หรือ log หากเข้าถึง MySQL server ไม่ได้ ให้รายงานว่าการตรวจจริงยังไม่ผ่าน ไม่แทนผลด้วย simulator

## ของที่ผู้ใช้จะได้รับ

ชุดเดียว มีทางเข้าเดียว START-HERE.th.md พร้อมลิงก์ไปหัวข้อตามงาน เปิดอ่านผ่าน IDE/Markdown viewer ได้โดยไม่ต้องรันเว็บไซต์ คู่มือจะมี HTML ไฟล์เดียวสำหรับอ่าน/พิมพ์ออฟไลน์ด้วย ไม่มี CDN, remote fonts, login หรือ server ของเอกสาร

แบ่งหน้าที่ชัดเจน:

- reference-app/: ตัวอย่างสมบูรณ์ที่รันได้บน MySQL จริง พร้อม sample config, SQL ตัวอย่าง และคำสั่งเตรียม/รัน/ตรวจ เป็นเอกสารอ้างอิง ไม่ใช่ project ที่บังคับส่งแทน template อาจารย์
- recipes/: ชิ้นส่วนโค้ดที่แสดง context/import/export/ตำแหน่งวางครบ พร้อมจุดที่ต้องปรับเมื่อย้ายเข้า template
- guides/: คู่มืออ่านสเปก, ปรับ schema, CRUD, DTO, pagination, error handling, debug และจัดส่ง
- requests/: request ตัวอย่างเป็น .http และ curl และไฟล์ Postman Collection แบบ standalone ใช้โดยไม่ต้อง sign in หรือ sync เลือกเครื่องมือที่ผู้ใช้มีได้
- practice/: โจทย์สมมติและเกณฑ์ตรวจสำหรับฝึกปรับงาน ไม่ใช้ตัวตน/secret จากสเปกผู้เข้าสอบคนอื่น

ทุกชิ้นมีคำอธิบายสั้นถึงเหตุผล ตัวอย่าง input/output และลิงก์กลับตารางสเปกเดียวกัน ไม่มีไฟล์เดโมหลายแบบที่ให้พฤติกรรมขัดกันโดยไม่ระบุ เอกสาร Markdown เป็นแหล่งเดียวของเนื้อหา HTML สำหรับอ่าน/พิมพ์สร้างจากเนื้อหาเดียวกัน ไม่ดูแลสองฉบับแยกกัน

## ประสบการณ์ใช้ชุดนี้ตั้งแต่เตรียมเครื่องถึงส่งงาน

1. เตรียมก่อนสอบ: clone/download ในเวลาที่อนุญาต, ติดตั้ง dependencies แบบ lockfile, ตั้งค่า sample DB, รันตัวอย่าง และเปิดคู่มือขณะตัดอินเทอร์เน็ต
2. เมื่อได้โจทย์: เปิด template อาจารย์เป็น project ส่งงาน เปิด kit เป็นโฟลเดอร์อ้างอิงข้างกัน ไม่แทนหรือ overwrite project อาจารย์อัตโนมัติ
3. กรอก Contract Sheet ต่อ endpoint: method, static student base path, path key และชนิด, query/default/invalid policy, body fields/required/types, DB table/key, output DTO/envelope/types, success status และ error cases
4. เตรียม project: ตรวจ imports/ชื่อโฟลเดอร์/ESM/scripts/config และลอง SELECT 1 โดยไม่มีการแก้ข้อมูล จากนั้นทำ Read ที่ง่ายที่สุดเพื่อพิสูจน์เส้นทางครบ
5. เลือก recipe ตามงานและคัดลอกเฉพาะชิ้นส่วนที่จำเป็น: list, detail, create, update, delete; pagination/DTO/error เป็นส่วนประกอบที่เปิดตามจุดใช้งาน ทุก recipe บอกไฟล์ที่ต้องแตะและวิธีตรวจหลังแก้
6. ใช้ request ของตนเองตรวจทั้ง happy path และกรณีขอบ อ่าน Expected/Actual ตรวจ JSON กับสเปกด้วย ไม่ใช้จำนวน test ผ่านเป็นคำตอบเดียว
7. แพ็กงาน: ใช้ข้อกำหนดส่งจริงเป็นหลัก คู่มือระบุรายการไฟล์ให้ตรวจ แล้วซ้อมแตก ZIP ไป directory ใหม่ ตั้งค่าภายในและรันอีกครั้ง

ลำดับหลัง Read แรกขึ้นกับ dependency และเวลาที่ผู้สอบมี ไม่บังคับว่าต้องทำข้อ pagination ก่อนทุกข้อ หรือยึดคะแนนของข้อสอบตัวอย่างเป็นคะแนนสอบจริง

## ตัวอย่างหลักและขอบเขต code

ใช้ระบบ catalog สมมติหนึ่งระบบ ชื่อตาราง/ข้อมูลแยกจากฐานสอบ: brands และ products เป็นส่วนหลัก; tags (string key) และ product_tags (composite key) เป็นตัวอย่างเสริมใน domain เดียวกัน ไม่สร้างแอปแยกอีกหลายระบบ

ตัวอย่างหลักมี brand list/detail, product list/detail/create/update/delete และ student-info แบบ placeholder เพื่อให้เห็นการตั้ง static base path มี CRUD, optional pagination ตาม contract ตัวอย่าง, summary/detail DTO, JOIN brandName และ error handler กลาง ตัวอย่างสมมติของ kit ใช้ page เริ่ม 1, limit default 10, เพดาน 100, จำนวนเต็มบวก, input ผิด 400, หน้าที่เกินข้อมูลคืน 200 + [] + metadata

ตัวอย่างเหล่านี้ไม่กลายเป็น default ของข้อสอบโดยอัตโนมัติ หากสเปกสอบต่าง ให้ Contract Sheet ของข้อสอบเป็นตัวกำหนด

ตารางอ้างอิงต้องบอกหน้าที่ของแต่ละชั้น:

- Route: HTTP input/output และส่ง error ต่อ ไม่มี SQL
- Service: business rules, not-found/duplicate/foreign-key decisions ตาม contract และการประสาน repository/mapper
- Repository: SQL และผลฐานข้อมูล ไม่มี req/res
- Mapper: allowlist และแปลง entity/request/response fields ไม่มีการส่ง HTTP
- Middleware: JSON parser ก่อน routes, pagination parser เฉพาะจุดที่ใช้ และ error handler หลัง routes

ใช้ mysql2/promise; parameterized values; ชื่อตาราง/คอลัมน์เป็น source code ที่ผู้เรียนตรวจและแก้ ไม่สร้าง SQL identifier จาก query/body รับเข้าตรง ๆ การนำเข้า/เพิ่ม scripts ใน exam project ต้องทำตามไฟล์อาจารย์จริงและอธิบายเป็น patch รายไฟล์ ไม่ติดตั้ง runtime framework ใหม่

## ชิ้นส่วนที่ต้องครอบคลุมจริง

| งาน | สิ่งที่ต้องมีใน recipe และวิธีตรวจ |
|---|---|
| Read list | array ว่าง/หลายรายการ; ordering ที่แน่นอน; JOIN เมื่อ DTO ต้องใช้ field อีกตาราง |
| Read detail | key แบบเลขและ string โดยไม่แปลง 'NA' เป็น NaN; row ไม่พบต้องถูกตรวจ ก่อนส่งให้ mapper |
| Create | body allowlist/validation; unique field; auto-increment กับ client-supplied key; INSERT แล้วอ่านข้อมูลกลับ |
| Update | ส่ง id + body ครบ; แยก not-found ออกจากอัปเดตค่าเดิม; unique key ชนกับแถวอื่น แต่ค่าเดิมของตนเองใช้ได้ |
| Delete | พบ/ไม่พบ/ลบซ้ำ/ถูก FK อ้างอิง; contract 200+JSON หรือ 204+empty body |
| Pagination | normalized limit ใช้คำนวณ offset; missing/empty/decimal/negative/zero/oversized/overflow policy; COUNT ใช้ filter เดียวกัน; total=0 และ empty pages |
| DTO | DB column → request field → response field; summary/detail allowlists; field ที่ต้อง JOIN; null และ optional fields |
| ชนิดข้อมูล | DECIMAL เป็น string/number ตามสเปก; DATE เป็น YYYY-MM-DD หรือรูปแบบกำหนด; timestamp ISO; id เป็นเลข/string ตาม contract ไม่ hardcode ทุก endpoint เหมือนกัน |
| Error | custom status/errorCode ตรง handler; 1062/1452/1451; validation และ business errors แยกจาก 500; body ไม่เผย SQL/config/stack |
| Keys | auto-increment, string และ composite key; ตรวจ key ครบทุกส่วน; recipe string/composite ใช้โดเมนสมมติ ไม่ทำสำเนาเฉลยงานส่งที่มีในเว็บ |

Duplicate precheck มีไว้ให้ข้อความเหมาะกับงาน แต่ยังต้องจัดการ unique constraint error จาก DB การพิจารณา affectedRows ต้องไม่ตัดสินว่าค่าเดิมที่ไม่เปลี่ยนคือ resource ไม่มีอยู่เสมอ

## Response contract และความต่างระหว่างชุด

ไม่มี global switch ที่เปลี่ยนทั้งแอปเป็น W6 หรือ W8 โดยไม่ดู endpoint ให้ recipe แสดง response function สองแบบในเอกสาร และบอกวิธีเลือก/ปรับต่อ endpoint:

- แบบ W6: status/data เมื่อสำเร็จ และ status/error/code/message เมื่อผิดพลาด ตามโจทย์
- แบบ W8: success/data, timestamp และ pagination เมื่อเกี่ยวข้อง ตามโจทย์
- ข้อสอบจริง: รูปแบบที่ระบุจริงเป็นหลัก รวมชื่อ key, nesting, types, status และ body

Student ID เป็นค่า static ของ base path ไม่ใช่ route parameter :studentId ข้อมูล student-info ใช้ของตนเองที่ได้รับ ไม่ใช้ข้อมูลเพื่อน ไม่ hardcode timestamp ตัวอย่างเป็นค่าคงที่

## ขอบเขตเอกสารและการช่วยคนยังไม่คล่อง

คู่มือเริ่มต้นมีเพียงทางเดียว แล้วแยกหัวข้อให้ค้นจากคำที่พบในโจทย์ เช่น 'แบ่งหน้า', 'ไม่พบข้อมูล', 'SKU ซ้ำ', 'JOIN', 'ลบไม่ได้เพราะ FK' ทั้ง Markdown และ HTML ใช้ชื่อ/ลำดับเดียวกัน

ทุก recipe มี: ใช้เมื่อไร → prerequisite → Contract Sheet ช่องที่เกี่ยวข้อง → ไฟล์ที่ต้องแก้ตามลำดับ → โค้ดพร้อม context → request/expected result → อาการพังที่พบบ่อย → วิธีตรวจหนึ่งขั้น

มี worked example หนึ่งรอบ เปลี่ยน schema/field names/base path/DTO ของโจทย์สมมติให้ต่างจาก reference-app พร้อม diff รายเลเยอร์ การค้นหา/แทนที่ข้อความทั้งโปรเจกต์ไม่ใช่วิธีปรับโจทย์หลัก

Troubleshooting แยกปัญหาเครื่อง/DB (config, auth, connection, missing table), ESM/import, process/port, request/body, SQL constraint, response mismatch พร้อม error ที่สังเกตได้และ action แรกเพียงหนึ่งอย่างก่อนเข้าสเต็ปถัดไป

ผู้ช่วยเป็นผู้เสนอให้มีแผ่นสรุปสั้นสำหรับอ่านก่อนสอบ แต่ไม่ทำวิดีโอ ระบบคอร์สใหม่ หรือ dashboard เพิ่มในรุ่นแรก

## การติดตั้งและ offline readiness

Runtime dependencies เท่าที่ template ต้องใช้: express, mysql2, http-status และ ESM ใช้ lockfile ที่ทดสอบแล้ว แยก source archive ออกจากเครื่องที่ติดตั้ง Node/MySQL แล้วอย่างชัดเจน Git clone อย่างเดียวไม่ติดตั้ง Node/MySQL และไม่รับประกัน npm install ออฟไลน์

การเตรียม: npm ci เมื่อยังมี network; บันทึก Node/server version ที่ใช้ทดสอบจริง; แยกขั้น import schema กับ start app; เปิดเอกสารและรัน HTTP/DB flow ขณะปิด network หากการสอบกำหนดให้ใช้ dependency รุ่นอื่นให้ยึด template สอบและซ้อมปรับตาม

เครื่องมือ doctor ต้อง read-only: ตรวจ runtime, module availability, configuration ที่จำเป็น, DB connectivity/SELECT 1 และแสดงอาการพร้อมทางแก้ ไม่พิมพ์ password/secret และไม่แก้ config หรือล้าง DB ให้เอง

ไม่ bundle node_modules ข้าม OS เป็นวิธีหลัก ไม่สัญญาว่า ZIP ใช้ได้บนทุกเครื่องโดยไม่เตรียม dependencies ข้อเสนอรุ่นแรกต้องพิสูจน์บนเครื่อง macOS ของผู้ใช้ก่อน และระบุความต่างของ shell ในคำสั่งที่ให้มา

## ฐานข้อมูลและชุดทดสอบ

มี sample DB ชื่อขึ้นต้น int161_practice_ พร้อม marker ระบุฐานฝึก init เป็นคำสั่ง explicit มีข้อมูลสมมติ ไม่มีการ drop/reset ฐานที่ผู้ใช้ตั้งค่าอยู่โดยอัตโนมัติ

Built-in integration tests ต้องเริ่ม reference-app ของ kit บนพอร์ตว่าง ใช้ DB ฝึกที่ตรวจ prefix+marker ก่อนเปลี่ยนข้อมูล และตรวจซ้ำว่า config ของ server/test ตรงกัน ไม่รับ arbitrary exam base URL เป็น target สำหรับชุดเขียน/ลบข้อมูลอัตโนมัติ

ชุด HTTP ที่ผู้ใช้เปิดแก้เพื่อทดสอบข้อสอบจริงต้องระบุขั้นตอนตรวจ base URL/DB/ข้อมูลที่จะเปลี่ยน และมีลำดับ create → read → update → delete ของ record ที่สร้างเอง ไม่เลือก sample id ที่อาจชนข้อมูลโจทย์โดยเงียบ ๆ

Official runner: ใช้ไฟล์ที่อาจารย์แจกให้ตนเองแบบไม่แก้เกณฑ์ตรวจ ไม่เผยแพร่ student profiles ของผู้อื่น runner เป็นเครื่องมือเสริม ต้องมี checklist เทียบ written spec เพราะ runner ของ W8 ยอมรับบางค่ากว้างกว่าสเปก

No production migrations, cloud DB หรือการ deploy exam app เป็นส่วนของ kit ข้อมูลที่ส่งสอบเป็นงาน local ตามข้อกำหนด LEB2

## เกณฑ์ยอมรับและหลักฐานก่อนเรียกว่าพร้อมใช้

### A. ความถูกต้องของชุดที่สร้าง

- reference-app รันกับ MySQL server จริงที่บันทึก version แล้ว; CRUD ทุกแบบอ่านกลับเพื่อยืนยัน persistence ไม่ใช่ in-memory/mock-only
- tests มีทั้ง positive และ negative cases ในตารางข้างบน รวม no-op update, duplicate, FK, composite, invalid pagination, zero total, exact DTO shape/types และ 204 ที่ body ว่างจริง
- fixed sample output ตรง Contract Sheet และถ้าตั้งใจให้รองรับ W8 ต้องตรวจ written spec แยกจาก official runner
- snippets ที่บอกให้ย้ายเข้า template มีการซ้อมนำไปใช้ในสำเนา template อาจารย์ที่ไม่ดัดแปลงมาก่อน รันได้จริง ไม่ใช่ตรวจ snippets แบบโดด ๆ
- ตั้งค่าใน directory ใหม่จากไฟล์ที่เตรียมไว้ แล้ว start/doc/requests/DB ทำงานโดยปิดอินเทอร์เน็ต
- doctor ไม่แก้ข้อมูล; integration test ปฏิเสธ DB ที่ไม่ผ่าน guard; sample secrets ไม่หลุดใน Git/archive/log

### B. ผู้ใช้ใช้งานได้จริง

ใช้โจทย์สมมติอีกชุดที่ไม่ได้เฉลยใน worked example เปลี่ยน resource/key/DTO/base path และมีอย่างน้อยหนึ่งเงื่อนไขต่างจาก reference เช่น delete body หรือ field alias

ผู้ใช้ทำเองโดยเปิดคู่มือได้ ผู้ช่วยไม่ชี้ทีละบรรทัด ตรวจเวลาจริงและจุดที่ติด แต่ไม่ตั้งเวลาเป้าหมายหรือรับประกันผ่านสอบก่อนทราบเวลาสอบปฏิบัติจริง หากติด ให้แก้คู่มือที่จุดนั้นแล้วซ้อมโจทย์ใหม่ ไม่ใช้การจำเฉลยเดิมเป็นหลักฐาน

ผู้ช่วยทดสอบเทคนิคให้ครบก่อนได้ แต่ห้ามเรียกว่าทดสอบการใช้งานกับผู้ใช้ผ่านแล้วจนผู้ใช้ได้ลองจริง

### C. การส่งงาน

ใช้สำเนา project จาก template อาจารย์ รหัสและ static base path ของตนเองถูกต้อง ตัด node_modules ออกจาก submission เมื่อโจทย์กำหนด แตก ZIP ไป directory ใหม่แล้วติดตั้ง/ใช้ dependencies ที่เตรียมไว้และ start ได้ ผ่านการตรวจ endpoint หลังแตก ZIP ไม่บรรจุ runtime password โดยเงียบ ๆ; config ที่ต้องส่ง/กรอกให้ยึดคำสั่งของอาจารย์

## สิ่งที่ไม่ทำในรุ่นแรกและลักษณะที่ถือว่าล้มเหลว

ไม่ทำ universal generator/config DSL, ORM, Docker, web UI ใหม่, AI assistant ระหว่างสอบ, exam answer predictor, server grading replacement, หรือการ submit LEB2 อัตโนมัติ

ล้มเหลวแม้เดโมผ่าน หากต้องใช้อินเทอร์เน็ต, ย้ายเข้า template ไม่ได้, ต้องเดาชนิดข้อมูล/response, ฟังก์ชันเดียวซ่อน SQL/HTTP ทั้งหมดจนแก้ไม่ได้, ต้องเปิดเอกสารหลายเวอร์ชันที่ขัดกัน, หรือ tests ผ่านได้เพราะเกณฑ์อ่อนกว่าสเปก

## สิ่งที่ให้ผู้สร้างตัดสินใจได้และลำดับการส่งมอบ

ให้ผู้สร้างเลือกชื่อไฟล์ย่อย รูปแบบ HTML สำหรับอ่าน/พิมพ์ โครง scripts/test harness และ SQL fixture implementation โดยรักษา contract/guards/คำสั่งที่ผู้ใช้เห็นตามนี้ การเลือก test library ใช้ Node built-ins ก่อนถ้าพอ ไม่เพิ่ม dependency โดยไม่มีประโยชน์ชัดเจน

ลำดับงานหลังอนุมัติ: ทำแผน implementation → ปิดช่องว่างของ template และสร้าง reference-app → พิสูจน์ MySQL/response contracts → เขียน recipes + worked example → พิสูจน์ migration เข้า template/offline/archive → ให้ผู้ใช้ซ้อมปรับโจทย์ → แก้จากผลซ้อม → สร้าง release สำหรับเตรียมสอบ

เอกสารนี้เป็นขอบเขตของหนึ่งโปรเจกต์ รายการข้างต้นเป็นลำดับผลลัพธ์ ไม่ใช่แผน coding รายไฟล์ การทำแผน implementation ต้องใช้ superpowers:writing-plans หลังผู้ใช้อนุมัติแบบออกแบบนี้


## บันทึกการรีวิวฉบับนี้

- ตรวจซ้ำกับ package.json, app/service/repository ใน template จริง และ SQL/test runner ของ W8
- ปรับจาก starter ทั่วไปเป็นชุดตัวอย่าง + คู่มือย้ายเข้า template โดยไม่ overwrite งานสอบ
- ปิดช่องโหว่ด้าน spec-vs-runner, SQL/HTTP data types, key variants, no-op update, dependencies offline และการใช้ DB จริง
- แยกการผ่านตรวจเชิงเทคนิคออกจากการที่ผู้ใช้ทำโจทย์ใหม่ด้วยตนเอง ปัจจุบันยังไม่ได้สร้างหรือทดสอบ product ตามแบบนี้
- ตรวจในมุมผู้สร้างอิสระด้วย builder-check-prompt จาก brainstorming skill ผู้รีวิวตอบว่า “nothing important left” ไม่มีคำถามที่ต้องให้ผู้ใช้ตอบเพิ่มเพื่อทำแผนจากเอกสารนี้
- ข้อเสนอเครื่องมือ/แพลตฟอร์ม/การเผยแพร่ที่ยังเป็นการตัดสินใจของผู้ช่วยระบุไว้ในหัวข้อเฉพาะ ไม่ถือเป็นความยินยอมที่ผู้ใช้ให้แล้ว
