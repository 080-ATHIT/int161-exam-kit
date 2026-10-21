import {loadSettings} from '../src/configs-$id/settings.js';
import {createDb} from '../src/configs-$id/db-config.js';
let db;
try {
  const config=loadSettings();
  console.log('Node:',process.version);
  for(const name of ['express','mysql2/promise','http-status']) {await import(name);console.log('Dependency OK:',name);}
  db=createDb(config);
  const [[result]]=await db.query('SELECT 1 AS ok,VERSION() AS version');
  console.log('MySQL server:',result.version,'; SELECT 1:',result.ok);
  console.log('Read-only check passed. No tables or records were changed.');
} catch(err) {
  console.error('Doctor failed:',err.code || 'CONFIG_ERROR');
  console.error('ตรวจ .env/MySQL; db:init ใช้ได้เฉพาะ DB_MODE=practice ไม่ใช้กับฐานสอบ');
  process.exitCode=1;
} finally {if(db)await db.end();}
