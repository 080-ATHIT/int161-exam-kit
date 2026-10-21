// แนวเฉลยที่ผู้ช่วยเขียนจากโจทย์ Week08 ไม่ใช่เฉลยอาจารย์
// Read 1: SELECT brands ORDER BY id → 200 array
import {success} from '../mappers-$id/api-response.js';

export function readBrandsHandler(service) {
  return async function (req, res) {
    return success(res, await service.listBrands());
  };
}
