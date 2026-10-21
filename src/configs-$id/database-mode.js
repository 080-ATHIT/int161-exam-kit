// ADAPT: DB_MODE=practice ใช้ฐานตัวอย่าง; DB_MODE=exam ใช้ DB_NAME ตามโจทย์โดยไม่สร้าง/resetฐาน
export const MARKER='int161-exam-kit-v1';
export function assertPracticeName(name) {
  if(typeof name!=='string'||name.length>64||!/^int161_practice_[A-Za-z0-9_]+$/.test(name)) throw new Error('Refusing writes: use a dedicated int161_practice_ database');
}
export async function assertPracticeDatabase(db) {
  const [[{name}]]=await db.query('SELECT DATABASE() AS name');
  assertPracticeName(name);
  const [rows]=await db.query('SELECT value FROM _int161_kit_marker WHERE id=1');
  if(rows[0]?.value!==MARKER) throw new Error('Refusing writes: database marker does not match this kit');
}

export async function assertAppDatabase(db, config) {
  if (config.dbMode === 'practice') return assertPracticeDatabase(db);
  if (config.dbMode !== 'exam') throw new Error('DB_MODE must be practice or exam');
  // อ่านอย่างเดียว: การสร้าง/นำเข้า schema ข้อสอบทำตามไฟล์ SQL ของอาจารย์เอง
  await db.query('SELECT 1');
}
