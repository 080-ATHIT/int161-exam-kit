# โจทย์เพิ่มเติมจากอาจารย์: Week 06

ที่มา: week6/express_crud_exception_assignment.md ใช้อ่านเพิ่มเรื่อง Exception Handling, String PK และ Composite PK ชุดนี้มี 5 ข้อตามใบงานเดิม ไม่ใช่การคาดการณ์ข้อสอบกลางภาค 6 ข้อ และรุ่นนี้ยังไม่ได้เพิ่มเฉลยเฉพาะ offices/employees/customers/payments

---

# แบบฝึกหัด: RESTful API CRUD & Centralized Exception Handling (Express.js)

### วัตถุประสงค์
1. ออกแบบและพัฒนา REST API ตามมาตรฐาน HTTP Methods และ Status Codes
2. ฝึกจัดการ Primary Key ทั้งแบบ Non-Auto-Increment String และ Composite Primary Key
3. รวมศูนย์การจัดการ Exception (Database Errors, Validation Errors, Not Found) ด้วย **Express Error-handling Middleware**
4. กำหนดมาตรฐานรูปแบบ JSON Response ให้เป็นรูปแบบเดียวกันทั้งระบบ

---

## 1. กฎและข้อกำหนดสำคัญ (Important Requirements)

### ⚠️ 1.1 ข้อกำหนดเรื่อง Base URL (Static Student ID Path)
* นักศึกษาแต่ละคน**ต้องระบุ (Hardcode) รหัสนักศึกษาของตนเองลงใน Route Path โดยตรง**
* **🚫 ข้อห้ามเด็ดขาด:** ห้ามใช้ Express Route Parameter เช่น `/api/:studentId/...` หรือดึงค่าผ่าน `req.params.studentId`
* *ตัวอย่าง (สมมติรหัสนักศึกษาคือ `66011234`):*
  * Base Path ที่ถูกต้อง: `/api/66011234/...`
  * การ Mount Router ในไฟล์ `app.js` หรือ `server.js`:
    ```javascript
    // กำหนดค่ารหัสนักศึกษาเป็น Static Prefix ในโค้ดของตนเอง
    const STUDENT_ID = '66011234';
    app.use(`/api/${STUDENT_ID}/offices`, officeRouter);
    // หรือ
    app.use('/api/66011234/offices', officeRouter);
    ```

---

### 1.2 มาตรฐานรูปแบบ JSON Response (ภาษาอังกฤษทั้งหมด)

#### 🟢 เมื่อทำงานสำเร็จ (Success Response)
ส่ง HTTP Status Code: `200 OK` หรือ `201 Created`
```json
{
  "status": "success",
  "data": { ... } // หรือ [ ... ] กรณีผลลัพธ์เป็น Array
}
```

#### 🔴 เมื่อเกิดข้อผิดพลาด (Error Response)
ส่ง HTTP Status Code ตามประเภทความผิดพลาด (400, 404, 409, 500) และ**ห้ามส่ง Default HTML error page ของ Express เด็ดขาด**:
```json
{
  "status": "error",
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Clear explanation of the error in English."
  }
}
```

---

### 1.3 ตัวอย่าง Centralized Error Middleware ที่ต้องนำไปใช้
ใน Controller ให้ใช้ `next(err)` ส่งต่อ Error มาที่ Middleware กลางนี้เพียงจุดเดียว:

```javascript
// middleware/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';

  // ตรวจจับและแปลง MySQL Error Codes เป็น Client Error
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    errorCode = 'DUPLICATE_KEY';
    message = 'Resource already exists (Primary key or unique constraint violation)';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    errorCode = 'FOREIGN_KEY_NOT_FOUND';
    message = 'Referenced foreign key record does not exist';
  } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 409;
    errorCode = 'RESOURCE_IN_USE';
    message = 'Cannot delete or modify resource because it is referenced by related records';
  }

  res.status(statusCode).json({
    status: 'error',
    error: {
      code: errorCode,
      message: message
    }
  });
};

module.exports = { AppError, errorHandler };
```

---

## 2. รายละเอียดโจทย์ 5 ข้อ (Simple → Intermediate)

*(ในโจทย์ตัวอย่างจะใช้รหัสสมมติ `66011234` ให้นักศึกษาแทนที่ด้วยรหัสของตนเอง)*

---

### ข้อที่ 1: [Simple] GET Office by ID (จัดการ 404 Not Found)
* **Resource:** ตาราง `offices`
* **Method & URI:** `GET /api/66011234/offices/:officeCode`
* **เงื่อนไขโจทย์:**
  1. ดึงข้อมูลสำนักงานตาม `:officeCode` (เช่น `1`, `2`, `NA`)
  2. หากพบข้อมูล ตอบกลับ HTTP `200 OK` พร้อมข้อมูลใน `data`
  3. หากไม่พบข้อมูล **ห้าม** ส่ง Object ว่างหรือ `null` ให้โยน `AppError` ไปที่ Error Middleware เพื่อตอบกลับเป็น HTTP `404 Not Found`
