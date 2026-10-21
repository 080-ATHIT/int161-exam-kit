// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Update: find first, full-body validation, UPDATE then read back; unchanged values200
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function updateProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.updateProduct(numericId(req.params.id), req.body));
  };
}
