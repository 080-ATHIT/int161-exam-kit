export function booksRepository(db){
 const find=async code=>{const [rows]=await db.query('SELECT book_code,title,author,daily_fee FROM books WHERE book_code=?',[code]);return rows[0]??null;};
 return {find,
  async list({limit,offset}){const [rows]=await db.query('SELECT book_code,title,author,daily_fee FROM books ORDER BY book_code LIMIT ? OFFSET ?',[limit,offset]);return rows;},
  async count(){const [[row]]=await db.query('SELECT COUNT(*) AS total FROM books');return Number(row.total);},
  async create(data){await db.query('INSERT INTO books SET ?',[data]);return find(data.book_code);},
  async update(code,{title,author,daily_fee}){await db.query('UPDATE books SET title=?,author=?,daily_fee=? WHERE book_code=?',[title,author,daily_fee,code]);return find(code);},
  async remove(code){const [r]=await db.query('DELETE FROM books WHERE book_code=?',[code]);return r.affectedRows;}
 };
}