* **Response ตัวอย่างเมื่อเกิด Error (404):**
  ```json
  {
    "status": "error",
    "error": {
      "code": "OFFICE_NOT_FOUND",
      "message": "Office with code '99' was not found"
    }
  }
  ```

---

### ข้อที่ 2: [Simple] Create Product Line (จัดการ String PK & Duplicate Entry)
* **Resource:** ตาราง `productlines`
* **Method & URI:** `POST /api/66011234/productlines`
* **Primary Key:** คอลัมน์ `productLine` เป็น `VARCHAR(50)` (Non-Auto-Increment รับค่าจาก Client)
* **Request Body:**
  ```json
  {
    "productLine": "Electric Vehicles",
    "textDescription": "Line of modern high-performance electric cars"
  }
  ```
* **เงื่อนไขโจทย์:**
  1. **Validation:** ตรวจสอบว่า `productLine` มีการส่งมาและไม่เป็นช่องว่าง หากไม่มี ให้โยน HTTP `400 Bad Request`
     ```json
     {
       "status": "error",
       "error": {
         "code": "VALIDATION_ERROR",
         "message": "Field 'productLine' is required and cannot be empty"
       }
     }
     ```
  2. เมื่อบันทึกสำเร็จ ให้ตอบกลับ HTTP `201 Created`
  3. หากมี `productLine` นี้อยู่แล้วในฐานข้อมูล (MySQL Error: `ER_DUP_ENTRY / 1062`) Error Middleware ต้องดักจับและส่ง HTTP `409 Conflict`
* **Response ตัวอย่างเมื่อเกิด Duplicate Key (409):**
  ```json
  {
    "status": "error",
    "error": {
      "code": "DUPLICATE_KEY",
      "message": "Product line 'Electric Vehicles' already exists"
    }
  }
  ```

---

