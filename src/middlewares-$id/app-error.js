// Error ที่แอปตั้งใจให้ client เห็น: status และ code ต้องใช้ให้ตรงกับ handler
export class AppError extends Error {
  constructor(message, status = 400, code = 'VALIDATION_ERROR') {
    super(message); this.status = status; this.code = code;
  }
}
