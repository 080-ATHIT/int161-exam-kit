// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Read 2: queryParser must run first; list + COUNT → summary DTO + pagination
import {success, metadata} from '../mappers-$id/api-response.js';

export function readProductsHandler(service) {
  return async function (req, res) {
    const {items, total} = await service.listProducts(req.pagination);
    return success(res, items, 200, metadata(total, req.pagination));
  };
}