### ข้อที่ 3: [Intermediate] Update Employee (จัดการ Foreign Key Constraint ตอนแก้ไข)
* **Resource:** ตาราง `employees`
* **Method & URI:** `PUT /api/66011234/employees/:employeeNumber`
* **ความสัมพันธ์:** `officeCode` ต้องมีอยู่จริงในตาราง `offices` และ `reportsTo` (ถ้ามีระบุ) ต้องมีอยู่จริงใน `employees`
* **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@classicmodelcars.com",
    "officeCode": "1",
    "reportsTo": 1002,
    "jobTitle": "Sales Representative"
  }
  ```
* **เงื่อนไขโจทย์:**
  1. ตรวจสอบว่าพนักงานรหัส `:employeeNumber` มีอยู่จริงหรือไม่ หากไม่พบให้ส่ง HTTP `404 Not Found` (`code: "EMPLOYEE_NOT_FOUND"`, `message: "Employee with ID '9999' was not found"`)
  2. ตรวจสอบรูปแบบ `email` หากไม่ถูกต้องตามรูปแบบอีเมล ส่ง HTTP `400 Bad Request` (`code: "INVALID_EMAIL"`, `message: "Invalid email address format"`)
  3. หาก Client ส่ง `officeCode` หรือ `reportsTo` ที่ไม่มีอยู่จริง (MySQL Error: `ER_NO_REFERENCED_ROW_2 / 1452`) Error Middleware ต้องตรวจจับและตอบกลับเป็น HTTP `400 Bad Request`
* **Response ตัวอย่างเมื่อ Foreign Key ไม่ถูกต้อง (400):**
  ```json
  {
    "status": "error",
    "error": {
      "code": "FOREIGN_KEY_NOT_FOUND",
      "message": "Invalid office code or reporting manager ID"
    }
  }
  ```

---

### ข้อที่ 4: [Intermediate] Delete Customer (จัดการ Foreign Key On-Delete Restrict)
* **Resource:** ตาราง `customers`
* **Method & URI:** `DELETE /api/66011234/customers/:customerNumber`
* **ความสัมพันธ์:** ลูกค้าถูกอ้างอิงในตาราง `orders` และ `payments`
* **เงื่อนไขโจทย์:**
  1. ตรวจสอบว่าลูกค้า `:customerNumber` มีตัวตนหรือไม่ หากไม่พบให้ส่ง HTTP `404 Not Found` (`code: "CUSTOMER_NOT_FOUND"`)
  2. ดำเนินการลบข้อมูล (`DELETE FROM customers WHERE customerNumber = ?`)
  3. หากลบสำเร็จ ส่ง HTTP `200 OK` พร้อม JSON:
     ```json
     {
       "status": "success",
       "data": {
         "message": "Customer record successfully deleted"
       }
     }
     ```
  4. หากลูกค้ารายนี้มีข้อมูลคำสั่งซื้อ (Orders) หรือประวัติการชำระเงิน (Payments) ค้างอยู่ MySQL จะไม่อนุญาตให้ลบ (MySQL Error: `ER_ROW_IS_REFERENCED_2 / 1451`)
  5. Error Middleware ต้องตรวจจับและส่ง HTTP `409 Conflict`
* **Response ตัวอย่างเมื่อไม่สามารถลบได้ (409):**
  ```json
  {
    "status": "error",
    "error": {
      "code": "RESOURCE_IN_USE",
      "message": "Cannot delete customer because related orders or payment records exist"
    }
  }
  ```

---

### ข้อที่ 5: [Intermediate] Create Payment (จัดการ Composite Primary Key & Business Logic)
* **Resource:** ตาราง `payments`
* **Method & URI:** `POST /api/66011234/customers/:customerNumber/payments`
* **Primary Key:** เป็น **Composite Key** คู่ `(customerNumber, checkNumber)`
* **Request Body:**
  ```json
  {
    "checkNumber": "HQ336338",
    "paymentDate": "2026-09-18",
    "amount": 2500.50
  }
  ```
* **เงื่อนไขโจทย์:**
  1. ตรวจสอบว่าลูกค้ารหัส `:customerNumber` มีอยู่จริงในระบบหรือไม่ ถ้าไม่พบ ส่ง HTTP `404 Not Found` (`code: "CUSTOMER_NOT_FOUND"`)
  2. ตรวจสอบ Business Rules:
     - `amount` ต้องเป็นตัวเลขและมากกว่า 0
     - `paymentDate` ต้องเป็นฟอร์แมตวันที่แบบ ISO (`YYYY-MM-DD`)
     - หากไม่ผ่านเงื่อนไข ให้ส่ง HTTP `400 Bad Request` (`code: "INVALID_PAYMENT_DATA"`, `message: "Payment amount must be greater than zero"`)
  3. บันทึกข้อมูลลงตาราง `payments` หากสำเร็จตอบกลับ HTTP `201 Created`
  4. หากส่ง `checkNumber` ซ้ำเดิมสำหรับลูกค้ารายเดิม จะเกิดการชนกันของ Composite Primary Key (MySQL Error: `ER_DUP_ENTRY / 1062`) Error Middleware ต้องดักจับและส่ง HTTP `409 Conflict`
* **Response ตัวอย่างเมื่อเกิด Duplicate Key (409):**
  ```json
  {
    "status": "error",
    "error": {
      "code": "DUPLICATE_KEY",
      "message": "Check number 'HQ336338' has already been registered for this customer"
    }
  }
  ```

---

## 3. ตารางสรุปการทดสอบ (Testing Checklist)

| ข้อที่ | Method & Static URI ตัวอย่าง | Success Status | กรณีทดสอบ Error | Expected Error Code & Status |
| :---: | :--- | :---: | :--- | :---: |
| **1** | `GET /api/66011234/offices/:code` | `200` | ไม่พบสำนักงานตาม code | `OFFICE_NOT_FOUND` (`404`) |
| **2** | `POST /api/66011234/productlines` | `201` | - Body ว่าง หรือไม่มี `productLine`<br>- Primary Key ซ้ำ (`1062`) | `VALIDATION_ERROR` (`400`)<br>`DUPLICATE_KEY` (`409`) |
| **3** | `PUT /api/66011234/employees/:empId` | `200` | - ไม่พบพนักงาน<br>- รูปแบบ Email ผิด<br>- `officeCode` / `reportsTo` ไม่มีจริง (`1452`) | `EMPLOYEE_NOT_FOUND` (`404`)<br>`INVALID_EMAIL` (`400`)<br>`FOREIGN_KEY_NOT_FOUND` (`400`) |
| **4** | `DELETE /api/66011234/customers/:custId` | `200` | - ไม่พบลูกค้า<br>- ลูกค้ามีข้อมูล orders/payments ผูกอยู่ (`1451`) | `CUSTOMER_NOT_FOUND` (`404`)<br>`RESOURCE_IN_USE` (`409`) |
| **5** | `POST /api/66011234/customers/:custId/payments` | `201` | - ไม่พบลูกค้า<br>- `amount <= 0` หรือ Format วันที่ผิด<br>- Composite PK (`checkNumber`) ซ้ำสำหรับลูกค้ารายนี้ (`1062`) | `CUSTOMER_NOT_FOUND` (`404`)<br>`INVALID_PAYMENT_DATA` (`400`)<br>`DUPLICATE_KEY` (`409`) |

> **ข้อกำหนดการให้คะแนน:**
> - มีการใช้ Route Parameter สำหรับรหัสนักศึกษา (เช่น `:studentId`) แทนที่จะเป็น Static Path **(หักคะแนน)**
> - ปล่อยให้เกิด Unhandled Exception หรือหลุดเป็น Default HTML Error Page ของ Express **(หักคะแนน)**
> - คีย์หรือโครงสร้างของ JSON ไม่ตรงตามสเปก (`status`, `data`, `error`) **(หักคะแนน)**
