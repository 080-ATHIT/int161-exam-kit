// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Read 3: validate id → SELECT JOIN → missing404 → detail DTO
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function readProductDetailHandler(service) {
  return async function (req, res) {
    return success(res, await service.getProduct(numericId(req.params.id)));
  };
}
