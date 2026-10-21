import mysql from 'mysql2/promise';
import {readFile} from 'node:fs/promises';
import {MARKER,assertPracticeName,assertPracticeDatabase} from '../src/configs-$id/database-mode.js';
export {MARKER,assertPracticeName,assertPracticeDatabase};
export async function initializePractice(config) {
  if ((config.dbMode ?? 'practice') !== 'practice') throw new Error('db:init/tests only work in DB_MODE=practice');
  assertPracticeName(config.database);
  const admin=await mysql.createConnection({host:config.host,port:config.port,user:config.user,password:config.password,timezone:'Z'});
  try {
    const [existing]=await admin.query('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=?',[config.database]);
    if(existing.length) {
      await admin.changeUser({database:config.database});
      await assertPracticeDatabase(admin); // An existing unmarked DB is never adopted silently.
    } else {
      await admin.query(`CREATE DATABASE \`${config.database}\` CHARACTER SET utf8mb4`);
      await admin.changeUser({database:config.database});
      await admin.query('CREATE TABLE _int161_kit_marker (id INT PRIMARY KEY,value VARCHAR(80) NOT NULL)');
      await admin.query('INSERT INTO _int161_kit_marker VALUES(1,?)',[MARKER]);
    }
    const schema=await readFile(new URL('../sql/schema.sql',import.meta.url),'utf8');
    for(const sql of schema.split(';').map(s=>s.trim()).filter(Boolean)) await admin.query(sql);
    await admin.query("INSERT IGNORE INTO brands(id,name,country_of_origin,website) VALUES (1,'Example Devices','Thailand','https://example.invalid'),(2,'Sample Mobility','Japan','https://example.invalid')");
    for(let id=1;id<=23;id++) await admin.query('INSERT IGNORE INTO products(id,sku,name,brand_id,category,price,ram_gb,storage_gb,color,stock_quantity,status,release_date,internal_cost) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [id,`DEMO-${String(id).padStart(3,'0')}`,`Demo Phone ${id}`,id%2?1:2,'PHONE',id*100,8,128,'Black',id,'AVAILABLE','2026-01-02',id*50]);
    await admin.query("INSERT IGNORE INTO tags(code,label) VALUES ('NA','Not assigned'),('DEMO','Example tag')");
    await admin.query("INSERT IGNORE INTO product_tags(product_id,tag_code) VALUES(1,'DEMO')");
    return config.database;
  } finally {await admin.end();}
}
