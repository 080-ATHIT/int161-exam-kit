import {AppError} from '../../reference-app/src/middlewares-$id/app-error.js';
import {bookSummary,bookDetail} from './mapper.js';
export function bookCode(value){if(typeof value!=='string'||!value.trim()||value.length>32||!/^[A-Za-z0-9_-]+$/.test(value))throw new AppError('Invalid book code');return value;}
function input(body,code){
 if(!body||typeof body!=='object'||Array.isArray(body))throw new AppError('Body must be an object');
 const result={book_code:bookCode(code??body.book_code)};
 for(const [field,max]of [['title',150],['author',100]]){if(typeof body[field]!=='string'||!body[field].trim()||body[field].trim().length>max)throw new AppError(`Invalid ${field}`);result[field]=body[field].trim();}
 const fee=body.daily_fee;
 if(typeof fee!=='number'||!Number.isFinite(fee)||fee<0||fee>99999999.99||Number(fee.toFixed(2))!==fee)throw new AppError('Invalid daily_fee');
 return {...result,daily_fee:fee};
}
export function booksService(repo){
 const find=async code=>{const row=await repo.find(bookCode(code));if(!row)throw new AppError('Book not found',404,'BOOK_NOT_FOUND');return row;};
 return {
  async get(code){return bookDetail(await find(code));},
  async list(page){const [rows,total]=await Promise.all([repo.list(page),repo.count()]);return {items:rows.map(bookSummary),total};},
  async create(body){return bookDetail(await repo.create(input(body)));},
  async update(code,body){await find(code);return bookDetail(await repo.update(code,input(body,code)));},
  async remove(code){await find(code);if(!await repo.remove(code))throw new AppError('Book not found',404,'BOOK_NOT_FOUND');return {code,deleted:true};}
 };
}
