การเชื่อม WebStorm กับ Postman เพื่อทดสอบ API ที่เราเขียนด้วย Node.js และ Express ทำได้ไม่ยากครับ จริง ๆ แล้วทั้งสองโปรแกรมไม่จำเป็นต้องเชื่อมกันโดยตรง แค่เปิดเซิร์ฟเวอร์จาก WebStorm แล้วใช้ Postman ส่ง Request ไปยังเซิร์ฟเวอร์นั้นได้เลย
ขั้นตอนที่ 1: เปิดโปรเจกต์ใน WebStorm
สมมติว่าคุณมีโปรเจกต์ Node.js + Express อยู่แล้ว โดยมีไฟล์ server.js
ตัวอย่างโค้ด:
 
Plain Text
Plain Text
const express = require("express");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/students", (req, res) => {
  res.json([
    { id: 1, name: "Somchai" },
    { id: 2, name: "Somsri" }
  ]);
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
 
โค้ดนี้สร้าง API ไว้ 2 เส้นทาง คือ / และ /students
ขั้นตอนที่ 2: รันเซิร์ฟเวอร์ใน WebStorm
 
 
 
 
1. เปิด Terminal
เปิด Terminal ด้านล่างของ WebStorm
2. ติดตั้ง Express หากยังไม่ได้ติดตั้ง
 
Plain Text
Plain Text
npm install express
 
3. รันเซิร์ฟเวอร์
 
Plain Text
Plain Text
node server.js
 
ถ้าเห็นข้อความ Server running on port 3000 แสดงว่าเซิร์ฟเวอร์เริ่มทำงานแล้ว
สำคัญ: อย่าปิด Terminal ที่กำลังรันเซิร์ฟเวอร์อยู่ เพราะ Postman ต้องเรียก API ขณะที่เซิร์ฟเวอร์ทำงาน
ขั้นตอนที่ 3: เปิด Postman เพื่อทดสอบ API
 
 
 
 
1. สร้าง HTTP Request ใหม่
เปิด Postman แล้วสร้าง Request ใหม่
2. ทดสอบ API แรก
GET
http://localhost:3000/
คัดลอก
กด Send
ผลลัพธ์ที่ควรได้:
 
Plain Text
Plain Text
Hello World!
 
3. ทดสอบ API ที่ส่ง JSON
GET
http://localhost:3000/students
คัดลอก
กด Send
ผลลัพธ์ที่ควรได้:
 
Plain Text
Plain Text
[
  { "id": 1, "name": "Somchai" },
  { "id": 2, "name": "Somsri" }
]
 
ขั้นตอนที่ 4: ถ้าต้องการทดสอบ POST
ตัวอย่างการส่งข้อมูลนักเรียนเข้า API
 
Plain Text
Plain Text
{
  "id": 3,
  "name": "Anan"
}
 
อย่างไรก็ตาม โค้ดตัวอย่างด้านบนยังไม่มี Route สำหรับ POST /students ดังนั้นต้องเขียน Route เพิ่มก่อน จึงจะทดสอบ POST ได้สำเร็จ
ถ้าทำแล้วไม่สำเร็จ ให้ตรวจสอบ
Cannot POST ... — ยังไม่ได้เขียน Route สำหรับ POST หรือใช้ URL ไม่ตรง
Cannot find module 'express' — ยังไม่ได้ติดตั้ง Express ในโปรเจกต์
404 Not Found — URL หรือ Route ไม่ตรงกับที่เขียนไว้
ECONNREFUSED — เซิร์ฟเวอร์ยังไม่รัน หรือใช้พอร์ตผิด
ส่งข้อมูลนี้
ไปที่ Body → raw → JSON
ใส่ URL http://localhost:3000/students
เปลี่ยน Method จาก GET เป็น POST
