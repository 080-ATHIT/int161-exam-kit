// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Create: validate/allowlist → INSERT → SELECT detail DTO → 201
import {success} from '../mappers-$id/api-response.js';

export function createProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.createProduct(req.body), 201);
  };
}
