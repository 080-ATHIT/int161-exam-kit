// These identifiers are literal source code. Change table/column names after reading schema.
export async function findTag(db,code){
 const [rows]=await db.query('SELECT code,label FROM tags WHERE code=?',[code]);
 return rows[0] || null; // Keep string keys such as NA as strings.
}
export async function findProductTag(db,productId,tagCode){
 const [rows]=await db.query('SELECT product_id,tag_code FROM product_tags WHERE product_id=? AND tag_code=?',[productId,tagCode]);
 return rows[0] || null; // BOTH key components are required.
}
