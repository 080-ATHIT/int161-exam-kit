# 01 — HTTP, REST และ Status Codes

คู่มือสรุปที่ผู้ช่วยเรียบเรียงเพิ่มสำหรับอ่านประกอบโจทย์ ไม่ใช่ใบงานหรือข้อสอบใหม่ของอาจารย์

## อ่าน request ให้ได้ก่อนเขียน route

HTTP request มี method, URL/path/query, headers และ body เช่น:

```http
POST /api/demo001/products
Content-Type: application/json

{"sku":"MY-001","name":"Phone","brand_id":1,"category":"PHONE","price":100}
```

method บอกการทำงาน path ระบุ resource headers บอกชนิดข้อมูล และ body คือข้อมูลที่ส่งเข้า server Response มี status, headers และ body ตาม contract

| Method | งานที่พบบ่อย | ตัวอย่าง |
| --- | --- | --- |
| GET | อ่านโดยไม่แก้ resource | /products, /products/1 |
| POST | สร้าง resource | /products |
| PUT | แทนค่าข้อมูล resource ตาม contract | /products/1 |
| PATCH | แก้บางฟิลด์ เมื่อโจทย์กำหนดให้ใช้ | /products/1 |
| DELETE | ลบ resource | /products/1 |

PUT แบบ full body ในชุดฝึกเป็นนโยบายของตัวอย่าง อย่าเดาว่าทุกข้อสอบใช้เหมือนกัน GET ไม่ควรทำให้ข้อมูล resource เปลี่ยน PUT/DELETE โดยหลักควรมีผลสุดท้ายเหมือนเดิมเมื่อส่งซ้ำ แต่ status ของครั้งหลังอาจต่าง เช่น DELETEซ้ำ404

## params, query และ body

- `/products/12` → `req.params.id` เป็น string `'12'`
- `/products?page=2&limit=10` → `req.query` ใช้ควบคุมรายการ ต้อง validate ก่อนคำนวณ
- POST/PUT JSON → `req.body` หลังผ่าน express.json()

base path ของนักศึกษาเป็นค่าคงที่ เช่น `/api/demo001` ไม่ใช้ `/api/:studentId` ส่วน product ID ใช้ route param ได้

## Status ที่ต้องเลือกถูก

| Status | ความหมาย/ใช้ในโจทย์ |
| --- | --- |
| 200 | สำเร็จ มี JSONตามสเปก |
| 201 | สร้างสำเร็จ |
| 204 | สำเร็จและไม่มี response body |
| 400 | request/validationไม่ถูกต้อง |
| 404 | route หรือ resourceไม่พบ |
| 409 | ข้อมูลชนกัน เช่น UNIQUE หรือ resourceยังถูกอ้างอิง |
| 500 | server errorที่ไม่คาดคิด |

statusในบรรทัด HTTP กับข้อความใน JSON เป็นคนละอย่าง `res.json({status:404})` อย่างเดียวไม่ได้ทำให้ HTTP เป็น404 ต้อง `res.status(404).json(...)`

W8 DELETE กำหนด204ว่าง แต่ W6 DELETE customer กำหนด200พร้อมJSON เลือกตามโจทย์ ไม่ตั้งกฎเดียวใช้ทุกชุด

## ลองอธิบายก่อนสอบ

ทำไม GET detailไม่พบต้อง404แต่ GET listไม่มีรายการยัง200พร้อม[]? ทำไม POSTสำเร็จ201? ทำไม204ห้ามแนบJSON? ทำไม priceในbodyต้องตรวจชนิด แม้ clientเขียนมาว่าเป็นnumber?

ดู [วิธีใช้โครงกับข้อสอบ](../GUIDE.md) และเทียบstatusกับสเปกที่ได้รับจริง
