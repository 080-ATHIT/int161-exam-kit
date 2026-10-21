function port(value, fallback) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value)) || Number(value)<1 || Number(value)>65535) throw new Error('Port must be an integer from 1 to 65535');
  return Number(value);
}
export function loadSettings(env = process.env) {
  // ADAPT 1: .env ระบุ DB ของโจทย์, mode และ identity ของตัวเอง ห้าม commit password
  const dbMode = env.DB_MODE || 'practice';
  if (!['practice','exam'].includes(dbMode)) throw new Error('DB_MODE must be practice or exam');
  if (dbMode === 'exam') {
    // ห้ามใช้fallbackหรือprofileตัวอย่างไปส่งสอบ ข้อความerrorระบุชื่อfieldเท่านั้น
    const placeholders = new Set(['demo001','your_actual_id','demo student','your name','fictional-key','key_from_spec']);
    for (const field of ['DB_NAME','STUDENT_ID','STUDENT_NAME','STUDENT_KEY']) {
      const value = env[field];
      if (typeof value !== 'string' || !value.trim() || placeholders.has(value.trim().toLowerCase())) {
        throw new Error(`Exam mode requires an actual value for ${field}`);
      }
    }
  }
  const database = env.DB_NAME || 'int161_practice_catalog';
  const testDatabase = env.TEST_DB_NAME || 'int161_practice_tests';
  for (const name of [database,testDatabase]) if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(name)) throw new Error('Invalid database identifier');
  const studentId = env.STUDENT_ID || 'demo001';
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(studentId)) throw new Error('STUDENT_ID must be a static identifier, not a route parameter or path');
  return {dbMode,host:env.DB_HOST || '127.0.0.1',port:port(env.DB_PORT,3306),user:env.DB_USER || 'root',password:env.DB_PASSWORD || '',database,testDatabase,
    appPort:port(env.PORT,3000),studentId,name:env.STUDENT_NAME || 'Demo Student',key:env.STUDENT_KEY || 'fictional-key'};
}
